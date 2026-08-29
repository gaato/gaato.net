import { rename, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { mergeSnapshot, type SnapshotMode } from '../src/lib/content/writing-snapshot';
import type { WritingItem, WritingSource } from '../src/lib/content/writing-types';

const root = process.cwd();
const snapshotDirectory = join(root, 'content', 'writing');
const xmlParser = new XMLParser({ ignoreAttributes: false, parseTagValue: false, trimValues: true });

function jstDate(value: string | number): `${number}-${number}-${number}` {
	const date = typeof value === 'number' ? new Date(value) : new Date(value);
	if (Number.isNaN(date.valueOf())) throw new Error(`invalid publication date: ${value}`);
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Tokyo',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(date) as `${number}-${number}-${number}`;
}

function textValue(value: unknown): string {
	if (typeof value === 'string' || typeof value === 'number') return String(value);
	if (value && typeof value === 'object' && '#text' in value) return String(value['#text']);
	return '';
}

function asArray<T>(value: T | readonly T[] | undefined): readonly T[] {
	if (value === undefined) return [];
	return Array.isArray(value) ? value : [value as T];
}

export function parseQiitaJson(value: unknown): WritingItem[] {
	if (!Array.isArray(value)) throw new Error('Qiita returned a non-array response');
	return value.map((entry) => {
		const item = entry as Record<string, unknown>;
		if (![item.id, item.title, item.url, item.created_at].every((field) => typeof field === 'string')) {
			throw new Error('Qiita item is missing a required field');
		}
		return {
			source: 'qiita',
			sourceId: item.id as string,
			title: item.title as string,
			url: item.url as string,
			publishedDate: jstDate(item.created_at as string),
			...(typeof item.updated_at === 'string' ? { updatedAt: item.updated_at } : {})
		};
	});
}

type RssItem = { title?: unknown; link?: unknown; guid?: unknown; pubDate?: unknown };

export function parseRss(xml: string, source: 'note' | 'zenn'): WritingItem[] {
	const parsed = xmlParser.parse(xml) as { rss?: { channel?: { item?: RssItem | RssItem[] } } };
	const entries = asArray(parsed.rss?.channel?.item);
	if (entries.length === 0) throw new Error(`${source} RSS contained no items`);
	return entries.map((entry) => {
		const title = textValue(entry.title);
		const url = textValue(entry.link);
		const sourceId = textValue(entry.guid) || url;
		const published = textValue(entry.pubDate);
		if (!title || !url || !sourceId || !published) throw new Error(`${source} RSS item is incomplete`);
		return { source, sourceId, title, url, publishedDate: jstDate(published) };
	});
}

export function parseMathlogHtml(html: string): WritingItem[] {
	const match = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/u);
	if (!match) throw new Error('Mathlog __NEXT_DATA__ was not found');
	const data = JSON.parse(match[1]) as {
		props?: {
			pageProps?: {
				articles?: Record<string, unknown>[];
				profile?: { contents_aggregation?: { articles_count?: number } };
			};
		};
	};
	const page = data.props?.pageProps;
	const articles = page?.articles;
	const expected = page?.profile?.contents_aggregation?.articles_count;
	if (!Array.isArray(articles) || typeof expected !== 'number' || articles.length !== expected) {
		throw new Error('Mathlog article count could not be verified');
	}

	return articles.map((article) => {
		const id = String(article.id ?? '');
		const title = String(article.title ?? '');
		const created = article.created_at as { seconds?: number; _seconds?: number } | undefined;
		const updated = article.updated_at as { seconds?: number; _seconds?: number } | undefined;
		const createdSeconds = created?.seconds ?? created?._seconds;
		const updatedSeconds = updated?.seconds ?? updated?._seconds;
		if (!id || !title || typeof createdSeconds !== 'number') throw new Error('Mathlog item is incomplete');
		return {
			source: 'mathlog',
			sourceId: id,
			title,
			url: `https://mathlog.info/articles/${id}`,
			publishedDate: jstDate(createdSeconds * 1000),
			...(typeof updatedSeconds === 'number'
				? { updatedAt: new Date(updatedSeconds * 1000).toISOString() }
				: {})
		};
	});
}

async function fetchText(url: string): Promise<string> {
	const response = await fetch(url, { headers: { 'user-agent': 'gaato.net writing updater' } });
	if (!response.ok) throw new Error(`${url} returned ${response.status}`);
	return response.text();
}

async function fetchJson(url: string): Promise<unknown> {
	return JSON.parse(await fetchText(url));
}

async function readSnapshot(source: WritingSource): Promise<WritingItem[]> {
	return JSON.parse(await readFile(join(snapshotDirectory, `${source}.json`), 'utf8')) as WritingItem[];
}

async function writeSnapshot(source: WritingSource, items: readonly WritingItem[]): Promise<void> {
	const destination = join(snapshotDirectory, `${source}.json`);
	const temporary = `${destination}.${process.pid}.tmp`;
	await writeFile(temporary, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
	await rename(temporary, destination);
}

type SourceUpdate = {
	readonly source: Exclude<WritingSource, 'gaato.net'>;
	readonly mode: SnapshotMode;
	readonly load: () => Promise<WritingItem[]>;
};

const updates: readonly SourceUpdate[] = [
	{
		source: 'qiita',
		mode: 'replace',
		load: async () =>
			parseQiitaJson(await fetchJson('https://qiita.com/api/v2/users/gaato/items?page=1&per_page=100'))
	},
	{
		source: 'note',
		mode: 'union',
		load: async () => parseRss(await fetchText('https://note.com/gaato/rss'), 'note')
	},
	{
		source: 'mathlog',
		mode: 'replace',
		load: async () => parseMathlogHtml(await fetchText('https://mathlog.info/users/368/articles'))
	},
	{
		source: 'zenn',
		mode: 'replace',
		load: async () => parseRss(await fetchText('https://zenn.dev/gaato/feed?all=1'), 'zenn')
	}
];

async function main(): Promise<void> {
	const failures: string[] = [];
	for (const update of updates) {
		try {
			const current = await readSnapshot(update.source);
			const incoming = await update.load();
			const merged = mergeSnapshot(current, incoming, update.mode);
			await writeSnapshot(update.source, merged);
			console.log(`${update.source}: ${merged.length} items`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			failures.push(`${update.source}: ${message}`);
			console.error(`${update.source}: kept last-known-good snapshot (${message})`);
		}
	}
	if (failures.length > 0) throw new Error(failures.join('\n'));
}

if (import.meta.main) {
	await main();
}
