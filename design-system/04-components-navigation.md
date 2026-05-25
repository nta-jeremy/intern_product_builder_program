# Navigation — Components

> Tất cả navigation components của YODY ITDX EA Portal.

---

## 1. Top Navigation Bar (Navbar)

### Structure
```
[Skip nav]  [Logo]  [Chapter 01]  [Chapter 02 ▾]  [Chapter 03 ▾]  [Chapter 04 ▾]
```

### Skip Navigation
```html
<!-- Screen reader & keyboard accessibility -->
<a href="#main-content">Bỏ qua điều hướng</a>
```
Visually hidden by default, shows on focus. Pattern: `[Bỏ qua điều hướng](#main-content)`.

### Logo
```
[YODY logo image] ITDX EA
```
- Image: `/yody-logo.webp` (Next.js optimized)
- Text: `ITDX EA` — divisi identifier
- Links to: `/` (homepage)
- Responsive: logo always visible, text may hide on mobile

### Chapter Navigation Items

| Item | Label | Type | Link |
|------|-------|------|------|
| 01 | `01 Tầm nhìn` | Direct link | `/` |
| 02 | `02 Bức tranh` | Dropdown | Multiple sub-pages |
| 03 | `03 Chiến lược` | Dropdown | Multiple sub-pages |
| 04 | `04 Hành trình` | Dropdown | Multiple sub-pages |

**Label format:** `[number][space][Vietnamese name]`  
Number prefix: `01`, `02`, `03`, `04` — always 2 digits.

### Dropdown Menus

**Chương 02 · Bức tranh:**
- Value Stream & Platforms → `/platforms`
- Nền tảng dữ liệu · ATLAS → `/atlas`
- Năng lực kinh doanh → `/capabilities`
- Tổ chức → `/org`

**Chương 03 · Chiến lược:**
- Khung số hóa → `/digitization-framework`
- Nguyên tắc → `/principles`
- AI-Native Enterprise → `/ai-native-enterprise`
- Sáng kiến → `/initiatives`

**Chương 04 · Hành trình:**
- Lộ trình → `/roadmap`
- Sức khỏe → `/health`

---

## 2. Outline Sidebar

Xuất hiện trên các trang multi-section (e.g., `/platforms`, `/atlas`, `/org`).

### Anatomy
```
Outline[N]           ← header with section count
─────────────
01 · [Section label]  ← with anchor link
02 · [Section label]  ← active = highlighted
03 · [Section label]
...
```

### Properties
- **Position:** Fixed left, desktop only
- **Width:** ~200–240px
- **Scroll behavior:** Highlights active section as user scrolls (intersection observer)
- **Number format:** `01`, `02`, `03`... (zero-padded)
- **Separator:** `·` between number and label

### Real example from `/platforms`:
```
Outline6
01 · Tổng quan         (#hero "8 stage × 6 platform")
02 · Value stream      (#value-stream "Subway map · Matrix")
03 · Chi tiết platform (#detail-arch "Hiện trạng + Roadmap")
04 · BUILD vs BUY      (#build-buy "Strategic posture")
05 · Pre-IPO blockers  (#pre-ipo-blockers "GAP analysis 2030")
06 · Tiếp theo · ATLAS (#next-atlas "Xương sống dữ liệu")
```

Each item has:
- Anchor ID (`#hero`, `#value-stream`, etc.)
- Tooltip/subtitle in quotes

---

## 3. Scene Navigator

Dùng khi một "chương" có nhiều trang liên tiếp.

### Anatomy
```
[Chapter Name] · [N] cảnh
[1 Page1] →[2 Page2] →[3 Page3] →[4 Page4]
```

### Real example from `/platforms`:
```
Bức tranh · 4 cảnh

1. [1 Platforms]              ← current (no arrow prefix)
2. →[2 ATLAS]                 ← next pages have → prefix
3. →[3 Capabilities]
4. →[4 Organization]
```

### Properties
- Horizontal list, top of page (below navbar)
- **Current page:** plain label, highlighted
- **Other pages:** `→` prefix + link
- Mobile: horizontal scroll
- "cảnh" = "scenes/views" — cinematic metaphor

---

## 4. Chapter Breadcrumb

Appears at bottom of pages as prev/next navigation:

```
[← Chương 03 · Chiến lược]         [Tiếp theo →]
```

Ví dụ từ `/health`:
```
← Chương 03 · Chiến lược    (links to /digitization-framework)
```

---

## 5. In-page Anchor Links

