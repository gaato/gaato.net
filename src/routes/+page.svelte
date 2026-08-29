<script lang="ts">
	import HomeDirectory from '$lib/components/HomeDirectory.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';

	let { data } = $props();
</script>

<PageMeta
	title="がーと / gaato"
	description="がーと / gaato のホームページ。"
	path="/"
/>
<HomeDirectory writing={data.writing} />
