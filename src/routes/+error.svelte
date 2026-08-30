<script lang="ts">
	import { page } from '$app/state';
	import ErrorPage from '$lib/components/ErrorPage.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';
</script>

<PageMeta
	title={`${page.status} — gaato`}
	description="ページが見つかりません。"
	noindex
/>

<ErrorPage status={page.status} />
