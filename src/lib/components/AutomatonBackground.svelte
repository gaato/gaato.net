<script lang="ts">
	import { onMount } from 'svelte';
	import { AutomatonBackgroundController } from '$lib/automaton/controller';
	import { AUTOMATON_RULES } from '$lib/automaton/rules';
	import {
		readPausePreference,
		writePausePreference,
		type StorageLike
	} from '$lib/automaton/storage';

	type Props = {
		paused?: boolean;
	};

	let { paused = $bindable(false) }: Props = $props();
	let host: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let controller: AutomatonBackgroundController | undefined;
	let pauseStorage: StorageLike | undefined;
	let preferenceLoaded = $state(false);
	let activeRuleId = $state(AUTOMATON_RULES[0].id);

	$effect(() => {
		const nextPaused = paused;
		controller?.setPaused(nextPaused);
		if (preferenceLoaded && pauseStorage) {
			writePausePreference(pauseStorage, nextPaused);
		}
	});

	onMount(() => {
		const rule = randomRule();
		activeRuleId = rule.id;

		try {
			pauseStorage = window.localStorage;
			paused = readPausePreference(pauseStorage, paused);
		} catch {
			pauseStorage = undefined;
		}
		preferenceLoaded = true;

		controller = new AutomatonBackgroundController({
			host,
			canvas,
			rule,
			seed: createSeed(),
			paused
		});
		controller.start();

		return () => {
			controller?.destroy();
			controller = undefined;
		};
	});

	function randomRule() {
		const value = Math.min(Math.max(Math.random(), 0), 1 - Number.EPSILON);
		return AUTOMATON_RULES[Math.floor(value * AUTOMATON_RULES.length)];
	}

	function createSeed(): number {
		if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
			return crypto.getRandomValues(new Uint32Array(1))[0] & 0x7fff_ffff;
		}
		return (Date.now() ^ Math.floor(Math.random() * 0x7fff_ffff)) & 0x7fff_ffff;
	}
</script>

<div
	class="automaton-background"
	aria-hidden="true"
	data-testid="automaton-background"
	data-rule={activeRuleId}
	bind:this={host}
>
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.automaton-background {
		position: fixed;
		z-index: 0;
		inset: 0;
		inline-size: 100%;
		block-size: 100dvb;
		overflow: hidden;
		pointer-events: none;
	}

	canvas {
		display: block;
		inline-size: 100%;
		block-size: 100%;
	}

	@media (forced-colors: active) {
		.automaton-background {
			display: none;
		}
	}
</style>
