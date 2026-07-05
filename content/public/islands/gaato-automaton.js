const RULE_NAMES = [
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

const MAX_DPR = 2;
const STEP_MS = 150;
const MIN_CELL = 10;
const MAX_CELL = 18;
const TARGET_COLS = 42;

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** @param {number} mask */
function maskDigits(mask) {
  let digits = "";
  for (let value = 0; value <= 8; value += 1) {
    if (((mask >> value) & 1) === 1) digits += value.toString();
  }
  return digits;
}

class GaatoAutomaton extends HTMLElement {
  constructor() {
    super();
    /** @type {HTMLCanvasElement | null} */
    this.canvas = null;
    /** @type {CanvasRenderingContext2D | null} */
    this.ctx = null;
    /** @type {HTMLParagraphElement | null} */
    this.label = null;
    /** @type {ResizeObserver | null} */
    this.resizeObserver = null;
    /** @type {any} */
    this.wasm = null;
    this.started = false;
    this.initialized = false;
    this.disconnected = false;
    this.width = 0;
    this.height = 0;
    this.cell = MIN_CELL;
    this.last = 0;
    this.accumulated = 0;
    this.lastSeedAt = 0;
  }

  connectedCallback() {
    if (this.started) return;
    this.started = true;
    this.classList.add("automaton-card");
    this.setAttribute("aria-hidden", "true");

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.textContent = "cellular automaton paused";
      return;
    }

    this.canvas = document.createElement("canvas");
    this.label = document.createElement("p");
    this.label.className = "automaton-rule";
    this.replaceChildren(this.canvas, this.label);
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) return;

    this.disconnected = false;

    this.mount().catch(() => {
      this.replaceChildren(document.createTextNode("cellular automaton unavailable"));
    });
  }

  disconnectedCallback() {
    this.disconnected = true;
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  async mount() {
    const canvas = this.canvas;
    if (!canvas) return;
    const wasmUrl = this.getAttribute("data-wasm") || "/assets/background.wasm";
    const response = await fetch(wasmUrl);
    const result = response.headers.get("content-type") === "application/wasm"
      ? await WebAssembly.instantiateStreaming(response, {})
      : await WebAssembly.instantiate(await response.arrayBuffer(), {});
    this.wasm = /** @type {any} */ (result.instance.exports);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this);
    this.resize();
    canvas.addEventListener("pointermove", (event) => this.seed(event));
    canvas.addEventListener("pointerdown", (event) => this.seed(event, true));
    requestAnimationFrame((time) => this.frame(time));
  }

  /** @param {PointerEvent} event @param {boolean} [force] */
  seed(event, force = false) {
    if (!this.initialized || !this.canvas || !this.wasm) return;
    const now = performance.now();
    if (!force && now - this.lastSeedAt < 45) return;
    this.lastSeedAt = now;
    const rect = this.canvas.getBoundingClientRect();
    const column = Math.floor((event.clientX - rect.left) / this.cell);
    const row = Math.floor((event.clientY - rect.top) / this.cell);
    this.wasm.seed_at(column, row);
    this.render();
  }

  resize() {
    if (!this.canvas || !this.ctx || !this.wasm) return;
    const rect = this.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
    this.cell = clamp(Math.round(this.width / TARGET_COLS), MIN_CELL, MAX_CELL);
    const columns = Math.ceil(this.width / this.cell);
    const rows = Math.ceil(this.height / this.cell);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.initialized) {
      this.wasm.resize(columns, rows);
    } else {
      this.wasm.setup(columns, rows, Math.floor(Math.random() * 0x7fffffff) || 1);
      this.initialized = true;
      this.renderLabel();
    }
    this.render();
  }

  renderLabel() {
    if (!this.wasm || !this.label) return;
    const rule = `B${maskDigits(this.wasm.get_birth_mask())}/S${maskDigits(this.wasm.get_survive_mask())}`;
    const name = RULE_NAMES[this.wasm.get_rule_index()] || "Life-like";
    this.label.textContent = `${name} ${rule}`;
  }

  /** @param {number} time */
  frame(time) {
    if (this.disconnected) return;
    if (document.hidden) {
      requestAnimationFrame((next) => this.frame(next));
      return;
    }
    if (this.last === 0) this.last = time;
    this.accumulated += Math.min(time - this.last, 1000);
    this.last = time;
    while (this.accumulated >= STEP_MS) {
      this.wasm.step();
      this.accumulated -= STEP_MS;
    }
    this.render();
    requestAnimationFrame((next) => this.frame(next));
  }

  render() {
    const { ctx, wasm, cell } = this;
    if (!ctx || !wasm) return;
    ctx.clearRect(0, 0, this.width, this.height);
    const columns = wasm.get_columns();
    const rows = wasm.get_rows();
    const palette = {
      red: wasm.get_palette_red(),
      green: wasm.get_palette_green(),
      blue: wasm.get_palette_blue(),
      redGain: wasm.get_palette_red_gain(),
      greenGain: wasm.get_palette_green_gain(),
      blueGain: wasm.get_palette_blue_gain(),
      alphaBase: wasm.get_palette_alpha_base(),
      alphaGain: wasm.get_palette_alpha_gain(),
    };
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const value = wasm.get_energy(index);
        if (value < 0.03) continue;
        const glow = wasm.get_alive(index) === 1 ? value : value * 0.72;
        const inset = cell * 0.1;
        ctx.fillStyle = `rgba(${Math.round(palette.red + glow * palette.redGain)}, ${Math.round(palette.green + glow * palette.greenGain)}, ${Math.round(palette.blue + glow * palette.blueGain)}, ${palette.alphaBase + glow * palette.alphaGain})`;
        ctx.fillRect(column * cell + inset, row * cell + inset, cell - inset * 2, cell - inset * 2);
      }
    }
  }
}

customElements.define("gaato-automaton", GaatoAutomaton);
