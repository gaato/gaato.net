<script lang="ts">
	import { tick } from 'svelte';
	import {
		MAX_JUMPS,
		MAX_MAX_RUNS,
		calculateReward,
		parseBonusPercent,
		parsePointInput,
		solveEventPoint,
		type EventPointPlan,
		type SolveError,
		type SolveResult
	} from '$lib/lab/event-point';

	let current = $state('');
	let target = $state('');
	let bonus = $state('0');
	let passport = $state(false);
	let maxJumps = $state('50');
	let maxRuns = $state('8');
	let errors = $state<string[]>([]);
	let invalidFields = $state<string[]>([]);
	let result = $state<SolveResult | null>(null);
	let errorSummary = $state<HTMLDivElement>();

	const integerFormatter = new Intl.NumberFormat('ja-JP');

	function parseBoundedInteger(raw: string, minimum: number, maximum: number): number | null {
		const normalized = raw.normalize('NFKC').replace(/[,_\s]/gu, '');
		if (!/^\d+$/u.test(normalized)) return null;
		const value = Number(normalized);
		return Number.isSafeInteger(value) && value >= minimum && value <= maximum ? value : null;
	}

	function formatInteger(value: bigint | number): string {
		return integerFormatter.format(value);
	}

	function summarizeJumps(plan: EventPointPlan): string {
		if (plan.jumps.length === 0) return 'プレイ不要';
		const groups = new Map<number, number>();
		for (const jumps of plan.jumps) groups.set(jumps, (groups.get(jumps) ?? 0) + 1);
		return [...groups.entries()]
			.sort(([a], [b]) => b - a)
			.map(([jumps, count]) => `${jumps}回${count > 1 ? ` × ${count}` : ''}`)
			.join(' + ');
	}

	function solveErrorMessage(error: SolveError): string {
		switch (error.code) {
			case 'target_below_current':
				return '目標Ptは現在Pt以上にしてください。';
			case 'unreachable':
				return `指定した回数では ${formatInteger(error.delta)} Pt をちょうど獲得できません。`;
			case 'search_limit_exceeded':
				return '探索量が上限を超えました。最大跳躍回数か最大プレイ回数を小さくしてください。';
			case 'out_of_range':
				return `${error.field} の値が範囲外です。`;
			case 'invalid_type':
				return 'パスポート設定を読み取れませんでした。';
		}
	}

	async function handleSubmit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		const nextErrors: string[] = [];
		const nextInvalidFields: string[] = [];
		const parsedCurrent = parsePointInput(current);
		const parsedTarget = parsePointInput(target);
		const parsedBonus = parseBonusPercent(bonus);
		const parsedMaxJumps = parseBoundedInteger(maxJumps, 0, MAX_JUMPS);
		const parsedMaxRuns = parseBoundedInteger(maxRuns, 1, MAX_MAX_RUNS);

		if (!parsedCurrent.ok) {
			nextErrors.push('現在Ptを0以上の整数で入力してください。');
			nextInvalidFields.push('current');
		}
		if (!parsedTarget.ok) {
			nextErrors.push('目標Ptを0以上の整数で入力してください。');
			nextInvalidFields.push('target');
		}
		if (!parsedBonus.ok) {
			nextErrors.push('イベントボーナスを0〜999.9%で入力してください。');
			nextInvalidFields.push('bonus');
		}
		if (parsedMaxJumps === null) {
			nextErrors.push(`最大跳躍回数を0〜${MAX_JUMPS}で入力してください。`);
			nextInvalidFields.push('maxJumps');
		}
		if (parsedMaxRuns === null) {
			nextErrors.push(`最大プレイ回数を1〜${MAX_MAX_RUNS}で入力してください。`);
			nextInvalidFields.push('maxRuns');
		}

		errors = nextErrors;
		invalidFields = nextInvalidFields;
		result = null;
		if (
			nextErrors.length > 0 ||
			!parsedCurrent.ok ||
			!parsedTarget.ok ||
			!parsedBonus.ok ||
			parsedMaxJumps === null ||
			parsedMaxRuns === null
		) {
			await tick();
			errorSummary?.focus();
			return;
		}

		result = solveEventPoint({
			current: parsedCurrent.value,
			target: parsedTarget.value,
			bonusPermil: parsedBonus.value,
			hasPassport: passport,
			maxJumps: parsedMaxJumps,
			maxRuns: parsedMaxRuns
		});
	}

	function rewardAt(jumps: number): string {
		const parsedBonus = parseBonusPercent(bonus);
		if (!parsedBonus.ok) return '—';
		return formatInteger(
			calculateReward({ jumps, bonusPermil: parsedBonus.value, hasPassport: passport })
		);
	}
