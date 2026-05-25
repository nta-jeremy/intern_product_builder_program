# YODY Design System for Landing Page

This document extracts and adapts the YODY ITDX Enterprise Architecture design system for the tech landing page project.

---

## Brand Identity

- **Brand**: YODY — Vietnamese mass-market fashion brand (274 stores, IPO target 2030)
- **Aesthetic**: **light hightech · art accent reserve · craftsmanship · AI-native**
- **ITDX Department**: Supply Chain (PHOENIX), Retail (UNICORN), Innovation (GLAUX)
- **Target**: Tech services, enterprise clients, internal/external digital surfaces

---

## 1. Design Philosophy

**BoD-first, lean-back, projector-readable.**

- Consumed on 14" laptop or projector at 1080p from 3m
- Visual interest from **content** (numerals, italic accents, watercolor blobs) not chrome (gradients, borders, surface tints)
- **White-dominant. Generous whitespace. Soft brand-tinted shadows.**

---

## 2. Color Tokens

### Brand Anchor
```
--brand        #2a2b86   Primary navy · headlines · brand chunk
--brand-light  #4a4bc8   Gradient pair · hover
--brand-deep   #16175a   Deep variant · footer
--brand-tint   #eeeefb   Brand 50 wash · subtle bg
--brand-gold   #fcaf16   Decorative-only · logo · gradients
```

### Accent Semantic Discipline (1 fixed role per accent)
```
--iris   #7c6cf5   AI / tech       · DEFAULT (90% of accent surface)
--gold   #fcaf16   Climax          · 1 moment per page MAX
--mint   #10b981   Growth · LIVE   · prosperity
--rose   #f472b6   Human · ESG     · warm care
--gap    #ef4444   ALERT ONLY
```

### Surfaces
```
--bg        #fcfcff   Paper (default)
--bg-2      #f4f5fb   Mist (alt sections)
--bg-muted  #ecedf8   Lavender (chip / hover)
--bg-ink    #0e0f24   Dark surface (hero / footer only)
--bg-warm   #fbfaf6   Hero warm wash
```

### Text
```
--fg-1  #1a1b3a   Primary ink (navy-tinted)
--fg-2  #5a5c7e   Body
--fg-3  #6b6d8c   Label / metadata
```

### Shadows (iris-tinted, never neutral black)
```
--shadow-sm  0 1px 2px  rgba(74,75,200,0.05)
--shadow-md  0 4px 16px rgba(74,75,200,0.08)
--shadow-lg  0 12px 32px rgba(74,75,200,0.12)
--shadow-xl  0 16px 40px rgba(74,75,200,0.14)
```

---

## 3. Typography

### Font Stack (Google Fonts + Self-hosted Be Vietnam Pro)
```
Inter           → body, labels, captions, nav, buttons
Be Vietnam Pro  → brand chrome, wordmark, card titles
Montserrat      → impact display, H1/H2, KPI numerals, roman numerals (italic 800)
Playfair Display Italic → HERO ONLY — 1 art moment per page
JetBrains Mono  → tags, code, years, technical metadata
Dancing Script  → hero signature line only
```

### Scale
```
--type-hero        800 clamp(80px, 8.4vw, 120px)/0.94   Montserrat
--type-display     800 clamp(64px, 6.4vw, 96px)/0.98    Montserrat
--type-h1          800 clamp(48px, 5.2vw, 64px)/1.08     Montserrat
--type-h2          700 clamp(32px, 3.4vw, 40px)/1.18     Montserrat
--type-h3          700 26px/1.3                          Montserrat
--type-card-title  700 20px/1.35                         Be Vietnam Pro
--type-body-lg     400 23px/1.65                         Inter
--type-body        400 19px/1.7                          Inter
--type-body-sm     400 16px/1.6                          Inter
--type-label       500 14px/1.4                          Inter
--type-tag         700 12px/1                            JetBrains Mono
--type-eyebrow     700 13px/1                            JetBrains Mono (0.32em tracking)
```

### Reserve Rules
- **Playfair italic = 1 moment / portal** (hero + insight only)
- **Roman numerals (I–V) = Montserrat italic 800** (geometric/technical, not ornamental)
- **No font #6.** If you reach for a sixth family, it's a layout problem.

---

## 4. Spacing & Layout

### Base Unit
- **4px base unit.** Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
- **Section padding**: 96px 56px desktop, 48px 16px mobile
- **Container**: max-width 1280px (1200px default, 1440px for matrix/roadmap)

### Breakpoints (Content-Based)
```
Mobile (Base)   320px - 768px   Single column, stacked, thumb nav
Tablet          768px - 1024px  Two columns, larger touch targets
Desktop         1024px - 1440px Multi-column, hover states
Large Desktop   1440px+         Max-width containers, spacious layouts
```

---

## 5. Components

### Section Template
```
┌─ [s-eyebrow]  mono 13px 0.32em · with flanking dashes
├─ [s-title]    Montserrat 800 56px · max-width 920
├─ [s-sub]      Inter 21px · max-width 720
├─ ┄┄┄ (mt-56) content blocks ┄┄┄
└─ [insight]    box · gold spine · Kết luận label · italic accent
```

