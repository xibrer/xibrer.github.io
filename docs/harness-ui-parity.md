# 与 DeepSeek Harness 落地页的 UI 对齐清单

参考页：<https://www.deepseek.com/harness/en/>
本仓库：`xibrer.github.io`（PRISM 系学术主页，玻璃拟态）

> 本文档基于参考页的实际产物逆向得出：CSS bundle
> `6f322bb0cffe2c36.css`、页面 HTML、以及 hero 的 shader/chunk 源码。
> 所有数值都是从参考站直接读出的，不是估计值。

---

## 实施状态

本轮已落地（第 1–3 项 + 深色优先）：

| # | 事项 | 状态 |
|---|---|---|
| 1 | `--ds-*` 令牌层 + 自托管字体 + 字阶 + 统一品牌蓝 | ✅ 已实施 |
| 2 | 玻璃/卡片重做（blur 12px、底色 2%–6%、1px 内高光、圆角 10px/24px） | ✅ 已实施 |
| 3 | 按钮系统（100px 胶囊 + 圆形涟漪 + primary/secondary/ghost） | ✅ 已实施 |
| — | 深色优先（`theme: 'dark'` + 首屏脚本默认 dark） | ✅ 已实施 |
| — | 导航 pill + 滚动后才显形；语言切换改分段胶囊；页脚改发丝线（玻璃重做的附带项） | ✅ 已实施 |
| 4–14 | 其余各项（hero 点阵/流体、滚动叙事、滚动触发动画…） | ⬜ 未做 |

落地细节见下文对应的 §1–§7、§9。

---

## 0. 一句话结论

参考页的"高级感"来自 **克制的表面 + 一个会动的 hero**：

- 页面底色几乎是纯黑/纯白（`#0a0a0a` / `#f9f8f8`），**没有**任何全屏渐变；
- 所有层次靠 **1px 半透明描边**（白 6%–25%）表达，面板底色低到白 2%；
- 圆角很小（卡片 10px），但按钮是 **100px 胶囊**；
- 全站只有 **一个字重 500 的无衬线体** 在扛排版，标题字距一律 -0.02em；
- 唯一的"炫技"集中在 hero 的 **WebGL2 流体 shader + 可交互点阵 canvas**，其余部分极其安静。

而我们现在的做法接近反过来：**处处是渐变背景 + 大面积高斯模糊玻璃 + 24px 大圆角 + 粗衬线标题**，hero 反而是最静的（一张静态个人卡片）。这个"重心错位"是最大的差异来源。

---

## 1. 设计令牌对照（`--ds-*` vs 我们的 CSS 变量）

参考页把整套设计系统收敛在 `:root` / `[data-theme=dark]` 的 `--ds-*` 变量里（约 90 个），建议我们照搬这套结构。

### 1.1 页面底色

| | 参考页 | 本仓库 |
|---|---|---|
| light | `#f9f8f8`（纯色） | `#e8eff7` + 4 层 radial-gradient |
| dark | `#0a0a0a`（纯色） | `#090f18` + 3 层 radial-gradient |

参考页默认就是 **dark**（静态 HTML 上是 `<html data-theme="dark">`），light 只是同一套 token 的另一组取值。

### 1.2 表面（surface）层级

| Token | light | dark |
|---|---|---|
| `surface-1` | `hsla(0,0%,100%,.3)` | `hsla(0,0%,100%,.06)` |
| `surface-2` | `hsla(0,0%,100%,.2)` | `hsla(0,0%,100%,.04)` |
| `surface-3`（卡片底） | `rgba(0,0,0,.03)` | `hsla(0,0%,100%,.02)` |
| `surface-4` | `rgba(0,0,0,.02)` | `hsla(0,0%,100%,.015)` |
| `surface-5` | `rgba(0,0,0,.05)` | `hsla(0,0%,100%,.12)` |
| `surface-raised`（导航条） | `hsla(0,0%,100%,.45)` | `hsla(0,0%,100%,.25)` |
| `bg-overlay`（下拉） | `#fff` | `#262626` |
| `bg-code` | `rgba(0,0,0,.05)` | `rgba(0,0,0,.35)` |
| `bg-hover` | `rgba(0,0,0,.04)` | `hsla(0,0%,100%,.06)` |
| `bg-input` | `hsla(0,0%,100%,.2)` | `hsla(0,0%,100%,.08)` |

