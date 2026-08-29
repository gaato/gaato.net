import mathlogSnapshot from '../../../../content/writing/mathlog.json';
import noteSnapshot from '../../../../content/writing/note.json';
import overridesData from '../../../../content/writing/overrides.json';
import qiitaSnapshot from '../../../../content/writing/qiita.json';
import zennSnapshot from '../../../../content/writing/zenn.json';
import {
	writingSources,
	type DateString,
	type WritingItem,
	type WritingOverrides,
	type WritingSource
} from '$lib/content/writing-types';
import { getLocalPosts } from './posts';

const sourceOrder: Readonly<Record<WritingSource, number>> = {
	'gaato.net': 0,
	qiita: 1,
	note: 2,
	mathlog: 3,
	zenn: 4
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/u;

function isWritingSource(value: unknown): value is WritingSource {
	return typeof value === 'string' && writingSources.includes(value as WritingSource);
}

function asDate(value: unknown): DateString | undefined {
	if (typeof value !== 'string') return undefined;
	const date = value.slice(0, 10);
	return datePattern.test(date) ? (date as DateString) : undefined;
}

function normalizeSnapshot(value: unknown): WritingItem[] {
	if (!Array.isArray(value)) return [];

	return value.flatMap((entry): WritingItem[] => {
		if (typeof entry !== 'object' || entry === null) return [];
		const item = entry as Record<string, unknown>;
		const publishedDate = asDate(item.publishedDate);
		if (
			!isWritingSource(item.source) ||
			typeof item.sourceId !== 'string' ||
			typeof item.title !== 'string' ||
			typeof item.url !== 'string' ||
			publishedDate === undefined
		) {
			return [];
		}

		const updatedDate = asDate(item.updatedDate) ?? asDate(item.updatedAt);
		return [
			{
				source: item.source,
				sourceId: item.sourceId,
				title: item.title,
				url: item.url,
				publishedDate,
				...(updatedDate === undefined ? {} : { updatedDate })
			}
		];
	});
}

export function mergeWritingItems(
	items: readonly WritingItem[],
	overrides: WritingOverrides
): WritingItem[] {
	const excluded = new Set(overrides.exclude);
	const merged = new Map<string, WritingItem>();

	for (const item of items) {
		if (excluded.has(item.url)) continue;
		const canonicalUrl = overrides.aliases[item.url] ?? item.url;
		if (merged.has(canonicalUrl)) continue;
		merged.set(canonicalUrl, canonicalUrl === item.url ? item : { ...item, url: canonicalUrl });
	}

	return [...merged.values()].sort(
		(left, right) =>
			right.publishedDate.localeCompare(left.publishedDate) ||
			sourceOrder[left.source] - sourceOrder[right.source] ||
			left.sourceId.localeCompare(right.sourceId)
	);
}

const localItems: WritingItem[] = getLocalPosts().map((post) => ({
	source: 'gaato.net',
	sourceId: post.slug,
	title: post.title,
	url: `/posts/${post.slug}/`,
	publishedDate: post.publishedDate,
	...(post.updatedDate === undefined ? {} : { updatedDate: post.updatedDate })
}));

const items = Object.freeze(
	mergeWritingItems(
		[
			...localItems,
			...normalizeSnapshot(qiitaSnapshot),
			...normalizeSnapshot(noteSnapshot),
			...normalizeSnapshot(mathlogSnapshot),
			...normalizeSnapshot(zennSnapshot)
		],
		overridesData as WritingOverrides
	)
);

export function getWritingItems(): readonly WritingItem[] {
	return items;
}

export function getLatestWritingItems(): readonly WritingItem[] {
	return items.slice(0, 8);
}
