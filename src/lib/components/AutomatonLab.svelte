<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AutomatonCanvasController,
		type AutomatonRunState
	} from '$lib/automaton/controller';
	import {
		AUTOMATON_RULES,
		findAutomatonRule,
		parseAutomatonRule,
		type AutomatonRule
	} from '$lib/automaton/rules';
	import {
		automatonRuleState,
		AUTOMATON_RULE_CHANGE_EVENT
	} from '$lib/automaton/rule-state';

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
	let selectedRule = $state<AutomatonRule>(AUTOMATON_RULES[0]);
	let ruleInput = $state(AUTOMATON_RULES[0].notation);
	let ruleError = $state('');
	let paused = $state(false);
	let reducedMotion = $state(false);
	let forcedColors = $state(false);
	let available = $state(true);

	$effect(() => {
		controller?.setSuspended(suspended);
	});

	onMount(() => {
		let initialRule = findAutomatonRule(initialRuleId) ?? AUTOMATON_RULES[0];
		if (!initialRuleId) {
			initialRule = automatonRuleState.getOrCreate();
		}
		automatonRuleState.set(initialRule);
		selectedRule = initialRule;
		ruleInput = initialRule.notation;
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

	function handleRuleInput(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		ruleInput = input.value;
		ruleError = '';
		input.setCustomValidity('');
	}

	function applyRule(event: SubmitEvent): void {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const input = form.elements.namedItem('rule') as HTMLInputElement;
		const rule = parseAutomatonRule(ruleInput);
		if (!rule) {
			ruleError = 'Use B…/S… notation with digits from 0 through 8.';
			input.setCustomValidity(ruleError);
			input.reportValidity();
			return;
		}

		input.setCustomValidity('');
		ruleError = '';
		ruleInput = rule.notation;
		selectedRule = rule;
		controller?.setRule(rule);
		automatonRuleState.set(rule);
		window.dispatchEvent(
			new CustomEvent(AUTOMATON_RULE_CHANGE_EVENT, { detail: rule.id })
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
		<form class="rule-form" onsubmit={applyRule}>
			<input
				id="automaton-rule"
				name="rule"
				data-testid="automaton-rule"
				value={ruleInput}
				oninput={handleRuleInput}
				aria-describedby={ruleError
					? 'automaton-rule-help automaton-rule-error'
					: 'automaton-rule-help'}
				aria-invalid={ruleError ? 'true' : 'false'}
				autocomplete="off"
				autocapitalize="characters"
				spellcheck="false"
				disabled={!available || forcedColors}
			/>
			<button type="submit" disabled={!available || forcedColors}>Apply</button>
		</form>
		<p id="automaton-rule-help" class="rule-help">Life-like B/S notation, for example B3/S23.</p>
		{#if ruleError}
			<p id="automaton-rule-error" class="rule-error" aria-live="polite">{ruleError}</p>
		{/if}
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
		border-block: 1px solid var(--color-line);
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
		font: 0.8125rem/1.5 var(--font-mono);
	}

	.rule-form {
		display: grid;
		grid-template-columns: minmax(0, 1fr) max-content;
		gap: 0.5rem;
	}

	input {
		inline-size: 100%;
		min-inline-size: 0;
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
		background: color-mix(in oklab, var(--color-accent) 10%, var(--color-surface));
	}

	output,
	p {
		grid-column: 2;
		margin: 0;
		color: var(--color-muted);
	}

	.rule-error {
		color: var(--color-error);
	}

	.automaton-canvas {
		block-size: clamp(18rem, 60dvb, 42rem);
		overflow: hidden;
		border: 1px solid var(--color-line);
		background: var(--color-surface);
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
