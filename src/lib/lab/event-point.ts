export const MIN_JUMPS = 0;
export const MAX_JUMPS = 100;
export const MIN_BONUS_PERMIL = 0;
export const MAX_BONUS_PERMIL = 9_999;
export const MIN_MAX_RUNS = 1;
export const MAX_MAX_RUNS = 20;
export const SEARCH_WORK_LIMIT = 250_000;

export type ParseErrorCode = 'empty' | 'invalid_format' | 'out_of_range';

export type ParseError = {
	code: ParseErrorCode;
	input: string;
	min?: string;
	max?: string;
};

export type ParseResult<T> =
	{ ok: true; value: T } | { ok: false; error: ParseError };

export type RewardInput = {
	jumps: number;
	bonusPermil: number;
	hasPassport: boolean;
};

export type SolveInput = {
	current: bigint;
	target: bigint;
	bonusPermil: number;
	hasPassport: boolean;
	maxJumps: number;
	maxRuns: number;
};

export type EventPointPlan = {
	jumps: number[];
	reward: bigint;
	plays: number;
	maxJump: number;
	totalJumps: number;
};

export type RangeField =
	'current' | 'target' | 'bonusPermil' | 'maxJumps' | 'maxRuns';

export type SolveError =
	| {
			code: 'target_below_current';
			current: bigint;
			target: bigint;
	  }
	| {
			code: 'out_of_range';
			field: RangeField;
			value: string;
			min: string;
			max?: string;
	  }
	| {
			code: 'invalid_type';
			field: 'hasPassport';
			value: string;
			expected: 'boolean';
	  }
	| {
			code: 'unreachable';
			delta: bigint;
			maxJumps: number;
			maxRuns: number;
			minimumReward: bigint;
			maximumReward: bigint;
			maximumReachable: bigint;
	  }
	| {
			code: 'search_limit_exceeded';
			delta: bigint;
			maxJumps: number;
			maxRuns: number;
			workLimit: number;
	  };

export type SolveResult =
	| {
			ok: true;
			delta: bigint;
			plans: EventPointPlan[];
			inferred: boolean;
	  }
	| { ok: false; error: SolveError };

type Action = {
	jumps: number;
	reward: number;
};

type Candidate = {
	jumps: number[];
	sum: number;
	lastActionIndex: number;
	totalJumps: number;
};

const TOP_PLAN_LIMIT = 3;

class SearchWorkLimitError extends Error {}

type SearchBudget = {
	used: number;
};

function ceilDivide(value: bigint, divisor: bigint): bigint {
	return (value + divisor - 1n) / divisor;
}

function assertIntegerInRange(
	field: string,
	value: number,
	min: number,
	max: number
): void {
	if (!Number.isInteger(value) || value < min || value > max) {
		throw new RangeError(`${field} must be an integer from ${min} to ${max}`);
	}
}

function normalizeNumericInput(input: string): string {
	return input
		.normalize('NFKC')
		.replace(/\u2212/gu, '-')
		.replace(/[,\s]/gu, '');
}

function parseFailure(
	code: ParseErrorCode,
	input: string,
	min?: string,
	max?: string
): ParseResult<never> {
	return { ok: false, error: { code, input, min, max } };
}

/** Parse a non-negative event point total without losing integer precision. */
export function parsePointInput(input: string): ParseResult<bigint> {
	const normalized = normalizeNumericInput(input);
	if (normalized.length === 0) return parseFailure('empty', input);
	if (!/^[+-]?\d+$/u.test(normalized))
		return parseFailure('invalid_format', input);

	const value = BigInt(normalized);
	if (value < 0n) return parseFailure('out_of_range', input, '0');
	return { ok: true, value };
}

/**
 * Parse a percentage with at most one decimal place and return permil units.
 * For example, `20` and `20.0%` both become `200`.
 */
