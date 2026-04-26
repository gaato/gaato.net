# gaato.net

Personal website built as a standards-first static HTML document, with an optional MoonBit/WASM background island, and deployed to Cloudflare Pages.

## Setup

Install the following tools first:

- [MoonBit](https://www.moonbitlang.com/)
- [Bun](https://bun.sh/)

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
