---
title: Ctrlが押しっぱなしになる犯人はマウスだった
description: KDE WaylandでCtrl+Cが押されたままになり、evdevを調べるとLogitech G304がキーを保持していた。
date: "2026-07-06"
updated: "2026-08-29"
author: gaato
tags:
  - linux
  - hardware
layout: blog-post
---

5月ごろから、たまに修飾キーが押しっぱなしになったような動作が起きていました。

- クリックの動作が変になる
- `c` が入力できない
- キーボードを接続し直しても直らない
- 再起動すると直る

環境は KDE Plasma の Wayland セッションです。KWin、KAccess の固定キー、fcitx5 などを疑っていました。

もう一度発生したとき、今回は再起動せずに別の端末から SSH で入りました。evdev の押下状態を調べると、こうなっていました。

```text
/dev/input/event18 Logitech G304 pressed: KEY_LEFTCTRL, KEY_C
```

`KEY_LEFTCTRL` と `KEY_C` を保持していたのは HHKB ではなくマウスの Logitech G304 でした。キーボードを抜いても直らなかったわけです。

udev 上でも、G304 には `ID_INPUT_MOUSE=1` と `ID_INPUT_KEYBOARD=1` の両方が付いていました。ボタンへキー入力を割り当てられるので、入力デバイスとしてはキーボードでもあります。

該当する USB インターフェイスを一度 unbind して、bind し直すと復旧しました。

```fish
set iface 1-12:1.2
printf %s $iface | sudo tee /sys/bus/usb/drivers/usbhid/unbind >/dev/null
sleep 1
printf %s $iface | sudo tee /sys/bus/usb/drivers/usbhid/bind >/dev/null
```

`1-12:1.2` はそのときの値です。USB ポートや再起動で変わるので、`/proc/bus/input/devices` と sysfs を見て G304 のインターフェイスであることを確認してから使います。違う値を unbind すると、そのデバイスが一時的に使えなくなります。

solaar や input-remapper のようなリマッパは動いていませんでした。マウスのオンボードプロファイルが原因なのか、レシーバや firmware の状態なのかは分かっていません。ひとまずオンボードプロファイルを無効にして様子を見ています。
