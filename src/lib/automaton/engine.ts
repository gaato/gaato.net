import { ruleAllowsCell, type AutomatonRule } from './rules';

export const MAX_GRID_DIMENSION = 4096;
export const MAX_GRID_CELLS = 1_048_576;

export interface SeededGrid {
	cells: Uint8Array;
	energy: Float32Array;
	seed: number;
}

function assertInteger(value: number, name: string): void {
	if (!Number.isInteger(value)) throw new RangeError(`${name} must be an integer`);
}

export function gridLength(columns: number, rows: number): number {
	assertInteger(columns, 'columns');
	assertInteger(rows, 'rows');
	if (columns < 1 || rows < 1) throw new RangeError('Grid dimensions must be positive');
	if (columns > MAX_GRID_DIMENSION || rows > MAX_GRID_DIMENSION) {
		throw new RangeError(`Grid dimensions must not exceed ${MAX_GRID_DIMENSION}`);
	}
	const length = columns * rows;
	if (!Number.isSafeInteger(length) || length > MAX_GRID_CELLS) {
		throw new RangeError(`Grid must contain at most ${MAX_GRID_CELLS} cells`);
	}
	return length;
}

function assertGrid(array: Uint8Array | Float32Array, columns: number, rows: number): void {
	if (array.length !== gridLength(columns, rows)) {
		throw new RangeError('Grid length does not match its dimensions');
	}
}

function viewsOverlap(left: ArrayBufferView, right: ArrayBufferView): boolean {
	if (left.buffer !== right.buffer) return false;
	const leftStart = left.byteOffset;
	const leftEnd = leftStart + left.byteLength;
	const rightStart = right.byteOffset;
	const rightEnd = rightStart + right.byteLength;
	return leftStart < rightEnd && rightStart < leftEnd;
}

function wrap(value: number, size: number): number {
	const remainder = value % size;
	return remainder < 0 ? remainder + size : remainder;
}

export class AutomatonRandom {
	#value: number;

	constructor(seed: number) {
		this.#value = normalizeSeed(seed);
	}

	get seed(): number {
		return this.#value;
	}

	reset(seed: number): void {
		this.#value = normalizeSeed(seed);
	}

	nextInteger(): number {
		this.#value = (Math.imul(this.#value, 1_664_525) + 1_013_904_223) & 0x7fff_ffff;
		return this.#value;
	}
}

export function normalizeSeed(seed: number): number {
	if (!Number.isFinite(seed)) throw new RangeError('Seed must be finite');
	return Math.trunc(seed) & 0x7fff_ffff;
}

function fillRandomGrid(
	cells: Uint8Array,
	energy: Float32Array,
	random: AutomatonRandom,
	initialAlivePer1000: number
): void {
	const threshold = Math.min(1000, Math.max(0, Math.trunc(initialAlivePer1000)));
	for (let index = 0; index < cells.length; index += 1) {
		const alive = random.nextInteger() % 1000 < threshold;
		cells[index] = alive ? 1 : 0;
		energy[index] = alive ? 0.6 + (random.nextInteger() % 300) / 1000 : 0;
	}
}

export function seedInitialGrid(
	columns: number,
	rows: number,
	seed: number,
	initialAlivePer1000: number
): SeededGrid {
	const length = gridLength(columns, rows);
	const cells = new Uint8Array(length);
	const energy = new Float32Array(length);
	const random = new AutomatonRandom(seed);
	fillRandomGrid(cells, energy, random, initialAlivePer1000);
	return { cells, energy, seed: random.seed };
}

/** Compute one exact B/S generation on a toroidal grid. */
export function stepAutomaton(
	current: Uint8Array,
	target: Uint8Array,
	columns: number,
	rows: number,
	rule: AutomatonRule
): Uint8Array {
	assertGrid(current, columns, rows);
	assertGrid(target, columns, rows);
	if (viewsOverlap(current, target)) {
		throw new TypeError('Automaton generations need non-overlapping buffers');
	}

	for (let row = 0; row < rows; row += 1) {
		const above = row === 0 ? rows - 1 : row - 1;
		const below = row === rows - 1 ? 0 : row + 1;
		for (let column = 0; column < columns; column += 1) {
			const left = column === 0 ? columns - 1 : column - 1;
			const right = column === columns - 1 ? 0 : column + 1;
			const neighbors =
				current[above * columns + left] +
				current[above * columns + column] +
				current[above * columns + right] +
				current[row * columns + left] +
				current[row * columns + right] +
				current[below * columns + left] +
				current[below * columns + column] +
				current[below * columns + right];
			const index = row * columns + column;
			target[index] = ruleAllowsCell(rule, current[index] === 1, neighbors) ? 1 : 0;
		}
	}

	return target;
}

