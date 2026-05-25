# Cards — Components

> KPI cards, platform cards, product cards, insight callouts, và các card variants trong portal.

---

## 1. KPI Stat Card

Component hiển thị một metric quan trọng — dùng nhiều trong hero sections, platform summaries, và ATLAS overview.

### Anatomy
```
┌─────────────────────┐
│   [NUMBER][UNIT]     │  ← large display number
│   [Label text]       │  ← descriptor
└─────────────────────┘
```

### Variants

**Large hero KPI** (homepage timeline):
```
2026          2028          ★ 2030 · IPO
2.800tỷ      4.032tỷ       5.806tỷ
Chuỗi cung   CX · AI cá   NET 12%
ứng E2E      nhân hoá     Niêm yết & tăng trưởng
```

**ATLAS summary KPIs** (4-col row):
```
60+          270          16K          800
Nguồn        Pipeline     Queries/ngày  Người dùng
```

**Platform detail KPIs** (4-col):
```
86           56%          44%
sản phẩm     vận hành     roadmap
× 6 platforms
```

**Health dashboard KPIs** (3-col):
```
0%           0            0
Điểm tổng   Đang LIVE     Còn GAP
hợp          61% / 41 năng lực
```

### Properties
- Number: Very large, bold, prominent
- Unit: Inline with number (no space) or subscript — `tỷ`, `/ngày`, `+`, `%`
- Label: Smaller, muted, below number
- `★` prefix: Milestone item (IPO 2030)
- Layout: Typically in horizontal row of 3–4 cards
- Border: Subtle or none

---

## 2. Platform Card

Hiển thị một platform (PHOENIX, UNICORN, etc.) với product count và status summary.

### Anatomy
```
┌─────────────────────────────┐
│  [PLATFORM NAME]([count])   │
│  ──────────────────────     │
│  [N]LIVE [N]DEV [N]PLAN [N]GAP  │
│                             │
│  [Stage labels it covers]   │
└─────────────────────────────┘
```

### Real example:
```
PHOENIX(8)    ← name + product count
2LIVE 2DEV 2PLAN 2GAP    ← status distribution
Tiền thành phẩm          ← value stream stages
```

### Status distribution bar
Dạng mini status summary dưới tên platform:
```
PHOENIX(8):  2LIVE · 2DEV · 2PLAN · 2GAP
UNICORN(14): ...
IRIS(19):    ...
GLAUX(10):   ...
ATLAS(12):   ...
AEGIS(23):   ...
```

### Platform Summary Table (Subway Map view)
| Platform | Products | Value Stream Stages |
|----------|---------|-------------------|
| PHOENIX | 8 | PLAN · DESIGN · SRC · MFG |
| UNICORN | 14 | DC · RTL · OMNI · CX |
| IRIS | 19 | Retail & Omni operations |
| GLAUX | 10 | Support functions |
| ATLAS | 12 | Foundation data layer |
| AEGIS | 23 | Cross-cutting governance |

---

## 3. Product Card

Product cards trong `/platforms` — chi tiết từng sản phẩm trong platform.

### Anatomy
```
┌────────────────────────────────────────────────────────┐
│  [◇ VENDOR] [STATUS]                                    │
│  ★                                                      │
│  ### [Product Name]                                     │
│  [Product tagline / type]                               │
│                                                         │
│  [Description paragraph]                               │
│                                                         │
│  [Module list if applicable ▾ N modules]               │
│                                                         │
│  [BUILD/BUY/HYBRID] · [Team] → [Timeline]              │
│  [Theme alignment note]                                 │
└────────────────────────────────────────────────────────┘
```

### Status indicators on product card:
- `◇ VENDOR` — external vendor system
- `★` — flagship/featured product
- `⚠ GAP` — warning state for missing product
- `● GAP` / `○ PLAN` — inline status indicators

### Metadata line format:
```
BUILD·P. Sản phẩm→GA 2026
BUY·P. Sản phẩm→2028
HYBRID·P. Sản phẩm, P. Quản trị Rủi ro→2030+
```

Pattern: `[METHOD]·[Team(s)]→[Timeline]`

### Module expandable:
```
Plan · 3Design · 3Source · 3Execute · 4▾ 13 modules
```
`▾` indicates expandable/accordion. Numbers indicate module count per sub-phase.

### Real examples:

**Flagship BUILD product:**
```
DEV ★
### YODY PLM
Product Lifecycle Management
Sản phẩm chủ lực — quản lý vòng đời...
BUILD·P. Sản phẩm→GA 2026
```

**VENDOR BUY product:**
```
◇ VENDOR LIVE
### Phần mềm thiết kế thời trang
Adobe · Pattern CAD · Pantone · 3D Design
BUY·P. Sản phẩm
```

**GAP product:**
```
⚠ GAP
### MES
Manufacturing Execution System
BUY·P. Sản phẩm→2028+
Cân nhắc sau IPO
```

---

## 4. Insight Callout Box

Highlighted box chứa key metric + context. Dùng để "pull out" insight quan trọng từ surrounding data.