export function parseBonusPercent(input: string): ParseResult<number> {
	let normalized = normalizeNumericInput(input);
	if (normalized.endsWith('%')) normalized = normalized.slice(0, -1);
	if (normalized.length === 0) return parseFailure('empty', input);
	if (!/^[+-]?(?:\d+(?:\.\d)?|\.\d)$/u.test(normalized)) {
		return parseFailure('invalid_format', input);
	}

	const isNegative = normalized.startsWith('-');
	const unsigned = normalized.replace(/^[+-]/u, '');
	const [whole, fractional = '0'] = unsigned.split('.');
	const value = BigInt(whole || '0') * 10n + BigInt(fractional);
	const signedValue = isNegative ? -value : value;

	if (
		signedValue < BigInt(MIN_BONUS_PERMIL) ||
		signedValue > BigInt(MAX_BONUS_PERMIL)
	) {
		return parseFailure(
			'out_of_range',
			input,
			String(MIN_BONUS_PERMIL / 10),
			String(MAX_BONUS_PERMIL / 10)
		);
	}

	return { ok: true, value: Number(signedValue) };
}

/**
 * Zero-boost base event points for a Jump Rope result.
 *
 * This formula matches every published measurement from 0 through 70 jumps,
 * plus 80, 90, and 100 jumps. Other supported rows are inferred from it.
 */
export function calculateBasePoints(jumps: number): bigint {
	assertIntegerInRange('jumps', jumps, MIN_JUMPS, MAX_JUMPS);
	return 45n + ceilDivide(13n * BigInt(jumps), 10n);
}

/** Apply event bonus first (rounding up), then the Holo Passport multiplier. */
export function calculateReward({
	jumps,
	bonusPermil,
	hasPassport
}: RewardInput): bigint {
	assertIntegerInRange('jumps', jumps, MIN_JUMPS, MAX_JUMPS);
	assertIntegerInRange(
		'bonusPermil',
		bonusPermil,
		MIN_BONUS_PERMIL,
		MAX_BONUS_PERMIL
	);
	if (typeof hasPassport !== 'boolean') {
		throw new TypeError('hasPassport must be a boolean');
	}

	const base = calculateBasePoints(jumps);
	const withBonus = ceilDivide(base * BigInt(1_000 + bonusPermil), 1_000n);
	return (hasPassport ? 2n : 1n) * withBonus;
}

/** Whether the public point table contains a direct measurement for this row. */
export function isPublishedMeasuredJump(jumps: number): boolean {
	return (
		(Number.isInteger(jumps) && jumps >= 0 && jumps <= 70) ||
		jumps === 80 ||
		jumps === 90 ||
		jumps === 100
	);
}

function rangeError(
	field: RangeField,
	value: bigint | number,
	min: bigint | number,
	max?: bigint | number
): SolveResult {
	return {
		ok: false,
		error: {
			code: 'out_of_range',
			field,
			value: String(value),
			min: String(min),
			...(max === undefined ? {} : { max: String(max) })
		}
	};
}

function validateSolveInput(input: SolveInput): SolveResult | undefined {
	if (typeof input.current !== 'bigint' || input.current < 0n) {
		return rangeError('current', input.current, 0n);
	}
	if (typeof input.target !== 'bigint' || input.target < 0n) {
		return rangeError('target', input.target, 0n);
	}
	if (
		!Number.isInteger(input.bonusPermil) ||
		input.bonusPermil < MIN_BONUS_PERMIL ||
		input.bonusPermil > MAX_BONUS_PERMIL
	) {
		return rangeError(
			'bonusPermil',
			input.bonusPermil,
			MIN_BONUS_PERMIL,
			MAX_BONUS_PERMIL
		);
	}
	if (
		!Number.isInteger(input.maxJumps) ||
		input.maxJumps < MIN_JUMPS ||
		input.maxJumps > MAX_JUMPS
	) {
		return rangeError('maxJumps', input.maxJumps, MIN_JUMPS, MAX_JUMPS);
	}
	if (
		!Number.isInteger(input.maxRuns) ||
		input.maxRuns < MIN_MAX_RUNS ||
		input.maxRuns > MAX_MAX_RUNS
	) {
		return rangeError('maxRuns', input.maxRuns, MIN_MAX_RUNS, MAX_MAX_RUNS);
	}
	if (typeof input.hasPassport !== 'boolean') {
		return {
			ok: false,
			error: {
				code: 'invalid_type',
				field: 'hasPassport',
				value: String(input.hasPassport),
				expected: 'boolean'
			}
		};
	}
	return undefined;
}