/** Add the original randomized 3x3 seed, wrapping at every edge. */
export function seedAt(
	cells: Uint8Array,
	energy: Float32Array,
	columns: number,
	rows: number,
	column: number,
	row: number,
	random: AutomatonRandom
): readonly number[] {
	assertGrid(cells, columns, rows);
	assertGrid(energy, columns, rows);
	assertInteger(column, 'column');
	assertInteger(row, 'row');
	const changed = new Set<number>();

	for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
		for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
			const targetRow = wrap(row + rowOffset, rows);
			const targetColumn = wrap(column + columnOffset, columns);
			const index = targetRow * columns + targetColumn;
			if (random.nextInteger() % 1000 < 550) {
				cells[index] = 1;
				energy[index] = Math.max(energy[index], 0.5);
				changed.add(index);
			}
		}
	}

	return [...changed];
}

/** Make one cell alive, wrapping at every edge. */
export function setCellAlive(
	cells: Uint8Array,
	energy: Float32Array,
	columns: number,
	rows: number,
	column: number,
	row: number
): number {
	assertGrid(cells, columns, rows);
	assertGrid(energy, columns, rows);
	assertInteger(column, 'column');
	assertInteger(row, 'row');
	const index = wrap(row, rows) * columns + wrap(column, columns);
	cells[index] = 1;
	energy[index] = 1;
	return index;
}

export interface AutomatonEngineOptions {
	columns: number;
	rows: number;
	rule: AutomatonRule;
	seed: number;
}

export class AutomatonEngine {
	#columns: number;
	#rows: number;
	#rule: AutomatonRule;
	#random: AutomatonRandom;
	#current: Uint8Array;
	#next: Uint8Array;
	#energy: Float32Array;

	constructor({ columns, rows, rule, seed }: AutomatonEngineOptions) {
		const length = gridLength(columns, rows);
		this.#columns = columns;
		this.#rows = rows;
		this.#rule = rule;
		this.#random = new AutomatonRandom(seed);
		this.#current = new Uint8Array(length);
		this.#next = new Uint8Array(length);
		this.#energy = new Float32Array(length);
		fillRandomGrid(
			this.#current,
			this.#energy,
			this.#random,
			this.#rule.initialAlivePer1000
		);
	}

	get columns(): number {
		return this.#columns;
	}

	get rows(): number {
		return this.#rows;
	}

	get rule(): AutomatonRule {
		return this.#rule;
	}

	get cells(): Uint8Array {
		return this.#current;
	}

	get energy(): Float32Array {
		return this.#energy;
	}

	get randomSeed(): number {
		return this.#random.seed;
	}

	step(): void {
		stepAutomaton(this.#current, this.#next, this.#columns, this.#rows, this.#rule);
		for (let index = 0; index < this.#next.length; index += 1) {
			this.#energy[index] =
				this.#next[index] === 1
					? Math.min(1, this.#energy[index] + 0.18)
					: Math.max(0, this.#energy[index] - 0.055);
		}
		const previous = this.#current;
		this.#current = this.#next;
		this.#next = previous;
	}

	seed(column: number, row: number): readonly number[] {
		return seedAt(
			this.#current,
			this.#energy,
			this.#columns,
			this.#rows,
			column,
			row,
			this.#random
		);
	}

	setAlive(column: number, row: number): number {
		return setCellAlive(
			this.#current,
			this.#energy,
			this.#columns,
			this.#rows,
			column,
			row
		);
	}

	reset(seed?: number): void {
		if (seed !== undefined) this.#random.reset(seed);
		this.#next.fill(0);
		fillRandomGrid(
			this.#current,
			this.#energy,
			this.#random,
			this.#rule.initialAlivePer1000
		);
	}

	setRule(rule: AutomatonRule, seed?: number): void {
		this.#rule = rule;
		this.reset(seed);
	}

	resize(columns: number, rows: number): boolean {
		const length = gridLength(columns, rows);
		if (columns === this.#columns && rows === this.#rows) return false;

		const current = new Uint8Array(length);
		const next = new Uint8Array(length);
		const energy = new Float32Array(length);
		fillRandomGrid(current, energy, this.#random, this.#rule.initialAlivePer1000);
		const copiedColumns = Math.min(this.#columns, columns);
		const copiedRows = Math.min(this.#rows, rows);
		for (let row = 0; row < copiedRows; row += 1) {
			const oldStart = row * this.#columns;
			const newStart = row * columns;
			current.set(this.#current.subarray(oldStart, oldStart + copiedColumns), newStart);
			next.set(this.#next.subarray(oldStart, oldStart + copiedColumns), newStart);
			energy.set(this.#energy.subarray(oldStart, oldStart + copiedColumns), newStart);
		}

		this.#columns = columns;
		this.#rows = rows;
		this.#current = current;
		this.#next = next;
		this.#energy = energy;
		return true;
	}
}