### CTA Links (Explore / Go deeper)
```markdown
[Khám phá lộ trình →](#commitments)
[Xem chi tiết roadmap](https://yody-itdx-ea.vercel.app/roadmap)
[→ Đi sâu vào ATLAS](https://yody-itdx-ea.vercel.app/atlas)
[→ Lộ trình Chương 01](https://yody-itdx-ea.vercel.app/)
```

**Patterns:**
- Internal anchor: `[Label →](#anchor-id)` — `→` at end
- Internal page: `[→ Label](url)` — `→` at beginning
- External: `[Label↗](url)` — `↗` indicates new tab

### Section Cross-links
```markdown
[S5 Blockers](#pre-ipo-blockers)
[Chương 03](https://yody-itdx-ea.vercel.app/digitization-framework)
[→ chi tiết](https://yody-itdx-ea.vercel.app/atlas)
[→ bức tranh hiện trạng](https://yody-itdx-ea.vercel.app/platforms)
[→ tổ chức](https://yody-itdx-ea.vercel.app/org)
```

---

## 6. Footer Navigation

### Structure
```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] ITDX · Enterprise Architecture                        │
│ [Tagline]                                                    │
├────────────┬─────────────────┬───────────────┬──────────────┤
│ Chương     │ Khung & chuẩn   │ Nghiên cứu    │ Vận hành bởi │
├────────────┼─────────────────┼───────────────┼──────────────┤
│ Tầm nhìn   │ TOGAF+APQC↗     │ McKinsey↗     │ ITDX YODY    │
│ Platforms  │ CMMI 5 cấp↗     │ BCG↗          │ HOD: ...     │
│ ATLAS      │ ISO 27001↗      │ Bain↗         │ BP. BI...    │
│ Năng lực   │ IFRS/VAS↗       │ McKinsey↗     │ YDP↗         │
│ Tổ chức    │                  │               │              │
│ Khung số   │                  │               │              │
│ Sức khỏe   │                  │               │              │
│ Lộ trình   │                  │               │              │
└────────────┴─────────────────┴───────────────┴──────────────┘
│ © 2026 YODY Fashion · Tài liệu nội bộ ITDX YODY             │
│ Portal v2.3 · Cập nhật T5/2026                              │
│ Architecture of record · sha b4f8528                        │
└──────────────────────────────────────────────────────────────┘
```

### Footer Tagline
```
Mặc đẹp mỗi ngày — vận hành bằng dữ liệu, dẫn dắt bằng AI.
```

### Footer Timeline Bar
```
2026IPO 2030
```
Appears above footer columns — decorative timeline reference.

### Footer Column 1 — Chương
Internal links, no external indicator:
- Tầm nhìn → `/`
- Value Stream & Platforms → `/platforms`
- Nền tảng dữ liệu · ATLAS → `/atlas`
- Năng lực kinh doanh → `/capabilities`
- Tổ chức → `/org`
- Khung số hóa → `/digitization-framework`
- Sức khỏe → `/health`
- Lộ trình → `/roadmap`

### Footer Column 2 — Khung & chuẩn
External links (↗):
- TOGAF + APQC PCF v7.4↗
- CMMI 5 cấp × 5 chiều↗
- ISO 27001 + NIST CSF↗
- IFRS / VAS · PDPL 2026↗

### Footer Column 3 — Nghiên cứu
External research citations (↗):
- McKinsey AI Retail 2024↗
- BCG Cá nhân hoá 2023↗
- Bain Công nghệ Bán lẻ 2024↗
- McKinsey "Rewired" 2023↗

### Footer Column 4 — Vận hành bởi
People/org attribution:
- ITDX YODY / HOD: Tăng Duy Phương
- BP. Business Insights / TBP: Đinh Thanh Bình
- YDP — YODY Data Platform↗ Executive Overview

### Footer Build Info
```
© 2026 YODY Fashion · Tài liệu nội bộ ITDX YODY
Portal v2.3 · Cập nhật T5/2026
Architecture of record · last reviewed by CTOFioenixLock · 2026-05-20 · sha b4f8528
```

---

## 7. Back to Top

```
[↑ Về đầu trang]   links to #main-content
```

Appears at bottom of each page before footer. Simple text link with `↑` arrow.

---

## Navigation Summary

| Component | Page location | Desktop | Mobile |
|-----------|--------------|---------|--------|
| Navbar | Top sticky | Always visible | Logo + hamburger? |
| Outline sidebar | Left fixed | ✓ multi-section pages | Hidden |
| Scene navigator | Below navbar | Horizontal list | Scroll |
| Chapter breadcrumb | Bottom of page | `← prev` / `next →` | Same |
| Back to top | Before footer | `↑` link | Same |
| Footer | Page bottom | 4-column grid | Stack |
