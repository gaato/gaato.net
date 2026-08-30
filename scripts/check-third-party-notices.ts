import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type PackageNotice = {
	name: string;
	packageName: string;
	licenseFile: string;
	source: string;
};

const noticeFile = resolve('public/THIRD_PARTY_NOTICES.txt');
const packages: PackageNotice[] = [
	{
		name: 'Svelte',
		packageName: 'svelte',
		licenseFile: 'LICENSE.md',
		source: 'https://github.com/sveltejs/svelte'
	},
	{
		name: 'SvelteKit',
		packageName: '@sveltejs/kit',
		licenseFile: 'LICENSE',
		source: 'https://github.com/sveltejs/kit'
	},
	{
		name: 'devalue',
		packageName: 'devalue',
		licenseFile: 'LICENSE',
		source: 'https://github.com/sveltejs/devalue'
	}
];

function normalizeLicense(text: string): string {
	return text
		.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gu, '$1 $2')
		.replace(/\s+/gu, ' ')
		.trim();
}

const notices = await readFile(noticeFile, 'utf8');
const failures: string[] = [];

for (const dependency of packages) {
	const packageDirectory = resolve('node_modules', dependency.packageName);
	const manifest = JSON.parse(
		await readFile(resolve(packageDirectory, 'package.json'), 'utf8')
	) as { license?: string };
	if (manifest.license !== 'MIT') {
		failures.push(
			`${dependency.packageName} declares ${JSON.stringify(manifest.license)}, expected MIT`
		);
	}

	const sectionStart = notices.indexOf(`\n${dependency.name}\n${dependency.source}\n`);
	if (sectionStart === -1) {
		failures.push(`${dependency.name} and its source URL are missing from the notice file`);
		continue;
	}
	const sectionEnd = notices.indexOf('\n===============', sectionStart + 1);
	const section = notices.slice(sectionStart, sectionEnd === -1 ? undefined : sectionEnd);
	const upstreamLicense = await readFile(
		resolve(packageDirectory, dependency.licenseFile),
		'utf8'
	);
	if (!normalizeLicense(section).includes(normalizeLicense(upstreamLicense))) {
		failures.push(`${dependency.name} license text differs from the installed package`);
	}
}

if (failures.length > 0) {
	for (const failure of failures) console.error(`- ${failure}`);
	throw new Error(
		`Third-party notice check failed with ${failures.length} problem${failures.length === 1 ? '' : 's'}`
	);
}

console.log(`Third-party notices match ${packages.length} installed packages`);
