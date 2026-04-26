import wasmUrl from "./_build/wasm-gc/release/build/background/background.wasm?url";

type Lang = "ja" | "en" | "id";

type BackgroundWasm = {
  setup(columns: number, rows: number, seed: number): void;
  resize(columns: number, rows: number): void;
  step(): void;
  get_columns(): number;
  get_rows(): number;
  get_alive(index: number): number;
  get_energy(index: number): number;
  get_birth_mask(): number;
  get_survive_mask(): number;
  get_initial_alive_per_1000(): number;
  get_rule_index(): number;
  get_palette_red(): number;
  get_palette_green(): number;
  get_palette_blue(): number;
  get_palette_red_gain(): number;
  get_palette_green_gain(): number;
  get_palette_blue_gain(): number;
  get_palette_alpha_base(): number;
  get_palette_alpha_gain(): number;
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
const AUTOMATON_RULE_SELECTOR = "[data-automaton-rule]";
const AUTOMATON_RULE_NAMES = [
  "Conway's Life",
  "HighLife",
  "DryLife",
  "EightLife",
  "DotLife",
  "2x2",
  "Pseudo Life",
  "HoneyLife",
  "Pedestrian Life",
  "Catagolue OCA",
  "LowDeath",
  "OCA",
  "Amoeba",
];

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

function readPalette(wasm: BackgroundWasm): AutomatonPalette {
  return {
    red: wasm.get_palette_red(),
    green: wasm.get_palette_green(),
    blue: wasm.get_palette_blue(),
    redGain: wasm.get_palette_red_gain(),
    greenGain: wasm.get_palette_green_gain(),
    blueGain: wasm.get_palette_blue_gain(),
    alphaBase: wasm.get_palette_alpha_base(),
    alphaGain: wasm.get_palette_alpha_gain(),
  };
}

function maskDigits(mask: number): string {
  let digits = "";
  for (let value = 0; value <= 8; value += 1) {
    if (((mask >> value) & 1) === 1) {
      digits += value.toString();
    }
  }
  return digits;
}

function formatLifeLikeRule(wasm: BackgroundWasm): string {
  return `B${maskDigits(wasm.get_birth_mask())}/S${maskDigits(wasm.get_survive_mask())}`;
}

function renderAutomatonRule(wasm: BackgroundWasm): void {
  const rule = formatLifeLikeRule(wasm);
  const density = wasm.get_initial_alive_per_1000() / 10;
  const name = AUTOMATON_RULE_NAMES[wasm.get_rule_index()];
  const label = name ? `${name} · ${rule} / ${density}%` : `${rule} / ${density}%`;
  document.querySelector<HTMLElement>(AUTOMATON_RULE_SELECTOR)?.replaceChildren(
    document.createTextNode(label),
  );
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
  let palette: AutomatonPalette = {
    red: 0,
    green: 0,
    blue: 0,
    redGain: 0,
    greenGain: 0,
    blueGain: 0,
    alphaBase: 0,
    alphaGain: 0,
  };
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
      wasm.setup(columns, rows, seed);
      palette = readPalette(wasm);
      renderAutomatonRule(wasm);
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
  void mountCellularBackground().catch((error: unknown) => {
    console.warn("Failed to mount cellular automaton background.", error);
  });
});
