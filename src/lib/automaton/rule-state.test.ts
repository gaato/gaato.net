import { describe, expect, test } from 'vitest';
import { AUTOMATON_RULES } from './rules';
import { createAutomatonRuleState } from './rule-state';

describe('automaton runtime rule state', () => {
	test('keeps one rule for the current application lifetime', () => {
		const state = createAutomatonRuleState();
		expect(state.getOrCreate(() => 0)).toBe(AUTOMATON_RULES[0]);
		expect(state.getOrCreate(() => 0.999)).toBe(AUTOMATON_RULES[0]);
	});

	test('allows the Lab to replace the shared rule', () => {
		const state = createAutomatonRuleState();
		state.getOrCreate(() => 0);
		state.set(AUTOMATON_RULES[7]);
		expect(state.getOrCreate(() => 0)).toBe(AUTOMATON_RULES[7]);
	});

	test('bounds random selection and handles non-finite values', () => {
		expect(createAutomatonRuleState().getOrCreate(() => 0.999)).toBe(AUTOMATON_RULES[12]);
		expect(createAutomatonRuleState().getOrCreate(() => Number.NaN)).toBe(AUTOMATON_RULES[0]);
	});
});
