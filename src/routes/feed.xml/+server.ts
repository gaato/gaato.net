import { getLocalPosts } from '#lib/server/content/posts.ts';
import { buildFeedXml } from '#lib/server/content/xml.ts';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(buildFeedXml(getLocalPosts()), {
		headers: { 'content-type': 'application/rss+xml; charset=utf-8' }
	});