对照我们的 `--glass-bg`：light `rgba(255,255,255,.54)`、dark `rgba(22,36,54,.48)` —— **不透明度高一个数量级**，所以我们的面板看起来"实"，参考页看起来"薄"。

### 1.3 描边

| Token | light | dark |
|---|---|---|
| `border-subtle` | `rgba(0,0,0,.06)` | `hsla(0,0%,100%,.08)` |
| `border-default` | `rgba(0,0,0,.1)` | `hsla(0,0%,100%,.06)` |
| `border-divider` | `rgba(0,0,0,.08)` | `hsla(0,0%,100%,.25)` |
| `border-hover` | `hsla(20,1%,45%,.2)` | `hsla(0,0%,100%,.2)` |
| `border-strong` | `rgba(0,0,0,.2)` | `hsla(0,0%,100%,.24)` |
| `border-secondary` | `rgba(9,45,78,.14)` | `hsla(0,0%,100%,.2)` |

注意参考页 **默认描边（6%–10%）比分割线（25%）还淡**，这是"细若游丝"观感的来源。我们的 `--glass-border` dark 是 `rgba(186,212,246,.17)`，偏亮偏蓝，所以在深色底上更"塑料"。

### 1.4 文字

| Token | light | dark |
|---|---|---|
| `text-primary` | `#1e232c` | `#fff` |
| `text-secondary` | `rgba(0,0,0,.7)` | `hsla(0,0%,100%,.8)` |
| `text-description` | `rgba(0,0,0,.65)` | `hsla(0,0%,100%,.5)` |
| `text-placeholder` | `#8691a1` | `hsla(0,0%,100%,.3)` |
| `text-link-blue` | `#234792` | — |

### 1.5 品牌色

| | 参考页 | 本仓库 |
|---|---|---|
| light | `#4d6bfe` | `#35669a`（首页）／`#d4a562`（全站 `--accent`） |
| dark | `#6799fe` | `#a0c5f3`（首页）／`#e4b976`（全站） |
| 次要变体 | `brand-deep #3a65c2`、`brand-medium-reverse #4176e6`、`brand-light-reverse #73a3d2` | `accent-light` / `accent-dark` |

> ⚠️ 我们现在 `--accent` 有 **两套并存**：`globals.css` 里是金 `#d4a562`，但首页被 `body:has(.home-shell)` 覆写成蓝 `#35669a`。子页面（publications / projects / awards）仍是金色。参考页全站只有一个蓝。**统一到单一品牌蓝是"看起来像一个站"的前提。**

### 1.6 圆角

| Token | 值 | 用途 |
|---|---|---|
| `radius-pill` | `100px` | 所有按钮、分段切换、导航条 |
| `radius-card` | `24px` | 大容器 |
| `radius-panel` | `16px` | 下拉、浮层 |
| `radius-media` | `10px` | 卡片、媒体框、代码块 |
| `radius-input` | `10px` | 输入框 |
| `radius-sm` | `8px` | 小标记 |

我们目前：面板 24px、卡片 `rounded-xl`(12px)、按钮 `rounded-md`(6px)、导航 20px —— **没有 pill 这一档**。

### 1.7 间距 / 模糊 / 阴影 / 字体

```
--ds-space-1..13: 4 8 12 16 24 32 40 56 80 120 160 200 240
--ds-blur-glass: 12px          ← 我们用了 20–28px + saturate(135%~150%)
--ds-shadow-card (light): 0 0 0 1px #f1f5f9, 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)
--ds-shadow-card (dark):  hsla(0,0%,100%,.12) 0px 1px 0px 0px inset   ← 只有一条内高光
--ds-font-body:    "DM Sans", system-ui, ...
--ds-font-display: "Host Grotesk", system-ui, ...
--ds-font-mono:    "Fragment Mono", ui-monospace, ...
hero 专用:          "Montserrat"（`ds-text-hero` 单独指定）
```

阴影对比：我们的 `--shadow-glass: 0 8px 32px rgba(31,38,135,.37)` 是参考页 dark 阴影的 **上百倍强度**（参考页 dark 卡片阴影只有一条 1px 内高光）。

> 顺带一个真实缺陷：`--font-sans: 'Inter', ...` 里的 Inter **从来没被加载过**（全仓库没有 `next/font`，也没有字体文件），实际渲染一直走系统字体。参考页是自托管 woff2：`host-grotesk-latin.woff2`、`dm-sans-400.woff2`、`dm-sans-500.woff2`。

