<script lang="ts">
	import AutomatonLab from '$lib/components/AutomatonLab.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';
</script>

<PageMeta
	title="Cellular Automaton — gaato"
	description="13種類のライフゲーム系セル・オートマトンをブラウザで動かします。"
	path="/lab/cellular-automaton/"
/>

<article class="lab-page" lang="en">
	<header>
		<h1>Cellular Automaton</h1>
		<p>13 Life-like rules. Move the pointer over the canvas to add cells.</p>
	</header>
	<AutomatonLab />
</article>

<style>
	.lab-page {
		min-inline-size: 0;
	}

	header {
		max-inline-size: 48rem;
		margin-block-end: 2rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(2.25rem, 6vw, 3.75rem);
		letter-spacing: -0.045em;
		line-height: 1.05;
	}

	p {
		margin: 0.75rem 0 0;
		color: var(--color-muted);
	}
</style>
