<script lang="ts">
	import { page } from '$app/state';
	import AutomatonBackground from '$lib/components/AutomatonBackground.svelte';
	import { elsewhere } from '$lib/site/content';
	import '../app.css';

	let { children } = $props();
	let paused = $state(false);
	const backgroundSuspended = $derived(page.url.pathname.startsWith('/lab/cellular-automaton'));
</script>

<a class="skip-link" href="#content">Skip to content</a>
<AutomatonBackground bind:paused suspended={backgroundSuspended} />

<div class="site-frame">
	<header class="site-header">
		<a class="site-name" href="/">gaato</a>
		<nav aria-label="Primary" lang="en">
			<a href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>Home</a>
			<a
				href="/writing/"
				aria-current={page.url.pathname === '/writing/' ? 'page' : undefined}>Writing</a
			>
		</nav>
	</header>

	<main id="content" tabindex="-1">
		{@render children()}
	</main>

	<footer class="site-footer">
		<nav aria-label="Elsewhere">
			{#each elsewhere as item}
				<a href={item.href} rel="me">{item.label}</a>
			{/each}
		</nav>
		{#if !backgroundSuspended}
			<button
				type="button"
				class="background-toggle"
				aria-pressed={paused}
				data-testid="automaton-background-toggle"
				lang="en"
				onclick={() => (paused = !paused)}
			>
				{paused ? 'Resume background' : 'Pause background'}
			</button>
		{/if}
	</footer>
</div>

<style>
	.site-frame {
		position: relative;
		z-index: 1;
		min-block-size: 100dvb;
		pointer-events: none;
	}

	.site-header,
	main,
	.site-footer {
		inline-size: min(calc(100% - (2 * var(--page-inline))), var(--page-width));
		margin-inline: auto;
		pointer-events: auto;
	}

	.site-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1.5rem;
		padding-block: 1.25rem;
		border-block-end: 1px solid var(--color-line);
	}

	.site-name {
		display: inline-flex;
		align-items: center;
		min-block-size: 2.75rem;
		font-weight: 750;
		letter-spacing: -0.02em;
		text-decoration: none;
	}

	.site-header nav,
	.site-footer nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.25rem;
	}

	.site-header nav a {
		display: inline-flex;
		align-items: center;
		min-block-size: 2.75rem;
		color: var(--color-muted);
		font-size: 0.9rem;
		text-decoration: none;
	}

	.site-header nav a:hover,
	.site-header nav a[aria-current='page'] {
		color: var(--color-ink);
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}

	main {
		padding-block: clamp(2.75rem, 7vw, 6rem);
	}

	.site-footer {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1.5rem;
		padding-block: 1.5rem 2rem;
		border-block-start: 1px solid var(--color-line);
		color: var(--color-muted);
		font-size: 0.8rem;
	}

	.site-footer a {
		display: inline-flex;
		align-items: center;
		inline-size: fit-content;
		min-block-size: 2.75rem;
	}

	.background-toggle {
		min-block-size: 2.75rem;
		padding: 0 0.25rem;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		white-space: nowrap;
	}

	.background-toggle:hover {
		color: var(--color-ink);
	}

	@media (max-width: 42rem) {
		.site-footer {
			flex-direction: column;
		}
	}
</style>
