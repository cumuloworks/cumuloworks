---
title: "Ryzen 9 5950X 初期不良を引いた話。"
description: "Ryzen 9 5950Xで初期不良を引いたときのログ。"
date: "2024-07-18"
category: "techtips"
---

Ryzen 9 5950Xで初期不良を引いたときのログ。

結局トラブルシューティングが終わるまで1ヶ月かかり、夜も眠れない日が続いたのだった…。

## Specification

```plaintext
CHA : Fractal Design Define 7 XL cumulo Light TG
CPU : AMD Ryzen 9 5950X
M/B : MSI Prestige X570 CREATION E-ATX
RAM : 128GB (4x 32GB DDR4-3600MHz CL18)
GPU : 2x NVIDIA GeForce RTX 3090 (24GB)
SSD : CORSAIR M.2 SSD Force MP600 2TB
PSU : Corsair AX1600i (1600W)
```

## Symptom

The machine restarts several minutes after Windows 10 startup without BSOD.

Windowsが起動してから数分～数十分で、ブルースクリーンなしにいきなり再起動する。

イベントビューアーを見たところ、WHEA-LoggerがEvent ID 18のエラー。

A fatal hardware error has occurred.

Reported by component: Processor Core

Error Source: Machine Check Exception

Error Type: Cache Hierarchy Error

Processor APIC ID: 12

The details view of this entry contains further information.

（APIC IDというのはCPUのコアのIDのことで、12や0で多く発生した。）

## Trouble Shooting

### BIOS

真っ先に疑ったのはBIOS。最新の安定版・β版へと段階的にアップデートして試したが、改善しない。マザーボードメーカー(MSI)に問い合わせ、少なくとも最新の安定版ではRyzen 5000シリーズに対応していることを確認した。

### メモリ

次にメモリ周りを疑った。両面実装の32GBメモリを4枚指しているのが原因の可能性があった。

メモリは定格クロックで、評判の良いG.Skillのものなのでまず問題ないはずと考えつつも、一応違う組み合わせで2枚(64GB)に減らしてみても変化なし。さらに他のマシンからCrucial製のものを載せ替えても変化なし。これでメモリ自体の不良の可能性は消える。

### 電源

電源は1600W電源なのでまず問題ないはず。コンセントの電圧が不安定な可能性もあると思い、いくつか系統を変えて試したが効果なし。

一応、EPS 8-pinケーブルをCablemodからちょうど届いたものに交換したが、改善しない。そもそも1600W電源からEPS 8pinを2本引いているので足りない訳がない。

### グラフィックボード

関係ないとは思いつつ、グラフィックボードを1枚にしたが、やはり改善しない。

### SSD・OS

いつもBIOSではなくWindows起動後に落ちることから、Windows側の不具合の可能性もあると考え、OSのクリーンインストールを試みる。しかし、USBからインストーラーをブートした時点で落ちてしまう。SSDやOSの可能性もこれで消える。

### マザー or CPU ?

友人のアドバイスで、CPUを2500MHzまでアンダークロックしたところ、なんと安定動作することに気づいた（！）

この段階で、マザーの不具合でCPUの電圧・クロックのコントロールがなにかおかしいか、CPUそのものがおかしいかという2択になった。

## CPUに確定

さらにその友人にお古のRyzen 9 3950Xを借りて載せ替えてみたところ、問題なく動作した。

Ryzen 9 3950XとRyzen 9 5950Xはスペックがかなり似ているので、マザーの不具合ならば同じ症状が出てもおかしくないはずで、これによりCPUの初期不良が確定した。

## その後

販売店へ返送・交換手続きを行ってからは問題なく動作している。（マジで初期不良を引いたんか...）
