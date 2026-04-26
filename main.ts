import wasmUrl from "./_build/wasm-gc/release/build/background/background.wasm?url";

type Lang = "ja" | "en" | "id";

type BackgroundWasm = {
  setup(columns: number, rows: number, birthMask: number, surviveMask: number, seed: number): void;
  resize(columns: number, rows: number): void;
  step(): void;
  get_columns(): number;
  get_rows(): number;
  get_alive(index: number): number;
  get_energy(index: number): number;
};

type AutomatonRule = {
  birth: number[];
  survive: number[];
};

type AutomatonPalette = {
  red: number;
  green: number;
  blue: number;
  redGain: number;
  greenGain: number;
  blueGain: number;
  alphaBase: number;
  alphaGain: number;
};

const LANGS: Lang[] = ["ja", "en", "id"];
const BG_MAX_DPR = 2.0;
const BG_BASE_STEP_MS = 140;
const BG_MIN_CELL_SIZE = 10;
const BG_MAX_CELL_SIZE = 18;
const BG_TARGET_COLS = 72;
const LANG_PANEL_SELECTOR = "[data-lang-panel]";
const LANG_LINK_SELECTOR = "[data-lang-link]";

function clamp(value: number, lower: number, upper: number): number {
  return Math.min(Math.max(value, lower), upper);
}

function ceilDiv(value: number, divisor: number): number {
  return Math.ceil(value / divisor);
}

