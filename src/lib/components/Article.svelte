<script lang="ts">
	import type { LocalPost } from '$lib/server/content/posts';
	import PageHeader from './PageHeader.svelte';

	let { post }: { post: LocalPost } = $props();
</script>

<article>
	<PageHeader title={post.title} separated>
		{#snippet meta()}
			<time datetime={post.publishedDate}>{post.publishedDate}</time>
			{#if post.updatedDate && post.updatedDate !== post.publishedDate}
				<span>updated <time datetime={post.updatedDate}>{post.updatedDate}</time></span>
			{/if}
		{/snippet}
	</PageHeader>
	<div class="article-body">{@html post.html}</div>
</article>

<style>
	article {
		max-inline-size: 76rem;
	}

	.article-body {
		max-inline-size: 76ch;
		line-height: 1.85;
	}

	.article-body :global(p),
	.article-body :global(ul),
	.article-body :global(ol),
	.article-body :global(blockquote),
	.article-body :global(pre),
	.article-body :global(table),
	.article-body :global(details) {
		margin-block: 1.25rem;
	}

	.article-body :global(h2),
	.article-body :global(h3) {
		margin-block: 2.75rem 1rem;
		line-height: 1.25;
	}

	.article-body :global(h2) {
		font-size: 1.55rem;
	}

	.article-body :global(h3) {
		font-size: 1.2rem;
	}

	.article-body :global(:not(pre) > code) {
		padding: 0.12em 0.32em;
		background: color-mix(in srgb, var(--color-ink), transparent 91%);
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}

	.article-body :global(pre) {
		max-inline-size: 100%;
		overflow-x: auto;
		padding: 1rem;
		border: 1px solid var(--color-line);
		background: var(--color-surface);
		font-size: 0.9rem;
		line-height: 1.55;
	}

	.article-body :global(blockquote) {
		margin-inline: 0;
		padding-inline-start: 1.25rem;
		border-inline-start: 0.25rem solid var(--color-line);
		color: var(--color-muted);
	}

	.article-body :global(table) {
		display: block;
		max-inline-size: 100%;
		overflow-x: auto;
		border-collapse: collapse;
	}

	.article-body :global(th),
	.article-body :global(td) {
		padding: 0.45rem 0.65rem;
		border: 1px solid var(--color-line);
		text-align: start;
	}

	.article-body :global(img) {
		block-size: auto;
	}

	.article-body :global(.problem-source) {
		margin-block-start: 1rem;
		color: var(--color-muted);
		font: 0.78rem/1.6 var(--font-mono);
	}

	.article-body :global(details) {
		padding-block: 0.15rem 0.75rem;
		border-block: 1px solid var(--color-line);
	}

	.article-body :global(details + h3) {
		margin-block-start: 3.5rem;
	}

	.article-body :global(summary) {
		min-block-size: var(--interactive-min-block-size);
		padding-block: 0.65rem;
		cursor: pointer;
		font-weight: 650;
	}

	.article-body :global(.katex:has(> math[display='block'])) {
		display: block;
		max-inline-size: 100%;
		margin-block: 1.25rem;
		overflow-x: auto;
		overflow-y: hidden;
	}

	.article-body :global(.katex-display),
	.article-body :global(math[display='block']) {
		display: block;
		max-inline-size: 100%;
		margin-block: 0;
		overflow-x: auto;
		overflow-y: hidden;
		padding-block: 0.25rem;
	}

	.article-body :global(math[display='block'] > *) {
		min-inline-size: max-content;
	}

	.article-body :global(.pattern-series) {
		--pattern-red: #9f2526;
		--pattern-blue: #164fa6;
		--pattern-green: #26713a;
		--pattern-magenta: #9a2e82;
		--pattern-yellow: #755d00;
	}

	.article-body :global(.pattern-series [mathcolor='patternred']) {
		color: var(--pattern-red) !important;
	}

	.article-body :global(.pattern-series [mathcolor='patternblue']) {
		color: var(--pattern-blue) !important;
	}

	.article-body :global(.pattern-series [mathcolor='patterngreen']) {
		color: var(--pattern-green) !important;
	}

	.article-body :global(.pattern-series [mathcolor='patternmagenta']) {
		color: var(--pattern-magenta) !important;
	}

	.article-body :global(.pattern-series [mathcolor='patternyellow']) {
		color: var(--pattern-yellow) !important;
	}

	.article-body :global(.region-figure) {
		max-inline-size: 28rem;
		margin-block: 1.5rem;
		margin-inline: auto;
	}

	.article-body :global(.region-figure svg) {
		inline-size: 100%;
		block-size: auto;
		color: var(--color-muted);
	}

	.article-body :global(.region-fill) {
		fill: var(--color-accent);
		fill-opacity: 0.24;
	}

	.article-body :global(.region-axis) {
		stroke: var(--color-line);
		stroke-width: 1;
	}

	.article-body :global(.region-boundary) {
		stroke: currentColor;
		stroke-width: 1.4;
		stroke-dasharray: 4 3;
	}

	.article-body :global(.region-label) {
		fill: currentColor;
		font: 8px var(--font-mono);
	}

	@media (prefers-color-scheme: dark) {
		.article-body :global(.pattern-series) {
			--pattern-red: #ff918a;
			--pattern-blue: #8fb4ff;
			--pattern-green: #8bd39d;
			--pattern-magenta: #f29bdc;
			--pattern-yellow: #ead36c;
		}
	}

	@media (forced-colors: active) {
		.article-body :global(.pattern-series [style*='color:pattern']) {
			color: CanvasText !important;
		}

		.article-body :global(.region-fill) {
			fill: Highlight;
			fill-opacity: 0.35;
		}
	}
</style>
