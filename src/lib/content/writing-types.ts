export const writingSources = [
	'gaato.net',
	'qiita',
	'note',
	'mathlog',
	'zenn',
	'shinonome'
] as const;

export type WritingSource = (typeof writingSources)[number];

export type DateString = `${number}-${number}-${number}`;

export type WritingItem = {
	readonly source: WritingSource;
	readonly sourceId: string;
	readonly title: string;
	readonly url: string;
	readonly publishedDate: DateString;
	readonly updatedDate?: DateString;
	/** ISO timestamp retained for the writing snapshot updater. */
	readonly updatedAt?: string;
};

export type WritingOverrides = {
	readonly aliases: Readonly<Record<string, string>>;
	readonly exclude: readonly string[];
};
