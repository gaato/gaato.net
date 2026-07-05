---
title: Debian woodyのインストーラがDHCP後に止まった
description: Debian woodyとGNU/Hurdをlibvirtで動かして、古いVMと古いパッケージ集合に付き合った話。
date: "2026-07-06"
author: gaato
tags:
  - linux
  - vm
layout: blog-post
---

Debian woody を仮想マシンで動かしたくなりました。2002年の Debian です。最初に考えたのは、何で起動するかでした。

`systemd-vmspawn` も候補にはありました。でも、これは今の systemd や mkosi の空気に近い道具です。2002年のインストーラを動かすなら、もう少し古い PC っぽい形に寄せたほうがよさそうでした。結局 `libvirt` にしました。

CPU は `pentium`、ディスクと CD-ROM は IDE、NIC は `rtl8139`、ビデオは `cirrus`、ACPI と APIC は off、メモリは 256 MiB。こういう指定をしていると、エミュレータというより時代設定をしている感じがあります。

ISO は Debian の archive から取りました。

```text
debian-30r6-i386-binary-1.iso
MD5: 3735a23e34c8213581579ebf816457e9
```

インストーラは起動しました。`cfdisk` は素っ気ないし、`mke2fs` は一文字ずつゆっくり進む。そのへんは楽しいです。楽しいんだけど、途中で灰色の please wait が出たまま動かなくなる。

画面だけ見ていても分かりません。そこでホスト側から見ます。

```sh
sudo virsh -c qemu:///system dominfo debian-woody
sudo virsh -c qemu:///system domblklist debian-woody
sudo virsh -c qemu:///system screenshot debian-woody /tmp/debian-woody-net-hang.png
sudo virsh -c qemu:///system domstats debian-woody --block
sudo tail -n 200 /var/log/libvirt/qemu/debian-woody.log
```

一度は CD-ROM が外れた扱いになっていました。

```text
Boot failed: Could not read from CDROM (code 0003)
```

これは `virsh change-media` で入れ直しました。問題は別にもありました。DHCP/BOOTP が成功したあと、continue を押すと進まない。ホスト側で見ると CPU 時間は増えているのに、ディスクのカウンタは動いていない。電源が落ちたわけではなく、インストーラのどこかで回っている。

最後は NIC を外しました。

```sh
sudo virsh -c qemu:///system destroy debian-woody || true
sudo virsh -c qemu:///system detach-interface debian-woody \
  --type network --mac <VM_MAC> --config || true
sudo virsh -c qemu:///system start debian-woody
```

ネットワークが成功しているのに、ネットワークを外すと先に進む。少なくともこの構成では、成功したネットワーク設定が次の詰まりになっていました。

待っている間に、Debian GNU/Hurd も動かすことにしました。

> 今思いついたんだけど、Debian GNU/Hurd動かしませんか

Hurd は netinst ISO ではなく、Debian ports の preinstalled image を使いました。起動はしました。SSH もできました。

```text
GNU debian 0.9 GNU-Mach 1.8+git20260224-up-486/Hurd-0.9 i686-AT386
This is the GNU Hurd. Welcome.
```

ここまでは思ったよりちゃんとしています。けれど、使える作業場になるかというと別です。`fish` を入れようとすると、`fish` は `fish-common (= 2.2.0-3)` を要求するのに、`fish-common` の候補は `4.2.1-3.2` でした。`libncurses5` と `libtinfo5` の候補もない。`bun` はインストールスクリプト自体は走りますが、落ちてきた Linux バイナリは実行できません。

```text
cannot execute binary file: 実行形式エラー
```

`npm` も依存で止まりました。

```text
npm : depends: nodejs:any but none of the choices are installable
```

Linux バイナリが動かないのは分かります。そこはしょうがない。でも、そうではないところでパッケージの整合性が崩れていると、もう少し頑張ってほしい気持ちになります。fish が入らない時点で、自分の作業場にはなりません。

最後は、これを手伝うべきかという話になりました。

> Hurdの開発手伝っちゃう？

> 果たしてその労力は報われるのでしょうか

Hurd は面白いです。Haiku も面白い。古い Debian を VM に閉じ込めるのも面白い。ただ、自分が日常で使っていて、直すとすぐ返ってくるものは openSUSE のほうです。OSS は好きだけど、別に FSF 信者というわけでもない。

まあ、実利を考えれば普通に openSUSE やってろ？
