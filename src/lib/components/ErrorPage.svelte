<script lang="ts">
	let { status }: { status: number } = $props();
</script>

<section class="error-page" lang="en">
	<p class="status">{status}</p>
	<h1>{status === 404 ? 'Not found' : 'Error'}</h1>
	<p><a href="/">Home</a></p>
</section>

<style>
	.error-page {
		padding-block: clamp(2rem, 8vw, 6rem);
	}

	.status {
		margin: 0;
		color: var(--color-muted);
		font: 0.85rem/1.5 var(--font-mono);
	}

	h1 {
		margin: 0.25rem 0 2rem;
		font-size: clamp(2.75rem, 8vw, 5rem);
		letter-spacing: -0.055em;
	}
</style>
