export const COLOR_SCHEME_STORAGE_KEY = 'gaato:color-scheme:v1';

export type ColorScheme = 'light' | 'dark';

export interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

export function readColorSchemePreference(storage: StorageLike): ColorScheme | null {
	try {
		const stored = storage.getItem(COLOR_SCHEME_STORAGE_KEY);
		return stored === 'light' || stored === 'dark' ? stored : null;
	} catch {
		// Storage can be unavailable in private or policy-restricted contexts.
		return null;
	}
}

export function writeColorSchemePreference(
	storage: StorageLike,
	colorScheme: ColorScheme | null
): void {
	try {
		if (colorScheme) storage.setItem(COLOR_SCHEME_STORAGE_KEY, colorScheme);
		else storage.removeItem(COLOR_SCHEME_STORAGE_KEY);
	} catch {
		// Theme switching still works for the current page when persistence is unavailable.
	}
}

export function oppositeColorScheme(colorScheme: ColorScheme): ColorScheme {
	return colorScheme === 'dark' ? 'light' : 'dark';
}

export function colorSchemeActionLabel(
	preference: ColorScheme | null,
	systemColorScheme: ColorScheme
): string {
	return preference
		? 'Use system theme'
		: `Switch to ${oppositeColorScheme(systemColorScheme)} theme`;
}
