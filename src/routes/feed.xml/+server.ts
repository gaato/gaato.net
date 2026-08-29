import { getLocalPosts } from '$lib/server/content/posts';
import { buildFeedXml } from '$lib/server/content/xml';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(buildFeedXml(getLocalPosts()), {
		headers: { 'content-type': 'application/rss+xml; charset=utf-8' }
	});
