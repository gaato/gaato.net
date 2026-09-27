import { spawnSync } from 'node:child_process';
import { rename, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import type {
	ContributionEntry,
	ContributionOrigin,
	ContributionOverrides
} from '../src/lib/content/contribution-types';
import type { DateString } from '../src/lib/content/writing-types';
import { asArray, jstDate } from './update-writing';

const login = 'gaato';
const userAgent = 'gaato.net contributions updater';
const root = process.cwd();
const snapshotDirectory = join(root, 'content', 'contributions');
const xmlParser = new XMLParser({ ignoreAttributes: false, parseTagValue: false, trimValues: true });
const gitlabHosts = ['invent.kde.org', 'gitlab.freedesktop.org'] as const;

/** A contribution before overrides: one repository, project or package with its latest activity. */
export type RawContribution = Omit<ContributionEntry, 'id' | 'label'>;

export type OriginResult = {
	readonly upstream: readonly RawContribution[];
	readonly packages: readonly RawContribution[];
};

function latest(entries: readonly RawContribution[]): RawContribution[] {
	const byKey = new Map<string, RawContribution>();
	for (const entry of entries) {
		const current = byKey.get(entry.key);
		if (!current || entry.lastDate > current.lastDate) byKey.set(entry.key, entry);
	}
	return [...byKey.values()];
}

export function parseGithubPullRequests(nodes: unknown): RawContribution[] {
	if (!Array.isArray(nodes)) throw new Error('GitHub returned no search nodes');
	return latest(
		nodes.map((node) => {
			const repository = String(node?.repository?.nameWithOwner ?? '');
			const mergedAt = String(node?.mergedAt ?? '');
			if (!repository || !mergedAt) throw new Error('GitHub pull request is missing fields');
			return {
				key: repository,
				href: `https://github.com/${repository}/pulls?q=is%3Apr+is%3Amerged+author%3A${login}`,
				lastDate: jstDate(mergedAt),
				origin: 'github' as const
			};
		}).filter((entry) => !entry.key.startsWith(`${login}/`))
	);
}

export function parseGitlabMergeRequests(host: string, value: unknown): RawContribution[] {
	if (!Array.isArray(value)) throw new Error(`${host} returned a non-array response`);
	return latest(
		value
			.map((request) => {
				const reference = String(request?.references?.full ?? '');
				const project = reference.split('!')[0];
				const mergedAt = String(request?.merged_at ?? '');
				if (!project || !mergedAt) throw new Error(`${host} merge request is missing fields`);
				return {
					key: project,
					href: `https://${host}/${project}/-/merge_requests/?sort=created_date&state=merged&author_username=${login}&first_page_size=20`,
					lastDate: jstDate(mergedAt),
					origin: 'gitlab' as const
				};
			})
			.filter((entry) => !entry.key.startsWith(`${login}/`))
	);
}

export function parseObsPackageNames(xml: string): Set<string> {
	const collection = xmlParser.parse(xml)?.collection;
	if (!collection) throw new Error('OBS package search returned no collection');
	return new Set(asArray(collection.package).map((entry) => String(entry['@_name'])));
}

type ObsRequest = {
	readonly id: string;
	readonly targetProject: string;
	readonly targetPackage: string;
	readonly acceptedDate: DateString;
};

export function parseObsRequests(xml: string): ObsRequest[] {
	const collection = xmlParser.parse(xml)?.collection;
	if (!collection) throw new Error('OBS request search returned no collection');
	return asArray(collection.request).flatMap((request) => {
		const when = String(request?.state?.['@_when'] ?? '');
		if (!when) throw new Error(`OBS request ${request?.['@_id']} has no state date`);
		// OBS reports UTC timestamps without a zone designator.
		const acceptedDate = jstDate(`${when}Z`);
		return asArray(request.action)
			.filter((action) => action['@_type'] === 'submit' && action.target)
			.map((action) => ({
				id: String(request['@_id']),
				targetProject: String(action.target['@_project']),
				targetPackage: String(action.target['@_package']),
				acceptedDate
			}));
	});
}

/**
 * Splits accepted submit requests into Factory packages I maintain and
 * contributions to packages maintained by others.
 */
export function classifyObsRequests(
	requests: readonly ObsRequest[],
	maintained: ReadonlySet<string>
): OriginResult {
	const packages: RawContribution[] = [];
	const upstreamRequests = new Map<string, ObsRequest[]>();
	for (const request of requests) {
		if (request.targetProject.startsWith(`home:${login}`)) continue;
		if (maintained.has(request.targetPackage)) {
			if (request.targetProject !== 'openSUSE:Factory') continue;
			packages.push({
				key: `openSUSE:Factory/${request.targetPackage}`,
				href: `https://build.opensuse.org/package/show/openSUSE%3AFactory/${request.targetPackage}`,
				lastDate: request.acceptedDate,
				origin: 'obs'
			});
			continue;
		}
		const key = `${request.targetProject}/${request.targetPackage}`;
		upstreamRequests.set(key, [...(upstreamRequests.get(key) ?? []), request]);
	}
	const upstream = [...upstreamRequests].map(([key, grouped]) => {
		const [first] = grouped;
		const href =
			grouped.length === 1
				? `https://build.opensuse.org/request/show/${first.id}`
				: `https://build.opensuse.org/package/requests/${first.targetProject}/${first.targetPackage}`;
		const lastDate = grouped.map((request) => request.acceptedDate).sort().at(-1)!;
		return { key, href, lastDate, origin: 'obs' as const };
	});
	return { upstream, packages: latest(packages) };
}

function slug(key: string): string {
	return key
		.toLowerCase()
		.replace(/[^a-z0-9]+/gu, '-')
		.replace(/^-|-$/gu, '');
}

/** Applies overrides and orders entries by their latest activity, newest first. */
export function presentContributions(
	entries: readonly RawContribution[],
	overrides: ContributionOverrides
): ContributionEntry[] {
	const excluded = new Set(overrides.exclude);
	return entries
		.filter((entry) => !excluded.has(entry.key))
		.toSorted((a, b) => b.lastDate.localeCompare(a.lastDate) || a.key.localeCompare(b.key))
		.map((entry) => ({
			id: slug(entry.key),
			key: entry.key,
			label: overrides.labels[entry.key] ?? entry.key,
			href: entry.href,
			lastDate: entry.lastDate,
			origin: entry.origin
		}));
}

async function fetchText(url: string, headers: Record<string, string> = {}, init: RequestInit = {}) {
	const response = await fetch(url, { ...init, headers: { 'user-agent': userAgent, ...headers } });
	if (!response.ok) throw new Error(`${url} returned ${response.status}`);
	return response.text();
}

const githubQuery = `query($q: String!, $after: String) {
  search(query: $q, type: ISSUE, first: 100, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes { ... on PullRequest { mergedAt repository { nameWithOwner } } }
  }
}`;

async function loadGithub(): Promise<OriginResult> {
	const token = process.env.GITHUB_TOKEN;
	if (!token) throw new Error('GITHUB_TOKEN is not set');
	const nodes: unknown[] = [];
	let after: string | null = null;
	do {
		const body = JSON.parse(
			await fetchText(
				'https://api.github.com/graphql',
				{ authorization: `Bearer ${token}`, 'content-type': 'application/json' },
				{
					method: 'POST',
					body: JSON.stringify({
						query: githubQuery,
						variables: { q: `is:pr author:${login} is:merged -user:${login}`, after }
					})
				}
			)
		);
		if (body.errors) throw new Error(`GitHub GraphQL: ${JSON.stringify(body.errors)}`);
		const search = body.data.search;
		nodes.push(...search.nodes);
		after = search.pageInfo.hasNextPage ? search.pageInfo.endCursor : null;
	} while (after);
	return { upstream: parseGithubPullRequests(nodes), packages: [] };
}

async function loadGitlab(): Promise<OriginResult> {
	const upstream: RawContribution[] = [];
	for (const host of gitlabHosts) {
		const url = `https://${host}/api/v4/merge_requests?scope=all&state=merged&author_username=${login}&per_page=100`;
		upstream.push(...parseGitlabMergeRequests(host, JSON.parse(await fetchText(url))));
	}
	return { upstream, packages: [] };
}

/** Reads the OBS API with OBS_PASSWORD, or through a configured `osc` when running locally. */
async function fetchObs(path: string): Promise<string> {
	const password = process.env.OBS_PASSWORD;
	if (password) {
		const credentials = Buffer.from(`${login}:${password}`).toString('base64');
		return fetchText(`https://api.opensuse.org${path}`, { authorization: `Basic ${credentials}` });
	}
	const result = spawnSync('osc', ['api', path], { encoding: 'utf8' });
	if (result.error || result.status !== 0) {
		throw new Error(`OBS_PASSWORD is not set and \`osc api\` failed: ${result.stderr || result.error}`);
	}
	return result.stdout;
}

async function loadObs(): Promise<OriginResult> {
	const match = (xpath: string) => `?match=${encodeURIComponent(xpath)}`;
	const maintained = parseObsPackageNames(
		await fetchObs(`/search/package/id${match(`person/@userid='${login}'`)}`)
	);
	const requests = parseObsRequests(
		await fetchObs(
			`/search/request${match(`@creator='${login}' and state/@name='accepted' and action/@type='submit'`)}`
		)
	);
	return classifyObsRequests(requests, maintained);
}

const loaders: Readonly<Record<ContributionOrigin, () => Promise<OriginResult>>> = {
	github: loadGithub,
	gitlab: loadGitlab,
	obs: loadObs
};

async function readJson<T>(name: string): Promise<T> {
	return JSON.parse(await readFile(join(snapshotDirectory, name), 'utf8')) as T;
}

async function writeSnapshot(name: string, entries: readonly ContributionEntry[]): Promise<void> {
	const destination = join(snapshotDirectory, name);
	const temporary = `${destination}.${process.pid}.tmp`;
	await writeFile(temporary, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
	await rename(temporary, destination);
}

async function main(): Promise<void> {
	const overrides = await readJson<ContributionOverrides>('overrides.json');
	const current = {
		upstream: await readJson<ContributionEntry[]>('upstream.json').catch(() => []),
		packages: await readJson<ContributionEntry[]>('packages.json').catch(() => [])
	};
	const upstream: RawContribution[] = [];
	const packages: RawContribution[] = [];
	const failures: string[] = [];
	for (const [origin, load] of Object.entries(loaders) as [ContributionOrigin, typeof loadObs][]) {
		const previous = {
			upstream: current.upstream.filter((entry) => entry.origin === origin),
			packages: current.packages.filter((entry) => entry.origin === origin)
		};
		try {
			const result = await load();
			if (result.upstream.length + result.packages.length === 0 && previous.upstream.length + previous.packages.length > 0) {
				throw new Error('refusing to replace a non-empty snapshot with an empty result');
			}
			upstream.push(...result.upstream);
			packages.push(...result.packages);
			console.log(`${origin}: ${result.upstream.length} upstream, ${result.packages.length} packages`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			failures.push(`${origin}: ${message}`);
			console.error(`${origin}: kept last-known-good entries (${message})`);
			upstream.push(...previous.upstream);
			packages.push(...previous.packages);
		}
	}
	await writeSnapshot('upstream.json', presentContributions(upstream, overrides));
	await writeSnapshot('packages.json', presentContributions(packages, overrides));
	if (failures.length > 0) throw new Error(failures.join('\n'));
}

if (import.meta.main) {
	await main();
}
