import { AUTOMATON_RULES, findAutomatonRule, type AutomatonRule } from './rules';

export const AUTOMATON_SESSION_RULE_KEY = 'gaato:automaton-rule:v1';
export const AUTOMATON_PAUSED_STORAGE_KEY = 'gaato:automaton-paused:v1';
export const AUTOMATON_SESSION_RULE_CHANGE_EVENT = 'gaato:automaton-rule-change';

export interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

export function readPausePreference(storage: StorageLike, fallback = false): boolean {
	try {
		const stored = storage.getItem(AUTOMATON_PAUSED_STORAGE_KEY);
		if (stored === 'true') return true;
		if (stored === 'false') return false;
	} catch {
		// Storage can be unavailable in private or policy-restricted contexts.
	}
	return fallback;
}

export function writePausePreference(storage: StorageLike, paused: boolean): void {
	try {
		storage.setItem(AUTOMATON_PAUSED_STORAGE_KEY, paused ? 'true' : 'false');
	} catch {
		// The simulation still works when persistence is unavailable.
	}
}

export function getOrCreateSessionRule(
	storage: StorageLike,
	random = Math.random
): AutomatonRule {
	try {
		const existing = findAutomatonRule(storage.getItem(AUTOMATON_SESSION_RULE_KEY));
		if (existing) return existing;
	} catch {
		// Fall through to an in-memory selection.
	}

	const value = random();
	const normalized = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1 - Number.EPSILON) : 0;
	const selected = AUTOMATON_RULES[Math.floor(normalized * AUTOMATON_RULES.length)];
	try {
		storage.setItem(AUTOMATON_SESSION_RULE_KEY, selected.id);
	} catch {
		// A stable selection for this component instance is still returned.
	}
	return selected;
}

export function writeSessionRule(storage: StorageLike, rule: AutomatonRule): void {
	try {
		storage.setItem(AUTOMATON_SESSION_RULE_KEY, rule.id);
	} catch {
		// Rule selection remains usable for the current component instance.
	}
}
