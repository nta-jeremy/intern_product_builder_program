# YODY Design System — DESIGN.md

> **Single source of truth** for the YODY ITDX Enterprise Architecture portal and any internal/digital surface that carries the brand. Adapted to **Light Hightech** direction · v2026.05.
>
> Canonical reference HTML: `yody-portal-redesign.html` (project `019e0bab-edea-717a-9a60-5435186b7d6a`)

---

## 0 · Philosophy

**BoD-first, lean-back, projector-readable.**

The portal is consumed in two modes — (1) executive on a 14″ laptop in a meeting, (2) projector at 1080p from 3 m. Type minimums and colour contrast are calibrated for the harder of the two. Visual interest comes from **content** (numerals, italic accents, watercolor blobs) — not from chrome (gradients, borders, surface tints).

Aesthetic words: **light hightech · art accent reserve · craftsmanship · AI-native.**

---

## 1 · The 9 enforcement principles (the "spine")

| # | Principle | What it means |
|---|---|---|
| **I** | **4–5 sub-blocks max** per section | More than 5 → split into a new section |
| **II** | **Claim → evidence → conclusion** | Section opens with a claim, shows data, ends with an italic Kết luận callout |
| **III** | **2 accents max** per section | Pick from { iris, gold, mint, rose } — never more than two in one viewport |
| **IV** | **Numeral I / II / III / IV / V** rhythm | Roman numerals (Montserrat italic 800) appear at every list of ≤5 — stakeholders, chapters, moat reasons, trụ cột |
| **V** | **Year card DNA unified** | Whatever the surface, year cards share the same anatomy — year mono · theme brand · big-num gradient · L2 label |
| **VI** | **≥19px body** (blog-portal readable) | 23px lede · 22px insight · 19px paragraph · 14px label minimum · line-height 1.65–1.7
| **VII** | **Insight callout** per section | Italic "Kết luận" with gold spine — never end a section on raw data |
| **VIII** | **1 ambient motion budget** per page | One thing animates at a time. Hero brush-line OR chart pulse OR signature script — never all three |
| **IX** | **Cross-chapter consistency** | Anything used twice must be a component, not a one-off. Year card in Hero = year card in S3a |

---

## 2 · Color tokens

### 2.1 Brand anchor
```
--brand        #2a2b86   Primary navy · headlines · brand chunk
--brand-light  #4a4bc8   Gradient pair · hover
--brand-deep   #16175a   Big-num gradient bottom · footer
--brand-tint   #eeeefb   Brand 50 wash · subtle bg
```

### 2.2 Accent semantic discipline

Every accent has **one** fixed role. Do not mix.

```
--iris   #7c6cf5   AI / tech       · DEFAULT accent (90% of accent surface)
--gold   #fcaf16   Climax           · 1 moment per page MAX · achievement
--mint   #10b981   Growth · LIVE    · prosperity · success
--rose   #f472b6   Human · ESG      · warm care · people
--gap    #ef4444   ALERT ONLY       · NOT for governance / compliance
```

Each has a `-deep` variant for gradient bottoms (`--iris-deep`, `--gold-deep`, etc.) and a `-tint` for soft backgrounds.

### 2.3 Surfaces
```
--bg        #fcfcff   Paper (default)
--bg-2      #f4f5fb   Mist (alt sections)
--bg-muted  #ecedf8   Lavender (chip / hover)
--bg-ink    #0e0f24   Dark surface (rare — hero / footer only)
--bg-warm   #fbfaf6   Hero warm wash
```

### 2.4 Text
```
--fg-1  #1a1b3a   Primary ink (navy-tinted, NOT pure black)
--fg-2  #5a5c7e   Body
--fg-3  #6b6d8c   Label / metadata (lifted from #9a9cb8 for projector legibility)
```

### 2.5 Big-num gradient (hero KPIs)

Use `.big-num.{brand|iris|gold|mint|rose}` — text gradient navy → brand-deep, etc. Reserved for hero numerals (104px+) and chapter numbers.

---

## 3 · Typography

### 3.1 The 5-font composition

| Token | Family | Role | Where |
|---|---|---|---|
| `--font-body` | **Inter** | Default body | Paragraph, label, caption, nav, button |
| `--font-brand` | **Be Vietnam Pro** | Brand chrome | Wordmark, header nav, card title, product names |
| `--font-impact` / `--font-display` | **Montserrat** | Impact display | Hero, H1, H2, KPI numerals, **roman numerals** (italic 800) |
| `--font-serif` | **Playfair Display Italic** | Artistic accent | **HERO ONLY** — 1 art moment per portal. Also used in Insight body italic |
| `--font-mono` | **JetBrains Mono** | Technical | Eyebrow (uppercase, 0.32em), tags, year labels, code |
| `--font-script` | **Dancing Script** | Signature | Hero signature line only |

### 3.2 Reserve rules

- **Playfair italic = 1 moment / portal.** Hero word + Insight italic accent. Never in H2, never in card titles.
- **Roman numerals (I/II/III/IV/V) = Montserrat italic 800**, not Playfair. We want geometric/technical, not ornamental.
- **No font #6.** If you reach for a sixth family, you're trying to compensate for a layout problem.

