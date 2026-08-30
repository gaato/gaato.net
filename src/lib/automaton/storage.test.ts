import { describe, expect, test } from 'vitest';
import {
	AUTOMATON_PAUSED_STORAGE_KEY,
	readPausePreference,
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

		expect(readPausePreference(broken, true)).toBe(true);
		expect(() => writePausePreference(broken, false)).not.toThrow();
	});
});
