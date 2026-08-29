import { describe, expect, it } from 'vitest';

import {
	MAX_JUMPS,
	SEARCH_WORK_LIMIT,
	calculateBasePoints,
	calculateReward,
	isPublishedMeasuredJump,
	parseBonusPercent,
	parsePointInput,
	solveEventPoint
} from './event-point';

describe('calculateBasePoints', () => {
	const publishedMeasurements: Array<[number, bigint]> = [
		[0, 45n],
		[1, 47n],
		[2, 48n],
		[3, 49n],
		[4, 51n],
		[5, 52n],
		[6, 53n],
		[7, 55n],
		[8, 56n],
		[9, 57n],
		[10, 58n],
		[11, 60n],
		[12, 61n],
		[13, 62n],
		[14, 64n],
		[15, 65n],
		[16, 66n],
		[17, 68n],
		[18, 69n],
		[19, 70n],
		[20, 71n],
		[21, 73n],
		[22, 74n],
		[23, 75n],
		[24, 77n],
		[25, 78n],
		[26, 79n],
		[27, 81n],
		[28, 82n],
		[29, 83n],
		[30, 84n],
		[31, 86n],
		[32, 87n],
		[33, 88n],
		[34, 90n],
		[35, 91n],
		[36, 92n],
		[37, 94n],
		[38, 95n],
		[39, 96n],
		[40, 97n],
		[41, 99n],
		[42, 100n],
		[43, 101n],
		[44, 103n],
		[45, 104n],
		[46, 105n],
		[47, 107n],
		[48, 108n],
		[49, 109n],
		[50, 110n],
		[51, 112n],
		[52, 113n],
		[53, 114n],
		[54, 116n],
		[55, 117n],
		[56, 118n],
		[57, 120n],
		[58, 121n],
		[59, 122n],
		[60, 123n],
		[61, 125n],
		[62, 126n],
		[63, 127n],
		[64, 129n],
		[65, 130n],
		[66, 131n],
		[67, 133n],
		[68, 134n],
		[69, 135n],
		[70, 136n],
		[80, 149n],
		[90, 162n],
		[100, 175n]
	];

	it.each(publishedMeasurements)(
		'matches the published measurement for %i jumps',
		(jumps, expected) => {
			expect(calculateBasePoints(jumps)).toBe(expected);
			expect(isPublishedMeasuredJump(jumps)).toBe(true);
		}
	);

	it('distinguishes inferred rows inside the supported range', () => {
		expect(isPublishedMeasuredJump(51)).toBe(true);
		expect(isPublishedMeasuredJump(70)).toBe(true);
		expect(isPublishedMeasuredJump(71)).toBe(false);
		expect(isPublishedMeasuredJump(79)).toBe(false);
		expect(isPublishedMeasuredJump(80)).toBe(true);
		expect(isPublishedMeasuredJump(89)).toBe(false);
		expect(isPublishedMeasuredJump(90)).toBe(true);
		expect(isPublishedMeasuredJump(99)).toBe(false);
		expect(isPublishedMeasuredJump(100)).toBe(true);
	});

	it('rejects jumps outside the supported range', () => {
		expect(() => calculateBasePoints(-1)).toThrow(RangeError);
		expect(() => calculateBasePoints(MAX_JUMPS + 1)).toThrow(RangeError);
		expect(() => calculateBasePoints(1.5)).toThrow(RangeError);
	});
});

describe('calculateReward', () => {
	it.each([
		[0, 108n],
		[43, 244n],
		[49, 262n],
		[50, 264n]
	])(
		'rounds a 20%% bonus before applying Passport for %i jumps',
		(jumps, expected) => {
			expect(
				calculateReward({ jumps, bonusPermil: 200, hasPassport: true })
			).toBe(expected);
		}
	);

	it('validates bonus permil', () => {
		expect(() =>
			calculateReward({ jumps: 0, bonusPermil: -1, hasPassport: false })
		).toThrow(RangeError);
		expect(() =>
			calculateReward({ jumps: 0, bonusPermil: 10_000, hasPassport: false })
		).toThrow(RangeError);
	});

	it('rounds the bonus up once and does not double without Passport', () => {
		expect(
			calculateReward({ jumps: 1, bonusPermil: 1, hasPassport: false })
		).toBe(48n);
		expect(
			calculateReward({ jumps: 1, bonusPermil: 1, hasPassport: true })
		).toBe(96n);
	});

	it.each([
		[200, false, 66n],
		[201, false, 67n],
		[201, true, 134n]
	])(
		'handles the fractional bonus boundary at 7 jumps',
		(bonusPermil, hasPassport, expected) => {
			expect(calculateReward({ jumps: 7, bonusPermil, hasPassport })).toBe(
				expected
			);
		}
	);

	it('rejects a non-boolean Passport value at runtime', () => {
		expect(() =>
			calculateReward({
				jumps: 0,
				bonusPermil: 0,
				hasPassport: 'yes' as unknown as boolean
			})
		).toThrow(TypeError);
	});
});