### 3.3 Scale (CSS tokens)

```
--type-hero      800 104px/0.94  Montserrat   HERO ONLY
--type-display   800 88px/0.98   Montserrat   Chapter cover
--type-h1        800 56px/1.05   Montserrat   Section title
--type-h2        700 32px/1.15   Montserrat
--type-h3        700 22px/1.25   Montserrat
--type-card-title 700 17px/1.3   Be Vietnam Pro

--type-kpi       800 56px        Montserrat   KPI value (tabular-nums)
--type-roman     italic 800 88px Montserrat   I / II / III / IV / V

--type-body-lg   400 23px/1.65   Inter        Section lede
--type-body      400 19px/1.7    Inter        Default body (blog-portal readable)
--type-body-sm   400 16px/1.6    Inter
--type-label     500 14px/1.4    Inter
--type-eyebrow   700 13px/1      JetBrains    0.32em uppercase
```

### 3.4 Inline accent pattern

```html
<h2 class="s-title">
  Hành trình đến <em class="em-accent gold">IPO 2030</em>
</h2>
```

`em.accent` is Montserrat italic 800 — same family as headline, just italic. `.gold` / `.iris` / `.mint` / `.rose` / `.brand` colour modifiers.

For HERO only:

```html
<h1 class="hero-display">
  Hành trình<br/>đến <span class="art-italic">năm</span> <span class="big-num brand">2030</span>
</h1>
```

---

## 4 · Component anatomy

### 4.1 Section template (recurring)

```
┌─ [s-eyebrow]  mono 12px 0.32em · with flanking dashes
│  CHƯƠNG · ITDX × CRAFTSMANSHIP
│
├─ [s-title]    Montserrat 800 56px · max-width 920
│  5 chặng dẫn lối tới <em>IPO 2030</em>
│
├─ [s-sub]      Inter 21px · max-width 720
│  Mỗi năm một chủ đề, một mức trưởng thành…
│
├─ ┄┄┄ (mt-56) content blocks ┄┄┄
│
└─ [insight]    box · gold spine · Kết luận label · italic accent
   <strong>2028 là điểm đòn bẩy</strong> — sau 2 năm đầu tư
   nền tảng, công nghệ bắt đầu sinh lời.
   <em>AI-Native fashion leader</em>.
```

### 4.2 Insight callout

```html
<div class="insight">
  <div class="insight-label">Kết luận</div>
  <div class="insight-body">
    <strong>…claim…</strong> — …evidence… <em>…art italic…</em>.
  </div>
</div>
```

- 32 × 40 padding · `--shadow-sm`
- Gold spine 3px on the left, 24px inset top/bottom
- Label: mono 11 / 0.3em / fg-3 / with leading 18px dash
- Body: 19px Inter · `<em>` is Playfair italic 700 in --iris or --gold-deep

### 4.3 CTA system

```
.cta             52px height · 28px padding · pill
.cta-primary     brand bg · white text · hover lift + shadow-brand
.cta-secondary   transparent · border · hover bg-muted
.cta-gold        gold bg · ink text · hover lift + shadow-gold
```

Only one primary CTA per section. Pair with secondary if needed.

### 4.4 Year card (unified DNA)

```
┌─ [tc-year]    mono 13px 0.18em · iris-deep
│  2030 · IPO
│
├─ [tc-theme]   Be Vietnam Pro 17px 700 · ink
│  Doanh nghiệp AI-native
│
├─ [tc-meta]    mono 10px 0.20em · fg-3
│  AI-NATIVE ENTERPRISE
│
├─ [tc-bignum]  Montserrat 800 56px · gradient (per year)
│  79 /79
│
└─ [tc-label]   Be Vietnam Pro 11.5 / 0.12em / fg-2
   NĂNG LỰC L2 MATURE
```

Year-tone mapping (5 chặng):
- 2026 → mint (foundation)
- 2027 → iris (platform)
- 2028 → rose (CX)
- 2029 → brand-light (operations)
- 2030 → **gold + climax border** (IPO)

### 4.5 Stakeholder ribbon (I–V list)

Per-tone CSS variables drive the entire row:

```html
<div class="ribbon" style="--tone: var(--iris); --tone-tint: …;">
  <div class="ribbon-ord">II</div>
  <div class="ribbon-content">
    <div class="ribbon-label">Khách hàng</div>
    <div class="ribbon-headline">10 triệu khách hàng…</div>
  </div>
  <div class="ribbon-seal"><div class="ribbon-seal-circle"></div></div>
</div>
```

- 100px ord column · Playfair italic 56px in `--tone`
- 4px left spine in `--tone`
- 60px seal circle on the right (radial gradient of `--tone-tint`)

### 4.6 KPI card variants

See `preview/kpi-cards.html` — six patterns:

