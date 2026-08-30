<script lang="ts">
	import { onMount } from 'svelte';
	import { AutomatonCanvasController } from '$lib/automaton/controller';
	import { AUTOMATON_RULES, findAutomatonRule } from '$lib/automaton/rules';
	import {
		automatonRuleState,
		AUTOMATON_RULE_CHANGE_EVENT
	} from '$lib/automaton/rule-state';
	import {
		readPausePreference,
		writePausePreference,
		type StorageLike
	} from '$lib/automaton/storage';

	interface Props {
		paused?: boolean;
		suspended?: boolean;
		ruleId?: string;
		seed?: number;
	}

	let {
		paused = $bindable(false),
		suspended = false,
		ruleId,
		seed
	}: Props = $props();

	let host: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let controller: AutomatonCanvasController | undefined;
	let pauseStorage: StorageLike | undefined;
	let preferenceLoaded = $state(false);
	let activeRuleId = $state(AUTOMATON_RULES[0].id);

	$effect(() => {
		const nextPaused = paused;
		const nextSuspended = suspended;
		controller?.setPaused(nextPaused);
		controller?.setSuspended(nextSuspended);
		if (preferenceLoaded && pauseStorage) {
			writePausePreference(pauseStorage, nextPaused);
		}
	});

	onMount(() => {
		let rule = findAutomatonRule(ruleId) ?? AUTOMATON_RULES[0];
		rule = findAutomatonRule(ruleId) ?? automatonRuleState.getOrCreate();
		automatonRuleState.set(rule);
		activeRuleId = rule.id;

		try {
			pauseStorage = window.localStorage;
			paused = readPausePreference(pauseStorage, paused);
		} catch {
			pauseStorage = undefined;
		}
		preferenceLoaded = true;

		controller = new AutomatonCanvasController({
			host,
			canvas,
			mode: 'background',
			rule,
			seed: seed ?? createSeed(),
			paused,
			suspended
		});
		controller.start();

		const handleRuleChange = (event: Event): void => {
			const nextRuleId = (event as CustomEvent<unknown>).detail;
			if (typeof nextRuleId !== 'string') return;
			const nextRule = findAutomatonRule(nextRuleId);
			if (!nextRule || nextRule.id === activeRuleId) return;
			automatonRuleState.set(nextRule);
			activeRuleId = nextRule.id;
			controller?.setRule(nextRule);
		};
		window.addEventListener(AUTOMATON_RULE_CHANGE_EVENT, handleRuleChange);

		return () => {
			window.removeEventListener(AUTOMATON_RULE_CHANGE_EVENT, handleRuleChange);
			controller?.destroy();
			controller = undefined;
		};
	});

	function createSeed(): number {
		if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
			return crypto.getRandomValues(new Uint32Array(1))[0] & 0x7fff_ffff;
		}
		return (Date.now() ^ Math.floor(Math.random() * 0x7fff_ffff)) & 0x7fff_ffff;
	}
</script>

<div
	class="automaton-background"
	class:suspended
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

	.automaton-background.suspended {
		visibility: hidden;
	}

	@media (forced-colors: active) {
		.automaton-background {
			display: none;
		}
	}
</style>