### 1.8 滚动条

参考页：`--ds-color-scrollbar` = `rgba(0,0,0,.15)` / `hsla(0,0%,100%,.2)`，宽 8px。
我们：轨道 `neutral-100`、滑块 `neutral-300` —— 有色块感，建议改成半透明中性色。

---

## 2. 排版

参考页的字阶（**全部 weight 500，全部负字距**）：

| class | 字号 | 行高 | 字距 | 字重 |
|---|---|---|---|---|
| `.ds-text-hero` | 36 → 46px @768 | 150% | -0.02em | 500（Montserrat） |
| `.ds-text-heading1` | 28 → 36px @768 | 150% | -0.02em | 500（Montserrat） |
| `.ds-text-subtitle` | 20px | 150% | -0.01em | 500 |
| `.ds-text-title` | 18px | 150% | -0.01em | 500 |
| `.ds-text-body` | 16px | 160% + `text-wrap: pretty` | — | — |
| `.ds-text-caption` | 14px | 150% | — | — |
| `.ds-text-xs` | 12px | — | — | — |

对照我们：`text-2xl/3xl/4xl font-serif font-bold`。

**要改的三件事：**
1. **去掉衬线标题**（或至少首页去掉）——参考页全站无衬线，靠字重/字距/大小建立层次，不靠字体对比。
2. **字重从 700 → 500**；`font-bold` 是"文档感"，`font-medium` 才是"产品感"。
3. **字号下调**：我们首页标题 24px(2xl)+中文衬线，参考页 section 标题 36px 但正文字号更小、行高更大（1.6–1.75），对比更"透气"。

---

## 3. 按钮（最值得整体移植的组件）

参考页所有按钮共用一套基类：

```css
.ds-btn-primary,.ds-btn-secondary,.ds-btn-ghost,.ds-btn-liquid,.ds-btn-text{
  position:relative; display:flex; align-items:center; justify-content:center;
  gap:6px; border-radius:100px; box-sizing:border-box;
  font-family:var(--ds-font-sans); font-weight:500; line-height:120%;
  overflow:hidden; isolation:isolate;
}
/* 悬停 = 从中心扩散的圆形涟漪，不是换背景色 */
.ds-btn-*::after{
  content:""; position:absolute; top:50%; left:50%;
  width:150%; aspect-ratio:1; border-radius:50%;
  opacity:0; z-index:-1; transform:translate(-50%,-50%) scale(0);
  transition:transform .36s ease-out, opacity .1s ease;
}
.ds-btn-*:hover::after{ opacity:1; transform:translate(-50%,-50%) scale(1); }
```

尺寸：`ds-btn-m` = 15px / padding 11px 18px / icon 16px；`ds-btn-s` = 14px；`ds-btn-xs` = 14px / 6px 12px。

三种变体：

| 变体 | light | dark | 悬停行为 |
|---|---|---|---|
| primary | bg `#1a1615`，字 `#fff` | bg `#fff`，字 `#0a0a0a` | 涟漪 `hsla(0,0%,100%,.3)` / `rgba(0,0,0,.2)` |
| secondary | bg `hsla(0,0%,100%,.4)` + **backdrop-blur 12px** + 1px `rgba(9,45,78,.18)` | bg `surface-1` + 1px 白 15% | 涟漪 `rgba(0,0,0,.05)`，**仅描边变色**（.35s）|
| ghost | 透明，weight **400** | 透明 | 涟漪 + 描边 `hsla(20,1%,45%,.2)` |

我们现在的按钮是 `bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md` —— 直角、换色、无涟漪。

---

## 4. 顶部导航（我们已经很接近，差 4 个细节）

参考页：

```css
.ds-header-wrapper{ position:fixed; top:0; left:0; right:0; margin:0 auto; z-index:50;
  width:min(100% - 48px,1140px); padding:var(--ds-space-2) 0 0; }      /* 768: -144px；1560: 1280px */
.ds-header-bar{ display:flex; align-items:center; justify-content:space-between;
  padding:4px 0; border-radius:100px; border:1px solid transparent; background:transparent; }
.ds-header-bar::before{                     /* 玻璃层默认透明，滚动后才淡入 */
  content:""; position:absolute; inset:-1px; border-radius:inherit;
  background:var(--ds-color-bg-surface-raised);
  backdrop-filter:blur(12px);
  border:1px solid var(--ds-color-border-default);
  opacity:0; visibility:hidden; transition:opacity .4s ease-in-out, visibility 0s .4s;
}
.ds-header-bar.is-scrolled::before{ opacity:1; visibility:visible; transition:opacity .4s ease-in-out, visibility 0s; }
```

