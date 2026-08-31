<script lang="ts">
	let { status }: { status: number } = $props();
	let notFound = $derived(status === 404);
</script>

<section class="error-page" lang="en">
	<p class="status">{status}</p>
	<h1>{notFound ? 'We couldn’t find this page.' : 'Something went wrong.'}</h1>
	<p class="message">
		{notFound ? 'That doesn’t mean it isn’t there.' : 'The page could not be loaded.'}
	</p>
	<nav aria-label="Error recovery">
		<a href="/">Return home</a>
		{#if notFound}<a href="/articles/">Browse articles</a>{/if}
	</nav>
</section>

<style>
	.error-page {
		max-inline-size: 48rem;
		padding-block: clamp(2rem, 8vw, 7rem);
	}

	.status {
		margin: 0;
		color: var(--color-muted);
		font: 0.85rem/1.5 var(--font-mono);
	}

	h1 {
		max-inline-size: 13ch;
		margin: 0.55rem 0 1.5rem;
		font-size: clamp(3rem, 9vw, 6.25rem);
		line-height: 0.96;
		letter-spacing: -0.065em;
	}

	.message {
		max-inline-size: 34ch;
		margin: 0;
		color: var(--color-muted);
		font-size: clamp(1rem, 2vw, 1.15rem);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.5rem;
		margin-block-start: 2rem;
	}

	a {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--interactive-min-block-size);
	}
</style>
