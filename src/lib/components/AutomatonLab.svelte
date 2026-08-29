<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AutomatonCanvasController,
		type AutomatonRunState
	} from '$lib/automaton/controller';
	import { AUTOMATON_RULES, findAutomatonRule } from '$lib/automaton/rules';
	import {
		AUTOMATON_SESSION_RULE_CHANGE_EVENT,
		getOrCreateSessionRule,
		writeSessionRule
	} from '$lib/automaton/storage';

	interface Props {
		initialRuleId?: string;
		seed?: number;
		suspended?: boolean;
	}

	let { initialRuleId, seed, suspended = false }: Props = $props();
	let host: HTMLDivElement;
	let canvasHost: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let controller: AutomatonCanvasController | undefined;
	let selectedRuleId = $state(AUTOMATON_RULES[0].id);
	let paused = $state(false);
	let reducedMotion = $state(false);
	let forcedColors = $state(false);
	let available = $state(true);

	const selectedRule = $derived(findAutomatonRule(selectedRuleId) ?? AUTOMATON_RULES[0]);

	$effect(() => {
		controller?.setSuspended(suspended);
	});

	onMount(() => {
		let initialRule = findAutomatonRule(initialRuleId) ?? AUTOMATON_RULES[0];
		if (!initialRuleId) {
			try {
				initialRule = getOrCreateSessionRule(window.sessionStorage);
			} catch {
				// Keep the fallback rule when session storage is unavailable.
			}
		}
		selectedRuleId = initialRule.id;
		controller = new AutomatonCanvasController({
			host: canvasHost,
			visibilityHost: host,
			canvas,
			mode: 'lab',
			rule: initialRule,
			seed: seed ?? createSeed(),
			paused,
			suspended,
			onRunStateChange: handleRunStateChange
		});
		available = controller.start();

		return () => {
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

	function handleRunStateChange(state: AutomatonRunState): void {
		reducedMotion = state.reducedMotion;
		forcedColors = state.forcedColors;
		available = state.available;
	}

	function handleRuleChange(event: Event): void {
		selectedRuleId = (event.currentTarget as HTMLSelectElement).value;
		const rule = findAutomatonRule(selectedRuleId);
		if (!rule) return;
		controller?.setRule(rule);
		try {
			writeSessionRule(window.sessionStorage, rule);
		} catch {
			// The selected rule still applies when session storage is unavailable.
		}
		window.dispatchEvent(
			new CustomEvent(AUTOMATON_SESSION_RULE_CHANGE_EVENT, { detail: rule.id })
		);
	}

	function togglePaused(): void {
		paused = !paused;
		controller?.setPaused(paused);
	}

	function stepOnce(): void {
		controller?.stepOnce();
	}

	function reset(): void {
		controller?.reset();
	}

	function addSeed(): void {
		controller?.seedCenter();
	}
</script>

<div
	class="automaton-lab"
	data-automaton-exclude
	data-testid="automaton-lab"
	bind:this={host}
>
	<div class="automaton-controls" aria-label="Cellular automaton controls">
		<label for="automaton-rule">Rule</label>
		<select
			id="automaton-rule"
			data-testid="automaton-rule"
			value={selectedRuleId}
			onchange={handleRuleChange}
			disabled={!available || forcedColors}
		>
			{#each AUTOMATON_RULES as rule}
				<option value={rule.id}>{rule.name} {rule.notation}</option>
			{/each}
		</select>
		<div class="button-row">
			<button
				type="button"
				aria-pressed={paused}
				data-testid="automaton-toggle"
				onclick={togglePaused}
				disabled={!available || reducedMotion || forcedColors}
			>
				{paused ? 'Resume' : 'Pause'}
			</button>
			<button
				type="button"
				data-testid="automaton-step"
				onclick={stepOnce}
				disabled={!available || forcedColors}
			>
				Step one generation
			</button>
			<button
				type="button"
				data-testid="automaton-reset"
				onclick={reset}
				disabled={!available || forcedColors}
			>
				Reset
			</button>
			<button
				type="button"
				data-testid="automaton-seed"
				onclick={addSeed}
				disabled={!available || forcedColors}
			>
				Add seed
			</button>
		</div>
		<output aria-live="polite">{selectedRule.name} {selectedRule.notation}</output>
		{#if reducedMotion}<p>Automatic motion is disabled by your system preference.</p>{/if}
		{#if forcedColors}<p>Cellular automaton is unavailable in forced-colors mode.</p>{/if}
		{#if !available}<p>Cellular automaton is unavailable in this browser.</p>{/if}
	</div>
	<div
		class="automaton-canvas"
		class:forced-colors={forcedColors}
		bind:this={canvasHost}
		role="img"
		aria-label={`Animated cellular automaton using ${selectedRule.name} ${selectedRule.notation}`}
	>
		<canvas bind:this={canvas} aria-hidden="true"></canvas>
	</div>
</div>

<style>
	.automaton-lab {
		content-visibility: auto;
		contain-intrinsic-block-size: auto 48rem;
		border-block: 1px solid var(--color-line, #a5aaa5);
	}

	.automaton-controls {
		display: grid;
		grid-template-columns: max-content minmax(12rem, 1fr);
		gap: 0.75rem 1rem;
		align-items: center;
		padding-block: 1rem;
	}

	label,
	output,
	p {
		font: 0.8125rem/1.5 ui-monospace, monospace;
	}

	select,
	button {
		min-block-size: 2.75rem;
		border: 1px solid var(--color-control-line, #777);
		border-radius: 0;
		background: var(--color-surface, Canvas);
		color: var(--color-ink, CanvasText);
		font: inherit;
	}

	select {
		inline-size: 100%;
		padding-inline: 0.5rem;
	}

	.button-row {
		display: flex;
		grid-column: 2;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	button {
		padding-inline: 0.75rem;
		cursor: pointer;
	}

	button:hover:not(:disabled) {
		background: color-mix(in oklab, var(--color-accent, CanvasText) 10%, var(--color-surface, Canvas));
	}

	:where(select, button):focus-visible {
		outline: 3px solid var(--color-accent, currentColor);
		outline-offset: 2px;
	}

	button:disabled,
	select:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	output,
	p {
		grid-column: 2;
		margin: 0;
		color: var(--color-muted, #5d625e);
	}

	.automaton-canvas {
		block-size: clamp(18rem, 60dvb, 42rem);
		overflow: hidden;
		border: 1px solid var(--color-line, #777);
		background: var(--color-surface, transparent);
	}

	.automaton-canvas.forced-colors {
		display: none;
	}

	canvas {
		display: block;
		inline-size: 100%;
		block-size: 100%;
		touch-action: pan-y pinch-zoom;
	}

	@media (max-width: 36rem) {
		.automaton-controls {
			grid-template-columns: 1fr;
		}

		.button-row,
		output,
		p {
			grid-column: 1;
		}
	}

	@media (forced-colors: active) {
		.automaton-canvas {
			border-color: CanvasText;
		}
	}
</style>
