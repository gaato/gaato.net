<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import WritingArchive from '$lib/components/WritingArchive.svelte';

	let { data } = $props();
</script>

<PageMeta title="Articles — gaato" description="がーと / gaato が書いた記事。" path="/articles/" />
<WritingArchive items={data.writing} />
