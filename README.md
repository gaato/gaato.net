# gaato.net

[![Deploy](https://img.shields.io/github/actions/workflow/status/gaato/gaato.net/deploy.yml?branch=main&label=deploy)](https://github.com/gaato/gaato.net/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fgaato.net&label=website)](https://gaato.net)
[![HTTP Observatory](https://img.shields.io/mozilla-observatory/grade/gaato.net?label=observatory)](https://developer.mozilla.org/en-US/observatory/analyze?host=gaato.net)
[![DeepWiki](https://img.shields.io/badge/DeepWiki-gaato%2Fgaato.net-blue)](https://deepwiki.com/gaato/gaato.net)
![Bun](https://img.shields.io/badge/bun-1.3-black?logo=bun)
![Vite](https://img.shields.io/badge/vite-8.0.10-646CFF?logo=vite&logoColor=white)
![MoonBit](https://img.shields.io/badge/moonbit-latest-blue)

Personal website built as a standards-first static HTML document, with an optional MoonBit/WASM background island, and deployed to Cloudflare Pages.

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

The page content lives in `index.html`. JavaScript is used only for progressive enhancement: language switching and the optional animated background. MoonBit is limited to the background WASM core in `src/background`.

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

Pushes to `main` deploy to Cloudflare Pages through GitHub Actions.

## License

- Code in this repository is licensed under the Blue Oak Model License 1.0.0. See `LICENSE.md`.
- Website content (text, images, and other creative assets) is All rights reserved unless explicitly noted otherwise.
