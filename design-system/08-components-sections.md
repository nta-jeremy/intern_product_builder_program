# Section Patterns — Components

> Cấu trúc page sections, scroll patterns, và chapter architecture trong portal.

---

## Page Architecture

### Single Chapter Page (e.g., `/`)
```
┌─────────────────────────────────────┐
│ NAVBAR                               │
├─────────────────────────────────────┤
│ HERO SECTION (I)                    │
│  - Chapter label                    │
│  - H1 title                         │
│  - Lead paragraph                   │
│  - CTA links                        │
├─────────────────────────────────────┤
│ CONTENT SECTION II                  │
│  - Roman numeral                    │
│  - Theme label                      │
│  - H2 title                         │
│  - Content (cards/tables/text)      │
├─────────────────────────────────────┤
│ CONTENT SECTION III–V               │
├─────────────────────────────────────┤
│ CLOSING / NEXT CHAPTER CTA (VI)     │
│  - Navigation to next chapter       │
├─────────────────────────────────────┤
│ FOOTER                              │
└─────────────────────────────────────┘
```

### Multi-Section Page with Sidebar (e.g., `/platforms`)
```
┌─────────────────────────────────────┐
│ NAVBAR                               │
├────────┬────────────────────────────┤
│ SCENE  │ CHAPTER BREADCRUMB         │
│ NAV    ├────────────────────────────┤
│        │ HERO SECTION (I)           │
│ OUT-   ├────────────────────────────┤
│ LINE   │ CONTENT SECTIONS           │
│ SIDE-  │ II · III · IV · V · VI     │
│ BAR    │                            │
│        │                            │
├────────┴────────────────────────────┤
│ FOOTER                              │
└─────────────────────────────────────┘
```

---

## Section Anatomy

### Hero Section

```
[CHAPTER LABEL]
Chương 02 · Bức tranh — Value Stream & Platforms

# Main H1 Title
*emphasis word*

- [Lead bullet 1]
- [Lead bullet 2]

[Optional CTA button/link]
```

**Chapter label format:**
```
Chương [NN] · [Theme Name] — [Section Title]
```

### Content Section

```
[Roman numeral — decorative]
II

[Optional theme label — small caps/muted]
Subway map · Value stream

[H2 section title]
## Mỗi platform có những phần mềm gì, làm gì, và thiếu gì tới 2030

[Optional sub-stats row]
Atomic inventory
86 sản phẩm × 6 platforms
56% vận hành  |  44% roadmap

[Main content]
[cards / tables / charts / prose]
```

### Closing / Next-Chapter Section

```
[Section number]
VI

[Context label]
Chương tiếp theo

[H2 title]
## Đi sâu vào bức tranh hiện trạng

[Description]
Khám phá value stream ngành thời trang...

[CTA links]
[→ Chương 02 · Bức tranh]
[Xem ATLAS deep-dive]

[Optional preview visual]
```

---

## Roman Numeral Section Pattern

Every major section within a page uses Roman numerals I → VI (or more):

```
I    → Hero / Introduction
II   → First content block
III  → Second content block
IV   → Data / Visualization
V    → Analysis / Supporting
VI   → CTA / Next chapter
```

**Styling:** Large, faded/muted background number — decorative function, not navigation.

---

## Chapter Label Pattern

```
Chương [NN] · [Theme] — [Title]
```

| Chapter | Theme | Example |
|---------|-------|---------|
| 01 | AI-native × Craftsmanship | `Chương 01 · AI-native × Craftsmanship` |
| 02 | Bức tranh | `Chương 02 · Bức tranh — Value Stream & Platforms` |
| 03 | Chiến lược | `Chương 03 · Chiến lược — Khung số hóa` |
| 04 | Hành trình | `Chương 04 · Hành trình — Sức khoẻ` |

**Note:** The em dash `—` separates chapter theme from specific page title.

---

## Timeline Bar Section

Appears near hero sections — full-width horizontal timeline:

```
2026 ─────────────────────────────── IPO 2030
```

Or with milestones:
```
2026         2028         ★ 2030 · IPO
2.800tỷ     4.032tỷ      5.806tỷ
[label]     [label]      [label]
```

**Styling:** Full bleed, sticky or scrolling with page. Acts as persistent orientation for the user.

---

## Sub-stats Row

Quick KPI row under section title — before main content:

```
Atomic inventory
86 sản phẩm × 6 platforms    56% vận hành    44% roadmap
```

Or:
```
LIVE 41 · 48%   DEV 7 · 8%   PLAN 20 · 23%   GAP 18 · 21%
```

