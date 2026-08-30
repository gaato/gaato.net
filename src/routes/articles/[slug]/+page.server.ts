import { error } from '@sveltejs/kit';
import { getLocalPost, getLocalPosts } from '$lib/server/content/posts';

export function entries() {
	return getLocalPosts().map((post) => ({ slug: post.slug }));
}

export function load({ params }) {
	const post = getLocalPost(params.slug);
	if (!post) error(404, 'Not found');
	return { post };
}