function scheduleOptionalWork(callback: () => void): void {
  const start = () => {
    requestAnimationFrame(callback);
  };

  if (document.readyState === "loading") {
    addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}

function setActivePanel(panel: HTMLElement, active: boolean): void {
  panel.hidden = !active;
  if (active) {
    panel.setAttribute("data-active-lang-panel", "");
  } else {
    panel.removeAttribute("data-active-lang-panel");
  }
}

function setActiveLangLink(link: HTMLAnchorElement, active: boolean): void {
  if (active) {
    link.setAttribute("aria-current", "true");
  } else {
    link.removeAttribute("aria-current");
  }
}

function normalizeLang(value: string | null | undefined): Lang | null {
  const normalized = value?.toLowerCase();
  if (!normalized) {
    return null;
  }
  return LANGS.find((lang) => normalized === lang || normalized.startsWith(`${lang}-`)) ?? null;
}

function detectInitialLang(): Lang {
  const params = new URLSearchParams(location.search);
  const queryLang = normalizeLang(params.get("lang"));
  if (queryLang) {
    return queryLang;
  }

  const candidates = navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  for (const candidate of candidates) {
    const lang = normalizeLang(candidate);
    if (lang) {
      return lang;
    }
  }
  return "ja";
}

function applyLang(lang: Lang): void {
  document.documentElement.lang = lang;
  for (const panel of document.querySelectorAll<HTMLElement>(LANG_PANEL_SELECTOR)) {
    setActivePanel(panel, panel.dataset.langPanel === lang);
  }
  for (const link of document.querySelectorAll<HTMLAnchorElement>(LANG_LINK_SELECTOR)) {
    setActiveLangLink(link, link.dataset.langLink === lang);
  }
}

function mountLanguageSwitcher(): void {
  applyLang(detectInitialLang());
}

function randomRule(): AutomatonRule {
  const rules: AutomatonRule[] = [
    { birth: [3], survive: [2, 3] },
    { birth: [3, 6], survive: [2, 3] },
    { birth: [3], survive: [1, 2, 3, 4, 5] },
    { birth: [3, 6, 7, 8], survive: [3, 4, 6, 7, 8] },
    { birth: [4, 6, 7, 8], survive: [3, 5, 6, 7, 8] },
  ];
  return rules[Math.floor(Math.random() * rules.length)] ?? rules[0];
}

function maskFor(values: number[]): number {
  return values.reduce((mask, value) => mask | (1 << value), 0);
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function normalizedAverage(values: number[]): number {
  return values.length === 0 ? 0 : sum(values) / (values.length * 8);
}

function seededUnit(seed: number): number {
  return (seed % 97) / 96;
}

function paletteForRule(rule: AutomatonRule): AutomatonPalette {
  const birthSum = sum(rule.birth);
  const surviveSum = sum(rule.survive);
  const birthDensity = rule.birth.length / 8;
  const surviveDensity = rule.survive.length / 8;
  const birthAverage = normalizedAverage(rule.birth);
  const surviveAverage = normalizedAverage(rule.survive);
  const activity = clamp(birthDensity * 0.58 + surviveDensity * 0.42, 0, 1);
  const contrast = clamp(Math.abs(birthAverage - surviveAverage), 0, 1);
  const stability = clamp(1 - contrast * 0.82, 0, 1);
  const warmSeed = seededUnit(
    birthSum * 37 + surviveSum * 19 + rule.birth.length * 53 + rule.survive.length * 29,
  );
  const coolSeed = seededUnit(
    birthSum * 17 + surviveSum * 31 + rule.birth.length * 11 + rule.survive.length * 47,
  );
  return {
    red: clamp(14 + 84 * warmSeed + 34 * contrast, 0, 255),
    green: clamp(58 + 52 * stability + 28 * activity, 0, 255),
    blue: clamp(68 + 78 * coolSeed + 18 * (1 - activity), 0, 255),
    redGain: clamp(12 + 44 * (1 - surviveAverage) + 20 * warmSeed, 0, 255),
    greenGain: clamp(24 + 42 * stability + 16 * activity, 0, 255),
    blueGain: clamp(22 + 48 * (1 - contrast) + 18 * coolSeed, 0, 255),
    alphaBase: clamp(0.11 + activity * 0.04, 0.08, 0.2),
    alphaGain: clamp(0.24 + contrast * 0.09 + stability * 0.05, 0.18, 0.4),
  };
}

async function loadBackgroundWasm(): Promise<BackgroundWasm> {
  const response = fetch(wasmUrl);
  const result = await WebAssembly.instantiateStreaming(response, {});
  return result.instance.exports as BackgroundWasm;
}

async function mountCellularBackground(): Promise<void> {
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  if (motionQuery.matches) {
    return;
  }

  const canvas = document.querySelector<HTMLCanvasElement>(".background-automaton");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) {
    return;
  }

  const wasm = await loadBackgroundWasm();
  const rule = randomRule();
  const palette = paletteForRule(rule);
  let width = 0;
  let height = 0;
  let dpr = 1;
  let cellSize = BG_MIN_CELL_SIZE;
  let lastTime = 0;
  let accumulated = 0;
  let initialized = false;

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    const columns = wasm.get_columns();
    const rows = wasm.get_rows();
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const value = wasm.get_energy(index);
        if (value < 0.03) {
          continue;
        }
        const inset = cellSize * 0.08;
        const glow = wasm.get_alive(index) === 1 ? value : value * 0.72;
        const red = Math.round(palette.red + glow * palette.redGain);
        const green = Math.round(palette.green + glow * palette.greenGain);
        const blue = Math.round(palette.blue + glow * palette.blueGain);
        const alpha = palette.alphaBase + glow * palette.alphaGain;
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        ctx.fillRect(
          column * cellSize + inset,
          row * cellSize + inset,
          cellSize - inset * 2,
          cellSize - inset * 2,
        );
      }
    }
  };

  const resize = () => {
    width = innerWidth;
    height = innerHeight;
    dpr = Math.min(devicePixelRatio, BG_MAX_DPR);
    cellSize = clamp(Math.round(width / BG_TARGET_COLS), BG_MIN_CELL_SIZE, BG_MAX_CELL_SIZE);
    const columns = ceilDiv(width, cellSize);
    const rows = ceilDiv(height, cellSize);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (initialized) {
      wasm.resize(columns, rows);
    } else {
      const seed = Math.floor(Math.random() * 0x7fffffff) || 1;
      wasm.setup(columns, rows, maskFor(rule.birth), maskFor(rule.survive), seed);
      initialized = true;
    }
    render();
  };

  const frame = (time: number) => {
    if (motionQuery.matches) {
      ctx.clearRect(0, 0, width, height);
      return;
    }
    if (lastTime === 0) {
      lastTime = time;
    }
    const delta = Math.min(time - lastTime, 1000);
    lastTime = time;
    accumulated += delta;
    while (accumulated >= BG_BASE_STEP_MS) {
      wasm.step();
      accumulated -= BG_BASE_STEP_MS;
    }
    render();
    requestAnimationFrame(frame);
  };

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(frame);
}

mountLanguageSwitcher();
scheduleOptionalWork(() => {
  void mountCellularBackground().catch(() => undefined);
});
