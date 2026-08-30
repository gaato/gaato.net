<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		variant?: 'compact' | 'display';
		description?: string;
		lang?: string;
		titleId?: string;
		meta?: Snippet;
		separated?: boolean;
	};

	let {
		title,
		variant = 'display',
		description,
		lang,
		titleId,
		meta,
		separated = false
	}: Props = $props();
</script>

<header class:compact={variant === 'compact'} class:display={variant === 'display'} class:separated {lang}>
	<h1 id={titleId}>{title}</h1>
	{#if description}<p>{description}</p>{/if}
	{#if meta}<div class="meta">{@render meta()}</div>{/if}
</header>

<style>
	header {
		max-inline-size: 62rem;
		margin-block-end: clamp(2rem, 4vw, 3rem);
	}

	header.separated {
		padding-block-end: 1.5rem;
		border-block-end: 1px solid var(--color-line);
	}

	h1 {
		margin: 0;
		text-wrap: balance;
	}

	.compact h1 {
		font-size: 1.75rem;
		letter-spacing: -0.025em;
		line-height: 1.2;
	}

	.display h1 {
		font-size: clamp(2rem, 4vw, 3.25rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}

	p {
		max-inline-size: 48rem;
		margin: 0.75rem 0 0;
		color: var(--color-muted);
		line-height: 1.65;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		margin-block-start: 1rem;
		color: var(--color-muted);
		font: 0.8125rem/1.5 var(--font-mono);
	}
</style>
