<script lang="ts">
	import type { WritingItem } from '$lib/content/writing-types';
	import { directoryEntries, sectionLabels, sectionOrder } from '$lib/site/content';
	import WritingList from './WritingList.svelte';

	let { writing }: { writing: readonly WritingItem[] } = $props();
</script>

<header class="home-intro">
	<h1 lang="en">I’m gaato. I put a lot of work into avoiding work.</h1>
</header>

<div class="directory">
	{#each sectionOrder as section}
		<section id={section}>
		<h2 lang="en">{sectionLabels[section]}</h2>
			<div>
				{#if section === 'write'}
					<WritingList items={writing} />
					<p class="more"><a href="/articles/" lang="en">All articles</a></p>
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
	.home-intro {
		display: grid;
		align-content: center;
		justify-items: center;
		min-block-size: clamp(8rem, 14vw, 10rem);
		margin-block-end: clamp(1.5rem, 3vw, 2.5rem);
	}

	h1 {
		max-inline-size: 48ch;
		margin: 0;
		font-size: clamp(1rem, 0.95rem + 0.3vw, 1.2rem);
		font-weight: 400;
		letter-spacing: 0;
		line-height: 1.5;
		text-align: center;
		text-wrap: balance;
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
		border-block-end: 1px solid var(--color-line-subtle);
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