describe('input parsing', () => {
	it('accepts full-width digits, commas, and spaces without losing precision', () => {
		expect(parsePointInput('１，１４４ ８９９')).toEqual({
			ok: true,
			value: 1_144_899n
		});
		expect(parsePointInput('9,007,199,254,740,993')).toEqual({
			ok: true,
			value: 9_007_199_254_740_993n
		});
	});

	it('parses bonus percentage with at most one decimal place', () => {
		expect(parseBonusPercent('２０．１％')).toEqual({ ok: true, value: 201 });
		expect(parseBonusPercent('.5')).toEqual({ ok: true, value: 5 });
		expect(parseBonusPercent('20.12')).toMatchObject({
			ok: false,
			error: { code: 'invalid_format' }
		});
		expect(parseBonusPercent('1000')).toMatchObject({
			ok: false,
			error: { code: 'out_of_range' }
		});
	});

	it('returns structured failures for empty, malformed, and negative points', () => {
		expect(parsePointInput('　')).toMatchObject({
			ok: false,
			error: { code: 'empty' }
		});
		expect(parsePointInput('12pt')).toMatchObject({
			ok: false,
			error: { code: 'invalid_format' }
		});
		expect(parsePointInput('-1')).toMatchObject({
			ok: false,
			error: { code: 'out_of_range' }
		});
	});
});

