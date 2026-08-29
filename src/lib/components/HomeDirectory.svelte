<script lang="ts">
	import type { WritingItem } from '$lib/content/writing-types';
	import { directoryEntries, sectionLabels, sectionOrder } from '$lib/site/content';
	import WritingList from './WritingList.svelte';

	let { writing }: { writing: readonly WritingItem[] } = $props();
</script>

<header class="home-title">
	<h1>がーと / gaato</h1>
</header>

<div class="directory">
	{#each sectionOrder as section}
		<section id={section}>
		<h2 lang="en">{sectionLabels[section]}</h2>
			<div>
				{#if section === 'write'}
					<WritingList items={writing} />
					<p class="more"><a href="/writing/" lang="en">All writing</a></p>
				{:else}
					<ul role="list">
						{#each directoryEntries[section] as entry}
							<li lang={entry.lang}>
								{#if entry.href}
									<a href={entry.href}>{entry.label}</a>
								{:else}
									<span>{entry.label}</span>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</section>
	{/each}
</div>

<style>
	.home-title {
		margin-block-end: clamp(2.75rem, 7vw, 5rem);
	}

	h1 {
		max-inline-size: 14ch;
		margin: 0;
		font-size: clamp(2.75rem, 7vw, 5rem);
		font-weight: 720;
		letter-spacing: -0.055em;
		line-height: 0.96;
	}

	.directory {
		border-block-start: 1px solid var(--color-line);
	}

	section {
		display: grid;
		grid-template-columns: minmax(10rem, 0.32fr) minmax(0, 1fr);
		gap: 1.5rem;
		padding-block: 1.75rem;
		border-block-end: 1px solid var(--color-line);
	}

	h2 {
		margin: 0;
		font-size: clamp(1.1rem, 2vw, 1.55rem);
		line-height: 1.2;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		padding-block: 0.5rem;
		border-block-end: 1px solid color-mix(in srgb, var(--color-line), transparent 45%);
	}

	li:first-child {
		padding-block-start: 0;
	}

	li:last-child {
		padding-block-end: 0;
		border-block-end: 0;
	}

	li a {
		font-weight: 620;
	}

	.more {
		margin: 1rem 0 0;
		text-align: end;
	}

	.more a {
		font-size: 0.875rem;
		font-weight: 650;
	}

	@media (max-width: 42rem) {
		section {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}
</style>
