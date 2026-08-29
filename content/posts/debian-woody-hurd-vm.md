---
title: Debian woodyのインストーラがDHCPのあとで止まった（GNU/Hurdも少しだけ）
description: Debian woodyのインストーラがDHCP後に進まなくなったのでNICを外した。待っている間にGNU/Hurdも少し起動した。
date: "2026-07-06"
updated: "2026-08-29"
author: gaato
tags:
  - linux
  - vm
layout: blog-post
---

Debian woody のインストーラを libvirt で起動しました。使ったのは archive にある `debian-30r6-i386-binary-1.iso` です。

```text
MD5: 3735a23e34c8213581579ebf816457e9
```

VM は CPU を `pentium`、ディスクと CD-ROM を IDE、NIC を `rtl8139`、ビデオを `cirrus` にして、ACPI と APIC は切りました。メモリは 256 MiB です。

最初に止まったときは CD-ROM が外れた扱いになっていました。

```text
Boot failed: Could not read from CDROM (code 0003)
```

これは `virsh change-media` で入れ直しました。

次はネットワーク設定で止まりました。DHCP/BOOTP 自体は成功します。しかし、そのあとの画面で `continue` を押しても灰色の `please wait` から進みません。

別の端末から状態を見ました。

```fish
sudo virsh -c qemu:///system dominfo debian-woody
sudo virsh -c qemu:///system domblklist debian-woody
sudo virsh -c qemu:///system screenshot debian-woody /tmp/debian-woody-net-hang.png
sudo virsh -c qemu:///system domstats debian-woody --block
sudo tail -n 200 /var/log/libvirt/qemu/debian-woody.log
```

CPU 時間は増えていましたが、ディスクのカウンタは動いていませんでした。何を待っていたのかまでは分かっていません。

NIC を外して起動し直すと、インストーラは先へ進みました。

```fish
sudo virsh -c qemu:///system domiflist debian-woody
set vm_mac 52:54:00:12:34:56 # domiflist に表示された値
sudo virsh -c qemu:///system destroy debian-woody
sudo virsh -c qemu:///system detach-interface debian-woody \
  --type network --mac $vm_mac --config
sudo virsh -c qemu:///system start debian-woody
```

## GNU/Hurdも少しだけ

woody を待っている間に、Debian ports の GNU/Hurd preinstalled image も起動しました。SSH で入るところまでは動きました。

```text
GNU debian 0.9 GNU-Mach 1.8+git20260224-up-486/Hurd-0.9 i686-AT386
This is the GNU Hurd. Welcome.
```

ただ、パッケージを入れようとすると依存関係が揃いませんでした。`fish` は `fish-common (= 2.2.0-3)` を要求しますが、見えていた候補は `4.2.1-3.2` でした。`libncurses5` と `libtinfo5` にも候補がありませんでした。

`bun` のインストールスクリプトが落としてきたものは Linux バイナリなので、Hurd では動きませんでした。

```text
cannot execute binary file: 実行形式エラー
```

`npm` も `nodejs` の依存関係で止まりました。

```text
npm : depends: nodejs:any but none of the choices are installable
```

Hurd は起動して SSH で入れたところで満足して、この日は終わりにしました。