Pattern: Key numbers + percentages in a horizontal row, small but prominent.

---

## Insight Banner

High-priority callout within a section — visually distinct from surrounding content:

```
┌──────────────────────────────────────────────────────────┐
│ Kết luận                                                  │
│                                                           │
│ **2028 là điểm đòn bẩy**: sau 2 năm đầu tư nền tảng,   │
│ công nghệ bắt đầu sinh lời. Đó là khoảnh khắc YODY     │
│ chuyển từ retailer truyền thống sang                     │
│ *AI-Native fashion leader*.                              │
└──────────────────────────────────────────────────────────┘
```

Used for: key conclusions, pivotal insights, "so what" statements.

---

## Roadmap Section (DMI steps)

Trang homepage — 5-step roadmap with year cards:

```
┌──────────────────────────────────────────┐
│  2026   2027   2028   2029   2030        │
│  32DMI  40DMI  48DMI  55DMI  65DMI★     │
│                                          │
│  ┌────────────────────────┐             │
│  │ 2026                   │ ← active    │
│  │ 32                     │             │
│  │ DMI                    │             │
│  │                        │             │
│  │ Chuỗi Cung Ứng E2E    │             │
│  │ E2E Supply Chain       │             │
│  │                        │             │
│  │ 38/ 79                 │             │
│  │ Năng lực kinh doanh    │             │
│  │ L2 mature              │             │
│  └────────────────────────┘             │
└──────────────────────────────────────────┘
```

5 Roadmap cards:
| Year | DMI | Theme |
|------|-----|-------|
| 2026 | 32 | Chuỗi Cung Ứng E2E |
| 2027 | 40 | Dữ liệu & AI nền tảng |
| 2028 | 48 | Trải nghiệm KH cá nhân hoá |
| 2029 | 55 | Vận hành số đo lường được |
| 2030 ★ | 65 | Doanh nghiệp AI-native |

**Bottom note:** "IPO 2030 Readiness — tuân thủ · quản trị · sẵn sàng niêm yết"

---

## Pillars Section (3-column)

Trang homepage — "3 trụ cột":

```
┌──────────────┬──────────────┬──────────────┐
│     I        │     II       │     III      │
│  Nền tảng    │  Quy trình   │  Con người   │
│  Platform    │  Process     │  People      │
│              │              │              │
│  P1          │  P4          │  P7          │
│  ### AI-Native│ ### Build vs Buy│### Performance│
│              │              │  Culture     │
│  Proof:      │  Proof:      │  Proof:      │
│  ATLAS...    │  0/6 BUY...  │  3 BP...     │
│              │              │              │
│  [→ detail]  │  [→ detail]  │  [→ detail]  │
└──────────────┴──────────────┴──────────────┘
```

3P Framework: Platform · Process · People (P1–P9 principles).

---

## Note/Footnote Pattern

```markdown
* **DMI** — Chỉ số trưởng thành về số hoá của tổ chức. [Xem cách tính chi tiết↗](url)
```

Footnotes use:
- `*` bullet prefix
- Bold term definition format: `**Term** — Definition`
- Link to detailed explanation with `↗`

---

## Banner Alert (Version redirect)

```
[→ Xem v2 canonical](https://yody-itdx-ea.vercel.app/maturity)
```

Non-intrusive banner at top of page indicating version redirect. Minimal styling.

---

## Page Summary Box

Some pages end with a "serves what" summary:

```
Bức tranh này phục vụ
5 Yearly Tech Themes + IPO 2030 Readiness

• 2026 · Chuỗi Cung Ứng E2E
• 2027 · Dữ liệu & AI nền tảng
• 2028 · Trải nghiệm KH cá nhân hoá
• 2029 · Vận hành số đo lường được
• 2030 · Doanh nghiệp AI-native
• IPO 2030 Readiness

[→ Lộ trình Chương 01]
```

---

## Section Pattern Summary

| Pattern | Pages | Purpose |
|---------|-------|---------|
| Roman numeral divider | All | Section counting/navigation |
| Chapter label | All | Portal positioning |
| Hero with lead bullets | All | Page intro |
| Sub-stats row | Data pages | Quick KPI context |
| 3-pillar column | `/`, `/principles` | Framework presentation |
| 5-step roadmap | `/` | Progression visualization |
| Full-bleed timeline bar | `/`, various | Temporal orientation |
| Insight banner/callout | Multiple | Key insight highlight |
| Footnote/note | `/`, `/platforms` | Data source, definition |
| Closing CTA section | All | Drive to next chapter |