function buildActions(input: SolveInput): Action[] {
	const actions: Action[] = [];
	for (let jumps = MIN_JUMPS; jumps <= input.maxJumps; jumps += 1) {
		const reward = Number(
			calculateReward({
				jumps,
				bonusPermil: input.bonusPermil,
				hasPassport: input.hasPassport
			})
		);
		if (actions.at(-1)?.reward === reward) continue;
		actions.push({ jumps, reward });
	}
	return actions;
}

function compareJumpLists(left: number[], right: number[]): number {
	for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
		if (left[index] !== right[index]) return left[index] - right[index];
	}
	return left.length - right.length;
}

function compareCandidates(
	left: Candidate,
	right: Candidate,
	actions: Action[]
): number {
	const leftMax =
		left.lastActionIndex < 0 ? 0 : actions[left.lastActionIndex].jumps;
	const rightMax =
		right.lastActionIndex < 0 ? 0 : actions[right.lastActionIndex].jumps;
	return (
		leftMax - rightMax ||
		left.totalJumps - right.totalJumps ||
		compareJumpLists(left.jumps, right.jumps)
	);
}

function greatestCommonDivisor(left: number, right: number): number {
	let a = Math.abs(left);
	let b = Math.abs(right);
	while (b !== 0) {
		const remainder = a % b;
		a = b;
		b = remainder;
	}
	return a;
}

function rewardGcd(actions: Action[]): number {
	return actions.reduce(
		(gcd, action) => greatestCommonDivisor(gcd, action.reward),
		0
	);
}

function shiftedRewardGcd(actions: Action[]): number {
	const minimumReward = actions[0]?.reward ?? 0;
	return actions.reduce(
		(gcd, action) => greatestCommonDivisor(gcd, action.reward - minimumReward),
		0
	);
}

function isExactPlayCountGcdFeasible(
	delta: number,
	playCount: number,
	minimumReward: number,
	differenceGcd: number
): boolean {
	const shiftedDelta = delta - playCount * minimumReward;
	if (shiftedDelta < 0) return false;
	if (differenceGcd === 0) return shiftedDelta === 0;
	return shiftedDelta % differenceGcd === 0;
}

function consumeSearchWork(budget: SearchBudget): void {
	budget.used += 1;
	if (budget.used > SEARCH_WORK_LIMIT) throw new SearchWorkLimitError();
}

function addCandidate(
	states: Array<Map<number, Candidate[]>>,
	candidate: Candidate,
	actions: Action[]
): void {
	const bySum = states[candidate.lastActionIndex];
	const bucket = bySum.get(candidate.sum) ?? [];
	if (
		bucket.some(
			(existing) => compareJumpLists(existing.jumps, candidate.jumps) === 0
		)
	)
		return;

	bucket.push(candidate);
	bucket.sort((left, right) => compareCandidates(left, right, actions));
	if (bucket.length > TOP_PLAN_LIMIT) bucket.length = TOP_PLAN_LIMIT;
	bySum.set(candidate.sum, bucket);
}

function solveWithExactPlayCount(
	delta: number,
	playCount: number,
	actions: Action[],
	budget: SearchBudget
): Candidate[] {
	let states: Array<Map<number, Candidate[]>> = actions.map(() => new Map());
	const initial: Candidate = {
		jumps: [],
		sum: 0,
		lastActionIndex: -1,
		totalJumps: 0
	};
	let activeCandidates = [initial];
	const maximumReward = actions.at(-1)?.reward ?? 0;

	for (let play = 0; play < playCount; play += 1) {
		states = actions.map(() => new Map());
		const remaining = playCount - play - 1;

		for (const candidate of activeCandidates) {
			const startIndex = Math.max(candidate.lastActionIndex, 0);
			for (
				let actionIndex = startIndex;
				actionIndex < actions.length;
				actionIndex += 1
			) {
				consumeSearchWork(budget);
				const action = actions[actionIndex];
				const sum = candidate.sum + action.reward;
				if (sum > delta) break;

				const minimumFinalSum = sum + remaining * action.reward;
				if (minimumFinalSum > delta) break;
				const maximumFinalSum = sum + remaining * maximumReward;
				if (maximumFinalSum < delta) continue;

				addCandidate(
					states,
					{
						jumps: [...candidate.jumps, action.jumps],
						sum,
						lastActionIndex: actionIndex,
						totalJumps: candidate.totalJumps + action.jumps
					},
					actions
				);
			}
		}

		activeCandidates = [];
		for (const bySum of states) {
			for (const bucket of bySum.values()) activeCandidates.push(...bucket);
		}
		if (activeCandidates.length === 0) break;
	}

	return activeCandidates
		.filter((candidate) => candidate.sum === delta)
		.sort((left, right) => compareCandidates(left, right, actions))
		.slice(0, TOP_PLAN_LIMIT);
}

