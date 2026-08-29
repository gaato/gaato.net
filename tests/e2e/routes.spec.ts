import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { collectBrowserProblems, pageRoutes } from './helpers';

for (const route of pageRoutes) {
	test(`${route} renders without browser or layout errors`, async ({ page }) => {
		const problems = collectBrowserProblems(page);
		const response = await page.goto(route, { waitUntil: 'networkidle' });
		expect(response?.status()).toBe(200);
		expect(new URL(page.url()).pathname).toBe(route);
		await expect(page.locator('main')).toBeVisible();
		expect(await page.title()).not.toBe('');
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
		problems.assertNone();
	});

	test(`${route} has no automated WCAG A/AA violations`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto(route, { waitUntil: 'networkidle' });
		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(results.violations).toEqual([]);
	});
}

test('an unknown route serves the noindex 404 page with a 404 status', async ({ page }) => {
	const problems = collectBrowserProblems(page);
	const response = await page.goto('/this-route-does-not-exist/', { waitUntil: 'networkidle' });
	expect(response?.status()).toBe(404);
	// Chromium reports the expected 404 main-document response as a console error.
	// The same document and all of its assets are checked separately at /404.
	problems.reset();
	await expect(page.locator('main')).toBeVisible();
	const robots = page.locator('meta[name="robots"]');
	await expect(robots).toHaveAttribute('content', /noindex/i);
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		.analyze();
	expect(results.violations).toEqual([]);
	problems.assertNone();
});

test('the feed is served with the RSS media type', async ({ request }) => {
	const response = await request.get('/feed.xml');
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toMatch(/^application\/rss\+xml(?:;|$)/iu);
});
