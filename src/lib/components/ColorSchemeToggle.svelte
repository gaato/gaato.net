<script lang="ts">
	import { onMount } from 'svelte';
	import {
		colorSchemeActionLabel,
		nextColorSchemePreference,
		readColorSchemePreference,
		writeColorSchemePreference,
		type ColorScheme,
		type StorageLike
	} from '$lib/theme/color-scheme';

	const themeColors: Record<ColorScheme, string> = {
		light: '#f4f1e8',
		dark: '#171714'
	};

	let preference = $state<ColorScheme | null>(null);
	let systemColorScheme = $state<ColorScheme>('light');
	let colorSchemeQuery: MediaQueryList | undefined;
	let storage: StorageLike | undefined;
	let actionLabel = $derived(colorSchemeActionLabel(preference, systemColorScheme));

	onMount(() => {
		colorSchemeQuery = matchMedia('(prefers-color-scheme: dark)');
		systemColorScheme = colorSchemeQuery.matches ? 'dark' : 'light';
		try {
			storage = window.localStorage;
			preference = readColorSchemePreference(storage);
		} catch {
			storage = undefined;
		}
		applyColorScheme(preference);

		const handleSystemColorSchemeChange = (event: MediaQueryListEvent) => {
			systemColorScheme = event.matches ? 'dark' : 'light';
			if (!preference) applyColorScheme(null);
		};
		colorSchemeQuery.addEventListener('change', handleSystemColorSchemeChange);

		return () => colorSchemeQuery?.removeEventListener('change', handleSystemColorSchemeChange);
	});

	function toggleColorScheme(): void {
		preference = nextColorSchemePreference(preference, systemColorScheme);
		if (storage) writeColorSchemePreference(storage, preference);
		applyColorScheme(preference);
	}

	function applyColorScheme(colorScheme: ColorScheme | null): void {
		const root = document.documentElement;
		const colorSchemeMeta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
		const themeColorMetas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');

		if (colorScheme) root.dataset.colorScheme = colorScheme;
		else delete root.dataset.colorScheme;
		if (colorSchemeMeta) colorSchemeMeta.content = colorScheme ?? 'light dark';

		for (const meta of themeColorMetas) {
			if (colorScheme) meta.content = themeColors[colorScheme];
			else meta.content = meta.media.includes('dark') ? themeColors.dark : themeColors.light;
		}
	}
</script>

<button
	type="button"
	class="color-scheme-toggle"
	aria-label={actionLabel}
	title={actionLabel}
	data-testid="color-scheme-toggle"
	lang="en"
	onclick={toggleColorScheme}
>
	<svg class="sun" viewBox="0 0 24 24" aria-hidden="true">
		<circle cx="12" cy="12" r="4" />
		<path
			d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
		/>
	</svg>
	<svg class="moon" viewBox="0 0 24 24" aria-hidden="true">
		<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
	</svg>
</button>

<style>
	.color-scheme-toggle {
		display: inline-grid;
		place-items: center;
		inline-size: var(--interactive-min-block-size);
		block-size: var(--interactive-min-block-size);
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--color-muted);
		cursor: pointer;
	}

	.color-scheme-toggle:hover {
		color: var(--color-ink);
	}

	svg {
		inline-size: 1.25rem;
		block-size: 1.25rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.moon {
		display: none;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-color-scheme='light'])) .sun {
			display: none;
		}

		:global(:root:not([data-color-scheme='light'])) .moon {
			display: block;
		}
	}

	:global(:root[data-color-scheme='dark']) .sun {
		display: none;
	}

	:global(:root[data-color-scheme='dark']) .moon {
		display: block;
	}
</style>
