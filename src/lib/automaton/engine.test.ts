import { describe, expect, test } from 'vitest';
import {
	AutomatonEngine,
	AutomatonRandom,
	MAX_GRID_CELLS,
	gridLength,
	seedAt,
	seedInitialGrid,
	stepAutomaton
} from './engine';
import { AUTOMATON_RULES, ruleAllowsCell } from './rules';

const conway = AUTOMATON_RULES[0];

function setNeighbors(
	grid: Uint8Array,
	columns: number,
	centerColumn: number,
	centerRow: number,
	count: number
): void {
	const offsets = [
		[-1, -1],
		[0, -1],
		[1, -1],
		[-1, 0],
		[1, 0],
		[-1, 1],
		[0, 1],
		[1, 1]
	] as const;
	for (const [columnOffset, rowOffset] of offsets.slice(0, count)) {
		grid[(centerRow + rowOffset) * columns + centerColumn + columnOffset] = 1;
	}
}

describe('automaton engine', () => {
	test('validates dimensions and limits allocation', () => {
		expect(gridLength(64, 64)).toBe(4096);
		expect(() => gridLength(0, 1)).toThrow(RangeError);
		expect(() => gridLength(1.5, 2)).toThrow(RangeError);
		expect(() => gridLength(MAX_GRID_CELLS, 2)).toThrow(RangeError);
		expect(() => gridLength(4097, 1)).toThrow(RangeError);
	});

	test('reproduces the original 31-bit LCG and initial board', () => {
		const random = new AutomatonRandom(1);
		expect(random.nextInteger()).toBe(1_015_568_748);
		expect(random.nextInteger()).toBe(1_586_005_467);
		const first = seedInitialGrid(12, 8, 42, conway.initialAlivePer1000);
		const second = seedInitialGrid(12, 8, 42, conway.initialAlivePer1000);
		expect(first).toEqual(second);
	});

	test('turns a Conway blinker by ninety degrees', () => {
		const columns = 5;
		const rows = 5;
		const current = new Uint8Array(columns * rows);
		const target = new Uint8Array(current.length);
		current[2 * columns + 1] = 1;
		current[2 * columns + 2] = 1;
		current[2 * columns + 3] = 1;

		stepAutomaton(current, target, columns, rows, conway);

		expect([...target]).toEqual([
			0, 0, 0, 0, 0,
			0, 0, 1, 0, 0,
			0, 0, 1, 0, 0,
			0, 0, 1, 0, 0,
			0, 0, 0, 0, 0
		]);
	});

	test.each(AUTOMATON_RULES)('$name applies exact birth and survival semantics', (rule) => {
		for (const alive of [false, true]) {
			for (let neighborCount = 0; neighborCount <= 8; neighborCount += 1) {
				const columns = 5;
				const rows = 5;
				const current = new Uint8Array(columns * rows);
				const target = new Uint8Array(current.length);
				setNeighbors(current, columns, 2, 2, neighborCount);
				current[2 * columns + 2] = alive ? 1 : 0;
				stepAutomaton(current, target, columns, rows, rule);
				expect(target[2 * columns + 2]).toBe(
					ruleAllowsCell(rule, alive, neighborCount) ? 1 : 0
				);
			}
		}
	});

	test('wraps neighbors across both axes', () => {
		const columns = 5;
		const rows = 5;
		const current = new Uint8Array(columns * rows);
		const target = new Uint8Array(current.length);
		current[4 * columns + 4] = 1;
		current[4 * columns] = 1;
		current[4] = 1;

		stepAutomaton(current, target, columns, rows, conway);

		expect(target[0]).toBe(1);
	});

	test('rejects identical and partially overlapping generation buffers', () => {
		const grid = new Uint8Array(25);
		expect(() => stepAutomaton(grid, grid, 5, 5, conway)).toThrow(TypeError);
		const shared = new Uint8Array(26);
		expect(() =>
			stepAutomaton(shared.subarray(0, 25), shared.subarray(1, 26), 5, 5, conway)
		).toThrow(TypeError);
	});

	test('wraps the randomized seed and updates only successful cells', () => {
		const cells = new Uint8Array(9);
		const energy = new Float32Array(9);
		const changed = seedAt(cells, energy, 3, 3, 0, 0, new AutomatonRandom(1));

		expect(changed).toContain(6);
		expect(changed.every((index) => index >= 0 && index < 9)).toBe(true);
		expect(changed.every((index) => cells[index] === 1 && energy[index] >= 0.5)).toBe(true);
	});

	test('does not thin dense generations or consume randomness while stepping', () => {
		const engine = new AutomatonEngine({ columns: 8, rows: 8, rule: AUTOMATON_RULES[3], seed: 7 });
		engine.cells.fill(1);
		engine.energy.fill(1);
		const before = engine.randomSeed;

		engine.step();

		expect(engine.cells.every((cell) => cell === 1)).toBe(true);
		expect(engine.randomSeed).toBe(before);
	});

	test('preserves the top-left state through resize and no-ops identical dimensions', () => {
		const engine = new AutomatonEngine({ columns: 2, rows: 2, rule: conway, seed: 7 });
		engine.cells.set([1, 0, 0, 1]);
		engine.energy.set([1, 0, 0, 0.75]);

		expect(engine.resize(2, 2)).toBe(false);
		expect(engine.resize(4, 3)).toBe(true);
		expect([...engine.cells.slice(0, 2)]).toEqual([1, 0]);
		expect([...engine.cells.slice(4, 6)]).toEqual([0, 1]);
		expect(engine.energy[5]).toBeCloseTo(0.75);
	});

	test('reset and rule changes are reproducible when a seed is supplied', () => {
		const engine = new AutomatonEngine({ columns: 10, rows: 8, rule: conway, seed: 1 });
		engine.reset(123);
		const first = engine.cells.slice();
		engine.reset(123);
		expect(engine.cells).toEqual(first);
		engine.setRule(AUTOMATON_RULES[1], 123);
		expect(engine.rule).toBe(AUTOMATON_RULES[1]);
		expect(engine.cells).not.toEqual(first);
	});
});
