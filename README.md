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
- `/writing/`
- `/posts/<slug>/`
- `/lab/cellular-automaton/`
- `/lab/event-pt/`
- `/feed.xml`
- `/sitemap.xml`
- `/404`（成果物は `dist/404.html`）

正規 URL は `https://gaato.net` です。

## License

- Code in this repository is licensed under the Blue Oak Model License 1.0.0. See `LICENSE.md`.
- Website content (text, images, and other creative assets) is All rights reserved unless explicitly noted otherwise.
