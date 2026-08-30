import { AutomatonEngine, MAX_GRID_CELLS, MAX_GRID_DIMENSION } from './engine';
import type { AutomatonRule } from './rules';

const STEP_INTERVAL_MS = 150;
const MAX_DEVICE_PIXEL_RATIO = 2;
const MAX_BACKING_PIXELS = 8_000_000;
const TAP_MOVEMENT_TOLERANCE = 10;
const INTERACTIVE_SELECTOR =
	'a, button, input, select, textarea, label, summary, [role="button"], [contenteditable="true"], [data-automaton-exclude]';

export interface AutomatonActivityConditions {
	available: boolean;
	initialized: boolean;
	documentVisible: boolean;
	reducedMotion: boolean;
	forcedColors: boolean;
	paused: boolean;
}

export function shouldRunAutomaton(conditions: AutomatonActivityConditions): boolean {
	return (
		conditions.available &&
		conditions.initialized &&
		conditions.documentVisible &&
		!conditions.reducedMotion &&
		!conditions.forcedColors &&
		!conditions.paused
	);
}

export interface AutomatonBackgroundControllerOptions {
	host: HTMLElement;
	canvas: HTMLCanvasElement;
	rule: AutomatonRule;
	seed: number;
	paused?: boolean;
}

interface PendingBackgroundTouch {
	pointerId: number;
	startX: number;
	startY: number;
	clientX: number;
	clientY: number;
	moved: boolean;
	interactionAllowed: boolean;
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.min(Math.max(value, minimum), maximum);
}

export interface GridPoint {
	column: number;
	row: number;
}

/** Return every grid cell crossed by a straight pointer segment. */
export function rasterizeGridSegment(start: GridPoint, end: GridPoint): GridPoint[] {
	const points: GridPoint[] = [];
	let column = start.column;
	let row = start.row;
	const deltaColumn = Math.abs(end.column - start.column);
	const deltaRow = Math.abs(end.row - start.row);
	const stepColumn = start.column < end.column ? 1 : -1;
	const stepRow = start.row < end.row ? 1 : -1;
	let error = deltaColumn - deltaRow;

	while (true) {
		points.push({ column, row });
		if (column === end.column && row === end.row) return points;
		const doubledError = error * 2;
		if (doubledError > -deltaRow) {
			error -= deltaRow;
			column += stepColumn;
		}
		if (doubledError < deltaColumn) {
			error += deltaColumn;
			row += stepRow;
		}
	}
}

export function calculateBackingScale(width: number, height: number, deviceScale: number): number {
	const cssPixels = Math.max(1, width * height);
	return Math.min(
		Math.max(deviceScale, 0.1),
		MAX_DEVICE_PIXEL_RATIO,
		Math.sqrt(MAX_BACKING_PIXELS / cssPixels)
	);
}

export class AutomatonBackgroundController {
	readonly #host: HTMLElement;
	readonly #canvas: HTMLCanvasElement;
	readonly #rule: AutomatonRule;
	readonly #seed: number;
	#context: CanvasRenderingContext2D | null = null;
	#engine: AutomatonEngine | undefined;
	#resizeObserver: ResizeObserver | undefined;
	#motionQuery: MediaQueryList | undefined;
	#darkQuery: MediaQueryList | undefined;
	#forcedColorsQuery: MediaQueryList | undefined;
	#dprQuery: MediaQueryList | undefined;
	#timer: number | undefined;
	#frame: number | undefined;
	#resizeFrame: number | undefined;
	#disposed = false;
	#paused: boolean;
	#documentVisible = true;
	#reducedMotion = false;
	#dark = false;
	#forcedColors = false;
	#width = 0;
	#height = 0;
	#backingWidth = 0;
	#backingHeight = 0;
	#backingScale = 0;
	#cellSize = 10;
	#lastBackgroundCell: GridPoint | undefined;
	#pendingBackgroundTouch: PendingBackgroundTouch | undefined;

	constructor({ host, canvas, rule, seed, paused = false }: AutomatonBackgroundControllerOptions) {
		this.#host = host;
		this.#canvas = canvas;
		this.#rule = rule;
		this.#seed = seed;
		this.#paused = paused;
	}

