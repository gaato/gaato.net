import packagesData from '../../../content/contributions/packages.json' with { type: 'json' };
import upstreamData from '../../../content/contributions/upstream.json' with { type: 'json' };
import type { ContributionEntry } from '$lib/content/contribution-types';
import type { WritingItem } from '$lib/content/writing-types';

const packageSnapshot = packagesData as readonly ContributionEntry[];
const upstreamSnapshot = upstreamData as readonly ContributionEntry[];

export type DirectoryEntry = {
	readonly id: string;
	readonly label: string;
	readonly href?: string;
	readonly lang?: string;
};

export type DirectorySectionId =
	| 'speak'
	| 'write'
	| 'maintain'
	| 'package'
	| 'contributed'
	| 'part-of';

export const sectionOrder: readonly DirectorySectionId[] = [
	'speak',
	'write',
	'maintain',
	'package',
	'contributed',
	'part-of'
];

export const sectionLabels: Readonly<Record<DirectorySectionId, string>> = {
	speak: 'I speak',
	write: 'I write',
	maintain: 'I maintain',
	package: 'I package',
	contributed: 'I contributed to',
	'part-of': 'I’ve been part of'
};

function toDirectoryEntry({ id, label, href }: ContributionEntry): DirectoryEntry {
	return { id, label, href };
}

export const directoryEntries: Readonly<
	Record<Exclude<DirectorySectionId, 'write'>, readonly DirectoryEntry[]>
> = {
	speak: [
		{ id: 'ja', label: '日本語', lang: 'ja' },
		{ id: 'en', label: 'English', lang: 'en' },
		{ id: 'id', label: 'Bahasa Indonesia', lang: 'id' }
	],
	maintain: [
		{ id: 'coderunbot', label: 'CodeRunBot', href: 'https://coderunbot.gaato.net/' },
		{ id: 'discord-mbt', label: 'discord.mbt', href: 'https://github.com/gaato/discord.mbt' }
	],
	package: packageSnapshot.map(toDirectoryEntry),
	contributed: upstreamSnapshot.map(toDirectoryEntry),
	'part-of': [
		{
			id: 'project-o-to-o',
			label: 'PROJECT O to O',
			href: 'https://www.youtube.com/@PROJECT-O-to-O'
		},
		{
			id: 'here-with-me',
			label: 'HERE WITH ME',
			href: 'https://www.youtube.com/watch?v=Aiana0rhZr0'
		},
		{
			id: 'recreating-world',
			label: 'Re:Creating World',
			href: 'https://drive.google.com/file/d/1H7H9Hsneml1iW-A0rydfGuJzhu6Ux2Sn/view?usp=sharing'
		}
	]
};

export const elsewhere = [
	{ label: 'GitHub', href: 'https://github.com/gaato' },
	{ label: 'X @gaato__', href: 'https://x.com/gaato__' },
	{ label: 'X @gaato11', href: 'https://x.com/gaato11' }
] as const;

export const sourceNames = {
	'gaato.net': 'gaato.net',
	qiita: 'Qiita',
	note: 'note',
	mathlog: 'Mathlog',
	zenn: 'Zenn',
	shinonome: 'Shinonome'
} as const;

export function writingHref(item: WritingItem): string {
	return item.source === 'gaato.net' ? `/articles/${item.sourceId}/` : item.url;
}
