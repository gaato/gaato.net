import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const wranglerState = `/tmp/gaato-net-wrangler-e2e-${process.pid}`;

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	// Wrangler's local workerd can drop connections when many browser workers close requests at once.
	workers: 1,
	reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
	timeout: 30_000,
	expect: {
		timeout: 5_000
	},
	use: {
		baseURL,
		locale: 'ja-JP',
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
		video: 'off'
	},
	projects: [
		{
			name: 'desktop-chromium',
			use: {
				...devices['Desktop Chrome'],
				colorScheme: 'light'
			}
		},
		{
			name: 'mobile-chromium',
			use: {
				...devices['Pixel 7'],
				colorScheme: 'light'
			}
		}
	],
	webServer: {
		command: `bun run wrangler dev --local --ip 127.0.0.1 --port ${port} --persist-to ${wranglerState} --show-interactive-dev-session=false --log-level warn`,
		url: baseURL,
		reuseExistingServer: false,
		stdout: 'pipe',
		stderr: 'pipe',
		timeout: 30_000
	}
});
