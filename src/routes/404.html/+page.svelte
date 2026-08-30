<script lang="ts">
	import ErrorPage from '$lib/components/ErrorPage.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';
</script>

<PageMeta
	title="404 — gaato"
	description="ページが見つかりません。"
	noindex
/>

<ErrorPage status={404} />
