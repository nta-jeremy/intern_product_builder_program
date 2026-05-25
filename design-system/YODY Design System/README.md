# YODY Design System

> Brand identity + reusable visual foundations for **YODY** — a Vietnamese fashion retail brand (274 stores, ~2,800 tỷ VND revenue, IPO target 2030). This system supports YODY's **ITDX Enterprise Architecture portal** and other internal/digital products.

The aesthetic brief: **chuẩn brand identity, art-modern, minimal, hightech, AI-style** — with an **Inter-led** typographic core that fully supports tiếng Việt.

---

## Sources

- **Logo:** `uploads/yody-logo.png` (provided; copied to `assets/yody-logo.png`)
- **Reference codebase:** `github.com/fioenix/yody-itdx-ea` (Next.js 16, Tailwind v4, shadcn/ui — internal TOGAF EA portal)
  - `docs/DESIGN.md` — canonical design system spec
  - `docs/CONCEPT.md` — view-by-view design concept
  - `app/globals.css` — Tailwind v4 token theme
  - `CLAUDE.md` — build conventions
- **Live site:** https://yody-itdx-ea.vercel.app

The reader is not assumed to have access; everything material has been distilled below.

---

## Index

| File / folder | What's inside |
|---|---|
| `README.md` | This file — context, content & visual fundamentals, iconography |
| **`DESIGN.md`** | **Canonical spec — 9 principles, full token reference, component anatomy** |
| `colors_and_type.css` | Color tokens, typography stacks, semantic CSS vars (drop-in) |
| `SKILL.md` | Agent-Skill manifest (cross-compatible with Claude Code skills) |
| `assets/` | Logo + brand visual assets |
| `fonts/` | Self-hosted Be Vietnam Pro · others loaded from Google Fonts CDN |
| `preview/` | Per-token cards rendered for the Design System tab |
| `ui_kits/itdx-portal/` | UI kit recreating the YODY ITDX EA portal — `index.html` + JSX components |

---

## What YODY does (1‑minute brief)

YODY (yody.vn) is a **Vietnamese mass-market fashion brand** running 274 retail stores across 34 provinces. The **ITDX department** (IT & Digital Transformation) is YODY's internal tech org executing the chuyển-đổi-số (digital transformation) journey toward IPO 2030.

**Three platforms** under ITDX:
- **PHOENIX** — Supply Chain (PLM, APS, WMS, TMS)
- **UNICORN** — Retail (POS/OMS, ERP)
- **GLAUX** — Innovation (AIxPerf, eLMS, YOAI, AI Automation)

The **ITDX EA Portal** is an internal executive dashboard visualising the EA landscape across 9 TOGAF domains, ~120 capabilities, with status, ownership, investment, and roadmap. Audience is **Business Owners (non-technical execs) + CTO**, so the design has to be confident and information-rich without being a "dev console".

---

## CONTENT FUNDAMENTALS

### Voice & casing
- **Vietnamese UI labels + English tech terms.** Default to Vietnamese for any human-facing copy, but never translate technical anchors (TOGAF, LIVE/BUILD/GAP/PLAN, PHOENIX, UNICORN, GLAUX, KPI, ROI, PLM, WMS).
- **Casing for status:** UPPERCASE in JetBrains Mono with letter-spacing — these are anchors for scanning, not words.
- **Sentence case** for headings and buttons (`Tổng quan`, `Khám phá →`), not Title Case.
- **No exclamation marks**, no all-caps bombast, no marketing fluff. Audience is execs.

### Tone
- **Direct, clinical, executive.** Calm certainty. Numbers and named owners are the unit of trust.
- **Insight before data.** Every section should lead with a one-line "kết luận" callout — never show data raw and let the reader infer.
- **You / chúng ta** rarely. Most copy is third-person factual: "65% hệ thống đã hiện đại hoá" not "Bạn đã hiện đại hoá 65%…".
- **Bilingual cues.** When a Vietnamese label might be ambiguous, append the English term in muted text: "Kiến trúc Ứng dụng · Application Architecture".

### Examples (real strings from the system)
- Page title: `Lộ trình Trưởng thành` · subtitle: `Lego-style maturity blocks · 2026 → 2030`
- Card eyebrow: `CHƯƠNG 02 · HIỆN TRẠNG`
- Status badge text: `LIVE` · `BUILD` · `GAP` · `PLAN`
- Header tag: `TOGAF GOVERNANCE` (mono, uppercase, letter-spaced)
- Caption / footer: `Cập nhật: T5/2026`
- Owner badge: `PO Delta` / `Squad SIGMA Lead` (role labels — never reproduce real names from internal org charts)

