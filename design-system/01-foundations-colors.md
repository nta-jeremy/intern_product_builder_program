# Colors — Foundations

> Semantic color system của YODY ITDX EA Portal, inferred từ rendered HTML và content semantics.

---

## Color Philosophy

Portal sử dụng **dark theme** với accent màu vàng/gold đặc trưng của YODY brand. Palette được thiết kế quanh hai trục:

1. **Semantic status** — màu truyền tải trạng thái (LIVE/DEV/PLAN/GAP)
2. **Hierarchy** — màu phân cấp thông tin (primary, secondary, muted)

---

## Brand Colors

| Token | Semantic | Usage |
|-------|----------|-------|
| `--color-brand-primary` | YODY Yellow/Gold | Logo accent, CTA buttons, highlight text, timeline bar |
| `--color-brand-dark` | Near-black | Page background |
| `--color-brand-white` | White/Off-white | Primary text on dark background |

**YODY brand identity:** "Mặc đẹp mỗi ngày" — thương hiệu thời trang trẻ, năng động. Màu vàng/gold xuất hiện ở logo, dấu ★ milestone, và accent elements.

---

## Status Color System

Đây là color system quan trọng nhất trong portal — được dùng ở badges, tables, cards, và dashboards.

### Status Badge Colors

| Status | Semantic | Color Intent | Usage |
|--------|----------|-------------|-------|
| **LIVE** | Sẵn có · vận hành | Green | Production systems, running capabilities |
| **DEV** | Đang phát triển | Blue | In-progress development work |
| **PLAN** | Trong lộ trình | Yellow/Amber | Committed, trong 2-3 quý tới |
| **GAP** | Chưa có · lỗ hổng | Red/Orange | Missing capabilities, critical blockers |

### Implementation Method Colors

| Tag | Semantic | Color Intent |
|-----|----------|-------------|
| **BUILD** | Tự xây | Blue/Teal — strategic in-house |
| **BUY** | Mua SaaS | Gray/Neutral — commodity vendor |
| **HYBRID** | Kết hợp | Purple/Mixed — vendor + customization |

### Visual Indicators

```
● (filled circle)   = GAP — critical, needs immediate attention
○ (outline circle)  = PLAN — committed but not started
★ (star)            = Featured/flagship product
⚠ (warning)         = GAP product cards
◇ (diamond)         = VENDOR / external system
```

---

## Semantic Colors

### Text Colors

| Token | Usage |
|-------|-------|
| Primary text | Headings, body copy — high contrast on dark bg |
| Secondary text | Metadata, labels, captions |
| Muted text | Footnotes, legal copy, version info |
| Accent text | Key metrics highlighted inline (bold + color) |
| Link text | Navigation links, `→` CTAs |

### Background Colors

| Token | Usage |
|-------|-------|
| Page background | Dark near-black — consistent across all pages |
| Section background | Subtle variation to separate sections (same dark family) |
| Card background | Slightly lighter than page bg, or with border |
| Callout background | Insight boxes, highlighted sections |
| Table header background | Distinct from row bg |

### Border Colors

| Token | Usage |
|-------|-------|
| Default border | Dividers, card borders |
| Subtle border | Table row separators |
| Accent border | Highlighted cards, selected states |

---

## Health Dashboard Colors

Trang `/health` sử dụng percentage-based color coding:

| Range | Color | Meaning |
|-------|-------|---------|
| ≥ 75% | Green | Healthy domain |
| 50–74% | Yellow/Amber | Needs attention |
| < 50% | Red/Orange | Critical gaps |

**Domain health bars:**
- A Kiến trúc Ứng dụng: 64% → Yellow
- B Kiến trúc Dữ liệu: 64% → Yellow
- C Kiến trúc Hạ tầng: 80% → Green
- D Kiến trúc Tích hợp: 40% → Red
- E Kiến trúc Bảo mật: 30% → Red
- F Kiến trúc Nghiệp vụ: 73% → Yellow
- G Quản trị CNTT: 75% → Green
- H Đổi mới & Nghiên cứu: 80% → Green
- I Quản lý Thay đổi: 67% → Yellow

---

## BUILD vs BUY Donut Chart Colors

Từ `/platforms` BUILD vs BUY analysis:

| Category | Proportion | Color Intent |
|----------|-----------|-------------|
| BUILD | 34% (29/86) | Blue — strategic |
| HYBRID | 19% (16/86) | Purple |
| BUY | 48% (41/86) | Gray — commodity |

---

## DMI Roadmap Color Ramp

Trục thời gian 2026→2030 sử dụng gradient màu thể hiện tăng trưởng maturity:

| Year | DMI | Color |
|------|-----|-------|
| 2026 | 32 | Warm amber |
| 2027 | 40 | Transitioning |
| 2028 | 48 | Green-ish |
| 2029 | 55 | Brighter green |
| 2030 ★ | 65 | Gold/highlight — IPO |

---

## Accessibility Notes

- Portal là tài liệu nội bộ (internal documentation) — WCAG compliance không bắt buộc nhưng nên theo
- Dark theme yêu cầu contrast ratio ≥ 4.5:1 cho body text
- Status colors (LIVE/GAP) không nên chỉ dựa vào màu — luôn kèm label text
- `●` vs `○` indicator cũng dùng shape để phân biệt GAP/PLAN, không chỉ màu

---

*Note: Hex values chính xác cần extract từ devtools → Computed styles hoặc source CSS bundle tại `/_next/static/css/`.*
