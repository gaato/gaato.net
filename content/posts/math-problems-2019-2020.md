---
title: 2019–2020年に作った数学の問題
description: 2019年から2020年に作った数学の問題を、解き直してまとめた。
date: "2026-08-30"
updated: "2026-08-30"
author: gaato
tags:
  - math
layout: blog-post
---

2019年から2020年にXへ投稿した問題と、数学を愛する会の模試に採用された問題を、見直してまとめた。

## 問題

1. [模試 第1問](#masulava-1)
2. [模試 第5問](#masulava-5)
3. [平方数](#integer-square)
4. [不定積分](#indefinite-integral)
5. [因数分解](#factorization)
6. [漸化式](#recurrence)
7. [最小値](#minimum)
8. [定積分](#definite-integral)
9. [領域](#region)
10. [3つの級数](#three-series)
11. [関数と逆関数](#inverse-function)

## ますらば会長への挑戦模試

<h3 id="masulava-1">模試 第1問</h3>

正整数 $x,y,z$ が

$$
x^3+y^2=z^2
$$

を満たすとき、$xyz$ 空間内に原点と $(x^3,y^2,z^2)$ を通る直線を引く。このようにして相異なる直線を無限本引けることを示せ。

<p class="problem-source"><time datetime="2019-12-24">2019-12-24</time> · 原案：がーと、協力：みゆ · <a href="https://x.com/mathlava/status/1209452919843483648">公開告知</a> · <a href="https://note.com/mathlava/n/nac9cc329ec21">数学を愛する会の記事</a></p>

<details>
<summary>解答</summary>

$n\geq 2$ に対して

$$
x=n,\qquad
y=\frac{n(n-1)}2,\qquad
z=\frac{n(n+1)}2
$$

とおく。このとき

$$
z^2-y^2=(z-y)(z+y)=n\cdot n^2=n^3=x^3
$$

なので、どの $n$ からも条件を満たす正整数の組が得られる。

さらに、対応する直線上では第2成分と第3成分の比が

$$
\frac{y^2}{z^2}=\left(\frac{n-1}{n+1}\right)^2
$$

となる。この値は $n\geq 2$ で単調に増加するので、異なる $n$ から得られる直線は相異なる。したがって、そのような直線は無限本存在する。

</details>

<h3 id="masulava-5">模試 第5問</h3>

$$
-\frac{\pi}{4}<x<\frac{\pi}{4}
$$

において、次の不等式を示せ。

$$
\frac{x}{1+x}\leq\tan x\leq\frac{x}{1-x}
$$

<p class="problem-source"><time datetime="2019-12-24">2019-12-24</time> · 作問：がーと · <a href="https://x.com/mathlava/status/1209452919843483648">公開告知</a> · <a href="https://note.com/mathlava/n/nac9cc329ec21">数学を愛する会の記事</a></p>

<details>
<summary>解答</summary>

#### 平均値の定理による証明

$0<x<\pi/4$ とする。$f(t)=\sin t$ に平均値の定理を区間 $[\pi/4-x,\pi/4+x]$ で使うと、ある $c$ が存在して

$$
\frac{\sin(\pi/4+x)-\sin(\pi/4-x)}{2x}
=\cos c,
\qquad
\frac{\pi}{4}-x<c<\frac{\pi}{4}+x
$$

となる。区間 $(0,\pi/2)$ で $\cos t$ は減少するので、

$$
\cos\left(\frac{\pi}{4}+x\right)
<
\frac{\sin x}{\sqrt2\,x}
<
\cos\left(\frac{\pi}{4}-x\right).
$$

両辺を整理すると

$$
-1<\frac1x-\frac1{\tan x}<1
$$

であり、ここから

$$
\frac{x}{1+x}<\tan x<\frac{x}{1-x}
$$

を得る。$x=0$ では等号が成り立ち、$x<0$ の場合は $\tan x$ の奇関数性から従う。

#### 積分による証明

$0<x<1$ とする。$0\leq t\leq x$ では

$$
1-t\leq\cos t\leq1+t
$$

であり、各辺は正なので

$$
\frac1{(1+t)^2}
\leq\frac1{\cos^2t}
\leq\frac1{(1-t)^2}
$$

が成り立つ。$0$ から $x$ まで積分すると

$$
\frac{x}{1+x}\leq\tan x\leq\frac{x}{1-x}
$$

を得る。$x=0$ では等号が成り立ち、$-1<x<0$ の場合も $\tan x$ の奇関数性から従う。したがって、この証明では実際には $-1<x<1$ で不等式が成り立つ。

</details>

## #がーとの自作問題

<h3 id="integer-square">平方数</h3>

任意の自然数 $k$ について、

$$
\sqrt{n^2+3k^3+6k}
$$

が整数となる自然数 $n$ が少なくとも1つ存在することを示せ。ここでは自然数を正の整数とする。

<p class="problem-source"><time datetime="2019-06-19">2019-06-19</time> · <a href="https://x.com/gaato__/status/1141322974974230528">元の投稿</a></p>

<details>
<summary>解答</summary>

$k\geq 3$ のとき、

$$
n=\frac{(k-1)(k-2)}2,\qquad
m=\frac{(k+1)(k+2)}2
$$

とおく。すると

$$
m^2-n^2=(m-n)(m+n)=3k(k^2+2)=3k^3+6k
$$

なので

$$
n^2+3k^3+6k=m^2.
$$

$k=1$ では $(n,m)=(4,5)$、$k=2$ では $(n,m)=(8,10)$ とすればよい。

</details>

<h3 id="indefinite-integral">不定積分</h3>

$x>0$ として、次の不定積分を求めよ。

$$
\int \sin x\left(\ln x-\frac1{x^2}\right)\,dx
$$

<p class="problem-source"><time datetime="2019-07-20">2019-07-20</time> · <a href="https://x.com/gaato__/status/1152592064443383808">元の投稿</a></p>

<details>
<summary>解答</summary>

部分積分と

$$
\left(\frac{\sin x}{x}\right)'
=\frac{\cos x}{x}-\frac{\sin x}{x^2}
$$

を使うと、

$$
\begin{aligned}
\int \sin x\ln x\,dx
&=-\cos x\ln x+\int\frac{\cos x}{x}\,dx,\\
-\int\frac{\sin x}{x^2}\,dx
&=\frac{\sin x}{x}-\int\frac{\cos x}{x}\,dx.
\end{aligned}
$$

したがって、

$$
\int \sin x\left(\ln x-\frac1{x^2}\right)\,dx
=-\cos x\ln x+\frac{\sin x}{x}+C.
$$

</details>

<h3 id="factorization">因数分解</h3>

次の式を因数分解せよ。

$$
x^{10}+x^6+x^3-x+1
$$

<p class="problem-source"><time datetime="2019-07-27">2019-07-27</time> · <a href="https://x.com/gaato__/status/1154992918240698368">元の投稿</a></p>

<details>
<summary>解答</summary>

$$
\begin{aligned}
x^{10}+x^6+x^3-x+1
&=(x^4-x+1)(x^6+x^3+1).
\end{aligned}
$$

右辺を展開すると、$x^7$ と $x^4$ の項がそれぞれ打ち消し合う。

</details>

<h3 id="recurrence">漸化式</h3>

$$
a_1=\frac12,\qquad a_{n+1}=2a_n(a_n+1)
$$

で定まる数列の一般項 $a_n$ を求めよ。

<p class="problem-source"><time datetime="2019-07-30">2019-07-30</time> · <a href="https://x.com/gaato__/status/1156154993168175105">元の投稿</a></p>

<details>
<summary>解答</summary>

$b_n=2a_n+1$ とおくと、

$$
b_{n+1}=4a_n(a_n+1)+1=(2a_n+1)^2=b_n^2.
$$

$b_1=2$ なので

$$
b_n=2^{2^{n-1}}.
$$

したがって、

$$
a_n=\frac{2^{2^{n-1}}-1}{2}.
$$

</details>

<h3 id="minimum">最小値</h3>

$x\geq 0$ かつ

$$
(x^2-4y^2-4)(x^2-12x+y+32)\geq 0
$$

を満たす実数 $x,y$ について、$x-y$ の最小値を求めよ。

<p class="problem-source"><time datetime="2019-08-05">2019-08-05</time> · <a href="https://x.com/gaato__/status/1158339354789462019">元の投稿</a></p>

<details>
<summary>解答</summary>

積の2つの因子がともに0以上の場合と、ともに0以下の場合に分ける。

まず

$$
x^2-4y^2-4\geq 0
$$

ならば、$x\geq0$ より $x\geq2\sqrt{y^2+1}$ である。したがって

$$
x-y\geq2\sqrt{y^2+1}-y\geq\sqrt3.
$$

最後の不等式は

$$
3\left(y-\frac1{\sqrt3}\right)^2\geq0
$$

から分かる。

一方、

$$
x^2-12x+y+32\leq0
$$

ならば

$$
x-y\geq x^2-11x+32
=\left(x-\frac{11}{2}\right)^2+\frac74
\geq\frac74>\sqrt3.
$$

$x=4/\sqrt3,\ y=1/\sqrt3$ のとき最初の因子が0となり、$x-y=\sqrt3$ である。よって最小値は

$$
\sqrt3
$$

である。

</details>

<h3 id="definite-integral">定積分</h3>

次の定積分を求めよ。

$$
\int_0^\pi\frac{\sin x}{e^x+e^{\pi/2}}\,dx
$$

<p class="problem-source"><time datetime="2019-08-18">2019-08-18</time> · <a href="https://x.com/gaato__/status/1163040492679917568">元の投稿</a></p>

<details>
<summary>解答</summary>

$x=\pi/2+t$ とおくと、

$$
I=e^{-\pi/2}\int_{-\pi/2}^{\pi/2}\frac{\cos t}{1+e^t}\,dt.
$$

被積分関数を $g(t)$ とすると

$$
g(t)+g(-t)
=\cos t\left(\frac1{1+e^t}+\frac1{1+e^{-t}}\right)
=\cos t.
$$

したがって、

$$
I=e^{-\pi/2}\int_0^{\pi/2}\cos t\,dt=e^{-\pi/2}.
$$

</details>

<h3 id="region">領域</h3>

次の不等式が表す領域を図示せよ。

$$
x^4-4x^3y+2x^2y^2-4xy^3+y^4<0
$$

<p class="problem-source"><time datetime="2019-08-31">2019-08-31</time> · <a href="https://x.com/gaato__/status/1167700659279319041">元の投稿</a></p>

<details>
<summary>解答</summary>

左辺は

$$
(x^2+y^2)(x^2-4xy+y^2)
$$

と因数分解できる。$x^2+y^2\geq0$ なので、求める条件は

$$
x^2-4xy+y^2<0.
$$

$x=0$ では成立しない。$x\neq0$ として $x^2$ で割ると、

$$
2-\sqrt3<\frac yx<2+\sqrt3.
$$

したがって、直線 $y=(2-\sqrt3)x$ と $y=(2+\sqrt3)x$ に挟まれた、原点について対称な2つの開いた扇形が答えである。境界線と原点は含まない。

<figure class="region-figure">
<svg viewBox="-112 -112 224 224" role="img" aria-labelledby="region-title region-description">
<title id="region-title">不等式が表す2つの領域</title>
<desc id="region-description">原点を通る傾き2引くルート3と2足すルート3の2直線に挟まれた、右上と左下の開いた扇形。</desc>
<polygon class="region-fill" points="0,0 96.6,-25.9 25.9,-96.6"></polygon>
<polygon class="region-fill" points="0,0 -96.6,25.9 -25.9,96.6"></polygon>
<line class="region-axis" x1="-105" y1="0" x2="105" y2="0"></line>
<line class="region-axis" x1="0" y1="-105" x2="0" y2="105"></line>
<line class="region-boundary" x1="-96.6" y1="25.9" x2="96.6" y2="-25.9"></line>
<line class="region-boundary" x1="-25.9" y1="96.6" x2="25.9" y2="-96.6"></line>
<text class="region-label" x="102" y="-4">x</text>
<text class="region-label" x="4" y="-102">y</text>
</svg>
<figcaption>破線は境界であり、領域には含まれない。</figcaption>
</figure>

</details>

<h3 id="three-series">3つの級数</h3>

色の規則も含めて一般項を読み取り、3つの級数の和を求めよ。

<div class="pattern-series" aria-hidden="true">

$$
\frac{\color{patternred}{2}}{10}
+\frac{\color{patternblue}{1}}{\color{patternred}{2}00}
+\frac{\color{patternred}{4}}{\color{patternblue}{3}000}
+\frac{\color{patternblue}{3}}{\color{patternred}{4}0000}
+\cdots=?
$$

$$
\frac{\color{patternblue}{2}}{10}
+\frac{\color{patternblue}{2}}{\color{patternblue}{3}00}
+\frac{\color{patternred}{6}}{\color{patternred}{5}000}
+\frac{\color{patternred}{6}}{\color{patternred}{7}0000}
+\cdots=?
$$

$$
\frac{\color{patternred}{2}}{10}
+\frac{\color{patternred}{2}}{\color{patterngreen}{3}00}
+\frac{\color{patternmagenta}{4}}{\color{patterngreen}{3}000}
+\frac{\color{patternmagenta}{4}}{\color{patternyellow}{5}0000}
+\cdots=?
$$

</div>

<div class="visually-hidden">
<p>1つ目は、2/10の分子2、1/200の分母の先頭2、4/3000の分子4、3/40000の分母の先頭4が赤。1/200の分子1、4/3000の分母の先頭3、3/40000の分子3が青。</p>
<p>2つ目は、2/10と2/300の分子2、および2/300の分母の先頭3が青。6/5000と6/70000の分子6、およびそれぞれの分母の先頭5と7が赤。</p>
<p>3つ目は、2/10と2/300の分子2が赤。2/300と4/3000の分母の先頭3が緑。4/3000と4/50000の分子4がマゼンタ。4/50000の分母の先頭5が黄。</p>
</div>

<p class="problem-source"><time datetime="2019-10-17">2019-10-17</time> · <a href="https://x.com/gaato__/status/1184770972320063489">元の投稿</a> · <a href="https://x.com/diegorattaggi/status/1183814592708993024">着想元：Diego Rattaggi</a></p>

<details>
<summary>解答</summary>

1つ目を $S_1$ とする。色から読み取れる一般項は

$$
S_1
=\sum_{n=1}^{\infty}
\left(
\frac{2n}{(2n-1)10^{2n-1}}
+\frac{2n-1}{2n\,10^{2n}}
\right).
$$

これを分けると

$$
S_1
=\sum_{m=1}^{\infty}\frac1{10^m}
+\sum_{m=1}^{\infty}\frac{(-1)^{m+1}}{m10^m}
=\frac19+\ln\frac{11}{10}.
$$

2つ目を $S_2$ とすると、

$$
S_2
=\sum_{n=1}^{\infty}
\left(
\frac{4n-2}{(4n-3)10^{2n-1}}
+\frac{4n-2}{(4n-1)10^{2n}}
\right).
$$

$u=1/\sqrt{10}$ とおけば、

$$
S_2
=\frac19+u^2-\frac{u^4}{3}+\frac{u^6}{5}-\cdots
=\frac19+u\arctan u
=\frac19+\frac1{\sqrt{10}}\arctan\frac1{\sqrt{10}}.
$$

3つ目を $S_3$ とすると、

$$
S_3
=\sum_{n=1}^{\infty}
\left(
\frac{2n}{(2n-1)10^{2n-1}}
+\frac{2n}{(2n+1)10^{2n}}
\right).
$$

$r=1/10$ とおけば、

$$
\begin{aligned}
S_3
&=\frac19+\operatorname{artanh}r
-\left(\frac{\operatorname{artanh}r}{r}-1\right)\\
&=\frac{10}{9}-\frac92\ln\frac{11}{9}.
\end{aligned}
$$

</details>

<h3 id="inverse-function">関数と逆関数</h3>

区間 $I\subset\mathbb R$ で定義され、逆関数が存在する連続関数 $f$ が $I$ の内部で微分可能であり、

$$
f'(x)\neq-1
$$

を満たすとする。このとき、曲線 $y=f(x)$ と $y=f^{-1}(x)$ の交点は直線 $y=x$ 上以外に存在しないことを示せ。

<p class="problem-source"><time datetime="2020-08-05">2020-08-05</time> · <a href="https://x.com/gaato__/status/1290980874041749504">元の投稿</a></p>

<details>
<summary>解答</summary>

2曲線が $y=x$ 上でない点 $(a,b)$ で交わったと仮定する。このとき

$$
f(a)=b,\qquad f(b)=a,\qquad a\neq b.
$$

$a<b$ としてよい。$f$ は $[a,b]$ で連続、$(a,b)$ で微分可能なので、平均値の定理から、ある $c\in(a,b)$ が存在して

$$
f'(c)=\frac{f(b)-f(a)}{b-a}
=\frac{a-b}{b-a}=-1
$$

となる。これは仮定に反する。

</details>
