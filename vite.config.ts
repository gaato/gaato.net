import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	build: {
		assetsInlineLimit(filePath) {
			return /\.(?:ttf|woff2?)$/u.test(filePath) ? false : undefined;
		}
	},
	plugins: [
		sveltekit({
			adapter: adapter({
				pages: 'dist',
				assets: 'dist',
				strict: true
			}),
			csp: {
				mode: 'hash',
				directives: {
					'default-src': ['self'],
					'base-uri': ['none'],
					'connect-src': ['self'],
					'font-src': ['self'],
					'form-action': ['self'],
					'frame-src': ['none'],
					'img-src': ['self', 'data:'],
					'manifest-src': ['self'],
					'object-src': ['none'],
					'script-src': [
						'self',
						'https://static.cloudflareinsights.com/beacon.min.js'
					],
					'style-src': ['self'],
					'style-src-attr': [
						'unsafe-hashes',
						'sha256-S8qMpvofolR8Mpjy4kQvEm7m1q8clzU4dfDH0AmvZjo='
					],
					'worker-src': ['self']
				}
			},
			files: {
				assets: 'public'
			},
			paths: {
				relative: false
			}
		})
	],
	test: {
		expect: { requireAssertions: true },
		environment: 'node',
		include: ['src/**/*.{test,spec}.{js,ts}', 'scripts/**/*.{test,spec}.{js,ts}']
	}
});
