<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
</script>

<PageMeta
	title="404 — gaato"
	description="ページが見つかりません。"
	noindex
/>

<section class="error-page" lang="en">
	<p class="status">404</p>
	<h1>Not found</h1>
	<p><a href="/">Home</a></p>
</section>

<style>
	.error-page {
		padding-block: clamp(2rem, 8vw, 6rem);
	}

	.status {
		margin: 0;
		color: var(--color-muted);
		font: 0.85rem/1.5 ui-monospace, SFMono-Regular, Consolas, monospace;
	}

	h1 {
		margin: 0.25rem 0 2rem;
		font-size: clamp(2.75rem, 8vw, 5rem);
		letter-spacing: -0.055em;
	}
</style>
