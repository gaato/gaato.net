export const AUTOMATON_PAUSED_STORAGE_KEY = 'gaato:automaton-paused:v1';

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
