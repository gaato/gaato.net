import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import { parse as parseYaml } from 'yaml';
import { publishedLocalPostSlugs } from '$lib/content/local-post-manifest';
import type { DateString } from '$lib/content/writing-types';

export type LocalPost = {
	readonly slug: string;
	readonly title: string;
	readonly description: string;
	readonly publishedDate: DateString;
	readonly updatedDate?: DateString;
	readonly tags: readonly string[];
	readonly html: string;
};

type Frontmatter = {
	title?: unknown;
	description?: unknown;
	date?: unknown;
	updated?: unknown;
	updatedDate?: unknown;
	tags?: unknown;
	draft?: unknown;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/u;
const markdown = new Marked({ gfm: true });
markdown.use(
	markedKatex({
		nonStandard: true,
		output: 'mathml',
		throwOnError: true,
		trust: false
	})
);

export function tokyoToday(now = new Date()): DateString {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Tokyo',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(now) as DateString;
}

export function splitFrontmatter(source: string): { data: Frontmatter; body: string } {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
	if (!match) return { data: {}, body: source };

	return {
		data: (parseYaml(match[1]) ?? {}) as Frontmatter,
		body: source.slice(match[0].length)
	};
}

function asDate(value: unknown): DateString | undefined {
	return typeof value === 'string' && datePattern.test(value) ? (value as DateString) : undefined;
}

export function parseLocalPost(
	source: string,
	path: string,
	today = tokyoToday()
): LocalPost | null {
	const slug = path.split('/').at(-1)?.replace(/\.md$/u, '') ?? '';
	if (!slug || slug === 'index') return null;

	const { data, body } = splitFrontmatter(source);
	const publishedDate = asDate(data.date);
	if (data.draft === true || typeof data.title !== 'string' || publishedDate === undefined) {
		return null;
	}
	if (publishedDate > today) return null;

	const updatedDate = asDate(data.updatedDate) ?? asDate(data.updated);
	const html = (markdown.parse(body, { async: false }) as string).replaceAll(
		'<pre>',
		'<pre tabindex="0">'
	);
	return {
		slug,
		title: data.title,
		description: typeof data.description === 'string' ? data.description : '',
		publishedDate,
		...(updatedDate === undefined ? {} : { updatedDate }),
		tags: Array.isArray(data.tags)
			? data.tags.filter((tag): tag is string => typeof tag === 'string')
			: [],
		html
	};
}

const postSources = import.meta.glob<string>('../../../../content/posts/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const parsedPosts = Object.entries(postSources)
	.map(([path, source]) => parseLocalPost(source, path))
	.filter((post): post is LocalPost => post !== null);
const postsBySlug = new Map(parsedPosts.map((post) => [post.slug, post]));
const manifestSlugs = new Set<string>(publishedLocalPostSlugs);
const missingOrUnpublished = publishedLocalPostSlugs.filter((slug) => !postsBySlug.has(slug));
const unlistedPublished = parsedPosts
	.map((post) => post.slug)
	.filter((slug) => !manifestSlugs.has(slug));

if (missingOrUnpublished.length > 0 || unlistedPublished.length > 0) {
	throw new Error(
		[
			'Local post manifest is out of sync.',
			missingOrUnpublished.length > 0
				? `Missing or unpublished: ${missingOrUnpublished.join(', ')}.`
				: '',
			unlistedPublished.length > 0
				? `Published but unlisted: ${unlistedPublished.join(', ')}.`
				: ''
		]
			.filter(Boolean)
			.join(' ')
	);
}

const posts = Object.freeze(
	parsedPosts.sort(
		(left, right) =>
			right.publishedDate.localeCompare(left.publishedDate) ||
			left.title.localeCompare(right.title, 'ja')
	)
);

export function getLocalPosts(): readonly LocalPost[] {
	return posts;
}

export function getLocalPost(slug: string): LocalPost | undefined {
	return posts.find((post) => post.slug === slug);
}