</script>

<section class="event-pt" aria-labelledby="event-pt-title">
	<header class="tool-header">
		<h1 id="event-pt-title">イベントPt調整</h1>
		<p>
			なわとびで目標Ptにちょうど到達する組み合わせを、プレイ回数が少ない順に最大3件探します。
		</p>
	</header>

	{#if errors.length > 0}
		<div
			bind:this={errorSummary}
			id="event-pt-errors"
			class="event-pt-errors"
			data-testid="event-pt-errors"
			role="alert"
			tabindex="-1"
		>
			<div>
				<strong>入力を確認してください。</strong>
				<ul>
					{#each errors as error}
						<li>{error}</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

	<div class="tool-layout">
		<form class="tool-form" data-testid="event-pt-form" onsubmit={handleSubmit} novalidate>
			<fieldset>
				<legend>Pt</legend>
				<div class="field-row">
					<div class="field">
						<label for="event-current">現在Pt</label>
						<input
							id="event-current"
							name="current"
							class="control"
							type="text"
							inputmode="numeric"
							enterkeyhint="next"
							autocomplete="off"
							bind:value={current}
							aria-invalid={invalidFields.includes('current') ? 'true' : undefined}
							aria-describedby={invalidFields.includes('current') ? 'event-pt-errors' : undefined}
							required
						/>
					</div>
					<div class="field">
						<label for="event-target">目標Pt</label>
						<input
							id="event-target"
							name="target"
							class="control"
							type="text"
							inputmode="numeric"
							enterkeyhint="next"
							autocomplete="off"
							bind:value={target}
							aria-invalid={invalidFields.includes('target') ? 'true' : undefined}
							aria-describedby={invalidFields.includes('target') ? 'event-pt-errors' : undefined}
							required
						/>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<legend>ボーナス</legend>
				<div class="field-row bonus-row">
					<div class="field">
						<label for="event-bonus">イベントボーナス（%）</label>
						<input
							id="event-bonus"
							name="bonus"
							class="control"
							type="text"
							inputmode="decimal"
							enterkeyhint="done"
							autocomplete="off"
							bind:value={bonus}
							aria-invalid={invalidFields.includes('bonus') ? 'true' : undefined}
							aria-describedby={invalidFields.includes('bonus') ? 'event-pt-errors' : undefined}
							required
						/>
					</div>
					<label class="passport-option" for="event-passport">
						<input
							id="event-passport"
							name="passport"
							type="checkbox"
							bind:checked={passport}
						/>
						<span>ホロパスポートあり</span>
					</label>
				</div>
			</fieldset>

			<details>
				<summary>探索範囲</summary>
				<div class="field-row advanced-fields">
					<div class="field">
						<label for="event-max-jumps">最大跳躍回数</label>
						<input
							id="event-max-jumps"
							name="maxJumps"
							class="control"
							type="text"
							inputmode="numeric"
							bind:value={maxJumps}
							aria-invalid={invalidFields.includes('maxJumps') ? 'true' : undefined}
							aria-describedby={invalidFields.includes('maxJumps') ? 'event-pt-errors' : undefined}
							required
						/>
					</div>
					<div class="field">
						<label for="event-max-runs">最大プレイ回数</label>
						<input
							id="event-max-runs"
							name="maxRuns"
							class="control"
							type="text"
							inputmode="numeric"
							bind:value={maxRuns}
							aria-invalid={invalidFields.includes('maxRuns') ? 'true' : undefined}
							aria-describedby={invalidFields.includes('maxRuns') ? 'event-pt-errors' : undefined}
							required
						/>
					</div>
				</div>
			</details>

			<button class="calculate-button" type="submit">組み合わせを計算</button>
		</form>

		<section class="reward-reference" aria-labelledby="reward-reference-title">
			<h2 id="reward-reference-title">現在の獲得Pt</h2>
			<dl>
				<div><dt>0回</dt><dd>{rewardAt(0)} Pt</dd></div>
				<div><dt>30回</dt><dd>{rewardAt(30)} Pt</dd></div>
				<div><dt>50回</dt><dd>{rewardAt(50)} Pt</dd></div>
			</dl>
			<p>ボーナス適用時は切り上げ、その後パスポート倍率を適用します。</p>
		</section>
	</div>

	<div class="results" data-testid="event-pt-result" aria-live="polite">
		{#if result?.ok}
			<h2>候補</h2>
			<p class="result-summary">あと {formatInteger(result.delta)} Pt</p>
			<div class="table-scroll">
				<table>
					<caption>目標Ptにちょうど到達する組み合わせ</caption>
					<thead>
						<tr><th scope="col">順位</th><th scope="col">組み合わせ</th><th scope="col">回数</th><th scope="col">跳躍合計</th></tr>
					</thead>
					<tbody>
						{#each result.plans as plan, index}
							<tr>
								<th scope="row">{index + 1}</th>
								<td>{summarizeJumps(plan)}</td>
								<td>{plan.plays}</td>
								<td>{plan.totalJumps}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if result.inferred}<p class="inference-note">未計測の跳躍回数を含む候補があります。</p>{/if}
		{:else if result}
			<div class="result-warning" role="status">{solveErrorMessage(result.error)}</div>
		{:else}
			<p class="empty-result">値を入力すると、ここに組み合わせが出ます。</p>
		{/if}
	</div>
</section>

<style>
	.event-pt {
		--event-ink: var(--color-ink, CanvasText);
		--event-muted: var(--color-muted, CanvasText);
		--event-page: var(--color-page, Canvas);
		--event-surface: var(--color-surface, Canvas);
		--event-rule: var(--color-line, GrayText);
		--event-control: var(--color-control-line, GrayText);
		--event-accent: var(--color-accent, LinkText);
		--event-error: var(--color-error, #9e2a2b);
		inline-size: 100%;
		min-inline-size: 0;
		color: var(--event-ink);
	}

	.tool-header {
		max-inline-size: 46rem;
		margin-block-end: clamp(1.5rem, 4vw, 2.5rem);
	}

	h1,
	h2,
	p {
		margin-block: 0;
	}

	h1 {
		font-size: clamp(1.75rem, 5vw, 2.75rem);
		line-height: 1.1;
	}

	.tool-header > p {
		max-inline-size: 44rem;
		margin-block-start: 0.75rem;
		color: var(--event-muted);
		line-height: 1.7;
	}

	.tool-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(14rem, 18rem);
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: start;
	}

	.tool-form {
		display: grid;
		min-inline-size: 0;
		gap: 1.5rem;
		padding-block: 1.5rem;
		border-block: 1px solid var(--event-rule);
	}

	fieldset {
		min-inline-size: 0;
		margin: 0;
		border: 0;
		padding: 0;
	}

	legend {
		margin-block-end: 0.75rem;
		padding: 0;
		color: var(--event-ink);
		font-size: 1rem;
		font-weight: 700;
	}

	.field-row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem;
	}

	.field {
		display: grid;
		min-inline-size: 0;
		gap: 0.45rem;
	}

	.field label,
	.passport-option {
		font-size: 0.9375rem;
		font-weight: 700;
	}

	.control {
		box-sizing: border-box;
		inline-size: 100%;
		min-block-size: 2.75rem;
		border: 1px solid var(--event-control);
		border-radius: 0;
		padding: 0.55rem 0.7rem;
		background: var(--event-surface);
		color: var(--event-ink);
		font-size: 1rem;
	}

	.control[aria-invalid='true'] {
		border-color: var(--event-error);
		border-inline-start-width: 0.25rem;
	}

	.control:focus-visible,
	.calculate-button:focus-visible,
	summary:focus-visible,
	.passport-option:has(input:focus-visible) {
		outline: 3px solid var(--event-accent);
		outline-offset: 3px;
	}

	.passport-option {
		display: flex;
		gap: 0.7rem;
		align-items: center;
		align-self: end;
		min-block-size: 2.75rem;
		cursor: pointer;
	}

	.passport-option input {
		inline-size: 1.25rem;
		block-size: 1.25rem;
		margin: 0;
		accent-color: var(--event-accent);
	}

	details {
		border-block-start: 1px solid var(--event-rule);
		padding-block-start: 1rem;
	}

	summary {
		display: flex;
		align-items: center;
		inline-size: fit-content;
		min-block-size: 2.75rem;
		cursor: pointer;
		font-weight: 700;
	}

	.advanced-fields {
		margin-block-start: 1rem;
	}

	.calculate-button {
		min-block-size: 2.75rem;
		border: 1px solid var(--event-ink);
		border-radius: 0;
		padding: 0.65rem 1rem;
		background: var(--event-ink);
		color: var(--event-page);
		font-weight: 700;
		cursor: pointer;
	}

	.reward-reference {
		min-inline-size: 0;
		padding-block: 1.5rem;
		border-block: 1px solid var(--event-rule);
	}

	.reward-reference h2,
	.results h2 {
		margin-block-end: 1rem;
		font-size: 1.15rem;
	}

	.reward-reference dl {
		margin: 0;
	}

	.reward-reference dl > div {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-block: 0.6rem;
		border-block-start: 1px solid var(--event-rule);
	}

	.reward-reference dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
		font-weight: 700;
	}

	.reward-reference p,
	.empty-result,
	.inference-note {
		margin-block: 1rem 0;
		color: var(--event-muted);
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.results {
		min-inline-size: 0;
		margin-block-start: 2rem;
		padding-block-start: 1.5rem;
		border-block-start: 1px solid var(--event-rule);
	}

	.result-summary {
		margin-block-end: 1rem;
		color: var(--event-muted);
	}

	.table-scroll {
		max-inline-size: 100%;
		overflow-x: auto;
		overscroll-behavior-inline: contain;
	}

	table {
		inline-size: 100%;
		border-collapse: collapse;
		color: var(--event-ink);
		font-variant-numeric: tabular-nums;
	}

	table :where(th, td) {
		padding: 0.7rem 0.6rem;
		border-block-start: 1px solid var(--event-rule);
		text-align: start;
		vertical-align: top;
		overflow-wrap: anywhere;
	}

	table :where(th, td):nth-last-child(-n + 2) {
		text-align: end;
	}

	table caption {
		position: absolute;
		clip-path: inset(50%);
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
	}

	.event-pt-errors {
		margin-block-end: 1.25rem;
		border: 1px solid var(--event-error);
		border-inline-start-width: 0.3rem;
		padding: 1rem;
		background: var(--event-surface);
		color: var(--event-ink);
	}

	.event-pt-errors ul {
		margin: 0.5rem 0 0;
		padding-inline-start: 1.25rem;
	}

	.result-warning {
		border-inline-start: 0.3rem solid var(--event-error);
		padding: 0.8rem 1rem;
		background: var(--event-surface);
	}

	@media (max-width: 48rem) {
		.tool-layout,
		.field-row {
			grid-template-columns: 1fr;
		}

		.passport-option {
			align-self: auto;
		}
	}

	@media (max-width: 30rem) {
		table {
			font-size: 0.875rem;
		}

		table :where(th, td) {
			padding-inline: 0.35rem;
		}
	}

	@media (forced-colors: active) {
		.control[aria-invalid='true'],
		.event-pt-errors,
		.result-warning {
			border-color: Mark;
		}
	}
</style>
