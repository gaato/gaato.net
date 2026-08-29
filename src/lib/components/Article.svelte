<script lang="ts">
	import type { LocalPost } from '$lib/server/content/posts';

	let { post }: { post: LocalPost } = $props();
</script>

<article>
	<header>
		<h1>{post.title}</h1>
		<p class="dates">
			<time datetime={post.publishedDate}>{post.publishedDate}</time>
			{#if post.updatedDate && post.updatedDate !== post.publishedDate}
				<span>updated <time datetime={post.updatedDate}>{post.updatedDate}</time></span>
			{/if}
		</p>
	</header>
	<div class="article-body">{@html post.html}</div>
</article>

<style>
	article {
		max-inline-size: 76rem;
	}

	header {
		max-inline-size: 62rem;
		margin-block-end: 3rem;
		padding-block-end: 1.5rem;
		border-block-end: 1px solid var(--color-line);
	}

	h1 {
		margin: 0 0 1rem;
		font-size: clamp(2.15rem, 6vw, 3.75rem);
		letter-spacing: -0.045em;
		line-height: 1.08;
	}

	.dates {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		margin: 0;
		color: var(--color-muted);
		font: 0.82rem/1.5 ui-monospace, SFMono-Regular, Consolas, monospace;
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
	.article-body :global(table) {
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
</style>