function searchLimitExceeded(input: SolveInput, delta: bigint): SolveResult {
	return {
		ok: false,
		error: {
			code: 'search_limit_exceeded',
			delta,
			maxJumps: input.maxJumps,
			maxRuns: input.maxRuns,
			workLimit: SEARCH_WORK_LIMIT
		}
	};
}

function unreachable(
	input: SolveInput,
	delta: bigint,
	actions: Action[]
): SolveResult {
	const minimumReward = BigInt(actions[0]?.reward ?? 0);
	const maximumReward = BigInt(actions.at(-1)?.reward ?? 0);
	return {
		ok: false,
		error: {
			code: 'unreachable',
			delta,
			maxJumps: input.maxJumps,
			maxRuns: input.maxRuns,
			minimumReward,
			maximumReward,
			maximumReachable: maximumReward * BigInt(input.maxRuns)
		}
	};
}

/** Find up to three exact, canonically ordered zero-boost adjustment plans. */
export function solveEventPoint(input: SolveInput): SolveResult {
	const validationError = validateSolveInput(input);
	if (validationError) return validationError;
	if (input.target < input.current) {
		return {
			ok: false,
			error: {
				code: 'target_below_current',
				current: input.current,
				target: input.target
			}
		};
	}

	const delta = input.target - input.current;
	if (delta === 0n) {
		return {
			ok: true,
			delta,
			plans: [{ jumps: [], reward: 0n, plays: 0, maxJump: 0, totalJumps: 0 }],
			inferred: false
		};
	}

	const actions = buildActions(input);
	const minimumReward = BigInt(actions[0].reward);
	const maximumReward = BigInt(actions.at(-1)?.reward ?? 0);
	const maximumReachable = maximumReward * BigInt(input.maxRuns);
	if (delta < minimumReward || delta > maximumReachable)
		return unreachable(input, delta, actions);
	const commonRewardDivisor = rewardGcd(actions);
	if (delta % BigInt(commonRewardDivisor) !== 0n) {
		return unreachable(input, delta, actions);
	}

	const numericDelta = Number(delta);
	const minimumPlayCount = Math.max(
		1,
		Math.ceil(numericDelta / Number(maximumReward))
	);
	const maximumPlayCount = Math.min(
		input.maxRuns,
		Math.floor(numericDelta / Number(minimumReward))
	);
	const plans: EventPointPlan[] = [];
	const minimumNumericReward = actions[0].reward;
	const differenceGcd = shiftedRewardGcd(actions);
	const budget: SearchBudget = { used: 0 };

	try {
		for (
			let playCount = minimumPlayCount;
			playCount <= maximumPlayCount;
			playCount += 1
		) {
			if (
				!isExactPlayCountGcdFeasible(
					numericDelta,
					playCount,
					minimumNumericReward,
					differenceGcd
				)
			)
				continue;

			const candidates = solveWithExactPlayCount(
				numericDelta,
				playCount,
				actions,
				budget
			);
			for (const candidate of candidates) {
				plans.push({
					jumps: candidate.jumps,
					reward: delta,
					plays: candidate.jumps.length,
					maxJump: candidate.jumps.at(-1) ?? 0,
					totalJumps: candidate.totalJumps
				});
				if (plans.length === TOP_PLAN_LIMIT) break;
			}
			if (plans.length === TOP_PLAN_LIMIT) break;
		}
	} catch (error) {
		if (error instanceof SearchWorkLimitError) {
			return searchLimitExceeded(input, delta);
		}
		throw error;
	}

	if (plans.length === 0) return unreachable(input, delta, actions);
	return {
		ok: true,
		delta,
		plans,
		inferred: plans.some((plan) =>
			plan.jumps.some((jumps) => !isPublishedMeasuredJump(jumps))
		)
	};
}
