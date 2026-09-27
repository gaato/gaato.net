import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { directoryEntries } from '../../src/lib/site/content';
import { collectBrowserProblems, pageRoutes, postSlugs } from './helpers';

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

test('unpublished local Lab paths remain ordinary 404s', async ({ request }) => {
	for (const path of ['/lab/cellular-automaton/', '/lab/event-pt/']) {
		const response = await request.get(path, { maxRedirects: 0 });
		expect(response.status(), path).toBe(404);
		expect(new URL(response.url()).pathname, path).toBe(path);
	}
});

test('legacy /posts/ paths redirect permanently to /articles/', async ({ request }) => {
	const redirects = [
		['/posts', '/articles/'],
		['/posts/', '/articles/'],
		...postSlugs.map((slug) => [`/posts/${slug}/`, `/articles/${slug}/`] as const)
	] as const;
	for (const [from, to] of redirects) {
		const response = await request.get(from, { maxRedirects: 0 });
		expect(response.status(), from).toBe(308);
		expect(new URL(response.headers().location, response.url()).pathname, from).toBe(to);
	}
});

test('the feed is served with the RSS media type', async ({ request }) => {
	const response = await request.get('/feed.xml');
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toMatch(/^application\/rss\+xml(?:;|$)/iu);
});

test('the footer links to the source and license notices', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });

	const siteInformation = page.getByRole('navigation', { name: 'Site information' });
	await expect(siteInformation.getByRole('link', { name: 'Source' })).toHaveAttribute(
		'href',
		'https://github.com/gaato/gaato.net'
	);
	await expect(siteInformation.getByRole('link', { name: 'License', exact: true })).toHaveAttribute(
		'href',
		'https://blueoakcouncil.org/license/1.0.0'
	);
	await expect(
		siteInformation.getByRole('link', { name: 'Third-party notices', exact: true })
	).toHaveAttribute('href', '/THIRD_PARTY_NOTICES.txt');
});

test('the primary navigation links to the separate Lab site', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });

	const primary = page.getByRole('navigation', { name: 'Primary' });
	await expect(primary.getByRole('link', { name: 'Lab', exact: true })).toHaveAttribute(
		'href',
		'https://lab.gaato.net/'
	);
	await expect(page.locator('section#experiment')).toHaveCount(0);
});

for (const [section, heading, previous] of [
	['package', 'I package', 'maintain'],
	['contributed', 'I contributed to', 'package']
] as const) {
	test(`the home page lists the ${section} snapshot`, async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		const locator = page.locator(`section#${section}`);
		const entries = directoryEntries[section];
		expect(entries.length).toBeGreaterThan(0);
		await expect(page.locator(`section#${previous} + section#${section}`)).toBeVisible();
		await expect(locator.getByRole('heading', { name: heading })).toBeVisible();
		await expect(locator.getByRole('link')).toHaveText(entries.map((entry) => entry.label));
		for (const entry of entries) {
			await expect(locator.getByRole('link', { name: entry.label, exact: true })).toHaveAttribute(
				'href',
				entry.href!
			);
		}
	});
}

test('the home page links the projects I maintain', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });

	await expect(page.locator('section#maintain').getByRole('link')).toHaveText(
		directoryEntries.maintain.map((entry) => entry.label)
	);
});

test('the home page lists representative collaborative projects', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });

	const section = page.locator('section#part-of');
	await expect(page.locator('section#contributed + section#part-of')).toBeVisible();
	await expect(page.locator('section#play')).toHaveCount(0);
	await expect(section.getByRole('heading', { name: 'I’ve been part of' })).toBeVisible();
	await expect(section.getByRole('link')).toHaveText([
		'PROJECT O to O',
		'HERE WITH ME',
		'Re:Creating World'
	]);
	await expect(section.getByRole('link', { name: 'PROJECT O to O' })).toHaveAttribute(
		'href',
		'https://www.youtube.com/@PROJECT-O-to-O'
	);
	await expect(section.getByRole('link', { name: 'HERE WITH ME' })).toHaveAttribute(
		'href',
		'https://www.youtube.com/watch?v=Aiana0rhZr0'
	);
	await expect(section.getByRole('link', { name: 'Re:Creating World' })).toHaveAttribute(
		'href',
		'https://drive.google.com/file/d/1H7H9Hsneml1iW-A0rydfGuJzhu6Ux2Sn/view?usp=sharing'
	);

	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth
	);
	expect(overflow).toBeLessThanOrEqual(1);
});

test('the math article renders accessible math and native solution disclosures', async ({ page }) => {
	await page.goto('/articles/math-problems-2019-2020/', { waitUntil: 'networkidle' });
	await expect(page.locator('math').first()).toBeAttached();

	const sourceGaps = await page.locator('.problem-source').evaluateAll((sources) =>
		sources.map((source) => {
			let previous = source.previousElementSibling;
			while (previous?.classList.contains('visually-hidden')) {
				previous = previous.previousElementSibling;
			}
			if (previous === null) return Number.POSITIVE_INFINITY;
			return source.getBoundingClientRect().top - previous.getBoundingClientRect().bottom;
		})
	);
	for (const gap of sourceGaps) {
		expect(gap).toBeGreaterThanOrEqual(12);
	}

	const firstDetails = page.locator('details').first();
	const firstSummary = firstDetails.locator('summary');
	await expect(firstDetails).not.toHaveAttribute('open', '');
	await firstSummary.focus();
	await page.keyboard.press('Enter');
	await expect(firstDetails).toHaveAttribute('open', '');
	await page.keyboard.press('Enter');
	await expect(firstDetails).not.toHaveAttribute('open', '');
});