### Anatomy
```
┌─────────────────────────────────────────────────────────┐
│  Insight · [Category label]         [anchor link]        │
│                                                         │
│  [LARGE NUMBER/PERCENTAGE]                              │
│  [Metric label]                                         │
│                                                         │
│  [Explanation sentence]                                  │
│                                                         │
│  [Tag 1] [Tag 2] [Tag 3]                               │
└─────────────────────────────────────────────────────────┘
```

### Real examples:

**Risk insight:**
```
Insight · Risk concentration    [S5 Blockers]
21%
18 / 86 sản phẩm còn GAP
tập trung ở 2 platform pre-IPO — không có blocker bất ngờ.
AEGIS · cross-cutting    ATLAS · foundation
```

**BUILD posture insight:**
```
Insight · BUILD-first posture   [Chương 03]
34%
29 / 86 sản phẩm BUILD
BUILD nằm ở engine năng lực cạnh tranh; BUY giới hạn ở commodity vendor mature.
BUILD · core              BUY · commodity
PLM PHOENIX               Cloud AWS/GCP
POS/OMS UNICORN           Keycloak IdP
Wiki RAG · YOAI           Google Workspace
Predictive · MDM          Ad platforms
```

**Theme alignment insight:**
```
Insight · Theme alignment
76%
17 / 17 blockers
nằm trong 2 mạch chiến lược đã lock Chương 1 — không có blocker bất ngờ.
6 ATLAS · Theme 2027    11 AEGIS · UNICORN · GLAUX · IPO 2030
```

### Properties:
- Label: `Insight ·` prefix + category
- Optional: anchor link to related section `[Section name](#id)`
- Big number: prominent, colored
- Explanation: 1-2 sentences
- Tags at bottom: platform/category tags

---

## 5. Strategic Goal Card

Trang homepage, 5 mục tiêu chiến lược được trình bày theo format numbered card.

### Anatomy
```
[Roman numeral]
[CATEGORY LABEL in caps]

[Goal statement text]
```

### Example set:
```
I   MỤC TIÊU 2030
    Công ty Thời trang có doanh thu số 1 Việt Nam
    Tốc độ tăng trưởng kép 2026-2030 đạt 20%

II  KHÁCH HÀNG
    Mang đến sự tự tin, thoải mái cho 10 triệu khách hàng...

III NHÂN VIÊN
    Đội ngũ con người phù hợp, hiệu suất cao và gắn kết

IV  CỔ ĐÔNG
    IPO với giá trị thị trường 10.000 tỷ

V   CỘNG ĐỒNG
    Phát triển bền vững, vì môi trường
```

---

## 6. Competitive Advantage Card

Trang homepage, 5 reasons "vì sao dẫn trước là lợi thế":

### Anatomy
```
[Roman numeral]
[Bold title]

[Description paragraph]

Đối thủ cần: [time estimate]
```

### Example:
```
I
Tốc độ ra mắt

Mẫu mới, tính năng mới đến tay khách hàng trước đối thủ...

Đối thủ cần: 3-6 tháng
```

**"Đối thủ cần"** pattern là competitive comparison label — always ends card.

---

## 7. Domain Health Card

Trang `/health`, 9 domain health cards trong grid.

### Anatomy
```
┌────────────────────────────────────┐
│  [Letter] [Domain Name]            │
│  [PERCENTAGE]                      │
│                                    │
│  [N] sẵn có                        │
│  [N] lỗ hổng                       │
│  [N] kế hoạch                      │
└────────────────────────────────────┘
```

### Example:
```
A  Kiến trúc Ứng dụng
   64%
   6 sẵn có
   2 lỗ hổng
   2 kế hoạch
```

Color coding: percentage determines border/background color (green/yellow/red).

---

## 8. Pre-IPO Blocker Card

Trang `/platforms` section V — Pre-IPO blockers.

### Anatomy
```
[● GAP / ○ PLAN]  [Platform tag]

[Item name]
[Item description]

[IPO/Theme context label]  →[Timeline]
[Additional note]
```

### Example:
```
● GAP    AEGIS

ITGC Framework
Khung kiểm soát IT chung theo Big 4 — bắt buộc trước IPO 2030...

IPO 2030 Readiness    → 2028
```

```
○ PLAN   ATLAS

Master Data Management (MDM)
Bộ master data chuẩn — Customer / Product / Vendor...

2027 · Dữ liệu & AI    → Q1.2027
```

---

## Card Usage Summary

| Card Type | Page(s) | Purpose |
|-----------|---------|---------|
| KPI Stat | All pages | Single metric highlight |
| Platform | `/platforms` | Platform overview |
| Product | `/platforms` | Individual product |
| Insight Callout | `/platforms`, `/health` | Key insight pull-out |
| Strategic Goal | `/` | Balanced scorecard items |
| Competitive Advantage | `/` | Why invest reasoning |
| Domain Health | `/health` | EA domain status |
| Pre-IPO Blocker | `/platforms` | Critical gap items |
