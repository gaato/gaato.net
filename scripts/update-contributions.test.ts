import { describe, expect, test } from 'vitest';
import {
	classifyObsRequests,
	parseGithubPullRequests,
	parseGitlabMergeRequests,
	parseObsPackageNames,
	parseObsRequests,
	presentContributions
} from './update-contributions';

describe('contribution source parsers', () => {
	test('keeps the latest merged pull request per repository and skips my own', () => {
		expect(
			parseGithubPullRequests([
				{ mergedAt: '2026-08-01T00:00:00Z', repository: { nameWithOwner: 'moonbitlang/async' } },
				{ mergedAt: '2026-09-01T00:00:00Z', repository: { nameWithOwner: 'moonbitlang/async' } },
				{ mergedAt: '2026-09-02T00:00:00Z', repository: { nameWithOwner: 'gaato/discord.mbt' } }
			])
		).toEqual([
			{
				key: 'moonbitlang/async',
				href: 'https://github.com/moonbitlang/async/pulls?q=is%3Apr+is%3Amerged+author%3Agaato',
				lastDate: '2026-09-01',
				origin: 'github'
			}
		]);
	});

	test('groups GitLab merge requests by project', () => {
		expect(
			parseGitlabMergeRequests('invent.kde.org', [
				{ references: { full: 'frameworks/kholidays!147' }, merged_at: '2026-02-02T15:06:02.828Z' },
				{ references: { full: 'frameworks/kholidays!142' }, merged_at: '2025-12-28T19:29:52.022Z' }
			])
		).toEqual([
			{
				key: 'frameworks/kholidays',
				href: 'https://invent.kde.org/frameworks/kholidays/-/merge_requests/?sort=created_date&state=merged&author_username=gaato&first_page_size=20',
				lastDate: '2026-02-03',
				origin: 'gitlab'
			}
		]);
	});

	test('splits OBS submit requests into my Factory packages and upstream contributions', () => {
		const maintained = parseObsPackageNames(
			`<collection matches="1"><package project='M17N' name='karukan'/></collection>`
		);
		const requests = parseObsRequests(`<collection matches="4">
			<request id="1"><action type="submit"><source project="M17N" package="karukan"/><target project="openSUSE:Factory" package="karukan"/></action><state name="accepted" when="2026-03-24T17:48:33"/></request>
			<request id="2"><action type="submit"><source project="home:gaato:branches:X11:XOrg" package="Mesa"/><target project="X11:XOrg" package="Mesa"/></action><state name="accepted" when="2026-09-08T11:02:11"/></request>
			<request id="3"><action type="submit"><source project="home:gaato" package="karukan"/><target project="M17N" package="karukan"/></action><state name="accepted" when="2026-03-20T00:00:00"/></request>
			<request id="4"><action type="submit"><source project="home:gaato:x" package="y"/><target project="home:gaato" package="y"/></action><state name="accepted" when="2026-03-20T00:00:00"/></request>
		</collection>`);
		expect(classifyObsRequests(requests, maintained)).toEqual({
			packages: [
				{
					key: 'openSUSE:Factory/karukan',
					href: 'https://build.opensuse.org/package/show/openSUSE%3AFactory/karukan',
					lastDate: '2026-03-25',
					origin: 'obs'
				}
			],
			upstream: [
				{
					key: 'X11:XOrg/Mesa',
					href: 'https://build.opensuse.org/request/show/2',
					lastDate: '2026-09-08',
					origin: 'obs'
				}
			]
		});
	});
});

test('applies exclusions and labels, newest first', () => {
	const entry = (key: string, lastDate: `${number}-${number}-${number}`) => ({
		key,
		href: `https://example.com/${key}`,
		lastDate,
		origin: 'github' as const
	});
	expect(
		presentContributions(
			[entry('a/old', '2024-01-01'), entry('a/new', '2026-01-01'), entry('a/hidden', '2026-02-01')],
			{ exclude: ['a/hidden'], labels: { 'a/old': 'Old project' } }
		).map(({ id, label }) => [id, label])
	).toEqual([
		['a-new', 'a/new'],
		['a-old', 'Old project']
	]);
});
