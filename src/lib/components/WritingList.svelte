<script lang="ts">
	import type { WritingItem } from '$lib/content/writing-types';
	import { sourceNames, writingHref } from '$lib/site/content';

	let { items }: { items: readonly WritingItem[] } = $props();
</script>

<ol class="writing-list" role="list">
	{#each items as item}
		<li>
			<time datetime={item.publishedDate}>{item.publishedDate}</time>
			<a href={writingHref(item)}>{item.title}</a>
			<span>{sourceNames[item.source]}</span>
		</li>
	{/each}
</ol>

<style>
	.writing-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 7.25rem minmax(0, 1fr) 5.25rem;
		gap: 0.4rem 1rem;
		align-items: baseline;
		padding-block: 0.6rem;
		border-block-end: 1px solid var(--color-line-subtle);
	}

	li:first-child {
		padding-block-start: 0;
	}

	li:last-child {
		padding-block-end: 0;
		border-block-end: 0;
	}

	time,
	span {
		color: var(--color-muted);
		font: 0.78rem/1.45 var(--font-mono);
		font-variant-numeric: tabular-nums;
	}

	a {
		inline-size: fit-content;
		max-inline-size: 100%;
		font-weight: 620;
	}

	span {
		text-align: end;
	}

	@media (max-width: 38rem) {
		li {
			grid-template-columns: minmax(0, 1fr) auto;
		}

		time {
			grid-column: 1;
		}

		a {
			grid-row: 2;
			grid-column: 1 / -1;
		}

		span {
			grid-row: 1;
			grid-column: 2;
		}
	}
</style>
