import { describe, expect, test } from 'vitest';
import { calculateBackingScale, rasterizeGridSegment, shouldRunAutomaton } from './controller';

describe('automaton canvas sizing', () => {
	test('caps device scale and total backing pixels', () => {
		expect(calculateBackingScale(800, 600, 3)).toBe(2);
		const scale = calculateBackingScale(3840, 2160, 2);
		expect(scale).toBeLessThan(1);
		expect(3840 * 2160 * scale * scale).toBeLessThanOrEqual(8_000_000.000_001);
	});

	test('keeps ordinary one-to-one canvases at one device pixel per CSS pixel', () => {
		expect(calculateBackingScale(1000, 800, 1)).toBe(1);
	});
});

describe('pointer trail rasterization', () => {
	test('fills every horizontal cell between sparse pointer events', () => {
		expect(rasterizeGridSegment({ column: 2, row: 4 }, { column: 6, row: 4 })).toEqual([
			{ column: 2, row: 4 },
			{ column: 3, row: 4 },
			{ column: 4, row: 4 },
			{ column: 5, row: 4 },
			{ column: 6, row: 4 }
		]);
	});

	test('fills diagonal segments in either direction without gaps', () => {
		const forward = rasterizeGridSegment({ column: 1, row: 1 }, { column: 4, row: 3 });
		const backward = rasterizeGridSegment({ column: 4, row: 3 }, { column: 1, row: 1 });
		expect(forward[0]).toEqual({ column: 1, row: 1 });
		expect(forward.at(-1)).toEqual({ column: 4, row: 3 });
		expect(backward).toEqual([...forward].reverse());
		expect(forward).toHaveLength(4);
	});
});

describe('automaton activity conditions', () => {
	const active = {
		available: true,
		initialized: true,
		documentVisible: true,
		renderVisible: true,
		reducedMotion: false,
		forcedColors: false,
		paused: false,
		suspended: false
	};

	test('runs only when every activity condition permits it', () => {
		expect(shouldRunAutomaton(active)).toBe(true);
		for (const key of Object.keys(active) as (keyof typeof active)[]) {
			const blocked = { ...active, [key]: !active[key] };
			expect(shouldRunAutomaton(blocked)).toBe(false);
		}
	});
});
