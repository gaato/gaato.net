---
title: RC-S380で空のNFCタグを読むまで
description: lsusbには見えるのにツールから使えないNFCリーダーを、権限、カーネルドライバの順にほどいた話。
date: "2026-07-06"
author: gaato
tags:
  - linux
  - hardware
layout: blog-post
---

手元に Sony の NFC リーダー RC-S380 があります。6月に、openSUSE Tumbleweed のデスクトップからこれを使えるようにして、上に置いてあったタグを読むところまでやりました。

`lsusb` では最初から見えています。

```
Bus 001 Device 010: ID 054c:06c3 Sony Corp. RC-S380
```

でも `pcsc_scan` はリーダーを待ち続けるし、`nfc-list` も見つけてくれません。USB として見えていることと、ツールから使えることは別の話でした。

PC/SC はあきらめて、nfcpy を試すことにしました。Python 環境を汚したくなかったので `uv run --with` の一時環境です。

```sh
uv run --with nfcpy --with pyusb --with libusb1 \
  python -c 'import nfc; clf = nfc.ContactlessFrontend("usb:054c:06c3"); print(clf); clf.close()'
```

最初の失敗は `PermissionError` でした。デバイスノードに触る権限がありません。ここで `MODE="0666"` にしてしまうのは避けて、udev の `uaccess` を使いました。ログイン中のユーザーにだけ ACL が付く形です。

```
SUBSYSTEM=="usb", ATTR{idVendor}=="054c", ATTR{idProduct}=="06c3", TAG+="uaccess"
```

ルールを置いて `udevadm control --reload-rules` と `udevadm trigger` をやり、`getfacl` で自分の ACL が付いたのを確認しました。

すると今度はエラーが変わって `Device or resource busy` になりました。権限の問題は解けて、別の誰かが先にデバイスを掴んでいます。`lsusb -t` を見ると `Driver=port100`。カーネルに RC-S380 用のドライバがいて、そっちがバインドしていました。

```sh
echo -n 1-10:1.0 | sudo tee /sys/bus/usb/drivers/port100/unbind
```

これで nfcpy がリーダーを開けるようになりました。インターフェイスのパスは環境と接続のたびに変わるので、これも使い回す前に `lsusb -t` で確認し直すものです。

肝心のタグは、Type 2 の NFC タグでした。NDEF フォーマット済みで中身は空、容量は 137 バイト、読み書き可能。`GET_VERSION` がタイムアウトしたので、IC の正確な型番までは分かりません。UID の先頭バイトから製造元の見当くらいは付くけれど、それ以上を UID だけで断定しないほうがいいです。

振り返ると、失敗が三層に分かれていたのがこの作業の分かりやすいところでした。見えない（ツールの経路が違う）、開けない（権限）、開けない（ドライバが先に掴んでいる）。エラーメッセージが `PermissionError` から `EBUSY` に変わった時点で、一段進んだと分かる。そういう進み方でした。
