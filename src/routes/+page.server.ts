import { getWritingItems } from '#lib/server/content/writing.ts';

export function load() {
	return { writing: getWritingItems().slice(0, 5) };
}
