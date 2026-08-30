import { XMLParser } from 'fast-xml-parser';
import { describe, expect, test } from 'vitest';
import type { LocalPost } from './posts';
import { buildFeedXml, buildSitemapXml, escapeXml } from './xml';

const post: LocalPost = {
	slug: 'a-post',
	title: 'A & B <test>',
	description: 'Short <description> & nothing more.',
	publishedDate: '2026-08-20',
	updatedDate: '2026-08-28',
	tags: [],
	html: '<p>This body must not appear in the feed.</p>'
};

describe('XML documents', () => {
	test('escapes all XML special characters', () => {
		expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;');
	});

	test('builds a parseable metadata-only RSS feed', () => {
		const xml = buildFeedXml([post]);
		const parsed = new XMLParser().parse(xml);
		expect(parsed.rss.channel.item.title).toBe('A & B <test>');
		expect(parsed.rss.channel.item.link).toBe('https://gaato.net/articles/a-post/');
		expect(xml).not.toContain(post.html);
		expect(xml).toContain('Short &lt;description&gt; &amp; nothing more.');
	});

	test('builds canonical trailing-slash sitemap URLs with post lastmod', () => {
		const xml = buildSitemapXml([post]);
		const parsed = new XMLParser().parse(xml);
		const urls = parsed.urlset.url as Array<{ loc: string; lastmod?: string }>;
		expect(urls.map((entry) => entry.loc)).toEqual([
			'https://gaato.net/',
			'https://gaato.net/articles/',
			'https://gaato.net/lab/cellular-automaton/',
			'https://gaato.net/lab/event-pt/',
			'https://gaato.net/articles/a-post/'
		]);
		expect(urls.at(-1)?.lastmod).toBe('2026-08-28');
	});
});