	get available(): boolean {
		return this.#context !== null;
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
		if (!this.#context) return false;

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
		window.addEventListener('pointermove', this.#handlePointerMove, { passive: true });
		window.addEventListener('touchstart', this.#handleTouchStart, { passive: true });
		window.addEventListener('touchmove', this.#handleTouchMove, { passive: true });
		window.addEventListener('touchend', this.#handleTouchEnd, { passive: true });
		window.addEventListener('touchcancel', this.#handleTouchCancel, { passive: true });
		this.#watchDevicePixelRatio();

		if ('ResizeObserver' in window) {
			this.#resizeObserver = new ResizeObserver(this.#requestResize);
			this.#resizeObserver.observe(this.#host);
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
		this.#resizeObserver?.disconnect();
		this.#motionQuery?.removeEventListener('change', this.#handleMotionChange);
		this.#darkQuery?.removeEventListener('change', this.#handleDarkChange);
		this.#forcedColorsQuery?.removeEventListener('change', this.#handleForcedColorsChange);
		this.#dprQuery?.removeEventListener('change', this.#handleDprChange);
		document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
		window.removeEventListener('resize', this.#requestResize);
		window.removeEventListener('pointermove', this.#handlePointerMove);
		window.removeEventListener('touchstart', this.#handleTouchStart);
		window.removeEventListener('touchmove', this.#handleTouchMove);
		window.removeEventListener('touchend', this.#handleTouchEnd);
		window.removeEventListener('touchcancel', this.#handleTouchCancel);
	}

	setPaused(paused: boolean): void {
		if (paused === this.#paused) return;
		this.#paused = paused;
		this.#resetPointerHistory();
		this.#reconcile();
	}

	requestDraw(): void {
		if (this.#disposed || this.#frame !== undefined || !this.#context || !this.#documentVisible) {
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
				reducedMotion: this.#reducedMotion,
				forcedColors: this.#forcedColors,
				paused: this.#paused
			})
		);
	}

	#shouldAcceptInput(): boolean {
		return (
			!this.#disposed &&
			this.#context !== null &&
			this.#engine !== undefined &&
			this.#documentVisible &&
			!this.#reducedMotion &&
			!this.#forcedColors
		);
	}

	#reconcile(): void {
		if (this.#shouldRun()) this.#scheduleTick();
		else this.#stopTimer();
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
		const preferredCellSize = clamp(Math.round(width / 96), 8, 14);
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

	#handlePointerMove = (event: PointerEvent): void => {
		if (event.pointerType !== 'mouse' || !this.#shouldAcceptInput()) return;
		if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) {
			this.#lastBackgroundCell = undefined;
			return;
		}
		const current = this.#gridPointFromClientPoint(event.clientX, event.clientY);
		if (!current || !this.#engine) return;
		const start = this.#lastBackgroundCell ?? current;
		for (const point of rasterizeGridSegment(start, current)) {
			this.#engine.setAlive(point.column, point.row);
		}
		this.#lastBackgroundCell = current;
		this.requestDraw();
	};

	#handleTouchStart = (event: TouchEvent): void => {
		if (event.touches.length !== 1 || !this.#shouldAcceptInput()) {
			this.#pendingBackgroundTouch = undefined;
			return;
		}
		const touch = event.touches[0];
		this.#pendingBackgroundTouch = {
			pointerId: touch.identifier,
			startX: touch.clientX,
			startY: touch.clientY,
			clientX: touch.clientX,
			clientY: touch.clientY,
			moved: false,
			interactionAllowed: !(
				event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)
			)
		};
	};

	#handleTouchMove = (event: TouchEvent): void => {
		const pending = this.#pendingBackgroundTouch;
		if (!pending || !pending.interactionAllowed || !this.#shouldAcceptInput()) return;
		const touch = this.#findTouch(event.touches, pending.pointerId);
		if (!touch) return;
		const deltaX = touch.clientX - pending.startX;
		const deltaY = touch.clientY - pending.startY;
		const moved = deltaX ** 2 + deltaY ** 2 > TAP_MOVEMENT_TOLERANCE ** 2;
		if (moved && this.#engine) {
			const start = this.#gridPointFromClientPoint(
				pending.moved ? pending.clientX : pending.startX,
				pending.moved ? pending.clientY : pending.startY
			);
			const end = this.#gridPointFromClientPoint(touch.clientX, touch.clientY);
			if (start && end) {
				for (const point of rasterizeGridSegment(start, end)) {
					this.#engine.setAlive(point.column, point.row);
				}
				this.requestDraw();
			}
		}
		pending.clientX = touch.clientX;
		pending.clientY = touch.clientY;
		pending.moved ||= moved;
	};

	#handleTouchEnd = (event: TouchEvent): void => {
		const pending = this.#pendingBackgroundTouch;
		if (!pending) return;
		const touch = this.#findTouch(event.changedTouches, pending.pointerId);
		if (!touch) return;
		this.#pendingBackgroundTouch = undefined;
		if (!pending.moved && pending.interactionAllowed && this.#shouldAcceptInput()) {
			this.#setAliveFromClientPoint(touch.clientX, touch.clientY);
		}
	};

	#handleTouchCancel = (): void => {
		this.#pendingBackgroundTouch = undefined;
	};

	#findTouch(touches: TouchList, identifier: number): Touch | undefined {
		for (let index = 0; index < touches.length; index += 1) {
			const touch = touches[index];
			if (touch.identifier === identifier) return touch;
		}
		return undefined;
	}

	#setAliveFromClientPoint(clientX: number, clientY: number): void {
		if (!this.#engine) return;
		const point = this.#gridPointFromClientPoint(clientX, clientY);
		if (!point) return;
		this.#engine.setAlive(point.column, point.row);
		this.requestDraw();
	}

	#gridPointFromClientPoint(clientX: number, clientY: number): GridPoint | undefined {
		if (!this.#engine) return undefined;
		const rect = this.#canvas.getBoundingClientRect();
		const column = Math.floor((clientX - rect.left) / this.#cellSize);
		const row = Math.floor((clientY - rect.top) / this.#cellSize);
		if (column < 0 || row < 0 || column >= this.#engine.columns || row >= this.#engine.rows) {
			return undefined;
		}
		return { column, row };
	}

	#resetPointerHistory(): void {
		this.#lastBackgroundCell = undefined;
		this.#pendingBackgroundTouch = undefined;
	}

	#draw(): void {
		const context = this.#context;
		const engine = this.#engine;
		if (!context || !engine) return;
		context.clearRect(0, 0, this.#width, this.#height);
		if (this.#forcedColors) return;

		const palette = engine.rule.palette;
		const inset = Math.max(1, this.#cellSize * 0.09);
		const alphaScale = this.#dark ? 0.55 : 0.45;
		const alphaCap = this.#dark ? 0.2 : 0.16;
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
