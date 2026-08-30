import { describe, expect, test } from 'vitest';
import {
	AUTOMATON_RULES,
	findAutomatonRule,
	maskDigits,
	maskFor,
	parseAutomatonRule,
	paletteForMasks,
	ruleAllowsCell
} from './rules';

const EXPECTED_RULES = [
	['conway', "Conway's Life", 'B3/S23', 180],
	['highlife', 'HighLife', 'B36/S23', 140],
	['drylife', 'DryLife', 'B37/S23', 500],
	['eightlife', 'EightLife', 'B3/S238', 350],
	['dotlife', 'DotLife', 'B3/S023', 100],
	['2x2', '2x2', 'B36/S125', 180],
	['pseudo-life', 'Pseudo Life', 'B357/S238', 350],
	['honeylife', 'HoneyLife', 'B38/S238', 80],
	['pedestrian-life', 'Pedestrian Life', 'B38/S23', 100],
	['catagolue-oca', 'Catagolue OCA', 'B3/S01357', 250],
	['lowdeath', 'LowDeath', 'B368/S238', 250],
	['oca', 'OCA', 'B3678/S23', 250],
	['amoeba', 'Amoeba', 'B357/S1358', 180]
] as const;

describe('curated automaton rules', () => {
	test('ports the exact order, names, B/S notation, and initial densities', () => {
		expect(
			AUTOMATON_RULES.map((rule) => [
				rule.id,
				rule.name,
				rule.notation,
				rule.initialAlivePer1000
			])
		).toEqual(EXPECTED_RULES);
	});

	test.each(AUTOMATON_RULES)('$name follows every bit in $notation', (rule) => {
		for (let neighbors = 0; neighbors <= 8; neighbors += 1) {
			expect(ruleAllowsCell(rule, false, neighbors)).toBe(
				rule.notation.split('/')[0].includes(neighbors.toString())
			);
			expect(ruleAllowsCell(rule, true, neighbors)).toBe(
				rule.notation.split('/')[1].includes(neighbors.toString())
			);
		}
	});

	test('ports the deterministic MoonBit palette relation', () => {
		const palette = paletteForMasks(maskFor([3]), maskFor([2, 3]));

		expect(palette.red).toBeCloseTo(38.875, 8);
		expect(palette.green).toBeCloseTo(111.752_777_777_777_78, 8);
		expect(palette.blue).toBeCloseTo(99.41, 8);
		expect(palette.redGain).toBeCloseTo(47.666_666_666_666_664, 8);
		expect(palette.greenGain).toBeCloseTo(66.371_944_444_444_44, 8);
		expect(palette.blueGain).toBeCloseTo(70.75, 8);
		expect(palette.alphaBase).toBeCloseTo(0.116_311_111_111_111_12, 8);
		expect(palette.alphaGain).toBeCloseTo(0.293_062_5, 8);
	});

	test('round-trips masks and rule identifiers', () => {
		expect(maskDigits(maskFor([0, 3, 8]))).toBe('038');
		expect(findAutomatonRule('amoeba')).toBe(AUTOMATON_RULES[12]);
		expect(findAutomatonRule('missing')).toBeUndefined();
		expect(() => maskFor([9])).toThrow(RangeError);
	});

	test('parses and canonicalizes arbitrary Life-like rules', () => {
		const custom = parseAutomatonRule(' b82 / s755 ');

		expect(custom).toMatchObject({
			id: 'B28/S57',
			name: 'Custom',
			notation: 'B28/S57',
			birthMask: maskFor([2, 8]),
			surviveMask: maskFor([5, 7])
		});
		expect(parseAutomatonRule('B36/S23')).toBe(AUTOMATON_RULES[1]);
		expect(parseAutomatonRule('B/S')).toMatchObject({ notation: 'B/S' });
		expect(parseAutomatonRule('rule 30')).toBeUndefined();
		expect(parseAutomatonRule('B9/S23')).toBeUndefined();
	});
});
