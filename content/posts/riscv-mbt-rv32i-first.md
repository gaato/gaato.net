---
title: MoonBitでRISC-Vエミュレータを書き始めた
description: 小さなRV32Iの命令列から始め、riscv-testsとQEMUで実装を確認できるところまで進めた。
date: "2026-07-06"
updated: "2026-08-29"
author: gaato
tags:
  - moonbit
  - riscv
layout: blog-post
---

[`riscv-mbt`](https://github.com/gaato/riscv-mbt) という RISC-V エミュレータを MoonBit で書き始めました。

目標は RV64GC で Linux を動かし、ブラウザからも使えるようにすることです。いきなりそこへ行くのは無理なので、最初は RV32I の小さい命令列を動かすところから始めました。

最初に作ったのは `CpuState`、`Bus`、命令の decode と execute、そして1命令ずつ実行する `Runner` です。手で並べた命令を実行して、レジスタとメモリの結果を `moon test` で見ました。未実装命令は何もしないのではなく trap させています。

RV32I が一通り動いたあと、upstream の `riscv-tests` を使い始めました。

```fish
./scripts/build-riscv-tests-official.sh
moon test
```

ここで、命令を実装しただけでは公式テストを動かせないことが分かりました。ELF をリンクされたアドレスへ置く処理、`env/p` が使う最低限の CSR と trap、テスト結果を書き込む `tohost` の監視も必要でした。

エミュレータ側で失敗したときに、ビルドした ELF 自体が悪いのかを分けるため、同じ `rv32ui-p-*` を `qemu-system-riscv32` でも実行しました。

```fish
./scripts/cross-check-official-rv32ui-with-qemu.pl
```

QEMU では `tohost` を monitor socket から監視しています。これは毎回のテストに必要なものではなく、公式バイナリを最初に通すときの比較用です。

その後は RV64、S-mode、Sv39、OpenSBI、Linux、ブラウザの Wasm ホストまで進みました。2026年8月29日の checkout では、Alpine の rootfs を動かす作業と RV64GC の仕様適合を進めています。最初に書いていた命令数やテスト通過数はすぐ古くなったので、この記事には残さないことにしました。

今の状態は [`docs/current.md`](https://github.com/gaato/riscv-mbt/blob/main/docs/current.md) にあります。ブラウザ版も公開しています。

- [riscv-mbt](https://github.com/gaato/riscv-mbt)
- [browser demo](https://gaato.github.io/riscv-mbt/)
