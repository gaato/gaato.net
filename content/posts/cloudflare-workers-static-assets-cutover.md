---
title: gaato.netをCloudflare PagesからWorkers Static Assetsへ移した
description: Pagesの前にWorkerを置いていた構成をWorkers Static Assetsへ移し、Terraformのroute stateを直した。
date: "2026-07-05"
updated: "2026-08-29"
author: gaato
tags:
  - web
  - cloudflare
layout: blog-post
---

gaato.net は Cloudflare Pages から配信していました。その前にプロキシ用の Worker もいたので、静的サイトなのに Pages と Worker の両方を使っていました。

Workers Static Assets なら Worker と一緒に `dist` を配信できます。Pages をやめて、`gaato-net` Worker に静的ファイルを持たせることにしました。

`wrangler.jsonc` はこうしました。

```json
{
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

GitHub Actions のデプロイも Pages から `wrangler deploy` に変更しました。Pull Request では `gaato-net-pr-<PR番号>`、main では `gaato-net` をデプロイします。

Worker のデプロイまでは通りましたが、Terraform で管理している `gaato.net/*` の route を apply すると `404 Not Found` で止まりました。Cloudflare API 側の状態と、Terraform に残っていた古い state が合っていなかったようです。

Worker はすでにできていたので、route だけを `terraform state rm` で state から外しました。そのあとでもう一度 apply すると route が作り直されました。

現在は `dist` を Worker から配信し、`gaato.net/*` をどの Worker へ向けるかだけを別の Terraform リポジトリで管理しています。
