import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { publishedLocalPostSlugs } from '../../src/lib/content/local-post-manifest';

const headerRoutes = [
	{ path: '/articles/', variant: 'compact' },
	{ path: `/articles/${publishedLocalPostSlugs[0]}/`, variant: 'display' },
	{ path: '/lab/cellular-automaton/', variant: 'display' },
	{ path: '/lab/event-pt/', variant: 'display' }
] as const;

const labRoutes = ['/lab/cellular-automaton/', '/lab/event-pt/'] as const;

async function visibleControlTargets(page: Page) {
	return page
		.locator('main :is(button, input, select, textarea, summary)')
		.evaluateAll((elements) =>
			elements.flatMap((element) => {
				const style = getComputedStyle(element);
				const sourceRect = element.getBoundingClientRect();
				if (
					style.display === 'none' ||
					style.visibility === 'hidden' ||
					sourceRect.width === 0 ||
					sourceRect.height === 0
				) {
					return [];
				}

				const target = element.matches('input[type="checkbox"], input[type="radio"]')
					? (element.closest('label') ?? element)
					: element;
				const rect = target.getBoundingClientRect();
				const labels = (element as HTMLInputElement).labels;
				const name =
					element.getAttribute('aria-label') ??
					labels?.[0]?.textContent?.trim() ??
					element.textContent?.trim() ??
					element.tagName.toLowerCase();

				return [{ name, width: rect.width, height: rect.height }];
			})
		);
}

async function expectVisibleFocus(control: Locator) {
	await control.scrollIntoViewIfNeeded();
	await control.focus();
	await expect(control).toBeFocused();

	const outline = await control.evaluate((element) => {
		const style = getComputedStyle(element);
		return {
			style: style.outlineStyle,
			width: Number.parseFloat(style.outlineWidth)
		};
	});

	expect(outline.style).not.toBe('none');
	expect(outline.width).toBeGreaterThanOrEqual(3);
}

test('page headings use the intended compact and display scales', async ({ page }) => {
	let compactSize = 0;

	for (const route of headerRoutes) {
		await page.goto(route.path);
		const heading = page.locator('main h1');
		await expect(heading).toHaveCount(1);

		const size = await heading.evaluate((element) =>
			Number.parseFloat(getComputedStyle(element).fontSize)
		);

		if (route.variant === 'compact') {
			expect(size).toBeCloseTo(28, 1);
			compactSize = size;
		} else {
			expect(size).toBeGreaterThanOrEqual(32);
			expect(size).toBeLessThanOrEqual(52);
			expect(size).toBeGreaterThan(compactSize);
		}
	}
});

test('Lab controls have 44px targets and visible keyboard focus', async ({ page }) => {
	for (const route of labRoutes) {
		await page.goto(route);
		const targets = await visibleControlTargets(page);
		expect(targets.length).toBeGreaterThan(0);

		for (const target of targets) {
			expect.soft(target.width, `${route}: ${target.name} width`).toBeGreaterThanOrEqual(43.5);
			expect.soft(target.height, `${route}: ${target.name} height`).toBeGreaterThanOrEqual(43.5);
		}

		await page.keyboard.press('Tab');
		const controls = page.locator(
			'main :is(button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary)'
		);
		for (let index = 0; index < (await controls.count()); index += 1) {
			const control = controls.nth(index);
			if (await control.isVisible()) await expectVisibleFocus(control);
		}
	}
});

test('a disabled button does not acquire hover styling', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/lab/cellular-automaton/');

	const button = page.getByTestId('automaton-toggle');
	await expect(button).toBeDisabled();

	const readStyle = () =>
		button.evaluate((element) => {
			const style = getComputedStyle(element);
			return {
				background: style.backgroundColor,
				border: style.borderTopColor,
				color: style.color,
				opacity: style.opacity
			};
		});

	const before = await readStyle();
	await button.hover({ force: true });
	expect(await readStyle()).toEqual(before);
});

test('the static and runtime 404 pages present the same UI', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop-chromium', 'one viewport is enough for parity');

	async function inspect(path: string) {
		const response = await page.goto(path);
		const main = page.locator('main');
		const heading = main.getByRole('heading', { level: 1 });

		return {
			status: response?.status(),
			title: await page.title(),
			robots: await page.locator('meta[name="robots"]').getAttribute('content'),
			text: (await main.innerText()).replace(/\s+/gu, ' ').trim(),
			heading: await heading.innerText(),
			homeHref: await main.getByRole('link', { name: 'Home' }).getAttribute('href'),
			headingStyle: await heading.evaluate((element) => {
				const style = getComputedStyle(element);
				return {
					fontSize: style.fontSize,
					lineHeight: style.lineHeight,
					letterSpacing: style.letterSpacing
				};
			})
		};
	}

	const staticPage = await inspect('/404');
	const runtimePage = await inspect('/this-route-does-not-exist/');

	expect(staticPage.status).toBe(200);
	expect(runtimePage.status).toBe(404);

	const { status: _staticStatus, ...staticPresentation } = staticPage;
	const { status: _runtimeStatus, ...runtimePresentation } = runtimePage;
	expect(runtimePresentation).toEqual(staticPresentation);
	expect(staticPage.robots).toMatch(/noindex/iu);
});

test('Event Pt remains accessible in dark mode and its error state', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop-chromium', 'one browser profile is enough');

	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await page.goto('/lab/event-pt/');
	await page.locator('#event-current').fill('not a point');
	await page.getByRole('button', { name: '組み合わせを計算' }).click();
	await expect(page.getByTestId('event-pt-errors')).toBeVisible();

	expect(await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches)).toBe(true);

	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(results.violations).toEqual([]);
});
