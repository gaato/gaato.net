import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { publishedLocalPostSlugs } from '../../src/lib/content/local-post-manifest';

const headerRoutes = [
	{ path: '/articles/', variant: 'compact' },
	{ path: `/articles/${publishedLocalPostSlugs[0]}/`, variant: 'display' }
] as const;

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
			homeHref: await main.getByRole('link', { name: 'Return home' }).getAttribute('href'),
			articlesHref: await main.getByRole('link', { name: 'Browse articles' }).getAttribute('href'),
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
	expect(staticPage.heading).toBe('We couldn’t find this page.');
	expect(staticPage.text).toContain(
		'We couldn’t find this page. That doesn’t mean it isn’t there.'
	);
	expect(staticPage.homeHref).toBe('/');
	expect(staticPage.articlesHref).toBe('/articles/');
});
