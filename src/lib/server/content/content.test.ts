import { describe, expect, test } from 'vitest';
import { getLocalPost, getLocalPosts, parseLocalPost } from './posts';
import { getLatestWritingItems, getWritingItems, mergeWritingItems } from './writing';
import type { WritingItem } from '$lib/content/writing-types';

const base: WritingItem = {
	source: 'note',
	sourceId: 'old',
	title: 'Old',
	url: 'https://example.com/old',
	publishedDate: '2026-01-01'
};

describe('server-only local posts', () => {
	test('loads the five published Markdown posts', () => {
		expect(getLocalPosts()).toHaveLength(5);
		expect(getLocalPost('cloudflare-workers-static-assets-cutover')?.html).toContain('<p>');
		expect(getLocalPost('missing')).toBeUndefined();
	});

	test('parses a separate updated date and Markdown body', () => {
		const post = parseLocalPost(
			`---\ntitle: Test\ndescription: Safe & short\ndate: "2026-08-20"\nupdated: "2026-08-28"\ntags: [one]\n---\n\nText with \`code\`.`,
			'/content/posts/test.md',
			'2026-08-29'
		);
		expect(post).toMatchObject({
			slug: 'test',
			publishedDate: '2026-08-20',
			updatedDate: '2026-08-28',
			tags: ['one']
		});
		expect(post?.html).toContain('<code>code</code>');
	});

	test('makes scrollable fenced code blocks keyboard focusable', () => {
		const post = parseLocalPost(
			'---\ntitle: Test\ndate: "2026-08-20"\n---\n\n```text\noutput\n```',
			'/content/posts/test.md',
			'2026-08-29'
		);
		expect(post?.html).toContain('<pre tabindex="0"><code');
	});

	test('excludes drafts, future posts, and the index document', () => {
		const draft = '---\ntitle: Draft\ndate: "2026-08-20"\ndraft: true\n---\nDraft';
		const future = '---\ntitle: Future\ndate: "2026-08-30"\n---\nFuture';
		expect(parseLocalPost(draft, '/content/posts/draft.md', '2026-08-29')).toBeNull();
		expect(parseLocalPost(future, '/content/posts/future.md', '2026-08-29')).toBeNull();
		expect(parseLocalPost(future, '/content/posts/index.md', '2026-09-01')).toBeNull();
	});
});

describe('server-only writing index', () => {
	test('merges local posts with all saved snapshots and returns the latest eight', () => {
		const items = getWritingItems();
		expect(items).toHaveLength(26);
		expect(getLatestWritingItems()).toEqual(items.slice(0, 8));
		expect(new Set(items.map((item) => item.source))).toEqual(
			new Set(['gaato.net', 'qiita', 'note', 'mathlog', 'zenn'])
		);
		expect(items.find((item) => item.source === 'mathlog')?.updatedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
	});

	test('applies aliases and exclusions before sorting', () => {
		const result = mergeWritingItems(
			[
				base,
				{
					...base,
					sourceId: 'new',
					title: 'New',
					url: 'https://example.com/new',
					publishedDate: '2026-02-01'
				},
				{ ...base, sourceId: 'copy', title: 'Copy', url: 'https://mirror.example/copy' },
				{ ...base, sourceId: 'hidden', title: 'Hidden', url: 'https://example.com/hidden' }
			],
			{
				aliases: { 'https://mirror.example/copy': 'https://example.com/old' },
				exclude: ['https://example.com/hidden']
			}
		);
		expect(result.map((item) => item.title)).toEqual(['New', 'Old']);
	});
});