### Don't
- ❌ Emoji — never. Status uses tag pills, not 🟢🔴.
- ❌ Marketing adjectives ("amazing", "revolutionary", "đột phá").
- ❌ Title Case in body.
- ❌ Exclamation points.

---

## VISUAL FOUNDATIONS

### Philosophy — one line
**White-dominant. Generous whitespace. Soft brand-tinted shadows. Pill nav. Rounded cards. Information density at "executive briefing", not "dev console".**

### Color
- **Brand navy `#2a2b86`** is the workhorse — primary CTA, active nav, KPI emphasis, BUILD status, gradient-pair start.
- **Brand gold `#fcaf16`** is decorative-only — the logo, gradient-pair end, achievement glints. **Never** for text or buttons (3:1 contrast on white fails).
- **Status palette is reserved:** `--live` green, `--build` navy, `--gap` red, `--plan` gold-brown. Don't reuse for non-status semantic.
- **Surfaces are white-on-white:** `--bg` (#ffffff) is dominant; `--bg-2` (#f8f8ff, navy 2% wash) only for hero/alternating sections, not content cards. Color comes from **content tokens**, not chrome tints.
- **Borders are navy-tinted** (`#e8e8f4`), not neutral grey — keeps cohesion with shadows.

### Typography
- **One UI/display family: Inter** (weights 400–800, with explicit `vietnamese` subset). Inter is round, modern, B2B-default (Vercel, Linear, GitHub, Stripe), and renders Vietnamese diacritics cleanly.
- **Mono: JetBrains Mono** for status pills, platform codes, IDs, timestamps.
- **Optional hightech accent: Space Grotesk** — reserved for hero numerals, AI-themed callouts, large display moments where Inter feels too neutral. Use sparingly.
- **Body line-height 1.5** universally. Headings 1.2–1.3.
- **Default heading weight 600**, not 700. Exception: KPI numerics (700, tabular-nums, slight negative tracking).
- **Status tags are always**: JetBrains Mono · UPPERCASE · 8–10px · letter-spacing 0.4–0.6px · pill (9999px).

### Spacing
- **4px base unit.** Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.
- **Container**: max-width 1200px (1400px wide for matrix/roadmap), `padding: 24px 32px 48px`.
- **Section rhythm**: 64–80px between chapters on desktop, 36px between sub-sections.
- **Card padding**: 16–24px inside; 12–20px gap in grids.

### Backgrounds
- **White-dominant.** No tinted content sections, no full-bleed photography behind text, no repeating textures.
- **Hero washes** use a soft mesh: `radial-gradient(20% 50%, rgba(navy/4%)) + radial-gradient(80% 80%, rgba(gold/3%))` — almost imperceptible but adds depth.
- **Dot grid**: optional layered radial dot pattern at 6% navy + 4% gold, 40px / 120px cell — used behind hero cards or feature blocks for the AI-tech texture. Never on full pages.
- **No gradients on text**, no gradient buttons, no glassmorphism. The only gradients are: logo brand-line `linear-gradient(navy → gold)`, hero mesh, and the 28×28 logo icon.

### Shadows (purple-tinted, never neutral black)
- `--shadow-sm` — 2px 8px, 6% navy — default card resting state
- `--shadow-md` — 4px 16px, 8% — hover, elevated
- `--shadow-lg` — 8px 24px, 10% — side panel, modal
- `--shadow-xl` — 16px 48px, 14% — hero feature cards
- **Never** `rgba(0,0,0,*)` — kills brand cohesion. **Never** opacity > 0.16 — kills airy feel.

### Borders & corner radii
- Borders are 1px, navy-tinted (`#e8e8f4`). Hover step to `#d0d0e8`.
- Radius scale: **4px** (micro tags, code chips), **8px** (buttons, domain badges — rounded square, not circle), **12px** (default card), **16px** (hero/feature card), **9999px** (pills — buttons, nav, status, badges).
- **Domain badges are rounded squares**, never circles.

### Animation & interaction
- **Easing**: standard `cubic-bezier(0.4, 0, 0.2, 1)` for everything UI; `cubic-bezier(0.34, 1.56, 0.64, 1)` (subtle overshoot) only for the side-panel slide-in.
- **Durations**: 150ms hover feedback, 200ms component state, 300ms page-level transitions, 400–600ms count-up KPI.
- **Hover state**: card shadow `sm → md`, optional `translateY(-2px)` only for click-target tiles. **Never** scale > 1.02.
- **Press state**: brief opacity dip to 0.85 + 1px down, no shrink.
- **Loading**: skeleton screens (light navy-tinted blocks), not spinners. Spinners only > 600ms.
- **Reduce motion** respected — disables marquee, smooth scroll, count-up.

### Drill-down rule
**Always slide-in side panel from the right.** Never navigate to a new page for detail. Width 40vw (min 400, max 600), backdrop `rgba(34,34,34,.4)`, close on × / backdrop / Esc.

### Layering & transparency
- Backdrops use `rgba(34,34,34,.4)`.
- Sticky header has `box-shadow: var(--shadow-sm)` + 1px border-bottom — never blur. Keeps it crisp on dense data tables behind.
- No frosted glass. No `backdrop-filter`. The brand reads as solid surfaces with airy shadows, not floating glass.

### Imagery
- The system carries little photography (it's an internal portal). When product / lookbook imagery enters via marketing surfaces: **warm neutral tones**, **natural light**, **Vietnamese context** (city, family, work). No black-and-white. No heavy grain. No filters.
- For diagrammatic illustration: flat vector, two-tone (navy + gold) max, no isometric, no faux-3D.

### Layout rules
- **Sticky header** 52–56px, white, 1px navy-tinted bottom border + soft shadow.
- **Side panel** as the only drill-down surface (see above).
- **Charts**: D3 / SVG, no chart library defaults. Donut stroke 20px butt cap. Bars 6px tall, 3px radius, segmented by status colour. Labels in body sans, 12px secondary text.
- **Grids** prefer 12-col desktop, 8-col tablet, 4-col mobile, gap 16–20px.

---

## ICONOGRAPHY

The reference codebase imports **`lucide-react`** as its icon system. Lucide is a clean, modern, monoline open-source icon set (24×24 viewBox, 1.5–2px stroke, rounded line-caps) — fits the brand's calm, minimal posture and stays consistent across hundreds of glyphs.

**Approach in this design system:**

- **Primary icon set: Lucide** — included via CDN: `https://unpkg.com/lucide@latest/dist/umd/lucide.js`. Use `<i data-lucide="check-circle"></i>` then `lucide.createIcons()`. (No font hosted; SVG injected at runtime.)
- **Stroke weight: 1.75px** (Lucide default scaled). All icons monoline, never filled.
- **Sizing**: 14 / 16 / 20 / 24 px. Icons inherit `currentColor`.
- **Colour**: matches text colour by default. Status icons take their status token (`--live`, `--gap`, etc.). **Never** rendered in `--accent` gold.
- **No emoji.** No unicode-symbol-as-icon (✓, ★, ➔). If you can't find a Lucide glyph, omit and use a label.
- **Logo and brand mark: PNG** at `assets/yody-logo.png` (provided by user). The system also ships a **gradient logo-tile** — a 28×28 `border-radius: 8px` square with `linear-gradient(135deg, #2a2b86, #4a4bc8)` and a white `Y` glyph — used in the header beside the wordmark.
- **Domain badges**: 28×28 rounded squares (8px radius), single-letter (A/B/C…), Inter 600 13px white on a per-domain solid (A=brand navy, B=#c2185b, C=#1565c0, …). These are the system's only "icon-as-letter" pattern.

> **⚠️ Substitution flag:** the upstream codebase uses `lucide-react` (the React port) with the icon SVGs bundled at build time. This design system uses the runtime CDN UMD distribution (same icon set, same SVGs) so HTML mocks load instantly without a build step. If you migrate to a Next.js / React project, swap to `lucide-react` directly.

---

## Substitutions & flags for the user

- **Fonts** are loaded from Google Fonts (CDN). The codebase loads Inter + JetBrains Mono via `next/font/google` (self-hosted at build time). No `.ttf`/`.woff2` files were shipped in the upstream repo, so none are bundled here. **If you need offline-capable font files, please provide the Inter + JetBrains Mono `.woff2` set and I'll wire `@font-face` entries.**
- **Space Grotesk** is a *new* addition I introduced as the optional "hightech / AI-style" display accent. It supports Vietnamese, is available on Google Fonts, and is reserved for hero numerals. Strip it from `colors_and_type.css` if the brand should stay strictly Inter.
- **Lucide icons** are loaded via CDN UMD (see Iconography above) rather than per-icon SVGs in this folder, to keep the system light. If you'd like the SVGs vendored locally, say the word.

---

## How to use

1. Drop `colors_and_type.css` into your `<head>` — it sets up CSS vars + base type.
2. Reference variables, not hex codes: `color: var(--fg-1)`, `background: var(--bg)`, `box-shadow: var(--shadow-md)`.
3. For status, use the `.tag` + `.tag-live | .tag-build | .tag-gap | .tag-plan` utility classes.
4. For full-fidelity recreations of the ITDX portal, see `ui_kits/itdx-portal/index.html`.

---

**Last updated:** 2026-05-20

> **For the full design contract, see [`DESIGN.md`](./DESIGN.md)** — 9 enforcement principles, complete token reference, component anatomy, do/don't rules. This README is the orientation; DESIGN.md is the spec.
