import { expect, test } from '@playwright/test';

test('the theme control switches to the opposite scheme and returns to the system setting', async ({
	page
}, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop-chromium', 'color scheme behavior only needs one browser profile');
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/');

	const toggle = page.getByTestId('color-scheme-toggle');
	await expect(toggle).toHaveText('Switch to dark theme');
	await expect(toggle).toHaveAttribute('aria-pressed', 'false');
	const systemLight = await page.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor);

	await toggle.click();
	await expect(toggle).toHaveText('Use system theme');
	await expect(toggle).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark');
	await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark');
	expect(await page.evaluate(() => localStorage.getItem('gaato:color-scheme:v1'))).toBe('dark');
	const pinnedDark = await page.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor);
	expect(pinnedDark).not.toBe(systemLight);

	await page.emulateMedia({ colorScheme: 'dark' });
	await expect(toggle).toHaveText('Use system theme');
	await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark');
	await page.reload();
	await expect(toggle).toHaveText('Use system theme');
	await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark');

	await toggle.click();
	await expect(toggle).toHaveText('Switch to light theme');
	await expect(toggle).toHaveAttribute('aria-pressed', 'false');
	await expect(page.locator('html')).not.toHaveAttribute('data-color-scheme', /.+/u);
	await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'light dark');
	expect(await page.evaluate(() => localStorage.getItem('gaato:color-scheme:v1'))).toBeNull();
});

test('a stored theme is applied before the application hydrates', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop-chromium', 'initial theme behavior only needs one browser profile');
	await page.emulateMedia({ colorScheme: 'light' });
	await page.addInitScript(() => localStorage.setItem('gaato:color-scheme:v1', 'dark'));
	await page.goto('/');

	await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark');
	await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark');
	const themeColors = page.locator('meta[name="theme-color"]');
	await expect(themeColors).toHaveCount(2);
	await expect(themeColors.first()).toHaveAttribute('content', '#171714');
	await expect(themeColors.nth(1)).toHaveAttribute('content', '#171714');
	await expect(page.getByTestId('color-scheme-toggle')).toHaveText('Use system theme');
});
