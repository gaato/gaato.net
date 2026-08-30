<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';

	let { data } = $props();
</script>

<PageMeta
	title={`${data.post.title} — gaato`}
	description={data.post.description || data.post.title}
	path={`/articles/${data.post.slug}/`}
	type="article"
	published={data.post.publishedDate}
	updated={data.post.updatedDate}
/>
<Article post={data.post} />
