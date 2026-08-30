import { getWritingItems } from '$lib/server/content/writing';

export function load() {
	return { writing: getWritingItems() };
}