### Insight Callout (mandatory per section)
- 36 × 44 padding, `--shadow-sm`
- Gold spine 3px left, 24px inset top/bottom
- Label: mono 12px, 0.3em, `fg-3`
- Body: 22px Inter, `<em>` is Playfair italic 700 in `--iris` or `--gold-deep`

### CTA System
```
.cta             56px height · 32px padding · pill
.cta-primary     brand bg · white text · hover lift + shadow-brand
.cta-secondary   transparent · border · hover bg-muted
.cta-gold        gold bg · ink text · hover lift + shadow-gold
```

### Status Pills
```
LIVE  → mint-deep on mint-bg
BUILD → iris-deep on iris-bg
GAP   → gap on gap-bg (ALERT ONLY)
PLAN  → gold-deep on plan-bg
```

---

## 6. Animation & Motion

### One Ambient Motion Budget per Page
Pick ONE:
- Hero brush-line draw (1s, once on load)
- Hero chart pulse (3s loop, very subtle)
- Signature script reveal (fade in, 500ms)
- KPI count-up (600ms)
- Card hover lift (translateY −2px, 250ms)

### Easing
```
--ease-out:        cubic-bezier(0.4, 0, 0.2, 1)      // UI standard
--ease-overshoot:  cubic-bezier(0.34, 1.56, 0.64, 1) // side-panel only
```

### Durations
- Hover feedback: 150ms
- Component state: 200ms
- Page-level transitions: 300ms
- Count-up KPI: 400–600ms
- Hero brush stroke: 1000ms

### Hover States
- Card shadow `sm → md`, optional `translateY(-2px)` only for click-target tiles
- **Never** scale > 1.02
- Press: brief opacity dip to 0.85 + 1px down

---

## 7. Iconography

- **Primary: Lucide** monoline icons, 1.75px stroke, 16–24px
- Icon colour = text colour (`currentColor`)
- **Never** gold. Never iconography larger than 32px in body content.
- Domain badges: 28×28 rounded squares (8px radius), single-letter, Inter 600 13px white

---

## 8. Imagery & Decoration

- **Watercolor blobs** (hero only): SVG `<feTurbulence>` + `<feDisplacementMap>` + radial gradient
- **Brush underline** (hero only): SVG path with gold gradient stroke
- **No flat illustration** for navigation icons. Lucide only.
- **Photography**: warm neutral tones, Vietnamese context, natural light. Never B&W, never heavy filters.
- **Hero mesh**: `radial-gradient(20% 50%, rgba(navy/4%)) + radial-gradient(80% 80%, rgba(gold/3%))`
- **Dot grid**: optional layered radial dot pattern at 6% navy + 4% gold, 40px / 120px cell

---

## 9. The 9 Enforcement Principles

| # | Principle |
|---|---|
| **I** | **4–5 sub-blocks max** per section |
| **II** | **Claim → evidence → conclusion** (end with italic Kết luận callout) |
| **III** | **2 accents max** per section (iris, gold, mint, rose) |
| **IV** | **Roman numerals I–V rhythm** for lists ≤5 |
| **V** | **Year card DNA unified** across all surfaces |
| **VI** | **≥19px body** (blog-portal readable) |
| **VII** | **Insight callout** per section |
| **VIII** | **1 ambient motion budget** per page |
| **IX** | **Cross-chapter consistency** — anything used twice = component |

---

## 10. Landing Page Adaptation Notes

### Sections (applying YODY principles to landing page)
1. **Hero** — value prop + CTA + brand line decoration (follows Principle II: claim → evidence → conclusion)
2. **Logo Bar** — 5-8 partner/customer logos (YODY stores count, partners)
3. **Value Prop Block** — 3 key benefits (Roman numerals I–III, iris accent)
4. **Feature Blocks** — 3-4 problem/solution pairs (max 5 sub-blocks per section)
5. **Social Proof** — testimonials with photo/name/title (rose accent for human)
6. **Final CTA** — restate value prop + strong CTA (gold climax moment)

### Adjustments from original YODY portal:
- **No data tables / charts** — this is a marketing landing page, not a dashboard
- **No status pills** (LIVE/BUILD/GAP/PLAN) unless showing platform status
- **No year cards / roadmaps** unless showing IPO timeline
- **No side panels** — landing page is single-scroll, drill-down goes to separate pages
- **No complex KPI cards** — simplify to stat blocks with big-num gradient
- **Keep insight callouts** — adapt "Kết luận" to English "Insight" or "Key Takeaway"

### Content Voice for Landing Page
- Direct, clinical, executive tone
- Numbers and named owners are trust units
- Insight before data
- No exclamation marks, no marketing fluff
- Bilingual cues where needed (Vietnamese labels + English tech terms)

---

**Source**: `design-system/YODY Design System/` — adapted for NextJS landing page.
**Last updated**: 2026-05-25
