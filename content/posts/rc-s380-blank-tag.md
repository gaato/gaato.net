---
title: openSUSE TumbleweedでRC-S380をnfcpyから使う
description: RC-S380にuaccessで権限を付け、port100を一時的にunbindしてnfcpyから開いた。
date: "2026-07-06"
updated: "2026-08-29"
author: gaato
tags:
  - linux
  - hardware
layout: blog-post
---

Sony の NFC リーダー RC-S380 を openSUSE Tumbleweed につなぎました。`lsusb` にはいます。

```text
Bus 001 Device 010: ID 054c:06c3 Sony Corp. RC-S380
```

`pcsc_scan` はリーダーを待ち続け、`nfc-list` からも見つかりませんでした。今回は nfcpy を試します。Python パッケージは環境へ入れず、`uv run --with` で実行しました。

```fish
uv run --with nfcpy --with pyusb --with libusb1 \
  python -c 'import nfc; clf = nfc.ContactlessFrontend("usb:054c:06c3"); print(clf); clf.close()'
```

最初は `PermissionError` になりました。`/etc/udev/rules.d/99-sony-rcs380.rules` に次のルールを置き、ログイン中のユーザーへ `uaccess` で権限を付けました。

```udev
SUBSYSTEM=="usb", ATTR{idVendor}=="054c", ATTR{idProduct}=="06c3", TAG+="uaccess"
```

```fish
sudo udevadm control --reload-rules
sudo udevadm trigger
```

`getfacl` でデバイスノードの ACL を確認してもう一度開くと、今度は `Device or resource busy` になりました。

`lsusb -t` を見ると RC-S380 のインターフェイスに `Driver=port100` と出ています。nfcpy を使っている間だけ、カーネルの `port100` ドライバから外しました。

```fish
set iface 1-10:1.0
printf %s $iface | sudo tee /sys/bus/usb/drivers/port100/unbind >/dev/null
```

`1-10:1.0` はこのときの値です。USB ポートや接続順で変わるので、そのまま使わず `lsusb -t` で確認します。

unbind 後は nfcpy から開けました。手元のタグは Type 2 Tag として読めて、NDEF フォーマット済み、メッセージは空、容量 137 バイト、読み書き可能という状態でした。

`GET_VERSION` はタイムアウトしました。タグの IC が何かは特定できていません。

作業が終わったら、同じインターフェイスを `port100` に戻します。

```fish
printf %s $iface | sudo tee /sys/bus/usb/drivers/port100/bind >/dev/null
```

途中で USB を抜いた場合はパスが消えるので、この `bind` は失敗します。その場合は挿し直せば `port100` が再び bind されました。
