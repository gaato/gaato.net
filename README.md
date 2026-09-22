# gaato.net

[![Verify and deploy](https://github.com/gaato/gaato.net/actions/workflows/deploy.yml/badge.svg)](https://github.com/gaato/gaato.net/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/gaato/gaato.net/actions/workflows/codeql.yml/badge.svg)](https://github.com/gaato/gaato.net/actions/workflows/codeql.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fgaato.net)](https://gaato.net)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/gaato/gaato.net)
[![License](https://img.shields.io/github/license/gaato/gaato.net)](LICENSE.md)

Source code for [gaato.net](https://gaato.net), the personal website of gaato.

## Development

```fish
bun install
bun run dev
```

Articles live in `content/posts/*.md`. A post with `draft: true` in its front matter is excluded from the build; use it for unpublished or future articles. Every published slug must also be listed in `src/lib/content/local-post-manifest.ts`.

To run the full verification suite:

```fish
bunx playwright install chromium
bun run verify
```

## License

The site software is licensed under the [Blue Oak Model License 1.0.0](LICENSE.md) (`BlueOak-1.0.0`).

Original articles, prose, and images are not covered by the software license. All rights are reserved unless a page states otherwise. Third-party and collaborative material is described in [NOTICE.md](NOTICE.md).
