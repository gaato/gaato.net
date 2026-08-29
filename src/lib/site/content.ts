import type { WritingItem } from '$lib/content/writing-types';

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
	| 'contributed'
	| 'play'
	| 'experiment';

export const sectionOrder: readonly DirectorySectionId[] = [
	'speak',
	'write',
	'maintain',
	'contributed',
	'play',
	'experiment'
];

export const sectionLabels: Readonly<Record<DirectorySectionId, string>> = {
	speak: 'I speak',
	write: 'I write',
	maintain: 'I maintain',
	contributed: 'I contributed to',
	play: 'I play',
	experiment: 'I experiment with'
};

export const directoryEntries: Readonly<
	Record<Exclude<DirectorySectionId, 'write'>, readonly DirectoryEntry[]>
> = {
	speak: [
		{ id: 'ja', label: '日本語', lang: 'ja' },
		{ id: 'en', label: 'English', lang: 'en' },
		{ id: 'id', label: 'Bahasa Indonesia', lang: 'id' }
	],
	maintain: [
		{
			id: 'karukan',
			label: 'Karukan for openSUSE',
			href: 'https://build.opensuse.org/package/show/openSUSE%3AFactory/karukan'
		},
		{ id: 'coderunbot', label: 'CodeRunBot', href: 'https://coderunbot.gaato.net/' },
		{ id: 'discord-mbt', label: 'discord.mbt', href: 'https://github.com/gaato/discord.mbt' }
	],
	contributed: [
		{ id: 'sdbootutil', label: 'openSUSE/sdbootutil', href: 'https://github.com/openSUSE/sdbootutil' },
		{ id: 'async', label: 'moonbitlang/async', href: 'https://github.com/moonbitlang/async' },
		{
			id: 'aqua-registry',
			label: 'aquaproj/aqua-registry',
			href: 'https://github.com/aquaproj/aqua-registry'
		},
		{
			id: 'kholidays',
			label: 'KDE Frameworks/kholidays',
			href: 'https://invent.kde.org/frameworks/kholidays'
		}
	],
	play: [
		{ id: 'geoguessr', label: 'GeoGuessr' },
		{ id: 'holodori', label: 'ホロドリ', lang: 'ja' }
	],
	experiment: [
		{
			id: 'cellular-automaton',
			label: 'Cellular Automaton',
			href: '/lab/cellular-automaton/',
			lang: 'en'
		},
		{
			id: 'event-pt',
			label: 'ホロドリ：イベントPt調整',
			href: '/lab/event-pt/',
			lang: 'ja'
		}
	]
};

export const elsewhere = [
	{ label: 'GitHub', href: 'https://github.com/gaato' },
	{ label: 'X @gaato__', href: 'https://x.com/gaato__' },
	{ label: 'X @gaato11', href: 'https://x.com/gaato11' },
	{ label: 'openSUSE Build Service', href: 'https://build.opensuse.org/users/gaato' }
] as const;

export const sourceNames = {
	'gaato.net': 'gaato.net',
	qiita: 'Qiita',
	note: 'note',
	mathlog: 'Mathlog',
	zenn: 'Zenn'
} as const;

export function writingHref(item: WritingItem): string {
	return item.source === 'gaato.net' ? `/posts/${item.sourceId}/` : item.url;
}
