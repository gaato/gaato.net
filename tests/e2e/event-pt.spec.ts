import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/lab/event-pt/');
});

test('Event Pt finds an exact result', async ({ page }) => {
	await page.locator('#event-current').fill('1144899');
	await page.locator('#event-target').fill('1145141');
	await page.locator('#event-bonus').fill('20');
	await page.locator('#event-passport').check();
	await page.getByRole('button', { name: '組み合わせを計算' }).click();

	const result = page.getByTestId('event-pt-result');
	await expect(result.getByRole('heading', { name: '候補' })).toBeVisible();
	const first = result.locator('tbody tr').first();
	await expect(first).toContainText('4回');
	await expect(first).toContainText('3回');
	await expect(first.locator('td').nth(1)).toHaveText('2');
	await expect(first.locator('td').nth(2)).toHaveText('7');
});

test('Event Pt reports and focuses invalid input', async ({ page }) => {
	await page.locator('#event-current').fill('not a point');
	await page.locator('#event-target').fill('100');
	await page.getByRole('button', { name: '組み合わせを計算' }).click();

	const errors = page.getByTestId('event-pt-errors');
	await expect(errors).toBeVisible();
	await expect(errors).toBeFocused();
	await expect(errors).toContainText('現在Ptを0以上の整数で入力してください。');
	await expect(page.locator('#event-current')).toHaveAttribute('aria-invalid', 'true');
});
