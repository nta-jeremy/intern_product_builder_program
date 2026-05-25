# Data Visualization Patterns

> Charts, maturity indicators, progress bars, và visual data patterns trong YODY ITDX EA Portal.

---

## Philosophy

Data viz trong portal phục vụ **strategic communication**, không phải analytics tool. Mọi visual đều có mục đích narrative — reinforcing the story, not exploring raw data.

**Principles:**
1. Every chart has a headline (the "so what" is in the title)
2. Numbers are always visible — không relying chỉ vào visual encoding
3. Color serves meaning (status colors, not decorative)
4. Annotations > legend khi có thể

---

## 1. ROI / Revenue Bar Chart

Trang `/` — "Mỗi đồng đầu tư · ~2.4× trở lại".

### Type: Dual-axis bar + line chart (responsive)

```
Revenue (tỷ VND) ↑        ROI Created (tỷ/năm)
                           ↗
5,806 ┤                ▓▓▓▓▓▓▓ ·
4,838 ┤             ▓▓▓▓▓▓▓ · ↗
4,032 ┤          ▓▓▓▓▓▓▓ ·
3,360 ┤       ▓▓▓▓▓▓▓ ·
2,800 ┤    ▓▓▓▓▓▓▓ ·
      └────┬────┬────┬────┬────→
         2026  2027  2028  2029  2030
                 ↑
           ROI vượt đầu tư (2027)
```

### Data points:
| Year | Revenue (tỷ) | Tech Investment | ROI Created |
|------|-------------|-----------------|-------------|
| 2026 | 2,800 | 48 | 22 |
| 2027 | 3,360 | 55 | 57 |
| 2028 | 4,032 | 69 | 78 |
| 2029 | 4,838 | 82 | 225 |
| 2030 | 5,806 | 99 | 348 |

### Key annotation: "ROI vượt đầu tư" (breakeven point at 2027)

---

## 2. Donut / Pie Charts

Trang `/platforms` — BUILD vs BUY distribution.

### Type: Donut chart (2 instances)

**Platform level (6 platforms):**
```
    ┌──────────────┐
    │   BUILD      │
    │   (33%)  ╔══╗│
    │          ║  ║│ ← HYBRID (67%)
    │          ╚══╝│
    └──────────────┘
BUILD · 2(33%)
HYBRID · 4(67%)
BUY · 0(0%)
```

**Product level (86 products):**
```
BUILD · 29(34%)
HYBRID · 16(19%)
BUY · 41(48%)
```

### Legend format: `[Color dot] [Label] · [N]([%])`

---

## 3. Status Distribution Bar

Trang `/platforms` — product status breakdown.

### Type: Horizontal segmented bar

```
|▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ░░░░░ ▒▒▒▒▒▒▒▒▒ ▓▓▓▓▓|
LIVE 41·48%  DEV 7·8%  PLAN 20·23%  GAP 18·21%
```

### Segment colors:
- LIVE: Green
- DEV: Blue
- PLAN: Yellow/Amber
- GAP: Red/Orange

---

## 4. Domain Health Progress Bars

Trang `/health` — per-domain health percentage.

### Type: Horizontal progress bar per domain

```
A  Kiến trúc Ứng dụng      [████████░░░] 64%
B  Kiến trúc Dữ liệu       [████████░░░] 64%
C  Kiến trúc Hạ tầng       [██████████░] 80%
D  Kiến trúc Tích hợp      [█████░░░░░░] 40%
E  Kiến trúc Bảo mật       [████░░░░░░░] 30%
F  Kiến trúc Nghiệp vụ     [█████████░░] 73%
G  Quản trị CNTT           [██████████░] 75%
H  Đổi mới & Nghiên cứu    [██████████░] 80%
I  Quản lý Thay đổi        [████████░░░] 67%
```

### Color rules:
- ≥75%: Green bar
- 50-74%: Yellow/Amber bar
- <50%: Red/Orange bar

### Sub-labels below bar:
```
6 sẵn có  |  2 lỗ hổng  |  2 kế hoạch
```

---

## 5. DMI Roadmap Timeline

Trang `/` — 5-year digital maturity progression.

### Type: Stepped timeline / roadmap cards

```
2026   2027   2028   2029   ★2030
 32     40     48     55     65
DMI    DMI    DMI    DMI    DMI
[theme][theme][theme][theme][theme]
```

### Each card shows:
- Year
- DMI score
- Theme name (Vi + EN subtitle)
- Capability milestone: `38/79 Năng lực kinh doanh L2 mature`

### Progress line connecting the dots visually.

---

## 6. Radar / Spider Chart (Squad Scorecards)

Trang `/org` — 19 role capability scorecards.

