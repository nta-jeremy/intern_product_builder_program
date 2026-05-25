# Spacing & Layout — Foundations

> Grid system, spacing scale, và layout patterns của YODY ITDX EA Portal.

---

## Page Layout Structure

### Overall Shell

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (sticky top)                                      │
│  ┌─ Logo ─── Chapter Nav Items ──────────────────────┐   │
│  └────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  OUTLINE SIDEBAR (fixed left, desktop only)              │
│  │ 01 · Section 1                                        │
│  │ 02 · Section 2     MAIN CONTENT AREA                 │
│  │ 03 · Section 3     (centered, max-width container)   │
│  │ ...                                                   │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                   │
│  ┌─ 4-column grid ─────────────────────────────────┐    │
│  │ Chương │ Khung & chuẩn │ Nghiên cứu │ Vận hành   │    │
│  └──────────────────────────────────────────────────┘    │
│  Copyright · Version · Sha                               │
└─────────────────────────────────────────────────────────┘
```

### Container Widths

| Context | Max Width | Notes |
|---------|-----------|-------|
| Main content | `max-w-4xl` (≈896px) or `max-w-5xl` (≈1024px) | Centered |
| Full-bleed section | 100vw | Hero sections, timeline bars |
| Sidebar | ~200–240px fixed | Left-aligned, desktop |
| Footer | `max-w-6xl` (≈1152px) | Wider for 4-column grid |

---

## Spacing Scale

Dựa trên Tailwind CSS defaults (base 4px = 1 unit):

| Token | px | rem | Usage |
|-------|-----|-----|-------|
| `space-1` | 4px | 0.25rem | Micro gaps |
| `space-2` | 8px | 0.5rem | Icon + label spacing |
| `space-3` | 12px | 0.75rem | Badge padding |
| `space-4` | 16px | 1rem | Base unit — card padding |
| `space-6` | 24px | 1.5rem | Section element gaps |
| `space-8` | 32px | 2rem | Card margin, section padding |
| `space-12` | 48px | 3rem | Section spacing |
| `space-16` | 64px | 4rem | Major section breaks |
| `space-24` | 96px | 6rem | Page-level section padding |
| `space-32` | 128px | 8rem | Hero section padding |

---

## Section Structure

### Full-Page Scroll Sections

Mỗi trang được chia thành **scroll sections** với Roman numeral identifiers:

```
Section I   → Hero / Introduction
Section II  → Main content block 1
Section III → Main content block 2
Section IV  → Data visualization / Tables
Section V   → Supporting analysis
Section VI  → Next chapter CTA
```

**Scroll behavior:** Native scroll, không có snap. User cuộn tự nhiên qua các sections.

### Section Header Anatomy

```
[Roman numeral — decorative, muted]
[Section theme label — small, uppercase]

## [Section Title] *[emphasis]*

[Lead paragraph — single bullet or 1-2 sentences]
```

---

## Grid Systems

### 2-Column Grid (common)
```
┌─────────────────┬─────────────────┐
│   Content/Text  │   Metric/Chart  │
└─────────────────┴─────────────────┘
```
Dùng cho: KPI + explanation, metric + context.

### 3-Column Grid
```
┌──────────┬──────────┬──────────┐
│  Col 1   │  Col 2   │  Col 3   │
└──────────┴──────────┴──────────┘
```
Dùng cho: 3 pillars (Platform/Process/People), 3 competitive advantages.

### 4-Column Grid
```
┌────────┬────────┬────────┬────────┐
│ KPI 1  │ KPI 2  │ KPI 3  │ KPI 4  │
└────────┴────────┴────────┴────────┘
```
Dùng cho: KPI stat cards (ATLAS: 60+ Nguồn · 270 Pipeline · 16K Queries · 800 Users).

### 5-Column Roadmap Grid
```
┌──────┬──────┬──────┬──────┬──────┐
│ 2026 │ 2027 │ 2028 │ 2029 │ 2030 │
└──────┴──────┴──────┴──────┴──────┘
```
Dùng cho: roadmap tables, capability maturity progression.

### Footer 4-Column Grid
```
┌─────────────┬───────────────┬──────────────┬─────────────┐
│   Chương    │ Khung & chuẩn │  Nghiên cứu  │ Vận hành bởi│
└─────────────┴───────────────┴──────────────┴─────────────┘
```

---

## Responsive Breakpoints

Tailwind CSS breakpoints:

| Breakpoint | Width | Layout change |
|-----------|-------|---------------|
| `sm` | 640px | Mobile → small tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop — sidebar appears |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

**Mobile behavior:**
- Outline sidebar: hidden hoặc collapse vào hamburger/drawer
- Multi-column grids: stack to 1 column
- Chapter scene nav: horizontal scroll

---

## Component Spacing

### Card Padding
```
padding: space-4 (16px) to space-6 (24px)
gap between cards: space-4 to space-6
```

### Table Cell Padding
```
th padding: space-3 (12px) space-4 (16px)
td padding: space-3 (12px) space-4 (16px)
```

### Badge/Pill
```
padding: space-1 (4px) space-2 (8px) to space-1 (4px) space-3 (12px)
border-radius: full (pill shape)
```

### Section Vertical Rhythm
```
h2 margin-bottom: space-4 to space-6
lead paragraph margin-bottom: space-8
content block gap: space-12 to space-16
section gap: space-24 to space-32
```

---

## Page-Specific Layout Patterns

### /platforms — Outline sidebar present
- Left sidebar: 6-item outline with anchor links
- Scene navigator: horizontal bar at top (Bức tranh · 4 cảnh)
- Main content: full-width sections

### /org — Complex multi-column
- RACI matrix: wide table requiring horizontal scroll on mobile
- Radar scorecards: 3-column or 4-column card grid
- Squad overview: 2-column or 3-column card layout

### /health — Dashboard layout
- Summary stats: 3-card horizontal row
- Domain health: grid of 9 domain cards (3×3 or stacked)
- Risk register: full-width table

### /roadmap — Wide matrix
- Theme × Year grid: minimum 6 columns (Themes + 5 years)
- Requires wide viewport or horizontal scroll

---

## Outline Sidebar

```
┌──────────────────┐
│ Outline[N]        │
├──────────────────┤
│ 01 · Section 1   │
│ 02 · Section 2   │ ← active
│ 03 · Section 3   │
│ ...               │
└──────────────────┘
```

- Fixed to left side trên desktop
- Numbers match Roman numeral sections
- Active state highlighted (current section in viewport)
- Số trong bracket = total sections: `Outline6`

---

## Timeline Bar

```
2026 ─────────────────────────────── IPO 2030
```

- Full-width horizontal bar
- Year markers at both ends
- Appears in hero sections và footer
- Visual metaphor: hành trình từ hiện tại → IPO

---

## Scene Navigator

Multi-page chapter có scene navigator:

```
Bức tranh · 4 cảnh
  [1 Platforms] →[2 ATLAS] →[3 Capabilities] →[4 Organization]
```

- Horizontal list với `→` separators
- Active page highlighted differently
- Current page: no `→` prefix
- Other pages: `→` prefix indicating navigation direction
