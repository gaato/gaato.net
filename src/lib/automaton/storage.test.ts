import { describe, expect, test } from 'vitest';
import { AUTOMATON_RULES } from './rules';
import {
	AUTOMATON_PAUSED_STORAGE_KEY,
	AUTOMATON_SESSION_RULE_KEY,
	getOrCreateSessionRule,
	readPausePreference,
	writeSessionRule,
	writePausePreference,
	type StorageLike
} from './storage';

class MemoryStorage implements StorageLike {
	readonly values = new Map<string, string>();

	getItem(key: string): string | null {
		return this.values.get(key) ?? null;
	}

	setItem(key: string, value: string): void {
		this.values.set(key, value);
	}
}

describe('automaton storage preferences', () => {
	test('keeps a valid rule for the duration of a tab session', () => {
		const storage = new MemoryStorage();
		storage.setItem(AUTOMATON_SESSION_RULE_KEY, 'drylife');

		expect(getOrCreateSessionRule(storage, () => 0)).toBe(AUTOMATON_RULES[2]);
		expect(storage.getItem(AUTOMATON_SESSION_RULE_KEY)).toBe('drylife');
	});

	test('selects and stores a bounded rule when none is valid', () => {
		const storage = new MemoryStorage();
		storage.setItem(AUTOMATON_SESSION_RULE_KEY, 'missing');

		expect(getOrCreateSessionRule(storage, () => 0.999)).toBe(AUTOMATON_RULES[12]);
		expect(storage.getItem(AUTOMATON_SESSION_RULE_KEY)).toBe('amoeba');
	});

	test('stores an explicitly selected Lab rule for the tab session', () => {
		const storage = new MemoryStorage();
		writeSessionRule(storage, AUTOMATON_RULES[7]);
		expect(storage.getItem(AUTOMATON_SESSION_RULE_KEY)).toBe('honeylife');
		expect(getOrCreateSessionRule(storage, () => 0)).toBe(AUTOMATON_RULES[7]);
	});

	test('reads and writes the persistent pause preference', () => {
		const storage = new MemoryStorage();
		expect(readPausePreference(storage, true)).toBe(true);
		writePausePreference(storage, false);
		expect(storage.getItem(AUTOMATON_PAUSED_STORAGE_KEY)).toBe('false');
		expect(readPausePreference(storage, true)).toBe(false);
	});

	test('degrades safely when storage throws', () => {
		const broken: StorageLike = {
			getItem: () => {
				throw new Error('blocked');
			},
			setItem: () => {
				throw new Error('blocked');
			}
		};

		expect(getOrCreateSessionRule(broken, () => Number.NaN)).toBe(AUTOMATON_RULES[0]);
		expect(readPausePreference(broken, true)).toBe(true);
		expect(() => writePausePreference(broken, false)).not.toThrow();
	});
});
