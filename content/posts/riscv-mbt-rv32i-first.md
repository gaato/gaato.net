---
title: ブラウザでLinuxを動かす前にRV32Iから始める
description: MoonBit製RISC-Vエミュレータを、最初からLinuxブートではなく小さいISAマイルストーンに分けた話。
date: "2026-07-06"
author: gaato
tags:
  - moonbit
  - riscv
  - ai
layout: blog-post
---

`riscv-mbt` は、MoonBit で書いている RISC-V エミュレータです。

最初の欲望は分かりやすいものでした。MoonBit で RV64GC のエミュレータを書いて、ブラウザ上で Linux をブートする。言うだけなら最高です。こういうのは、目標だけ置くとだいたい気持ちよくなって終わります。

途中で、少し言い方を変えました。

> でもプロジェクトの目的を単にMoonBit製のRISC-Vエミュレーターとして、最終的な副産物としてLinuxをブート、とするのもいいかもしれないですね

この変更は地味ですが、かなり大きかったです。Linux ブートが主目的だと、最初の一歩が大きすぎる。エミュレータとして進めるなら、`RV32I` を最初のマイルストーンにできます。

> まずはRV32Iを一つのマイルストーンにして、少しずつ拡張をマイルストーンにしましょう

この時点で、AI に頼むこともコードだけではなくなりました。

> というのを、後でAIがわかりやすいような仕組みを作るところまでやってください

つまり、実装より先に、後から読み直せる足場を作る。`README.md`、`docs/current.md`、`docs/roadmap.md`、`docs/milestones/`、`docs/tasks/`、`docs/adr/`、`AGENTS.md`。人間向けのドキュメントというより、未来の自分と未来のエージェントが、毎回プロジェクトの前提を決め直さないためのファイル群です。

この手の side project は、途中で忘れます。忘れたあとに戻ってきたとき、「何ができていて、次に何をするのか」が1ファイルで分からないと、その日は復帰だけで終わる。AI エージェントを使うならなおさらです。毎回コンテキストを長文で渡すより、リポジトリの中に読ませる順番を置いておくほうがいい。

最初の検査対象も、夢ではなく小さい実行可能なものにしました。`moon test` と `riscv-tests` を通す、という形です。

```sh
moon test
./scripts/build-riscv-tests-official.sh
```

`RV32I` を最初の境界にして、`riscv-tests` の official subset を読み、QEMU と照らせるところは照らす。ブラウザは後です。Linux も後です。まず、整数命令をちゃんと動かす。

その後、プロジェクトは捨てずに続きました。公開前に見た README には、`RV32IMC`、official `riscv-tests`、RV64、Linux boot platform integration、browser delivery milestone まで並んでいます。公開している smoke demo もあります。

```text
https://gaato.github.io/riscv-mbt/
```

もちろん、これで完成ではありません。手元の checkout ではまだ先の作業が続いています。post-Linux の互換性、`F`/`D`、vector extension まわりの整理など、まだ終わっていないところはあります。

それでも、最初に Linux ブートを副産物に降格したのは正しかったと思います。大きいデモを捨てたわけではありません。順番を変えただけです。

このリポジトリでは、派手なスクリーンショットより先に `docs/current.md` を置いたのが効きました。地味です。でも、戻ってきたときに助かるのはそっちでした。