- **A · Aurora gradient** — flagship dashboard cards, gradient backgrounds
- **B · Soft glass tint** — radial tint on white, lighter
- **C · Mesh + sparkline** — data-led, AI-dashboard
- **D · Hero dark** — brand anchor, navy + gold DNA
- **E · Radial** — at-a-glance progress
- **F · Composition bar** — gradient segments for split metrics

Pick by context: data-heavy → C; brand moment → A; secondary → B; cover → D.

### 4.7 Status pills (tags)

JetBrains Mono · uppercase · 0.6px letterspacing · pill. Foreground uses the `-deep` variant for legibility:

```
LIVE  · mint-deep on mint-bg     · operational
BUILD · iris-deep on iris-bg     · in progress
GAP   · gap         on gap-bg    · ALERT
PLAN  · gold-deep on plan-bg     · scheduled
```

---

## 5 · Layout & rhythm

### 5.1 Spacing

4px base. Use `--s-N` tokens (1–28). Section padding: `96px 56px` desktop, `48px 16px` mobile.

### 5.2 Container

- Default: `max-width: 1280px; margin: 0 auto;`
- Roadmap / matrix: 1440px
- Section inner: 1280px

### 5.3 Chapter spine

Each chapter ends with a 24px Mist (`--bg-2`) border-bottom — visual chapter break.

### 5.4 Section anchors

```html
<div class="anchor" id="home"></div>
<section class="chapter">…</section>
```

`.anchor` is `position: relative; top: -80px;` to offset sticky nav.

---

## 6 · Motion budget

**One ambient motion per page.** Pick from:

- Hero brush-line draw (1s, once on load)
- Hero chart pulse (3s loop, very subtle)
- Signature script reveal (fade in, 500ms)
- KPI count-up (600ms)
- Year card hover lift (translateY −3px, 250ms)

`prefers-reduced-motion: reduce` disables all loops.

---

## 7 · Iconography

- **Lucide** monoline icons, 1.75px stroke, 16–24px.
- Icon colour = text colour (`currentColor`). Status icons use the `-deep` variant.
- Never gold. Never iconography larger than 32px in body content.
- Reserved single-letter "domain badges" (28 × 28, 8px radius) for TOGAF domains:
  - A · brand · B · iris · C · mint · D · rose · E · gold
  - F · brand-light · G · slate · H · coral · I · mint

---

## 8 · Imagery & decoration

- **Watercolor blobs** (hero only): SVG `<feTurbulence>` + `<feDisplacementMap>` + radial gradient. Mix-blend-mode: multiply, opacity ~0.4.
- **Brush underline** (hero only): SVG path with gold gradient stroke, `<feTurbulence>` rough filter.
- **No flat illustration** for navigation icons. Lucide only.
- **Photography**: warm neutral tones, Vietnamese context, natural light. Never B&W, never heavy filters.

---

## 9 · Logo & brand mark

### 9.1 Wordmark (file: `assets/yody-logo.png`)

YODY wordmark is **Quicksand 700**-derived, with geometric proportions (rounder counters than default Quicksand). Use the file logo whenever possible. When typography reproduction is needed:

```css
font-family: 'Quicksand', system-ui;
font-weight: 700;
letter-spacing: -0.015em;
transform: scaleX(1.04);  /* slight widen for squarer counters */
```

### 9.2 Header lockup

```
[ y ]  yody  ·id
```

- Mark: 32 × 32 gradient navy → iris (or gold on dark surface)
- Wordmark: Quicksand 700 · 26px
- `.id` sub: Be Vietnam Pro 500 · 14px · gradient text navy → iris

### 9.3 Brand line decoration

3px height pill, gradient `linear-gradient(90deg, brand, accent, mint)`. Width 140px. Used under hero title.

---

## 10 · File index

| File | What's inside |
|---|---|
| `README.md` | Project overview, content & visual fundamentals |
| `DESIGN.md` | **This file** — canonical spec |
| `colors_and_type.css` | All tokens, drop-in CSS |
| `SKILL.md` | Agent skill manifest |
| `assets/yody-logo.png` | Master wordmark |
| `preview/*.html` | Per-token specimen cards (Design System tab) |
| `ui_kits/itdx-portal/` | Working UI kit recreating the portal |
| `yody-portal-redesign.html` | (cross-project) canonical reference HTML |

---

## 11 · Do's and Don'ts

### ✅ Do
- Lead with claim, support with data, end with italic Kết luận
- Use roman numerals (I–V) for any list of ≤5
- Reserve gold for 1 climax per page
- Default to iris when in doubt
- Keep body ≥17px
- Match year card DNA across hero and roadmap

### ❌ Don't
- Don't use Playfair italic outside hero & insight
- Don't use crimson (`--gap`) for governance / compliance — that's iris navy
- Don't put two accent colours in one section if you can avoid it
- Don't navigate to a new page for drill-down — slide-in panel from right
- Don't reach for font #6
- Don't use icons > 32px in body content
- Don't use roman numerals in flowing text — only in numeral lists

---

**Last updated** 2026-05-20 · **Maintained by** Fioenix / CTO Office.
**Override note**: If this file disagrees with anything in `colors_and_type.css` or a preview asset, **this file wins** — update the asset.
