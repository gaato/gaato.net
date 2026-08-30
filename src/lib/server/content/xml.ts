import type { LocalPost } from './posts';

export const canonicalOrigin = 'https://gaato.net';

export function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function canonicalUrl(path: string): string {
	return `${canonicalOrigin}${path}`;
}

function rssDate(value: string): string {
	return new Date(`${value}T00:00:00+09:00`).toUTCString();
}

export function buildFeedXml(posts: readonly LocalPost[]): string {
	const items = posts
		.map((post) => {
			const url = canonicalUrl(`/articles/${post.slug}/`);
			return [
				'    <item>',
				`      <title>${escapeXml(post.title)}</title>`,
				`      <link>${escapeXml(url)}</link>`,
				`      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
				`      <pubDate>${rssDate(post.publishedDate)}</pubDate>`,
				`      <description>${escapeXml(post.description)}</description>`,
				'    </item>'
			].join('\n');
		})
		.join('\n');
	const latestDate = posts.reduce<string | undefined>((latest, post) => {
		const date = post.updatedDate ?? post.publishedDate;
		return latest === undefined || date > latest ? date : latest;
	}, undefined);

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0">',
		'  <channel>',
		'    <title>gaato</title>',
		`    <link>${canonicalOrigin}/</link>`,
		'    <description>gaato.netに書いたもの。</description>',
		'    <language>ja</language>',
		...(latestDate === undefined ? [] : [`    <lastBuildDate>${rssDate(latestDate)}</lastBuildDate>`]),
		items,
		'  </channel>',
		'</rss>',
		''
	].join('\n');
}

const staticSitemapPaths = ['/', '/articles/', '/lab/cellular-automaton/', '/lab/event-pt/'] as const;

export function buildSitemapXml(posts: readonly LocalPost[]): string {
	const staticEntries = staticSitemapPaths.map(
		(path) => `  <url><loc>${escapeXml(canonicalUrl(path))}</loc></url>`
	);
	const postEntries = posts.map((post) => {
		const url = canonicalUrl(`/articles/${post.slug}/`);
		const lastModified = post.updatedDate ?? post.publishedDate;
		return `  <url><loc>${escapeXml(url)}</loc><lastmod>${lastModified}</lastmod></url>`;
	});

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...staticEntries,
		...postEntries,
		'</urlset>',
		''
	].join('\n');
}
