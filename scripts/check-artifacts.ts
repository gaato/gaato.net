import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, posix, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

const outputDirectory = resolve('dist');
const canonicalOrigin = 'https://gaato.net';
const postSlugs = [
	'cloudflare-workers-static-assets-cutover',
	'debian-woody-hurd-vm',
	'rc-s380-blank-tag',
	'riscv-mbt-rv32i-first',
	'stuck-ctrl-was-the-mouse'
] as const;

const routeFiles = new Map<string, string>([
	['/', 'index.html'],
	['/writing/', 'writing/index.html'],
	...postSlugs.map((slug) => [`/posts/${slug}/`, `posts/${slug}/index.html`] as const),
	['/lab/cellular-automaton/', 'lab/cellular-automaton/index.html'],
	['/lab/event-pt/', 'lab/event-pt/index.html']
]);
const expectedHtml = [...routeFiles.values(), '404.html'].sort();
const expectedSitemapUrls = [...routeFiles.keys()].map((route) => `${canonicalOrigin}${route}`).sort();
const expectedPostUrls = postSlugs.map((slug) => `${canonicalOrigin}/posts/${slug}/`).sort();
const failures: string[] = [];

function fail(message: string): void {
	failures.push(message);
}

async function walk(directory: string, prefix = ''): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const relative = posix.join(prefix, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(resolve(directory, entry.name), relative)));
		else if (entry.isFile()) files.push(relative);
	}
	return files;
}

async function readOutput(relative: string): Promise<string> {
	return readFile(resolve(outputDirectory, relative), 'utf8');
}

function parseAttributes(tag: string): Map<string, string> {
	const attributes = new Map<string, string>();
	const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gu;
	for (const match of tag.matchAll(pattern)) {
		attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? '');
	}
	return attributes;
}

function tags(html: string, name: 'link' | 'meta'): Map<string, string>[] {
	return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'giu'))].map((match) =>
		parseAttributes(match[0])
	);
}

function hasTag(
	parsedTags: Map<string, string>[],
	required: Readonly<Record<string, string | RegExp>>
): boolean {
	return parsedTags.some((attributes) =>
		Object.entries(required).every(([name, expected]) => {
			const actual = attributes.get(name.toLowerCase());
			return typeof expected === 'string' ? actual === expected : actual !== undefined && expected.test(actual);
		})
	);
}

function sortedUnique(values: string[]): string[] {
	return [...new Set(values)].sort();
}

function textValue(value: unknown): string | undefined {
	if (typeof value === 'string') return value;
	if (value && typeof value === 'object' && '#text' in value) {
		const text = (value as { '#text'?: unknown })['#text'];
		return typeof text === 'string' ? text : undefined;
	}
	return undefined;
}

function asArray<T>(value: T | T[] | undefined): T[] {
	if (value === undefined) return [];
	return Array.isArray(value) ? value : [value];
}

