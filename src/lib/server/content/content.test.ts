import { describe, expect, test } from 'vitest';
import { publishedLocalPostSlugs } from '$lib/content/local-post-manifest';
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
	test('loads exactly the Markdown posts in the published manifest', () => {
		expect(getLocalPosts().map((post) => post.slug).sort()).toEqual(
			[...publishedLocalPostSlugs].sort()
		);
		expect(getLocalPost('cpctf2021-osint-writeup')?.updatedDate).toBe('2021-05-26');
		expect(getLocalPost('math-problems-2019-2020')?.html).toContain('<details>');
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

	test('renders inline and display math as accessible server-side HTML', () => {
		const post = parseLocalPost(
			'---\ntitle: Test\ndate: "2026-08-20"\n---\n\nInline $x^2$.\n\n$$\n\\frac{1}{2}\n$$',
			'/content/posts/test.md',
			'2026-08-29'
		);
		expect(post?.html).toContain('<math');
		expect(post?.html).toContain('<math');
		expect(post?.html).toContain('display="block"');
	});

	test('does not render TeX delimiters inside fenced code blocks', () => {
		const post = parseLocalPost(
			'---\ntitle: Test\ndate: "2026-08-20"\n---\n\n```tex\n$$\\input{file}$$\n```',
			'/content/posts/test.md',
			'2026-08-29'
		);
		expect(post?.html).toContain('class="language-tex"');
		expect(post?.html).not.toContain('<math');
	});

	test('rejects malformed TeX instead of publishing an error placeholder', () => {
		expect(() =>
			parseLocalPost(
				'---\ntitle: Test\ndate: "2026-08-20"\n---\n\n$$\n\\notACommand{x}\n$$',
				'/content/posts/test.md',
				'2026-08-29'
			)
		).toThrow();
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
			new Set(['gaato.net', 'qiita', 'note', 'mathlog', 'zenn', 'shinonome'])
		);
		expect(items.find((item) => item.source === 'mathlog')?.updatedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
		expect(items.find((item) => item.source === 'shinonome')).toMatchObject({
			title: 'Python のフォーマッタの比較と VSCode での設定方法',
			url: 'https://blog.shinonome.io/python-formatter/',
			publishedDate: '2022-12-01'
		});
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
