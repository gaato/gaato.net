import type { WritingItem } from './writing-types';

export type SnapshotMode = 'replace' | 'union';

export function mergeSnapshot(
	current: readonly WritingItem[],
	incoming: readonly WritingItem[],
	mode: SnapshotMode
): WritingItem[] {
	if (incoming.length === 0 && current.length > 0) {
		throw new Error('refusing to replace a non-empty snapshot with an empty result');
	}

	if (mode === 'replace') return [...incoming];

	const merged = new Map(current.map((item) => [item.sourceId, item]));
	for (const item of incoming) merged.set(item.sourceId, item);
	return [...merged.values()];
}
