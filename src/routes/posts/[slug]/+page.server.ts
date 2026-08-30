import { redirect } from '@sveltejs/kit';
import { getLocalPosts } from '$lib/server/content/posts';

export function entries() {
	return getLocalPosts().map((post) => ({ slug: post.slug }));
}

export function load({ params }) {
	redirect(308, `/articles/${params.slug}/`);
}