function resolveAsset(reference: string, from: string): string | undefined {
	if (/^(?:data:|blob:|mailto:|tel:|#)/iu.test(reference)) return undefined;
	const url = new URL(reference, `${canonicalOrigin}/${from}`);
	if (url.origin !== canonicalOrigin) return undefined;
	const relative = posix.normalize(decodeURIComponent(url.pathname).replace(/^\/+/, ''));
	if (relative === '..' || relative.startsWith('../')) {
		fail(`Asset reference escapes dist: ${reference} from ${from}`);
		return undefined;
	}
	return relative;
}

function htmlAssetReferences(html: string, from: string, extension: '.js' | '.css'): string[] {
	const references: string[] = [];
	const pattern = /\b(?:src|href)\s*=\s*(?:"([^"]+)"|'([^']+)')/giu;
	for (const match of html.matchAll(pattern)) {
		const reference = (match[1] ?? match[2]).split(/[?#]/u, 1)[0];
		if (reference.endsWith(extension)) {
			const resolved = resolveAsset(reference, from);
			if (resolved) references.push(resolved);
		}
	}
	return references;
}

function moduleReferences(source: string, from: string): string[] {
	const references: string[] = [];
	const pattern = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)["']([^"']+\.js(?:[?#][^"']*)?)["']/gu;
	for (const match of source.matchAll(pattern)) {
		const resolved = resolveAsset(match[1], from);
		if (resolved) references.push(resolved);
	}
	return references;
}

function cssReferences(source: string, from: string): string[] {
	const references: string[] = [];
	const pattern = /@import\s+(?:url\(\s*)?["']([^"']+\.css(?:[?#][^"']*)?)["']/gu;
	for (const match of source.matchAll(pattern)) {
		const resolved = resolveAsset(match[1], from);
		if (resolved) references.push(resolved);
	}
	return references;
}

function inlineBlocks(html: string, element: 'script' | 'style'): string[] {
	return [...html.matchAll(new RegExp(`<${element}\\b([^>]*)>([\\s\\S]*?)<\\/${element}>`, 'giu'))]
		.filter((match) => element === 'style' || !/\bsrc\s*=/iu.test(match[1]))
		.map((match) => match[2]);
}

async function routeAssetSize(
	htmlFile: string,
	type: 'js' | 'css'
): Promise<{ bytes: number; files: string[] }> {
	const html = await readOutput(htmlFile);
	const visited = new Set<string>();
	let bytes = 0;

	async function include(relative: string): Promise<void> {
		if (visited.has(relative)) return;
		visited.add(relative);
		let source: Buffer;
		try {
			source = await readFile(resolve(outputDirectory, relative));
		} catch {
			fail(`${htmlFile} references missing asset ${relative}`);
			return;
		}
		bytes += gzipSync(source, { level: 9 }).byteLength;
		const text = source.toString('utf8');
		const nested = type === 'js' ? moduleReferences(text, relative) : cssReferences(text, relative);
		for (const reference of nested) await include(reference);
	}

	const extension = type === 'js' ? '.js' : '.css';
	for (const reference of htmlAssetReferences(html, htmlFile, extension)) await include(reference);
	for (const inline of inlineBlocks(html, type === 'js' ? 'script' : 'style')) {
		bytes += gzipSync(Buffer.from(inline), { level: 9 }).byteLength;
		if (type === 'js') {
			for (const reference of moduleReferences(inline, htmlFile)) await include(reference);
		}
	}

	return { bytes, files: [...visited].sort() };
}

let files: string[] = [];
try {
	files = (await walk(outputDirectory)).sort();
} catch (error) {
	throw new Error(`Cannot inspect dist. Run the production build first. ${String(error)}`);
}

const actualHtml = files.filter((file) => extname(file) === '.html').sort();
if (JSON.stringify(actualHtml) !== JSON.stringify(expectedHtml)) {
	fail(`Unexpected HTML outputs. Expected ${expectedHtml.join(', ')}; got ${actualHtml.join(', ')}`);
}

for (const required of ['feed.xml', 'sitemap.xml', 'robots.txt', 'site.webmanifest', '_headers']) {
	if (!files.includes(required)) fail(`Missing required output: ${required}`);
}

for (const file of files) {
	if (['.md', '.mbt', '.wasm'].includes(extname(file))) fail(`Source/runtime artifact must not ship: ${file}`);
}
for (const forbidden of ['assets/party_inko.gif', 'assets/round2-index-transitions.css']) {
	if (files.includes(forbidden)) fail(`Comparison-only asset must not ship: ${forbidden}`);
}

const textualExtensions = new Set(['.css', '.html', '.js', '.json', '.txt', '.webmanifest', '.xml']);
const forbiddenText = [
	{ label: 'comparison route', pattern: /\/compare(?:\/|["'])/u },
	{ label: 'prototype component', pattern: /PrototypeRenderer|BirdCentered|DenseIndex|Makaizou|PageDialects|SamStudy/u },
	{ label: 'raw post source path', pattern: /content\/posts\//u },
	{ label: 'raw Markdown front matter', pattern: /layout:\s*blog-post/u },
	{ label: 'raw Markdown code fence', pattern: /```(?:\w+)?\r?\n/u },
	{ label: 'Wasm runtime reference', pattern: /\.wasm(?:\b|[?#])/u }
];
for (const file of files.filter((candidate) => textualExtensions.has(extname(candidate)))) {
	const contents = await readOutput(file);
	for (const forbidden of forbiddenText) {
		if (forbidden.pattern.test(contents)) fail(`${file} contains ${forbidden.label}`);
	}
}

for (const [route, file] of routeFiles) {
	if (!files.includes(file)) continue;
	const html = await readOutput(file);
	const links = tags(html, 'link');
	const metadata = tags(html, 'meta');
	const canonical = `${canonicalOrigin}${route}`;
	const requiredMetadata: Array<[string, boolean]> = [
		['description', hasTag(metadata, { name: 'description', content: /\S/u })],
		['Open Graph title', hasTag(metadata, { property: 'og:title', content: /\S/u })],
		['Open Graph description', hasTag(metadata, { property: 'og:description', content: /\S/u })],
		['Open Graph URL', hasTag(metadata, { property: 'og:url', content: canonical })],
		['Twitter card', hasTag(metadata, { name: 'twitter:card', content: /\S/u })],
		[
			'light theme color',
			hasTag(metadata, { name: 'theme-color', media: /prefers-color-scheme:\s*light/iu, content: /\S/u })
		],
		[
			'dark theme color',
			hasTag(metadata, { name: 'theme-color', media: /prefers-color-scheme:\s*dark/iu, content: /\S/u })
		],
		['content security policy', hasTag(metadata, { 'http-equiv': /content-security-policy/iu, content: /\S/u })],
		['canonical link', hasTag(links, { rel: 'canonical', href: canonical })],
		['manifest link', hasTag(links, { rel: 'manifest', href: /(?:^|\/)site\.webmanifest$/u })],
		[
			'RSS alternate',
			hasTag(links, { rel: 'alternate', type: 'application/rss+xml', href: /(?:^|\/)feed\.xml$/u })
		]
	];
	if (route.startsWith('/posts/')) {
		requiredMetadata.push(
			['article publication time', hasTag(metadata, { property: 'article:published_time', content: /^\d{4}-\d{2}-\d{2}/u })],
			['article modification time', hasTag(metadata, { property: 'article:modified_time', content: /^\d{4}-\d{2}-\d{2}/u })]
		);
	}
	for (const [label, present] of requiredMetadata) {
		if (!present) fail(`${file} is missing ${label}`);
	}
}

if (files.includes('404.html')) {
	const notFound = await readOutput('404.html');
	const metadata = tags(notFound, 'meta');
	const links = tags(notFound, 'link');
	if (!hasTag(metadata, { name: 'robots', content: /(?:^|,)\s*noindex\b/iu })) {
		fail('404.html is missing robots noindex metadata');
	}
	if (hasTag(links, { rel: 'canonical', href: /\S/u })) {
		fail('404.html must not advertise a canonical URL');
	}
	if (hasTag(metadata, { property: 'og:url', content: /\S/u })) {
		fail('404.html must not advertise an Open Graph URL');
	}
	if (!hasTag(metadata, { 'http-equiv': /content-security-policy/iu, content: /\S/u })) {
		fail('404.html is missing the content security policy');
	}
}

const parser = new XMLParser({ ignoreAttributes: false, trimValues: true });
if (files.includes('sitemap.xml')) {
	const xml = await readOutput('sitemap.xml');
	const valid = XMLValidator.validate(xml);
	if (valid !== true) fail(`sitemap.xml is invalid: ${JSON.stringify(valid)}`);
	else {
		const document = parser.parse(xml) as { urlset?: { url?: Array<{ loc?: unknown }> | { loc?: unknown } } };
		const locations = sortedUnique(
			asArray(document.urlset?.url)
				.map((entry) => textValue(entry.loc))
				.filter((value): value is string => value !== undefined)
		);
		if (JSON.stringify(locations) !== JSON.stringify(expectedSitemapUrls)) {
			fail(`sitemap.xml URLs differ. Expected ${expectedSitemapUrls.join(', ')}; got ${locations.join(', ')}`);
		}
	}
}

if (files.includes('feed.xml')) {
	const xml = await readOutput('feed.xml');
	const valid = XMLValidator.validate(xml);
	if (valid !== true) fail(`feed.xml is invalid: ${JSON.stringify(valid)}`);
	else {
		type FeedItem = { link?: unknown };
		const document = parser.parse(xml) as {
			rss?: { channel?: { item?: FeedItem | FeedItem[] } };
		};
		const items = asArray(document.rss?.channel?.item);
		const links = sortedUnique(
			items
				.map((item) => textValue(item.link))
				.filter((value): value is string => value !== undefined)
		);
		if (items.length !== postSlugs.length) fail(`feed.xml must contain ${postSlugs.length} local posts, got ${items.length}`);
		if (JSON.stringify(links) !== JSON.stringify(expectedPostUrls)) {
			fail(`feed.xml post links differ. Expected ${expectedPostUrls.join(', ')}; got ${links.join(', ')}`);
		}
	}
}

const routeCssBudget = 15 * 1024;
for (const file of expectedHtml) {
	if (!files.includes(file)) continue;
	const css = await routeAssetSize(file, 'css');
	console.log(`${file}: ${css.bytes} bytes gzip CSS (${css.files.length} files)`);
	if (css.bytes > routeCssBudget) {
		fail(`${file} CSS is ${css.bytes} gzip bytes; budget is ${routeCssBudget}`);
	}
}

for (const [file, budget] of [
	['index.html', 50 * 1024],
	['lab/event-pt/index.html', 75 * 1024]
] as const) {
	if (!files.includes(file)) continue;
	const js = await routeAssetSize(file, 'js');
	console.log(`${file}: ${js.bytes} bytes gzip JavaScript (${js.files.length} files)`);
	if (js.bytes > budget) fail(`${file} JavaScript is ${js.bytes} gzip bytes; budget is ${budget}`);
}

const outputSize = (await Promise.all(files.map(async (file) => (await stat(resolve(outputDirectory, file))).size))).reduce(
	(total, size) => total + size,
	0
);
console.log(`Checked ${files.length} files (${outputSize} bytes total)`);

if (failures.length > 0) {
	for (const failure of failures) console.error(`- ${failure}`);
	throw new Error(`Production artifact check failed with ${failures.length} problem${failures.length === 1 ? '' : 's'}`);
}

console.log('Production artifact checks passed');