要点：
1. **pill 圆角 100px**（我们是 20px）；
2. **默认完全透明**，滚动 20px 后才用 `.4s` 淡入玻璃层（我们是一开始就有玻璃）；
3. blur 只要 **12px**，不要 `saturate`；
4. 容器宽度 `min(100% - 48px, 1140px)`，桌面边距 144px（我们是 `100% - 32px` / 1200px）。

**语言切换**：参考页是**分段胶囊**，不是下拉菜单：

```css
.ds-locale-toggle{ display:flex; height:32px; padding:3px; border-radius:100px;
  border:1px solid var(--ds-color-border-default); }
.ds-locale-toggle-item{ height:100%; padding:0 12px; border-radius:100px;
  font-size:12px; font-weight:500; color:var(--ds-color-text-description); }
.ds-locale-toggle-item.is-active{ background:var(--ds-color-bg-surface-raised);
  color:var(--ds-color-text-primary); box-shadow:0 1px 3px rgba(0,0,0,.08); }
```

我们只有 zh / en 两个语言，这个组件是**完美适配**，可以直接替掉现在的图标+下拉。

**移动端菜单**：参考页是**全屏浮层**（`position:fixed; inset:0; background:var(--ds-color-bg-page)`），条目 18px/500、`padding:24px 0`、`border-bottom:1px solid border-divider`。我们现在是一个悬浮玻璃小卡片。

**Logo**：参考页是 图标 + 等宽字体的字标，外面套一个 chip（外层 `rounded-[8px] p-[1px]`，内层 `rounded-[7px] pt-[4px] pb-[3px] font-mono`）。我们是纯衬线文字。

---

## 5. 分区节奏与"小标签"

- **容器**：`width:min(100% - 48px, 1140px)` → 768px 起 `-144px` → 1560px 起 `1280px`（非对称留白）。我们是 `max-w-6xl` + `px-4/6/8`。
- **分区上下留白**：`py-ds-10` = **80px**，部分区块到 `160px`（`ds-space-11`）。我们首页区块间距只有 24px（`space-y-6`）。
- **Eyebrow 小标签**（我们完全没有）：

```html
<span class="inline-flex items-center rounded-[8px] p-[1px]">
  <span class="px-[9px] pt-[6px] pb-[5px] rounded-[7px] bg-black/25 font-mono">…</span>
</span>
```

等宽字体、外面再包一层 1px 的壳 —— 用在每个 section 标题上方（如 `01 / Quick start`）。这是最容易提升"设计感"的廉价元素。

- **粘性滚动叙事**：`grid-cols-[42fr_58fr] gap-[80px]`，左列每项 `min-h-[35vh] py-[11vh]`，右列 `sticky` 的 8:5 媒体面板，随左侧进入视口淡入淡出（`transition-opacity duration-500`），图标颜色随激活项 `transition-colors duration-500`。

> 我们的 `CardPage` 已经有一个 tab 版 `ProjectShowcase`（`layoutId` 滑块做得不错）。参考页是**滚动驱动**而非点击切换 —— 这是"更贵"的那一版。

---

## 6. 卡片

```html
<div class="bg-ds-surface-3 border border-ds-border-default rounded-ds-media p-ds-6">
```

即：**圆角 10px、底色白 2%、1px 白 6% 描边、内边距 32px**。

- 我们：`glass-inset` + `--glass-inset-bg` + 内阴影高光 + 12px 圆角 + `glass-interactive` 悬停换成 `--glass-bg`。视觉重量差很远。
- 参考页 light 模式的卡片阴影是复合的：`0 0 0 1px #f1f5f9, 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)`（描边环 + 两层柔和阴影），**不是**模糊光晕。
- 卡片内链接：`text-ds-primary hover:text-ds-brand transition-colors`，下划线 `underline underline-offset-4 decoration-1`——很细的实线下划线，不是我们那种加粗变色的做法。

---

## 7. 代码块

参考页 hero 里的命令行卡片：

