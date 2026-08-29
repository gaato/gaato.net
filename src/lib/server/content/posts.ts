import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import type { DateString } from '$lib/content/writing-types';
import cloudflareWorkersPost from '../../../../content/posts/cloudflare-workers-static-assets-cutover.md?raw';
import debianWoodyPost from '../../../../content/posts/debian-woody-hurd-vm.md?raw';
import rcS380Post from '../../../../content/posts/rc-s380-blank-tag.md?raw';
import riscvMbtPost from '../../../../content/posts/riscv-mbt-rv32i-first.md?raw';
import stuckCtrlPost from '../../../../content/posts/stuck-ctrl-was-the-mouse.md?raw';

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
	const html = (marked.parse(body, { async: false, gfm: true }) as string).replaceAll(
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

const postSources: Readonly<Record<string, string>> = {
	'/content/posts/cloudflare-workers-static-assets-cutover.md': cloudflareWorkersPost,
	'/content/posts/debian-woody-hurd-vm.md': debianWoodyPost,
	'/content/posts/rc-s380-blank-tag.md': rcS380Post,
	'/content/posts/riscv-mbt-rv32i-first.md': riscvMbtPost,
	'/content/posts/stuck-ctrl-was-the-mouse.md': stuckCtrlPost
};

const posts = Object.freeze(
	Object.entries(postSources)
		.map(([path, source]) => parseLocalPost(source, path))
		.filter((post): post is LocalPost => post !== null)
		.sort(
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
