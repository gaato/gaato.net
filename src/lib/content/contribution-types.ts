import type { DateString } from './writing-types';

export const contributionOrigins = ['github', 'gitlab', 'obs'] as const;

export type ContributionOrigin = (typeof contributionOrigins)[number];

export type ContributionEntry = {
	readonly id: string;
	/** Stable identity from the source (repository, project or OBS package); overrides are keyed by it. */
	readonly key: string;
	readonly label: string;
	readonly href: string;
	readonly lastDate: DateString;
	readonly origin: ContributionOrigin;
};

export type ContributionOverrides = {
	readonly exclude: readonly string[];
	readonly labels: Readonly<Record<string, string>>;
};
