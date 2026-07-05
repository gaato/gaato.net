---
title: Pagesの後ろにいたWorkerをやめた
description: gaato.netをCloudflare Workers Static Assetsへ寄せたときの、アプリより制御面が面倒だった話。
date: "2026-07-05"
author: gaato
tags:
  - web
  - cloudflare
layout: blog-post
---

gaato.net は、以前 Cloudflare Pages に置いた `dist` を Worker で受ける形になっていました。動いてはいたけれど、冷静に見ると変です。静的ファイルを出したいだけなのに、Pages と Worker の両方を通っている。

Cloudflare Workers Static Assets があるなら、Worker 自身に `dist` を載せればいい。そう考えて、Pages の後ろにいたプロキシ Worker をやめました。

アプリ側の変更はそこまで大きくありません。Vite と MoonBit/Wasm で作ったサイトをビルドして、Wrangler で Worker にアップロードする。GitHub Actions も Pages deploy から `wrangler deploy` に変える。PR では preview Worker を作り、main では本番 Worker を更新する。

面倒だったのは、アプリではなく Cloudflare 側の状態でした。

Terraform は `gaato.net/*` のルートを管理していました。ところが apply の途中で、古い route の state と Cloudflare API 側の実体が噛み合わず、`404 Not Found` で止まりました。Worker のデプロイ自体はできている。問題は、どの Worker をどのルートに結びつけるかという制御面です。

結局、壊れていた route だけを `terraform state rm` で外し、もう一度 apply して作り直しました。雑に全部を消すのではなく、壊れている state の持ち方だけを捨てた形です。

この作業で分かったのは、静的サイトの移行でも「静的ファイルをどこに置くか」だけでは終わらないことです。DNS、ルート、CI、Wrangler の互換日付、Terraform state、404 の挙動。小さいサイトでも、公開面に出るものはそれなりにあります。

ただ、最終形は前より素直です。`dist` を作る。Worker に載せる。ルートは Terraform が指す。Pages は間にいない。あとから見たときに説明しやすい形になったので、これは直してよかったです。
