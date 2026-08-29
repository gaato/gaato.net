import { getLatestWritingItems } from '$lib/server/content/writing';

export function load() {
	return { writing: getLatestWritingItems().slice(0, 5) };
}
