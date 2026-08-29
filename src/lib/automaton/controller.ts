import { AutomatonEngine, MAX_GRID_CELLS, MAX_GRID_DIMENSION } from './engine';
import type { AutomatonRule } from './rules';

const STEP_INTERVAL_MS = 150;
const MAX_DEVICE_PIXEL_RATIO = 2;
const MAX_BACKING_PIXELS = 8_000_000;
const BACKGROUND_SEED_DISTANCE = 72;
const LAB_SEED_INTERVAL_MS = 45;
const TAP_MOVEMENT_TOLERANCE = 10;
const INTERACTIVE_SELECTOR =
	'a, button, input, select, textarea, label, summary, [role="button"], [contenteditable="true"], [data-automaton-exclude]';

export type AutomatonCanvasMode = 'background' | 'lab';

export interface AutomatonRunState {
	automatic: boolean;
	reducedMotion: boolean;
	forcedColors: boolean;
	available: boolean;
}

export interface AutomatonActivityConditions {
	available: boolean;
	initialized: boolean;
	documentVisible: boolean;
	renderVisible: boolean;
	reducedMotion: boolean;
	forcedColors: boolean;
	paused: boolean;
	suspended: boolean;
}

export function shouldRunAutomaton(conditions: AutomatonActivityConditions): boolean {
	return (
		conditions.available &&
		conditions.initialized &&
		conditions.documentVisible &&
		conditions.renderVisible &&
		!conditions.reducedMotion &&
		!conditions.forcedColors &&
		!conditions.paused &&
		!conditions.suspended
	);
}

export interface AutomatonCanvasControllerOptions {
	host: HTMLElement;
	visibilityHost?: HTMLElement;
	canvas: HTMLCanvasElement;
	mode: AutomatonCanvasMode;
	rule: AutomatonRule;
	seed: number;
	paused?: boolean;
	suspended?: boolean;
	onRunStateChange?: (state: AutomatonRunState) => void;
}

interface PendingTap {
	pointerId: number;
	startX: number;
	startY: number;
	clientX: number;
	clientY: number;
	moved: boolean;
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.min(Math.max(value, minimum), maximum);
}

export function calculateBackingScale(width: number, height: number, deviceScale: number): number {
	const cssPixels = Math.max(1, width * height);
	return Math.min(
		Math.max(deviceScale, 0.1),
		MAX_DEVICE_PIXEL_RATIO,
		Math.sqrt(MAX_BACKING_PIXELS / cssPixels)
	);
}

function randomSeed(): number {
	if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
		return crypto.getRandomValues(new Uint32Array(1))[0] & 0x7fff_ffff;
	}
	return (Date.now() ^ Math.floor(Math.random() * 0x7fff_ffff)) & 0x7fff_ffff;
}

export class AutomatonCanvasController {
	readonly #host: HTMLElement;
	readonly #visibilityHost: HTMLElement;
	readonly #canvas: HTMLCanvasElement;
	readonly #mode: AutomatonCanvasMode;
	readonly #onRunStateChange?: (state: AutomatonRunState) => void;
	#rule: AutomatonRule;
	#seed: number;
	#context: CanvasRenderingContext2D | null = null;
	#engine: AutomatonEngine | undefined;
	#resizeObserver: ResizeObserver | undefined;
	#intersectionObserver: IntersectionObserver | undefined;
	#motionQuery: MediaQueryList | undefined;
	#darkQuery: MediaQueryList | undefined;
	#forcedColorsQuery: MediaQueryList | undefined;
	#dprQuery: MediaQueryList | undefined;
	#timer: number | undefined;
	#frame: number | undefined;
	#resizeFrame: number | undefined;
	#disposed = false;
	#paused: boolean;
	#suspended: boolean;
	#documentVisible = true;
	#renderVisible = true;
	#reducedMotion = false;
	#dark = false;
	#forcedColors = false;
	#width = 0;
	#height = 0;
	#backingWidth = 0;
	#backingHeight = 0;
	#backingScale = 0;
	#cellSize = 10;
	#lastBackgroundSeedX = Number.NaN;
	#lastBackgroundSeedY = Number.NaN;
	#lastLabSeedAt = 0;
	#pendingTap: PendingTap | undefined;