- 外框：`rounded-[10px] border border-white/[0.08] bg-black/20 backdrop-blur-xl overflow-hidden`
- 顶栏：macOS 三点（`11px`，`#ff5f57` / `#febc2e` / `#28c840`），右侧是**文字按钮**（不是图标）：`text-[12px] text-ds-description hover:text-ds-primary`
- 内容：`p-24px`，`font-mono text-[14px] leading-relaxed`，`$` 提示符用品牌色且 `select-none`
- 上方 tab：纯文字按钮 `text-[13px] font-medium`（Quick start / Install from source）

我们的 BibTeX 块是 `bg-neutral-50 rounded-lg p-4` + 右上角图标按钮。→ 可以整体换成上面这套（三点 + 顶栏 + 文字 Copy）。

---

## 8. Hero —— 参考页真正的"效果"所在

参考页 hero 是 `height:100vh`，背后叠了 **三层 canvas**：

### 8.1 WebGL2 流体（鼠标轨迹）

ping-pong flowmap：鼠标处写入 `influence = exp(-d²/(r²·0.5))`，每帧 `prev.r *= decay`，同时把速度方向编码进 G/B 通道；主 shader 用 flowmap 扰动 UV 后再做 swirl 迭代。解出的配置：

```js
{
  mouseRadius: .09, mouseStrength: 1.8, mouseSmoothing: .1, mouseVelocity: .2,
  decay: .925, distortBoost: 2.2, noiseBoost: .3, swirlBoost: .8, glowIntensity: .13,
  glowColors: ["#fff7d1", "#538dca", "#2d448b"],
  speed: 28, distortion: 18, swirl: 20, swirlIterations: 12,
  scale: 1.77, rotation: 15, proportion: 60, softness: 80, shapeScale: 0,
  offsetX: -124, offsetY: -48, grain: .005,
  colors: ["#000000", "#1A3870", "#204a7e", "#eed8aa", "#000000"],
  lightX: .89, lightY: .46, lightCore: .14, lightHalo: .2,
  vignette: .38, lightFollow: .63,
  bloomThreshold: .61, bloomRange: .18, bloomStrength: .4
}
```

即 **深蓝（`#1A3870`/`#204a7e`）+ 暖金（`#eed8aa`）的流动液体**，右上 0.89/0.46 处一团柔光，整体 38% 暗角。

### 8.2 可交互点阵（2D canvas）

- 网格间距 **90px**，线/点颜色 `rgba(60,100,160,α)`，线 α=.1、点 α=.2
- 鼠标 140px 半径内推开，力度 `(1 - d/140) * 30`，加速度 ×0.1
- 回弹：`v += 0.05 * (rest - pos)`，阻尼 `v *= 0.85`
- 点尺寸 1.8（靠近鼠标最多 +2），节流到 ~30fps，离开视口暂停（`IntersectionObserver`）
- **只在非触屏设备启用**（`matchMedia('(hover: none), (pointer: coarse)')` 直接 return）

### 8.3 可选 three.js 玻璃体

`HeroGlassObject` / `HeroSingleBlob` / `HeroHelm` / `HeroDigitileR3F`，参数：`metalness .89, roughness .1, transmission .16, thickness 2.3, ior 1.66, iridescence .8, clearcoat .36`，环境色 `#5a8dd9 / #1f3873 / #0d142e / #99b8e6`。全部用 `loadable(..., { ssr:false })` 包起来。

### 8.4 入场动画

```css
@keyframes ds-hero-enter{
  0%{ opacity:0; transform:translateY(var(--enter-y,20px)); filter:blur(var(--enter-blur,0)); }
  to{ opacity:1; transform:translateY(0); filter:blur(0); }
}
.ds-hero-enter{ animation:ds-hero-enter .8s ease-out backwards; }
```

每个子元素单独加 `.ds-hero-enter` 实现**错峰淡入 + 去模糊**。我们用的是 framer-motion 的 `y:20 → 0`，没有 blur，也没有错峰。

> 📌 有意思的巧合：我们首页现在已经有一层 **88px 的网格线**（`body:has(.home-shell)::before`），和参考页的 **90px 点阵**几乎同参数 —— 但参考页那层是**会被鼠标推开的**，我们的是静态的。这是投入产出比最高的一个升级点。

---

## 9. 下拉浮层 / 页脚

**玻璃下拉**（`.ds-glass-dropdown`，用于页脚二维码浮层）：

