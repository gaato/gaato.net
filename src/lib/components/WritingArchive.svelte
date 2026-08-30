<script lang="ts">
	import type { WritingItem } from '$lib/content/writing-types';
	import PageHeader from './PageHeader.svelte';
	import WritingList from './WritingList.svelte';

	let { items }: { items: readonly WritingItem[] } = $props();

	const years = $derived(
		Object.entries(
			items.reduce<Record<string, WritingItem[]>>((groups, item) => {
				const year = item.publishedDate.slice(0, 4);
				(groups[year] ??= []).push(item);
				return groups;
			}, {})
		).sort(([left], [right]) => right.localeCompare(left))
	);
</script>

<PageHeader title="Articles" variant="compact" lang="en" />

<div class="years">
	{#each years as [year, yearItems]}
		<section>
			<h2>{year}</h2>
			<WritingList items={yearItems} />
		</section>
	{/each}
</div>

<style>
	.years {
		display: grid;
		gap: 2.75rem;
	}

	section {
		display: grid;
		grid-template-columns: 7rem minmax(0, 1fr);
		gap: 1.5rem;
		padding-block-start: 1rem;
		border-block-start: 1px solid var(--color-line);
		content-visibility: auto;
		contain-intrinsic-block-size: auto 22rem;
	}

	h2 {
		margin: 0;
		font-size: 1.25rem;
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 38rem) {
		section {
			grid-template-columns: 1fr;
		}
	}
</style>
