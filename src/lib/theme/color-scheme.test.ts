import { describe, expect, test } from 'vitest';
import {
	COLOR_SCHEME_STORAGE_KEY,
	colorSchemeActionLabel,
	oppositeColorScheme,
	readColorSchemePreference,
	writeColorSchemePreference,
	type StorageLike
} from './color-scheme';

class MemoryStorage implements StorageLike {
	readonly values = new Map<string, string>();

	getItem(key: string): string | null {
		return this.values.get(key) ?? null;
	}

	setItem(key: string, value: string): void {
		this.values.set(key, value);
	}

	removeItem(key: string): void {
		this.values.delete(key);
	}
}

describe('color scheme preferences', () => {
	test('stores only explicit light and dark preferences', () => {
		const storage = new MemoryStorage();
		expect(readColorSchemePreference(storage)).toBeNull();

		writeColorSchemePreference(storage, 'dark');
		expect(readColorSchemePreference(storage)).toBe('dark');

		writeColorSchemePreference(storage, null);
		expect(storage.getItem(COLOR_SCHEME_STORAGE_KEY)).toBeNull();

		storage.setItem(COLOR_SCHEME_STORAGE_KEY, 'sepia');
		expect(readColorSchemePreference(storage)).toBeNull();
	});

	test('degrades safely when storage throws', () => {
		const broken: StorageLike = {
			getItem: () => {
				throw new Error('blocked');
			},
			setItem: () => {
				throw new Error('blocked');
			},
			removeItem: () => {
				throw new Error('blocked');
			}
		};

		expect(readColorSchemePreference(broken)).toBeNull();
		expect(() => writeColorSchemePreference(broken, 'light')).not.toThrow();
		expect(() => writeColorSchemePreference(broken, null)).not.toThrow();
	});

	test('labels the next action rather than the current appearance', () => {
		expect(oppositeColorScheme('light')).toBe('dark');
		expect(oppositeColorScheme('dark')).toBe('light');
		expect(colorSchemeActionLabel(null, 'light')).toBe('Switch to dark theme');
		expect(colorSchemeActionLabel(null, 'dark')).toBe('Switch to light theme');
		expect(colorSchemeActionLabel('dark', 'light')).toBe('Use system theme');
	});
});