describe('solveEventPoint', () => {
	const defaults = {
		bonusPermil: 200,
		hasPassport: true,
		maxJumps: 50,
		maxRuns: 8
	};

	it('finds the ranked two-play plan for a 242 point adjustment', () => {
		const result = solveEventPoint({
			current: 1_144_899n,
			target: 1_145_141n,
			...defaults
		});

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.plans[0]).toEqual({
			jumps: [3, 4],
			reward: 242n,
			plays: 2,
			maxJump: 4,
			totalJumps: 7
		});
		expect(result.plans.slice(0, 3).map((plan) => plan.jumps)).toEqual([
			[3, 4],
			[2, 5],
			[1, 6]
		]);
	});

	it('matches an exhaustive top-three ranking on a bounded search space', () => {
		const maxJumps = 6;
		const maxRuns = 3;
		const byTarget = new Map<number, number[][]>();

		const enumerate = (
			remaining: number,
			startJump: number,
			jumps: number[],
			reward: number
		): void => {
			if (remaining === 0) {
				const plans = byTarget.get(reward) ?? [];
				plans.push(jumps);
				byTarget.set(reward, plans);
				return;
			}

			for (let jump = startJump; jump <= maxJumps; jump += 1) {
				enumerate(
					remaining - 1,
					jump,
					[...jumps, jump],
					reward +
						Number(
							calculateReward({
								jumps: jump,
								bonusPermil: 0,
								hasPassport: false
							})
						)
				);
			}
		};

		for (let plays = 1; plays <= maxRuns; plays += 1) {
			enumerate(plays, 0, [], 0);
		}

		const comparePlans = (left: number[], right: number[]): number => {
			const leftTotal = left.reduce((sum, jump) => sum + jump, 0);
			const rightTotal = right.reduce((sum, jump) => sum + jump, 0);
			const aggregateOrder =
				left.length - right.length ||
				(left.at(-1) ?? 0) - (right.at(-1) ?? 0) ||
				leftTotal - rightTotal;
			if (aggregateOrder !== 0) return aggregateOrder;

			for (
				let index = 0;
				index < Math.min(left.length, right.length);
				index += 1
			) {
				if (left[index] !== right[index]) {
					return left[index] - right[index];
				}
			}
			return 0;
		};

		for (const [target, exhaustivePlans] of byTarget) {
			const expected = exhaustivePlans.sort(comparePlans).slice(0, 3);
			const result = solveEventPoint({
				current: 0n,
				target: BigInt(target),
				bonusPermil: 0,
				hasPassport: false,
				maxJumps,
				maxRuns
			});

			expect(result.ok, `target ${target}`).toBe(true);
			if (!result.ok) continue;
			expect(
				result.plans.map((plan) => plan.jumps),
				`target ${target}`
			).toEqual(expected);
		}
	});

	it('prefers the one-play exact adjustment', () => {
		const result = solveEventPoint({
			current: 1_144_899n,
			target: 1_145_143n,
			...defaults
		});

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.plans[0].jumps).toEqual([43]);
		expect(result.plans[0].reward).toBe(244n);
	});

	it('returns a zero-play plan when current already equals target', () => {
		const result = solveEventPoint({
			current: 123n,
			target: 123n,
			...defaults
		});

		expect(result).toEqual({
			ok: true,
			delta: 0n,
			plans: [{ jumps: [], reward: 0n, plays: 0, maxJump: 0, totalJumps: 0 }],
			inferred: false
		});
	});

	it('marks a plan inferred only when it uses an unpublished jump row', () => {
		const inferred = solveEventPoint({
			current: 0n,
			target: 138n,
			bonusPermil: 0,
			hasPassport: false,
			maxJumps: 71,
			maxRuns: 1
		});
		expect(inferred).toMatchObject({
			ok: true,
			inferred: true,
			plans: [{ jumps: [71] }]
		});

		const measured = solveEventPoint({
			current: 0n,
			target: 123n,
			bonusPermil: 0,
			hasPassport: false,
			maxJumps: 60,
			maxRuns: 1
		});
		expect(measured).toMatchObject({
			ok: true,
			inferred: false,
			plans: [{ jumps: [60] }]
		});
	});

	it('rejects an odd Passport delta through reward-GCD feasibility', () => {
		const result = solveEventPoint({
			current: 0n,
			target: 3_001n,
			bonusPermil: 0,
			hasPassport: true,
			maxJumps: MAX_JUMPS,
			maxRuns: 20
		});

		expect(result).toMatchObject({
			ok: false,
			error: { code: 'unreachable', delta: 3_001n }
		});
	});

	it('returns a structured error when the deterministic work budget is exhausted', () => {
		const result = solveEventPoint({
			current: 0n,
			target: 3_000n,
			bonusPermil: 0,
			hasPassport: false,
			maxJumps: MAX_JUMPS,
			maxRuns: 20
		});

		expect(result).toMatchObject({
			ok: false,
			error: {
				code: 'search_limit_exceeded',
				delta: 3_000n,
				workLimit: SEARCH_WORK_LIMIT
			}
		});
	});

	it('returns a structured runtime error for a non-boolean Passport value', () => {
		const result = solveEventPoint({
			current: 0n,
			target: 100n,
			bonusPermil: 0,
			hasPassport: 1 as unknown as boolean,
			maxJumps: 50,
			maxRuns: 8
		});

		expect(result).toEqual({
			ok: false,
			error: {
				code: 'invalid_type',
				field: 'hasPassport',
				value: '1',
				expected: 'boolean'
			}
		});
	});

	it('returns structured errors for target order, constraints, and unreachable deltas', () => {
		expect(
			solveEventPoint({ current: 2n, target: 1n, ...defaults })
		).toMatchObject({
			ok: false,
			error: { code: 'target_below_current' }
		});
		expect(
			solveEventPoint({
				current: 0n,
				target: 100n,
				...defaults,
				maxJumps: 1_000
			})
		).toMatchObject({
			ok: false,
			error: { code: 'out_of_range', field: 'maxJumps' }
		});
		expect(
			solveEventPoint({
				current: 0n,
				target: 1n,
				...defaults,
				bonusPermil: 0,
				hasPassport: false
			})
		).toMatchObject({ ok: false, error: { code: 'unreachable', delta: 1n } });
	});

	it('accepts the exact maximum reach and rejects the next point', () => {
		const input = {
			current: 0n,
			bonusPermil: 0,
			hasPassport: false,
			maxJumps: 50,
			maxRuns: 8
		};
		const reachable = solveEventPoint({ ...input, target: 880n });
		expect(reachable).toMatchObject({
			ok: true,
			plans: [{ jumps: [50, 50, 50, 50, 50, 50, 50, 50] }]
		});

		const unreachable = solveEventPoint({ ...input, target: 881n });
		expect(unreachable).toMatchObject({
			ok: false,
			error: {
				code: 'unreachable',
				maximumReward: 110n,
				maximumReachable: 880n
			}
		});
	});
});
