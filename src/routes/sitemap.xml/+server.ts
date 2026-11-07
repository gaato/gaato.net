import { getLocalPosts } from '#lib/server/content/posts.ts';
import { buildSitemapXml } from '#lib/server/content/xml.ts';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(buildSitemapXml(getLocalPosts()), {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
