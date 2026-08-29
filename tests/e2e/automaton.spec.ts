import { expect, test } from '@playwright/test';
import {
	backgroundCanvas,
	canvasFingerprint,
	labCanvas,
	waitForCanvasPaint
} from './helpers';

test('the background canvas is painted and follows the system color scheme', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop-chromium', 'color scheme behavior only needs one browser profile');
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/');
	const canvas = backgroundCanvas(page);
	await waitForCanvasPaint(canvas);

	const light = await page.evaluate(() => {
		const style = getComputedStyle(document.body);
		return { background: style.backgroundColor, color: style.color };
	});
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
	const dark = await page.evaluate(() => {
		const style = getComputedStyle(document.body);
		return {
			background: style.backgroundColor,
			color: style.color,
			matches: matchMedia('(prefers-color-scheme: dark)').matches
		};
	});
	expect(dark.matches).toBe(true);
	expect({ background: dark.background, color: dark.color }).not.toEqual(light);
});

test('reduced motion leaves a painted but stationary background', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	const canvas = backgroundCanvas(page);
	await waitForCanvasPaint(canvas);
	const before = await canvasFingerprint(canvas);
	await page.waitForTimeout(450);
	const after = await canvasFingerprint(canvas);
	expect(after).toEqual(before);
});

test('the user can pause the background and the choice survives navigation and reload', async ({ page }) => {
	await page.goto('/');
	const canvas = backgroundCanvas(page);
	await waitForCanvasPaint(canvas);
	const toggle = page.getByTestId('automaton-background-toggle');
	await expect(toggle).toHaveAttribute('aria-pressed', 'false');
	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-pressed', 'true');

	const before = await canvasFingerprint(canvas);
	await page.waitForTimeout(450);
	expect(await canvasFingerprint(canvas)).toEqual(before);

	await page.getByRole('link', { name: 'Writing', exact: true }).click();
	await expect(page).toHaveURL(/\/writing\/$/u);
	await expect(page.getByTestId('automaton-background-toggle')).toHaveAttribute('aria-pressed', 'true');
	await page.reload();
	await expect(page.getByTestId('automaton-background-toggle')).toHaveAttribute('aria-pressed', 'true');
});

test('a mouse movement can add a seed without blocking page interaction', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop-chromium', 'hover seeding is intentionally mouse-only');
	await page.goto('/');
	const canvas = backgroundCanvas(page);
	await waitForCanvasPaint(canvas);
	await page.getByTestId('automaton-background-toggle').click();
	await page.evaluate(() => scrollTo(0, 0));
	const before = await canvasFingerprint(canvas);
	const viewport = page.viewportSize();
	expect(viewport).not.toBeNull();
	await page.mouse.move(viewport!.width - 16, Math.floor(viewport!.height / 2));
	await page.mouse.move(viewport!.width - 16, Math.floor(viewport!.height / 2) + 100, { steps: 3 });
	await expect.poll(async () => (await canvasFingerprint(canvas)).hash).not.toBe(before.hash);
	await expect(page.getByRole('link', { name: 'Writing', exact: true })).toBeVisible();
});

test('forced colors hides only the decorative background', async ({ page }) => {
	await page.emulateMedia({ forcedColors: 'active' });
	await page.goto('/');
	const canvas = backgroundCanvas(page);
	if ((await canvas.count()) === 0) {
		await expect(page.locator('main')).toBeVisible();
		return;
	}
	await expect(canvas).toBeAttached();
	const hidden = await canvas.evaluate((element) => {
		for (let current: Element | null = element; current; current = current.parentElement) {
			const style = getComputedStyle(current);
			if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) {
				return true;
			}
		}
		return false;
	});
	expect(hidden).toBe(true);
	await expect(page.locator('main')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Writing', exact: true })).toBeVisible();
});

test('the Lab exposes all rules and deterministic native controls', async ({ page }) => {
	await page.goto('/lab/cellular-automaton/');
	await expect(page.getByTestId('automaton-background')).toHaveCSS('visibility', 'hidden');
	const canvas = labCanvas(page);
	await waitForCanvasPaint(canvas);
	const rule = page.getByTestId('automaton-rule');
	await expect(rule.locator('option')).toHaveCount(13);

	const toggle = page.getByTestId('automaton-toggle');
	if ((await toggle.getAttribute('aria-pressed')) !== 'true') await toggle.click();
	await expect(toggle).toHaveAttribute('aria-pressed', 'true');

	const initial = await canvasFingerprint(canvas);
	await page.getByTestId('automaton-step').click();
	await expect.poll(async () => (await canvasFingerprint(canvas)).hash).not.toBe(initial.hash);

	const stepped = await canvasFingerprint(canvas);
	await page.getByTestId('automaton-seed').click();
	await expect.poll(async () => (await canvasFingerprint(canvas)).hash).not.toBe(stepped.hash);

	const seeded = await canvasFingerprint(canvas);
	await page.getByTestId('automaton-reset').click();
	await expect.poll(async () => (await canvasFingerprint(canvas)).hash).not.toBe(seeded.hash);

	const originalRule = await rule.inputValue();
	const values = await rule.locator('option').evaluateAll((options) =>
		options.map((option) => (option as HTMLOptionElement).value)
	);
	const alternate = values.find((value) => value !== originalRule);
	expect(alternate).toBeDefined();
	await rule.selectOption(alternate!);
	expect(await rule.inputValue()).not.toBe(originalRule);
	await expect(page.getByTestId('automaton-background')).toHaveAttribute('data-rule', alternate!);
	await page.goto('/');
	await expect(page.getByTestId('automaton-background')).toHaveAttribute('data-rule', alternate!);
});

test('forced colors disables the visual Lab with an explicit explanation', async ({ page }) => {
	await page.emulateMedia({ forcedColors: 'active' });
	await page.goto('/lab/cellular-automaton/');
	await expect(page.getByText('Cellular automaton is unavailable in forced-colors mode.')).toBeVisible();
	await expect(page.getByTestId('automaton-rule')).toBeDisabled();
	await expect(page.getByTestId('automaton-toggle')).toBeDisabled();
	await expect(page.getByTestId('automaton-step')).toBeDisabled();
	await expect(page.getByTestId('automaton-reset')).toBeDisabled();
	await expect(page.getByTestId('automaton-seed')).toBeDisabled();
	await expect(page.locator('.automaton-canvas')).toBeHidden();
});
