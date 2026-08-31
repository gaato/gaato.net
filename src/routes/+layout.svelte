<script lang="ts">
	import { page } from '$app/state';
	import AutomatonBackground from '$lib/components/AutomatonBackground.svelte';
	import { elsewhere } from '$lib/site/content';
	import '../app.css';

	let { children } = $props();
	let paused = $state(false);
</script>

<a class="skip-link" href="#content">Skip to content</a>
<AutomatonBackground bind:paused />

<div class="site-frame">
	<header class="site-header">
		<nav aria-label="Primary" lang="en">
			<a href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>Home</a>
			<a
				href="/articles/"
				aria-current={page.url.pathname.startsWith('/articles/') ? 'page' : undefined}>Articles</a
			>
			<a href="https://lab.gaato.net/">Lab</a>
		</nav>
	</header>

	<main id="content" class:home-page={page.url.pathname === '/'} tabindex="-1">
		{@render children()}
	</main>

	<footer class="site-footer">
		<div class="footer-links">
			<nav aria-label="Elsewhere">
				{#each elsewhere as item}
					<a href={item.href} rel="me">{item.label}</a>
				{/each}
			</nav>
			<nav aria-label="Site information" lang="en">
				<a href="https://github.com/gaato/gaato.net">Source</a>
				<a href="https://blueoakcouncil.org/license/1.0.0">License</a>
				<a href="/THIRD_PARTY_NOTICES.txt">Third-party notices</a>
			</nav>
		</div>
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
	</footer>
</div>

<style>
	.skip-link {
		position: fixed;
		inset-block-start: 0.75rem;
		inset-inline-start: 0.75rem;
		z-index: 9999;
		padding: 0.65rem 0.9rem;
		border: 1px solid var(--color-ink);
		background: var(--color-surface);
		color: var(--color-ink);
		font-weight: 700;
		transform: translateY(-180%);
	}

	.skip-link:focus {
		transform: translateY(0);
	}

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
		gap: 1.5rem;
		padding-block: 1.25rem;
		border-block-end: 1px solid var(--color-line);
	}

	.site-header nav,
	.site-footer nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.25rem;
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 2rem;
	}

	.site-header nav a {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--interactive-min-block-size);
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

	main.home-page {
		padding-block-start: clamp(2rem, 4vw, 3rem);
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
		min-block-size: var(--interactive-min-block-size);
	}

	.background-toggle {
		min-block-size: var(--interactive-min-block-size);
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
