# gaato.net

[![Deploy](https://img.shields.io/github/actions/workflow/status/gaato/gaato.net/deploy.yml?branch=main&label=deploy)](https://github.com/gaato/gaato.net/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fgaato.net&label=website)](https://gaato.net)
[![HTTP Observatory](https://img.shields.io/mozilla-observatory/grade/gaato.net?label=observatory)](https://developer.mozilla.org/en-US/observatory/analyze?host=gaato.net)
[![DeepWiki](https://img.shields.io/badge/DeepWiki-gaato%2Fgaato.net-blue)](https://deepwiki.com/gaato/gaato.net)
![Bun](https://img.shields.io/badge/bun-1.3-black?logo=bun)
![Astra](https://img.shields.io/badge/astra-0.22-3a6f6a)
![Vite](https://img.shields.io/badge/vite-preview-646CFF?logo=vite&logoColor=white)
![MoonBit](https://img.shields.io/badge/moonbit-latest-blue)

Personal website built as Astra-rendered static HTML, with an optional MoonBit/WASM background island, and deployed to Cloudflare Workers Static Assets.

## Setup

Install the pinned toolchain first:

```sh
mise trust
mise install
```

Then install dependencies:

```sh
bun install
```

## Development

Start the local development server:

```sh
bun run dev
```

Public site content (posts and pages) lives in `content/`. Astra renders the Markdown first, then `scripts/build-site.mjs` wraps the output in the site shell and writes plain files to `dist/`.

JavaScript is used only for progressive enhancement. Reading pages does not require client-side JavaScript; the home-page cellular automaton is optional and backed by the MoonBit WASM core in `src/background`.

## Build

Create a production build:

```sh
bun run build
```

Run the local checks:

```sh
bun run check
```

`bun run check` runs TypeScript checking, MoonBit checking, the production build, HTML/CSS validation, and size budgets. The CI workflow also runs Pa11y accessibility checks and Lychee link checks.

## Deploy

Pushes to `main` deploy to Cloudflare Workers Static Assets through GitHub Actions. Pull requests deploy a preview Worker named after the pull request number.

## License

- Code in this repository is licensed under the Blue Oak Model License 1.0.0. See `LICENSE.md`.
- Website content (text, images, and other creative assets) is All rights reserved unless explicitly noted otherwise.
