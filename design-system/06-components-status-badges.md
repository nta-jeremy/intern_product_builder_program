# Status Badges — Components

> Hệ thống badge/tag quan trọng nhất trong portal — phản ánh operational status, development stage, và implementation method của từng item.

---

## Taxonomy Overview

Portal dùng **2 loại badge độc lập**:

| Type | Values | Answers |
|------|--------|---------|
| **Operational Status** | LIVE · DEV · PLAN · GAP | "Currently in what state?" |
| **Implementation Method** | BUILD · BUY · HYBRID | "How are we building this?" |

Hai loại này thường xuất hiện cùng nhau trên product cards:
```
BUILD · P. Sản phẩm → GA 2026
[STATUS]
```

---

## Operational Status Badges

### LIVE
```
┌──────┐
│ LIVE │
└──────┘
```
- **Meaning:** Đang vận hành production, người dùng thực tế đang dùng
- **Color:** Green — positive, operational
- **Alternate label (health dashboard):** "Sẵn có" / "sẵn có"
- **Count on `/platforms`:** 41 products (48%)
- **Count on `/health`:** 25 EA items (61%)

### DEV
```
┌─────┐
│ DEV │
└─────┘
```
- **Meaning:** Đang phát triển tích cực, chưa GA
- **Color:** Blue — active, in progress
- **Typically paired with:** `★` for flagship items in DEV
- **Count on `/platforms`:** 7 products (8%)

### PLAN
```
┌──────┐
│ PLAN │
└──────┘
```
- **Meaning:** Đã committed trong roadmap, trong vòng 2-3 quý
- **Color:** Yellow/Amber — pending, scheduled
- **Visual indicator:** `○` (outline circle) in list views
- **Alternate label (health dashboard):** "kế hoạch"
- **Count on `/platforms`:** 20 products (23%)
- **Count on `/health`:** 7 EA items (17%)

### GAP
```
┌─────┐
│ GAP │
└─────┘
```
- **Meaning:** Năng lực chưa có, cần đầu tư — critical missing piece
- **Color:** Red/Orange — warning, urgent
- **Visual indicator:** `●` (filled circle) in list views, `⚠` on product cards
- **Alternate label (health dashboard):** "lỗ hổng"
- **Count on `/platforms`:** 18 products (21%)
- **Count on `/health`:** 9 EA items (22%)

---

## Implementation Method Badges

### BUILD
```
┌───────┐
│ BUILD │
└───────┘
```
- **Meaning:** Tự xây in-house — core competitive capability
- **Color:** Blue/Teal — strategic investment
- **Guiding principle:** P4 "Build vs Buy" — PLM, OMS, CDP, Loyalty
- **Example:** YODY PLM, APS, ATLAS pipeline engine

### BUY
```
┌─────┐
│ BUY │
└─────┘
```
- **Meaning:** Mua SaaS/vendor — commodity functionality
- **Color:** Gray/Neutral — standard procurement
- **Examples:** Google Workspace, Keycloak, AWS/GCP, Adobe Creative Suite

### HYBRID
```
┌────────┐
│ HYBRID │
└────────┘
```
- **Meaning:** Vendor platform + significant customization/extension
- **Color:** Purple/Mixed — middle ground
- **Examples:** WMS + Robotic (Viettel Post), platforms with in-house wrappers

---

## Badge Combinations

### On Product Cards

Standard single-line metadata:
```
BUILD · P. Sản phẩm → GA 2026
```

Multi-team:
```
BUILD · P. Cung ứng, P. Vận hành Hàng hóa +1 → Q3.2026 (P1) → Q2.2027 (P2)
```

No timeline:
```
BUY · P. Sản phẩm
```

With note:
```
BUY · P. Sản phẩm → 2028
POC trước khi mass adopt · Theme 2028 Personalized CX
```

External/VENDOR:
```
◇ VENDOR LIVE
```
`◇` (diamond) prefix = external vendor system, not internal

---

## Status Indicators in Lists

In Pre-IPO blockers and risk registers, status is shown as filled/outline circles:

```
● GAP    AEGIS    ITGC Framework
● GAP    AEGIS    GRC Platform
● GAP    AEGIS    DLP (Data Loss Prevention)
○ PLAN   ATLAS    Master Data Management (MDM)
○ PLAN   ATLAS    Data Security & Privacy
● GAP    ATLAS    Data Quality & QA/QC
```

| Symbol | Status | Visual |
|--------|--------|--------|
| `●` | GAP | Filled red/orange circle |
| `○` | PLAN | Outline circle (yellow/gray) |

---

## Severity Tags on Health Dashboard

Risk register table uses "Mức độ" (severity) column:

| Value | Meaning |
|-------|---------|
| GAP | Critical — must address before IPO |

No graduated severity (P1/P2/P3) — binary GAP vs rest in risk register.

---

## Status in Summary Stats

Health page summary cards:
```
Đang LIVE    0   [N]     61% / 41 năng lực
Còn GAP      0   [N]     Cần đầu tư trước IPO 2030
Đang PLAN    0   [N]     Trong lộ trình 2-3 quý tới
```

Pattern: Vietnamese label + count + supporting context

---

## Domain Letter Tags

Health page dùng single-letter tags để identify capability domains:

```
A — Kiến trúc Ứng dụng
B — Kiến trúc Dữ liệu
C — Kiến trúc Hạ tầng
D — Kiến trúc Tích hợp
E — Kiến trúc Bảo mật
F — Kiến trúc Nghiệp vụ
G — Quản trị CNTT
H — Đổi mới & Nghiên cứu
I — Quản lý Thay đổi
```

Used as column prefix in risk register:
```
| A | WMS — Warehouse Management | SIGMA | GAP |
| B | Master Data Management     | BI    | GAP |
```

---

## Platform Code Tags

Short codes trong subway map và blockers:

```
PHOENIX   UNICORN   IRIS   GLAUX   ATLAS   AEGIS
```

**Display format:** All caps, monospace-adjacent.
**In blockers:** Platform code precedes item description:
```
● GAP    AEGIS    [Item Name]
○ PLAN   ATLAS    [Item Name]
```

---

## Theme Tags (Year Tags)

Trong product cards và blocker cards, theme year context:

```
2027 · Dữ liệu & AI
2026 Chuỗi Cung Ứng E2E
IPO 2030 Readiness
Theme 2028 Personalized CX
```

Format: `[Year] · [Theme Name]` or `[Year][ThemeName]` — alignment indicator.

---

## Squad/Team Tags

```
P. Sản phẩm      = Product squad (DELTA)
P. Cung ứng      = Supply chain squad (SIGMA)
P. Vận hành HH   = Operations squad
P. Quản trị RR   = Risk/governance squad
BP. Business Insights = BI squad
BETA             = Infrastructure/security squad
```

---

## Badge Rules Summary

| Rule | Detail |
|------|--------|
| Status + Method coexist | Product can be `LIVE` + `BUILD` simultaneously |
| Method is stable | BUILD/BUY/HYBRID rarely changes once decided |
| Status evolves | GAP → PLAN → DEV → LIVE over time |
| No mixed status | One status per product (not "LIVE/DEV") |
| ★ is orthogonal | Star = flagship, independent of status |
| ◇ VENDOR is orthogonal | VENDOR = external system, can be LIVE/PLAN etc. |
