# gaato.net

がーと（gaato）の個人サイトです。SvelteKit で静的ファイルを生成し、Cloudflare Workers Static Assets で配信します。

背景のセル・オートマトンは TypeScript と Canvas 2D で動きます。MoonBit や Wasm は実行時にもビルド時にも必要ありません。公開記事の一覧は保存済み JSON を使うため、通常のビルドでは外部 API に接続しません。

## Development

```fish
bun install
bun run dev
```

型チェック、単体テスト、プロダクションビルド、成果物検査、ブラウザーテストをまとめて実行します。

```fish
bunx playwright install chromium
bun run verify
```

個別のコマンドも利用できます。

```fish
bun run check
bun run test
bun run build
bun run check:artifacts
bun run test:e2e
```

ビルド結果は `dist/` に出力されます。Qiita、note、Mathlog、Zenn の記事一覧を更新するときだけ、次のコマンドがネットワークへ接続します。

```fish
bun run writing:update
```

## Public routes

- `/`
- `/articles/`
- `/articles/<slug>/`
- `/lab/cellular-automaton/`
- `/lab/event-pt/`
- `/feed.xml`
- `/sitemap.xml`
- `/404`（成果物は `dist/404.html`）

`/posts/` 以下の旧 URL は、対応する `/articles/` 以下へ転送します。

正規 URL は `https://gaato.net` です。

## License

This repository contains software, editorial content, and third-party or collaborative material. They do not all share one license.

### Software

The software source code for gaato.net is licensed under the [Blue Oak Model License 1.0.0](LICENSE.md) (`BlueOak-1.0.0`). This includes the site implementation, build and maintenance scripts, tests, and code examples authored for this site, unless a file or example states otherwise.

### Editorial content

Copyright in original articles, prose, and images remains with Gakuto Furuya. All rights are reserved unless a page explicitly states another license.

Titles and other metadata saved from external publishing services remain subject to the rights of their respective authors and services.

### Third-party and collaborative material

The software license does not apply to third-party or collaborative material. See [NOTICE.md](NOTICE.md) for details. When the status of a particular item is unclear, do not assume that the software license applies to it; open an issue before reusing it.
