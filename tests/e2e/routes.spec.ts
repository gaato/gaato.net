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

test('the footer links to the source repository', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });

	const siteInformation = page.getByRole('navigation', { name: 'Site information' });
	await expect(siteInformation.getByRole('link', { name: 'Source' })).toHaveAttribute(
		'href',
		'https://github.com/gaato/gaato.net'
	);
});

test('the home page links representative upstream contributions', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });

	const section = page.locator('section#contributed');
	const contributions = [
		{
			name: 'openSUSE/sdbootutil',
			href: 'https://github.com/openSUSE/sdbootutil/pulls?q=is%3Apr+is%3Amerged+author%3Agaato'
		},
		{
			name: 'moonbitlang/async',
			href: 'https://github.com/moonbitlang/async/pulls?q=is%3Apr+is%3Amerged+author%3Agaato'
		},
		{
			name: 'aquaproj/aqua-registry',
			href:
				'https://github.com/aquaproj/aqua-registry/pulls?q=is%3Apr+is%3Amerged+author%3Agaato'
		},
		{
			name: 'KDE Frameworks/kholidays',
			href:
				'https://invent.kde.org/frameworks/kholidays/-/merge_requests/?sort=created_date&state=merged&author_username=gaato&first_page_size=20'
		},
		{
			name: 'purpleblueslime/a',
			href: 'https://github.com/purpleblueslime/a/pulls?q=is%3Apr+is%3Amerged+author%3Agaato'
		}
	] as const;

	await expect(section.getByRole('link')).toHaveText(
		contributions.map((contribution) => contribution.name)
	);
	for (const contribution of contributions) {
		await expect(section.getByRole('link', { name: contribution.name })).toHaveAttribute(
			'href',
			contribution.href
		);
	}
});

test('the home page lists representative collaborative projects', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });

	const section = page.locator('section#part-of');
	await expect(page.locator('section#contributed + section#part-of')).toBeVisible();
	await expect(page.locator('section#part-of + section#play')).toBeVisible();
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
