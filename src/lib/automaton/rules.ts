export interface AutomatonPalette {
	red: number;
	green: number;
	blue: number;
	redGain: number;
	greenGain: number;
	blueGain: number;
	alphaBase: number;
	alphaGain: number;
}

export interface AutomatonRule {
	id: string;
	name: string;
	notation: string;
	birthMask: number;
	surviveMask: number;
	initialAlivePer1000: number;
	palette: AutomatonPalette;
}

function clamp(value: number, lower: number, upper: number): number {
	return Math.min(Math.max(value, lower), upper);
}

export function maskFor(values: readonly number[]): number {
	let mask = 0;
	for (const value of values) {
		if (!Number.isInteger(value) || value < 0 || value > 8) {
			throw new RangeError('Life-like rule counts must be integers from 0 through 8');
		}
		mask |= 1 << value;
	}
	return mask;
}

export function maskContains(mask: number, value: number): boolean {
	return value >= 0 && value <= 8 && ((mask >> value) & 1) === 1;
}

export function maskDigits(mask: number): string {
	let digits = '';
	for (let value = 0; value <= 8; value += 1) {
		if (maskContains(mask, value)) digits += value.toString();
	}
	return digits;
}

function maskCount(mask: number): number {
	let count = 0;
	for (let value = 0; value <= 8; value += 1) {
		if (maskContains(mask, value)) count += 1;
	}
	return count;
}

function maskSum(mask: number): number {
	let total = 0;
	for (let value = 0; value <= 8; value += 1) {
		if (maskContains(mask, value)) total += value;
	}
	return total;
}

function normalizedAverage(mask: number): number {
	const count = maskCount(mask);
	return count === 0 ? 0 : maskSum(mask) / (count * 8);
}

function seededUnit(seed: number): number {
	return (seed % 97) / 96;
}

/** Port of the palette relation from the original MoonBit implementation. */
export function paletteForMasks(birthMask: number, surviveMask: number): AutomatonPalette {
	const birthSum = maskSum(birthMask);
	const surviveSum = maskSum(surviveMask);
	const birthCount = maskCount(birthMask);
	const surviveCount = maskCount(surviveMask);
	const birthDensity = birthCount / 9;
	const surviveDensity = surviveCount / 9;
	const birthAverage = normalizedAverage(birthMask);
	const surviveAverage = normalizedAverage(surviveMask);
	const activity = clamp(birthDensity * 0.58 + surviveDensity * 0.42, 0, 1);
	const contrast = clamp(Math.abs(birthAverage - surviveAverage), 0, 1);
	const stability = clamp(1 - contrast * 0.82, 0, 1);
	const warmSeed = seededUnit(
		birthSum * 37 + surviveSum * 19 + birthCount * 53 + surviveCount * 29
	);
	const coolSeed = seededUnit(
		birthSum * 17 + surviveSum * 31 + birthCount * 11 + surviveCount * 47
	);

	return {
		red: clamp(14 + 84 * warmSeed + 34 * contrast, 0, 255),
		green: clamp(58 + 52 * stability + 28 * activity, 0, 255),
		blue: clamp(68 + 78 * coolSeed + 18 * (1 - activity), 0, 255),
		redGain: clamp(12 + 44 * (1 - surviveAverage) + 20 * warmSeed, 0, 255),
		greenGain: clamp(24 + 42 * stability + 16 * activity, 0, 255),
		blueGain: clamp(22 + 48 * (1 - contrast) + 18 * coolSeed, 0, 255),
		alphaBase: clamp(0.11 + activity * 0.04, 0.08, 0.2),
		alphaGain: clamp(0.24 + contrast * 0.09 + stability * 0.05, 0.18, 0.4)
	};
}

function defineRule(
	id: string,
	name: string,
	birth: readonly number[],
	survive: readonly number[],
	initialAlivePer1000: number
): AutomatonRule {
	const birthMask = maskFor(birth);
	const surviveMask = maskFor(survive);
	return Object.freeze({
		id,
		name,
		notation: `B${maskDigits(birthMask)}/S${maskDigits(surviveMask)}`,
		birthMask,
		surviveMask,
		initialAlivePer1000,
		palette: Object.freeze(paletteForMasks(birthMask, surviveMask))
	});
}

/** The curated order, rules and densities from `src/background/rules.mbt`. */
export const AUTOMATON_RULES: readonly AutomatonRule[] = Object.freeze([
	defineRule('conway', "Conway's Life", [3], [2, 3], 180),
	defineRule('highlife', 'HighLife', [3, 6], [2, 3], 140),
	defineRule('drylife', 'DryLife', [3, 7], [2, 3], 500),
	defineRule('eightlife', 'EightLife', [3], [2, 3, 8], 350),
	defineRule('dotlife', 'DotLife', [3], [0, 2, 3], 100),
	defineRule('2x2', '2x2', [3, 6], [1, 2, 5], 180),
	defineRule('pseudo-life', 'Pseudo Life', [3, 5, 7], [2, 3, 8], 350),
	defineRule('honeylife', 'HoneyLife', [3, 8], [2, 3, 8], 80),
	defineRule('pedestrian-life', 'Pedestrian Life', [3, 8], [2, 3], 100),
	defineRule('catagolue-oca', 'Catagolue OCA', [3], [0, 1, 3, 5, 7], 250),
	defineRule('lowdeath', 'LowDeath', [3, 6, 8], [2, 3, 8], 250),
	defineRule('oca', 'OCA', [3, 6, 7, 8], [2, 3], 250),
	defineRule('amoeba', 'Amoeba', [3, 5, 7], [1, 3, 5, 8], 180)
]);

const RULES_BY_ID = new Map(AUTOMATON_RULES.map((rule) => [rule.id, rule]));
const RULES_BY_NOTATION = new Map(AUTOMATON_RULES.map((rule) => [rule.notation, rule]));

export function parseAutomatonRule(notation: string): AutomatonRule | undefined {
	const compact = notation.replaceAll(/\s/gu, '').toUpperCase();
	const match = /^B([0-8]*)\/S([0-8]*)$/u.exec(compact);
	if (!match) return undefined;

	const birthMask = maskFor([...match[1]].map(Number));
	const surviveMask = maskFor([...match[2]].map(Number));
	const canonical = `B${maskDigits(birthMask)}/S${maskDigits(surviveMask)}`;
	const known = RULES_BY_NOTATION.get(canonical);
	if (known) return known;

	return Object.freeze({
		id: canonical,
		name: 'Custom',
		notation: canonical,
		birthMask,
		surviveMask,
		initialAlivePer1000: 180,
		palette: Object.freeze(paletteForMasks(birthMask, surviveMask))
	});
}

export function findAutomatonRule(id: string | null | undefined): AutomatonRule | undefined {
	if (id === null || id === undefined) return undefined;
	return RULES_BY_ID.get(id) ?? parseAutomatonRule(id);
}

export function ruleAllowsCell(rule: AutomatonRule, alive: boolean, neighbors: number): boolean {
	return maskContains(alive ? rule.surviveMask : rule.birthMask, neighbors);
}
