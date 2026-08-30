import { AUTOMATON_RULES, type AutomatonRule } from './rules';

export const AUTOMATON_RULE_CHANGE_EVENT = 'gaato:automaton-rule-change';

export interface AutomatonRuleState {
	getOrCreate(random?: () => number): AutomatonRule;
	set(rule: AutomatonRule): void;
}

export function createAutomatonRuleState(): AutomatonRuleState {
	let current: AutomatonRule | undefined;

	return {
		getOrCreate(random = Math.random): AutomatonRule {
			if (current) return current;
			const value = random();
			const normalized = Number.isFinite(value)
				? Math.min(Math.max(value, 0), 1 - Number.EPSILON)
				: 0;
			current = AUTOMATON_RULES[Math.floor(normalized * AUTOMATON_RULES.length)];
			return current;
		},

		set(rule: AutomatonRule): void {
			current = rule;
		}
	};
}

export const automatonRuleState = createAutomatonRuleState();
