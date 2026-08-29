<script lang="ts">
	let {
		title,
		description,
		path,
		type = 'website',
		published,
		updated,
		noindex = false
	}: {
		title: string;
		description: string;
		path?: string;
		type?: 'website' | 'article';
		published?: string;
		updated?: string;
		noindex?: boolean;
	} = $props();

	const origin = 'https://gaato.net';
	const canonical = $derived(path ? new URL(path, origin).href : undefined);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}
	<meta property="og:site_name" content="gaato" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if type === 'article' && published}
		<meta property="article:published_time" content={published} />
	{/if}
	{#if type === 'article' && updated}
		<meta property="article:modified_time" content={updated} />
	{/if}
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>
