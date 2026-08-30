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
	| 'part-of'
	| 'play';

export const sectionOrder: readonly DirectorySectionId[] = [
	'speak',
	'write',
	'maintain',
	'contributed',
	'part-of',
	'play'
];

export const sectionLabels: Readonly<Record<DirectorySectionId, string>> = {
	speak: 'I speak',
	write: 'I write',
	maintain: 'I maintain',
	contributed: 'I contributed to',
	'part-of': 'I’ve been part of',
	play: 'I play'
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
		{
			id: 'sdbootutil',
			label: 'openSUSE/sdbootutil',
			href: 'https://github.com/openSUSE/sdbootutil/pulls?q=is%3Apr+is%3Amerged+author%3Agaato'
		},
		{
			id: 'async',
			label: 'moonbitlang/async',
			href: 'https://github.com/moonbitlang/async/pulls?q=is%3Apr+is%3Amerged+author%3Agaato'
		},
		{
			id: 'aqua-registry',
			label: 'aquaproj/aqua-registry',
			href:
				'https://github.com/aquaproj/aqua-registry/pulls?q=is%3Apr+is%3Amerged+author%3Agaato'
		},
		{
			id: 'kholidays',
			label: 'KDE Frameworks/kholidays',
			href:
				'https://invent.kde.org/frameworks/kholidays/-/merge_requests/?sort=created_date&state=merged&author_username=gaato&first_page_size=20'
		},
		{
			id: 'a',
			label: 'purpleblueslime/a',
			href: 'https://github.com/purpleblueslime/a/pulls?q=is%3Apr+is%3Amerged+author%3Agaato'
		}
	],
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
	],
	play: [
		{ id: 'geoguessr', label: 'GeoGuessr' },
		{ id: 'holodori', label: 'hololive Dreams', lang: 'en' }
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
