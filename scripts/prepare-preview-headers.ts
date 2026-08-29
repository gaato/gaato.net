import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const outputPath = resolve('dist/_headers');
const marker = '# gaato.net preview indexing policy';
const previewPolicy = `${marker}\n/*\n  X-Robots-Tag: noindex, nofollow\n`;

let existing = '';
try {
	existing = await readFile(outputPath, 'utf8');
} catch (error) {
	if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
}

if (!existing.includes(marker)) {
	await mkdir(dirname(outputPath), { recursive: true });
	const separator = existing.length === 0 || existing.endsWith('\n') ? '' : '\n';
	await writeFile(outputPath, `${existing}${separator}\n${previewPolicy}`, 'utf8');
}

const prepared = await readFile(outputPath, 'utf8');
if (!prepared.includes('X-Robots-Tag: noindex, nofollow')) {
	throw new Error('Preview headers do not disable search indexing');
}

console.log(`Prepared preview-only headers at ${outputPath}`);
