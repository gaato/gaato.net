import { expect, type Locator, type Page } from '@playwright/test';
import { publishedLocalPostSlugs as postSlugs } from '../../src/lib/content/local-post-manifest';

export const pageRoutes = [
	'/',
	'/articles/',
	...postSlugs.map((slug) => `/articles/${slug}/`),
	'/404'
] as const;

export function collectBrowserProblems(page: Page): {
	assertNone: () => void;
	reset: () => void;
} {
	const problems: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') problems.push(`console: ${message.text()}`);
	});
	page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
	page.on('requestfailed', (request) => {
		problems.push(`requestfailed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`);
	});
	return {
		assertNone: () => expect(problems, problems.join('\n')).toEqual([]),
		reset: () => problems.splice(0)
	};
}

export function backgroundCanvas(page: Page): Locator {
	return page
		.locator(
			'canvas[data-testid="automaton-background"], [data-testid="automaton-background"] canvas'
		)
		.first();
}

export async function canvasFingerprint(canvas: Locator): Promise<{ painted: number; hash: number }> {
	await expect(canvas).toBeAttached();
	return canvas.evaluate((element: HTMLCanvasElement) => {
		const context = element.getContext('2d', { willReadFrequently: true });
		if (!context || element.width === 0 || element.height === 0) return { painted: 0, hash: 0 };
		const pixels = context.getImageData(0, 0, element.width, element.height).data;
		const sampleStride = Math.max(4, Math.floor(pixels.length / 400_000 / 4) * 4);
		let painted = 0;
		let hash = 2_166_136_261;
		for (let index = 0; index < pixels.length; index += sampleStride) {
			const alpha = pixels[index + 3] ?? 0;
			if (alpha !== 0) painted += 1;
			hash ^= (pixels[index] ?? 0) + ((pixels[index + 1] ?? 0) << 8) + ((pixels[index + 2] ?? 0) << 16) + (alpha << 24);
			hash = Math.imul(hash, 16_777_619) >>> 0;
		}
		return { painted, hash };
	});
}

export async function waitForCanvasPaint(canvas: Locator): Promise<void> {
	await expect
		.poll(async () => (await canvasFingerprint(canvas)).painted, {
			message: 'canvas should contain painted automaton cells'
		})
		.toBeGreaterThan(0);
}