```css
background: var(--ds-color-bg-overlay);   /* #fff / #262626 */
backdrop-filter: blur(12px);
border: 1px solid var(--ds-color-border-subtle);
border-radius: 16px;
box-shadow: 0 0 1px 0 rgba(0,0,0,.2), 0 0 4px 0 rgba(0,0,0,.02), 0 12px 32px 0 rgba(0,0,0,.08);
```

悬停延迟：`opacity .15s .4s` 打开、`inset:-8px` 伪元素扩大命中区。

我们现在的下拉是 `bg-background dark:bg-neutral-800 + shadow-lg`，无模糊、圆角 8px。

**页脚**结构：`1px` 发丝分割线（`bg-border-subtle`）→ 三栏网格（左侧二维码触发器 / 中间版权 / 右侧法务链接），文字全部 `ds-text-caption`，间距 `gap-x-12px gap-y-8px`。
我们：`border-t` + `bg-neutral-50/50` 色带 + 一行居中的 last updated。→ 建议改成**发丝线 + 三栏**，并把 GitHub / Google Scholar / Email / 二维码 放进去。

---

## 10. 其他可移植的细节

| 项 | 参考页 | 建议 |
|---|---|---|
| 滚动动画 | `IntersectionObserver` 驱动，进入视口才播 | 我们全是挂载即播，滚动到下方区块时动画早就播完了 |
| 透明度降级 | `@media (prefers-reduced-transparency: reduce)` 关模糊 | ✅ 我们已有 |
| 无 blur 降级 | `@supports not (backdrop-filter…)` 用实色 `--glass-fallback` | ✅ 我们已有 |
| 动效降级 | `prefers-reduced-motion` | ✅ 我们已有 |
| 滚动条 | `--ds-color-scrollbar` 半透明 | 改成半透明中性 |
| 链接下划线 | `underline underline-offset-4 decoration-1` | 替换现在的"变色+加重" |
| 焦点环 | 参考页几乎全站不用 ring，靠描边变色 | 可保留 ring，但换成品牌色 1px |

---

## 11. 建议的实施顺序（按"观感提升 / 风险"排序）

| # | 事项 | 影响面 | 风险 |
|---|---|---|---|
| 1 | 引入 `--ds-*` 令牌层 + 自托管字体（Host Grotesk / DM Sans / Fragment Mono 或近似替代） | 全站 | 低 · ✅ 已完成 |
| 2 | 统一品牌色为单一蓝（干掉首页蓝 / 子页金的分裂） | 全站 | 低 · ✅ 已完成 |
| 3 | 去衬线化 + 字重 700→500 + 字号/字距对齐 `ds-text-*` 字阶 | 全站 | 中 · ✅ 已完成 |
| 4 | 玻璃参数下调（blur 12px、surface 不透明度降到 2%–6%、阴影改 1px 内高光） | 全站 | 低 · ✅ 已完成 |
| 5 | 导航改 pill + 滚动后才显形；语言切换改分段胶囊；移动端改全屏浮层 | 导航 | 中 · ✅ pill/分段已完成，移动端全屏浮层未做 |
| 6 | 按钮系统重做（pill + 涟漪 + 三变体） | 全站 | 低 · ✅ 已完成 |
| 7 | 加 eyebrow 小标签 + 分区留白提到 80–160px | 全站 | 低 · ⬜ 未做（`.ds-eyebrow` 已备好） |
| 8 | 卡片改 `rounded-10px + 1px 描边 + 极淡底` | 全站 | 低 · ✅ 已完成 |
| 9 | 代码块改三点 macOS 顶栏 + 文字 Copy | 论文 BibTeX | 低 · ✅ 已完成 |
| 10 | 页脚改发丝线三栏 + 联系方式 | 全站 | 低 · ⬜ 仅做了发丝线，三栏/联系方式未做 |
| 11 | 背景点阵改**可交互**（鼠标推开 + 回弹，90px，仅桌面端） | 首页 | 中 · ⬜ 未做 |
| 12 | Hero 加流体 shader（WebGL2 ping-pong，参数见 §8.1） | 首页 | 高 · ⬜ 未做 |
| 13 | 入场动画加 blur + 错峰；改为滚动触发 | 全站 | 低 · ⬜ 未做 |
| 14 | 项目展示改粘性滚动叙事（42/58 双列） | 首页/Projects | 中 · ⬜ 未做 |
