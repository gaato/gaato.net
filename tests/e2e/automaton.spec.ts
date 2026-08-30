import { expect, test } from '@playwright/test';
import { backgroundCanvas, canvasFingerprint, waitForCanvasPaint } from './helpers';

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

test('a full reload selects a new background rule', async ({ page }) => {
	await page.addInitScript(() => {
		const loadCount = Number(sessionStorage.getItem('gaato:test-rule-load') ?? '0');
		sessionStorage.setItem('gaato:test-rule-load', String(loadCount + 1));
		Math.random = () => (loadCount === 0 ? 0 : 0.999);
	});
	await page.goto('/');
	await expect(page.getByTestId('automaton-background')).toHaveAttribute('data-rule', 'conway');

	await page.reload();
	await expect(page.getByTestId('automaton-background')).toHaveAttribute('data-rule', 'amoeba');
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

	await page.getByRole('link', { name: 'Articles', exact: true }).click();
	await expect(page).toHaveURL(/\/articles\/$/u);
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
	await expect(page.getByRole('link', { name: 'Articles', exact: true })).toBeVisible();
});

test('a mobile tap adds one background cell without blocking scrolling', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'mobile-chromium', 'touch input needs the mobile profile');
	await page.goto('/');
	const canvas = backgroundCanvas(page);
	await waitForCanvasPaint(canvas);
	await page.getByTestId('automaton-background-toggle').click();
	await page.evaluate(() => scrollTo(0, 0));
	const before = await canvasFingerprint(canvas);

	await page.touchscreen.tap(Math.floor(page.viewportSize()!.width / 2), 160);
	await expect.poll(async () => (await canvasFingerprint(canvas)).hash).not.toBe(before.hash);
	await expect(page.getByRole('link', { name: 'Articles', exact: true })).toBeVisible();
});

test('a mobile swipe paints a continuous background trail while the page can scroll', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'mobile-chromium', 'touch input needs the mobile profile');
	await page.goto('/');
	const canvas = backgroundCanvas(page);
	await waitForCanvasPaint(canvas);
	await page.getByTestId('automaton-background-toggle').click();
	await page.evaluate(() => scrollTo(0, 0));
	const before = await canvasFingerprint(canvas);
	const viewport = page.viewportSize();
	expect(viewport).not.toBeNull();

	const client = await page.context().newCDPSession(page);
	const x = Math.floor(viewport!.width * 0.8);
	const startY = Math.floor(viewport!.height * 0.72);
	const endY = Math.floor(viewport!.height * 0.28);
	await client.send('Input.dispatchTouchEvent', {
		type: 'touchStart',
		touchPoints: [{ x, y: startY, id: 1 }]
	});
	for (let step = 1; step <= 8; step += 1) {
		const y = Math.round(startY + ((endY - startY) * step) / 8);
		await client.send('Input.dispatchTouchEvent', {
			type: 'touchMove',
			touchPoints: [{ x, y, id: 1 }]
		});
	}
	await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

	await expect.poll(async () => (await canvasFingerprint(canvas)).hash).not.toBe(before.hash);
	await expect.poll(async () => page.evaluate(() => scrollY)).toBeGreaterThan(0);
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
	await expect(page.getByRole('link', { name: 'Articles', exact: true })).toBeVisible();
});