	constructor({
		host,
		visibilityHost = host,
		canvas,
		mode,
		rule,
		seed,
		paused = false,
		suspended = false,
		onRunStateChange
	}: AutomatonCanvasControllerOptions) {
		this.#host = host;
		this.#visibilityHost = visibilityHost;
		this.#canvas = canvas;
		this.#mode = mode;
		this.#rule = rule;
		this.#seed = seed;
		this.#paused = paused;
		this.#suspended = suspended;
		this.#onRunStateChange = onRunStateChange;
	}

	get available(): boolean {
		return this.#context !== null;
	}

	get rule(): AutomatonRule {
		return this.#rule;
	}

	get paused(): boolean {
		return this.#paused;
	}

	get engine(): AutomatonEngine | undefined {
		return this.#engine;
	}

	start(): boolean {
		if (this.#disposed || this.#context) return this.available;
		this.#context = this.#canvas.getContext('2d');
		if (!this.#context) {
			this.#emitRunState();
			return false;
		}

		this.#documentVisible = !document.hidden;
		this.#motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
		this.#darkQuery = matchMedia('(prefers-color-scheme: dark)');
		this.#forcedColorsQuery = matchMedia('(forced-colors: active)');
		this.#reducedMotion = this.#motionQuery.matches;
		this.#dark = this.#darkQuery.matches;
		this.#forcedColors = this.#forcedColorsQuery.matches;
		this.#motionQuery.addEventListener('change', this.#handleMotionChange);
		this.#darkQuery.addEventListener('change', this.#handleDarkChange);
		this.#forcedColorsQuery.addEventListener('change', this.#handleForcedColorsChange);
		document.addEventListener('visibilitychange', this.#handleVisibilityChange);
		window.addEventListener('resize', this.#requestResize, { passive: true });
		this.#watchDevicePixelRatio();

		if ('ResizeObserver' in window) {
			this.#resizeObserver = new ResizeObserver(this.#requestResize);
			this.#resizeObserver.observe(this.#host);
		}

		if (this.#mode === 'background') {
			window.addEventListener('pointermove', this.#handleBackgroundPointerMove, {
				passive: true
			});
		} else {
			this.#canvas.addEventListener('pointermove', this.#handleLabPointerMove, {
				passive: true
			});
			this.#canvas.addEventListener('pointerdown', this.#handleLabPointerDown, {
				passive: true
			});
			this.#canvas.addEventListener('pointerup', this.#handleLabPointerUp, {
				passive: true
			});
			this.#canvas.addEventListener('pointercancel', this.#handleLabPointerCancel, {
				passive: true
			});
			this.#watchRenderVisibility();
		}

		this.#resizeNow();
		this.#reconcile();
		return true;
	}

	destroy(): void {
		if (this.#disposed) return;
		this.#disposed = true;
		this.#stopTimer();
		if (this.#frame !== undefined) cancelAnimationFrame(this.#frame);
		if (this.#resizeFrame !== undefined) cancelAnimationFrame(this.#resizeFrame);
		this.#frame = undefined;
		this.#resizeFrame = undefined;
		this.#resizeObserver?.disconnect();
		this.#intersectionObserver?.disconnect();
		this.#motionQuery?.removeEventListener('change', this.#handleMotionChange);
		this.#darkQuery?.removeEventListener('change', this.#handleDarkChange);
		this.#forcedColorsQuery?.removeEventListener('change', this.#handleForcedColorsChange);
		this.#dprQuery?.removeEventListener('change', this.#handleDprChange);
		document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
		window.removeEventListener('resize', this.#requestResize);
		window.removeEventListener('pointermove', this.#handleBackgroundPointerMove);
		this.#canvas.removeEventListener('pointermove', this.#handleLabPointerMove);
		this.#canvas.removeEventListener('pointerdown', this.#handleLabPointerDown);
		this.#canvas.removeEventListener('pointerup', this.#handleLabPointerUp);
		this.#canvas.removeEventListener('pointercancel', this.#handleLabPointerCancel);
		this.#visibilityHost.removeEventListener(
			'contentvisibilityautostatechange',
			this.#handleContentVisibilityChange
		);
	}

	setPaused(paused: boolean): void {
		if (paused === this.#paused) return;
		this.#paused = paused;
		this.#resetPointerHistory();
		this.#reconcile();
	}

	setSuspended(suspended: boolean): void {
		if (suspended === this.#suspended) return;
		this.#suspended = suspended;
		this.#resetPointerHistory();
		this.#reconcile();
	}

	setRule(rule: AutomatonRule, seed = randomSeed()): void {
		this.#rule = rule;
		this.#seed = seed;
		if (this.#engine) this.#engine.setRule(rule, seed);
		this.requestDraw();
	}

	stepOnce(): void {
		if (!this.#engine) return;
		this.#engine.step();
		this.requestDraw();
	}

	reset(seed?: number): void {
		if (!this.#engine) return;
		this.#engine.reset(seed);
		this.requestDraw();
	}

	seedCenter(): void {
		if (!this.#engine) return;
		this.#engine.seed(Math.floor(this.#engine.columns / 2), Math.floor(this.#engine.rows / 2));
		this.requestDraw();
	}

	requestDraw(): void {
		if (
			this.#disposed ||
			this.#frame !== undefined ||
			!this.#context ||
			!this.#documentVisible ||
			!this.#renderVisible
		) {
			return;
		}
		this.#frame = requestAnimationFrame(() => {
			this.#frame = undefined;
			this.#draw();
		});
	}

	#shouldRun(): boolean {
		return (
			!this.#disposed &&
			shouldRunAutomaton({
				available: this.#context !== null,
				initialized: this.#engine !== undefined,
				documentVisible: this.#documentVisible,
				renderVisible: this.#renderVisible,
				reducedMotion: this.#reducedMotion,
				forcedColors: this.#forcedColors,
				paused: this.#paused,
				suspended: this.#suspended
			})
		);
	}

	#shouldAcceptBackgroundInput(): boolean {
		return (
			!this.#disposed &&
			this.#context !== null &&
			this.#engine !== undefined &&
			this.#documentVisible &&
			this.#renderVisible &&
			!this.#reducedMotion &&
			!this.#forcedColors &&
			!this.#suspended
		);
	}

	#reconcile(): void {
		if (this.#shouldRun()) this.#scheduleTick();
		else this.#stopTimer();
		this.#emitRunState();
	}

	#scheduleTick(): void {
		if (this.#timer !== undefined || !this.#shouldRun()) return;
		this.#timer = window.setTimeout(this.#tick, STEP_INTERVAL_MS);
	}

	#stopTimer(): void {
		if (this.#timer === undefined) return;
		clearTimeout(this.#timer);
		this.#timer = undefined;
	}

	#tick = (): void => {
		this.#timer = undefined;
		if (!this.#shouldRun() || !this.#engine) return;
		this.#engine.step();
		this.requestDraw();
		this.#scheduleTick();
	};

	#emitRunState(): void {
		this.#onRunStateChange?.({
			automatic: this.#shouldRun(),
			reducedMotion: this.#reducedMotion,
			forcedColors: this.#forcedColors,
			available: this.available
		});
	}

	#requestResize = (): void => {
		if (this.#disposed || this.#resizeFrame !== undefined) return;
		this.#resizeFrame = requestAnimationFrame(() => {
			this.#resizeFrame = undefined;
			this.#resizeNow();
		});
	};

	#resizeNow(): void {
		if (!this.#context) return;
		const rect = this.#host.getBoundingClientRect();
		const width = Math.max(1, Math.round(rect.width));
		const height = Math.max(1, Math.round(rect.height));
		const preferredCellSize =
			this.#mode === 'background'
				? clamp(Math.round(width / 96), 8, 14)
				: clamp(Math.round(width / 54), 10, 18);
		const boundedCellSize = Math.max(
			1,
			Math.ceil(width / MAX_GRID_DIMENSION),
			Math.ceil(height / MAX_GRID_DIMENSION),
			Math.ceil(Math.sqrt((width * height) / MAX_GRID_CELLS))
		);
		let cellSize = Math.max(preferredCellSize, boundedCellSize);
		let columns = Math.ceil(width / cellSize);
		let rows = Math.ceil(height / cellSize);
		while (
			columns > MAX_GRID_DIMENSION ||
			rows > MAX_GRID_DIMENSION ||
			columns * rows > MAX_GRID_CELLS
		) {
			cellSize += 1;
			columns = Math.ceil(width / cellSize);
			rows = Math.ceil(height / cellSize);
		}
		const scale = calculateBackingScale(width, height, devicePixelRatio || 1);
		const backingWidth = Math.max(1, Math.round(width * scale));
		const backingHeight = Math.max(1, Math.round(height * scale));
		const cssChanged = width !== this.#width || height !== this.#height;
		const backingChanged =
			backingWidth !== this.#backingWidth || backingHeight !== this.#backingHeight;
		const scaleChanged = scale !== this.#backingScale;

		this.#width = width;
		this.#height = height;
		this.#cellSize = cellSize;
		if (!this.#engine) {
			this.#engine = new AutomatonEngine({ columns, rows, rule: this.#rule, seed: this.#seed });
		} else {
			this.#engine.resize(columns, rows);
		}

		if (backingChanged) {
			this.#backingWidth = backingWidth;
			this.#backingHeight = backingHeight;
			this.#canvas.width = backingWidth;
			this.#canvas.height = backingHeight;
		}
		if (backingChanged || scaleChanged) {
			this.#backingScale = scale;
			this.#context.setTransform(scale, 0, 0, scale, 0, 0);
		}
		if (cssChanged || backingChanged || scaleChanged) this.requestDraw();
		this.#reconcile();
	}

	#watchDevicePixelRatio(): void {
		this.#dprQuery?.removeEventListener('change', this.#handleDprChange);
		this.#dprQuery = matchMedia(`(resolution: ${devicePixelRatio || 1}dppx)`);
		this.#dprQuery.addEventListener('change', this.#handleDprChange);
	}

	#handleDprChange = (): void => {
		this.#watchDevicePixelRatio();
		this.#requestResize();
	};

	#watchRenderVisibility(): void {
		if ('contentVisibility' in document.documentElement.style) {
			this.#visibilityHost.addEventListener(
				'contentvisibilityautostatechange',
				this.#handleContentVisibilityChange
			);
			return;
		}
		if ('IntersectionObserver' in window) {
			this.#intersectionObserver = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (entry) this.#setRenderVisible(entry.isIntersecting);
				},
				{ rootMargin: '200px' }
			);
			this.#intersectionObserver.observe(this.#visibilityHost);
		}
	}

	#handleContentVisibilityChange = (event: Event): void => {
		this.#setRenderVisible(!(event as Event & { skipped?: boolean }).skipped);
	};

	#setRenderVisible(visible: boolean): void {
		if (visible === this.#renderVisible) return;
		this.#renderVisible = visible;
		if (!visible && this.#frame !== undefined) {
			cancelAnimationFrame(this.#frame);
			this.#frame = undefined;
		}
		if (visible) this.requestDraw();
		this.#reconcile();
	}

	#handleVisibilityChange = (): void => {
		this.#documentVisible = !document.hidden;
		if (!this.#documentVisible && this.#frame !== undefined) {
			cancelAnimationFrame(this.#frame);
			this.#frame = undefined;
		}
		if (this.#documentVisible) this.requestDraw();
		this.#reconcile();
	};

	#handleMotionChange = (event: MediaQueryListEvent): void => {
		this.#reducedMotion = event.matches;
		this.#resetPointerHistory();
		this.#reconcile();
	};

	#handleDarkChange = (event: MediaQueryListEvent): void => {
		this.#dark = event.matches;
		this.requestDraw();
	};

	#handleForcedColorsChange = (event: MediaQueryListEvent): void => {
		this.#forcedColors = event.matches;
		this.#reconcile();
		this.requestDraw();
	};

	#handleBackgroundPointerMove = (event: PointerEvent): void => {
		if (event.pointerType !== 'mouse' || !this.#shouldAcceptBackgroundInput()) return;
		if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) {
			this.#lastBackgroundSeedX = event.clientX;
			this.#lastBackgroundSeedY = event.clientY;
			return;
		}
		const deltaX = event.clientX - this.#lastBackgroundSeedX;
		const deltaY = event.clientY - this.#lastBackgroundSeedY;
		if (
			Number.isFinite(this.#lastBackgroundSeedX) &&
			deltaX * deltaX + deltaY * deltaY < BACKGROUND_SEED_DISTANCE ** 2
		) {
			return;
		}
		this.#lastBackgroundSeedX = event.clientX;
		this.#lastBackgroundSeedY = event.clientY;
		this.#seedFromClientPoint(event.clientX, event.clientY);
	};

	#handleLabPointerMove = (event: PointerEvent): void => {
		if (
			!event.isPrimary ||
			this.#forcedColors ||
			this.#suspended ||
			!this.#documentVisible ||
			!this.#renderVisible
		) {
			return;
		}
		if (event.pointerType !== 'mouse') {
			if (this.#pendingTap?.pointerId === event.pointerId) {
				this.#pendingTap.clientX = event.clientX;
				this.#pendingTap.clientY = event.clientY;
				const deltaX = event.clientX - this.#pendingTap.startX;
				const deltaY = event.clientY - this.#pendingTap.startY;
				if (deltaX ** 2 + deltaY ** 2 > TAP_MOVEMENT_TOLERANCE ** 2) {
					this.#pendingTap.moved = true;
				}
			}
			return;
		}
		if (this.#reducedMotion) {
			return;
		}
		const now = performance.now();
		if (now - this.#lastLabSeedAt < LAB_SEED_INTERVAL_MS) return;
		this.#lastLabSeedAt = now;
		this.#seedFromClientPoint(event.clientX, event.clientY);
	};

	#handleLabPointerDown = (event: PointerEvent): void => {
		if (
			!event.isPrimary ||
			this.#forcedColors ||
			this.#suspended ||
			!this.#documentVisible ||
			!this.#renderVisible ||
			(event.pointerType === 'mouse' && event.button !== 0)
		) {
			return;
		}
		if (event.pointerType === 'mouse') {
			this.#seedFromClientPoint(event.clientX, event.clientY);
			return;
		}
		this.#pendingTap = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			clientX: event.clientX,
			clientY: event.clientY,
			moved: false
		};
	};

	#handleLabPointerUp = (event: PointerEvent): void => {
		if (!event.isPrimary || !this.#pendingTap || this.#pendingTap.pointerId !== event.pointerId) {
			return;
		}
		const pending = this.#pendingTap;
		this.#pendingTap = undefined;
		if (!pending.moved) this.#seedFromClientPoint(event.clientX, event.clientY);
	};

	#handleLabPointerCancel = (event: PointerEvent): void => {
		if (this.#pendingTap?.pointerId === event.pointerId) this.#pendingTap = undefined;
	};

	#seedFromClientPoint(clientX: number, clientY: number): void {
		if (!this.#engine) return;
		const rect = this.#canvas.getBoundingClientRect();
		const column = Math.floor((clientX - rect.left) / this.#cellSize);
		const row = Math.floor((clientY - rect.top) / this.#cellSize);
		this.#engine.seed(column, row);
		this.requestDraw();
	}

	#resetPointerHistory(): void {
		this.#lastBackgroundSeedX = Number.NaN;
		this.#lastBackgroundSeedY = Number.NaN;
		this.#lastLabSeedAt = 0;
		this.#pendingTap = undefined;
	}

	#draw(): void {
		const context = this.#context;
		const engine = this.#engine;
		if (!context || !engine) return;
		context.clearRect(0, 0, this.#width, this.#height);
		if (this.#forcedColors) return;

		const palette = engine.rule.palette;
		const inset = Math.max(1, this.#cellSize * (this.#mode === 'background' ? 0.09 : 0.1));
		const alphaScale = this.#mode === 'background' ? (this.#dark ? 0.55 : 0.45) : 1;
		const alphaCap = this.#mode === 'background' ? (this.#dark ? 0.2 : 0.16) : 0.55;
		for (let index = 0; index < engine.cells.length; index += 1) {
			const energy = engine.energy[index];
			if (energy < 0.03) continue;
			const glow = engine.cells[index] === 1 ? energy : energy * 0.72;
			const red = Math.round(clamp(palette.red + glow * palette.redGain, 0, 255));
			const green = Math.round(clamp(palette.green + glow * palette.greenGain, 0, 255));
			const blue = Math.round(clamp(palette.blue + glow * palette.blueGain, 0, 255));
			const alpha = Math.min(alphaCap, (palette.alphaBase + glow * palette.alphaGain) * alphaScale);
			const column = index % engine.columns;
			const row = Math.floor(index / engine.columns);
			context.fillStyle = `rgb(${red} ${green} ${blue} / ${alpha})`;
			context.fillRect(
				column * this.#cellSize + inset,
				row * this.#cellSize + inset,
				this.#cellSize - inset * 2,
				this.#cellSize - inset * 2
			);
		}
	}
}
