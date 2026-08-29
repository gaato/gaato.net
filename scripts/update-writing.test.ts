import { describe, expect, test } from 'vitest';
import { parseMathlogHtml, parseQiitaJson, parseRss } from './update-writing';

describe('writing source parsers', () => {
	test('parses the fields used from Qiita', () => {
		expect(
			parseQiitaJson([
				{
					id: 'abc',
					title: 'Article',
					url: 'https://qiita.com/gaato/items/abc',
					created_at: '2026-08-01T00:00:00+09:00',
					updated_at: '2026-08-02T00:00:00+09:00'
				}
			])
		).toEqual([
			{
				source: 'qiita',
				sourceId: 'abc',
				title: 'Article',
				url: 'https://qiita.com/gaato/items/abc',
				publishedDate: '2026-08-01',
				updatedAt: '2026-08-02T00:00:00+09:00'
			}
		]);
	});

	test('parses a single RSS item without treating it as an array', () => {
		const xml = `<?xml version="1.0"?><rss><channel><item><title>Post</title><link>https://note.com/gaato/n/n1</link><guid>n1</guid><pubDate>Fri, 01 Aug 2025 00:00:00 GMT</pubDate></item></channel></rss>`;
		expect(parseRss(xml, 'note')).toEqual([
			{
				source: 'note',
				sourceId: 'n1',
				title: 'Post',
				url: 'https://note.com/gaato/n/n1',
				publishedDate: '2025-08-01'
			}
		]);
	});

	test('accepts Mathlog only when the advertised article count matches', () => {
		const nextData = {
			props: {
				pageProps: {
					profile: { contents_aggregation: { articles_count: 1 } },
					articles: [
						{
							id: 2364,
							title: 'Integral',
							created_at: { seconds: 1622473200 }
						}
					]
				}
			}
		};
		const html = `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(nextData)}</script>`;
		expect(parseMathlogHtml(html)).toHaveLength(1);
		expect(() =>
			parseMathlogHtml(html.replace('"articles_count":1', '"articles_count":2'))
		).toThrow(/count could not be verified/u);
	});
});
