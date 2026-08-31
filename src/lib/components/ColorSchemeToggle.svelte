<script lang="ts">
	import { onMount } from 'svelte';
	import {
		colorSchemeActionLabel,
		oppositeColorScheme,
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
		preference = preference ? null : oppositeColorScheme(systemColorScheme);
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
	aria-pressed={preference !== null}
	data-testid="color-scheme-toggle"
	lang="en"
	onclick={toggleColorScheme}
>
	{actionLabel}
</button>