### Type: Radar/spider chart per role

```
           Leadership
              /\
             /  \
   Strategy /    \ Technical
           /      \
          /________\
    Communication   Delivery
```

8 dimensions per scorecard — scored 1-5.

19 scorecards for 19 roles across 3 BPs.

---

## 7. ATLAS Maturity Bars (8-dimension)

Trang `/atlas` — data platform maturity.

### Type: Horizontal bar with level labels

```
Sources       ████████░░░ Level 3 → 4
Pipeline      ████████████ Level 4 ✓
Quality       ████░░░░░░░ Level 2 ↑
Analytics     ████████░░░ Level 3
ML/Predict    ██░░░░░░░░░ Level 1 ↑
Security      ████████░░░ Level 3
Governance    ████████░░░ Level 3
Adoption      ████████████ Level 4 ✓
```

### Level scale: 1 (Initial) → 5 (Optimizing)
Current levels shown + target arrows.

---

## 8. Capability Maturity Progress

Trang `/roadmap` — per-year capability progress.

### Type: Progress number within card

```
38/ 79   Năng lực kinh doanh L2 mature  (2026)
50/ 79   Năng lực kinh doanh L2 mature  (2027)
60/ 79   ...
70/ 79   ...
79/ 79   ...
```

"Năng lực kinh doanh mature" count increases each year — showing progress toward full 79 L2 capabilities.

---

## 9. ATLAS Data Flow Diagram

Trang `/atlas` — conceptual architecture.

### Type: Flow diagram (left to right)

```
[Sources 60+] → [Ingestion] → [Storage] → [Processing] → [Distribution] → [Consumers]
  • OMS            Airbyte       Raw Lake   dbt / Spark    Metabase          800 users
  • POS            Kafka         Silver     ML Models      APIs              BI Reports
  • PLM                          Gold                      Reverse ETL       AI Features
  • ...
```

### 3 layers:
1. Data Sources (60+)
2. ATLAS Pipeline (270 pipelines)
3. Consumers (16K queries/day, 800 users)

---

## 10. Digitization Mode Radar/Matrix

Trang `/digitization-framework` — 6 modes.

### Type: 2×3 grid or hexagonal display

```
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  ELIMINATE          │  AUTOMATE           │  AUGMENT            │
│  Loại bỏ           │  Tự động hóa        │  Tăng cường         │
│  (remove waste)     │  (RPA, workflow)    │  (AI-assist human)  │
├─────────────────────┼─────────────────────┼─────────────────────┤
│  ENABLE             │  CONNECT            │  INSIGHT            │
│  Kích hoạt          │  Kết nối            │  Thông tin          │
│  (new capability)   │  (integration)      │  (analytics, AI)    │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

---

## 11. Org Structure Diagram

Trang `/org` — 3 BPs × 7 Squads.

### Type: Org chart / hierarchy

```
ITDX
├── BP. Năng lực Kinh doanh
│   ├── DELTA (PLM, CX Platform)
│   ├── SIGMA (Supply Chain)
│   └── GAMMA (Retail, Omni)
├── BP. Business Insights
│   └── BI (Data, Analytics)
└── BP. Nền tảng & Vận hành
    ├── BETA (Infra, Security)
    ├── OMEGA (Integration, DevOps)
    └── LAMBDA (Product, CRM)
```

---

## 12. Security Pillars (6-pillar layout)

Trang `/org` — 6 security pillars.

### Type: Icon + label grid (2×3 or 3×2)

```
┌──────────────┬──────────────┬──────────────┐
│ 🔐 Identity  │ 🌐 Network   │ 📦 Endpoint  │
├──────────────┼──────────────┼──────────────┤
│ 📊 Data      │ 🔍 Operations│ ⚖️ Compliance│
└──────────────┴──────────────┴──────────────┘
```

Expandable accordion — click to see details per pillar.

---

## Visualization Rules

| Rule | Detail |
|------|--------|
| Always show numbers | Never "just a chart" — numbers always visible |
| Annotate the key point | Arrow/label at the "so what" moment |
| Consistent status colors | LIVE=green, GAP=red across all charts |
| Avoid 3D effects | Flat design only |
| Dark theme compatible | High contrast, no thin light lines on dark |
| Legend optional | Embed in chart where possible |
| Mobile: simplify | Stack charts vertically, remove secondary axis on mobile |

---

## Chart Library

Not explicitly identified in HTML, but based on Next.js + Tailwind setup, likely uses:
- **Recharts** (React-based, common with Next.js)
- **D3.js** (for custom visualizations)
- **CSS-based** bars/progress indicators (for simple bars)
- Custom SVG for timeline elements
