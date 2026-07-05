---
title: zypper in godotが失敗した日
description: openSUSE TumbleweedでGodotの依存が壊れて見えたとき、直すべき場所がもう直っていた話。
date: "2026-07-06"
author: gaato
tags:
  - linux
  - opensuse
  - obs
layout: blog-post
---

ある日、Tumbleweed で Godot を入れようとして失敗しました。

```sh
sudo zypper in godot
```

エラーはこれです。

```text
nothing provides 'libmbedcrypto.so.16()(64bit)' needed by the to be installed godot-4.6.3-1.1.x86_64
```

こういうとき、手元の `zypper` だけ見ていると話を間違えます。ローカルの repo-oss にある `godot` は古い `libmbedcrypto.so.16` を要求している。でも、それが「自分の環境だけ古い」のか、「Tumbleweed のパッケージが壊れている」のか、「すでに直っていて手元の repo-oss だけ古いものを見ている」のかは、まだ分かりません。

OBS を見に行きました。

```sh
osc search --package godot
osc meta pkg openSUSE:Factory godot
osc results openSUSE:Factory godot -r standard -a x86_64 -V
```

この時点では、Factory 側もまだ失敗していました。ビルドログには `mbedtls/ctr_drbg.h` がない、というエラーが出ていました。

```text
modules/mbedtls/crypto_mbedtls.h:35:10: fatal error: mbedtls/ctr_drbg.h: No such file or directory
```

つまり、手元の repo-oss が古いものを見ているだけではなく、Factory の Godot も mbedTLS まわりでつまずいていた時期があった。

ただし、そこで自分が直す話にはなりませんでした。devel project の `games/godot` 側では、すでに submit request が出ていて、修正の方向も見えていました。

変更の方向は、Godot を新しい mbedTLS に無理に合わせることではありませんでした。Godot 側が期待している古い API に対して、mbedTLS を unbundle するのをやめる。spec では `mbedtls-devel` が有効な BuildRequires ではなくなり、`unbundle_libs` から `mbedtls` が外れ、`bundled(mbedtls) = 3.6.5` を提供する形に寄っていました。

これは少し悔しいけれど、妥当です。ディストリビューションとしてはできるだけ共有ライブラリを使いたい。でも、上流の想定とライブラリ側の ABI/API がずれているときに、無理に unbundle するとビルド不能になります。きれいな方針を通して壊すより、ここでは bundled に戻すほうが使えるパッケージになります。

翌日の recheck では、Factory 側の submit request は受理済みで、x86_64 のビルドも通っていました。

```text
Request: 1361601
submit: games/godot@c09a079... -> openSUSE:Factory
State: accepted 2026-06-25T08:57:38
```

一方で、手元の repo-oss はまだ `godot 4.6.3-1.1` を見ていて、dry-run install も同じ `libmbedcrypto.so.16` で落ちていた。

この時点で自分が投げるパッチはありませんでした。もう直っている。手元の repo-oss だけがまだ古い Godot を見ていた。

公開前にもう一度見ると、手元の Tumbleweed には `godot 4.7-2.1` が入っています。

```text
i+ | godot | package | 4.7-2.1 | x86_64 | repo-oss
```

`osc request show 1361601` でも accepted のままです。最初の失敗は本物でしたが、最後に必要だったのはパッチではなく、どの層まで直っているかを見分けることでした。

パッケージングを少し触っていると、壊れているものを見るとすぐ手を出したくなります。でも今回は、出る幕がなかった。そういう日もある。
