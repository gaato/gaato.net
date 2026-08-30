<script lang="ts">
	import AutomatonLab from '$lib/components/AutomatonLab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageMeta from '$lib/components/PageMeta.svelte';
</script>

<PageMeta
	title="Cellular Automaton — gaato"
	description="任意のLife-likeルールを指定してセル・オートマトンをブラウザで動かします。"
	path="/lab/cellular-automaton/"
/>

<article class="lab-page" lang="en">
	<PageHeader
		title="Cellular Automaton"
		description="Enter any Life-like rule. Move the pointer over the canvas to add cells."
		lang="en"
	/>
	<AutomatonLab />
</article>

<style>
	.lab-page {
		min-inline-size: 0;
	}

</style>
