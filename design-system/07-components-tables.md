# Tables — Components

> Các loại bảng biểu trong YODY ITDX EA Portal — từ RACI matrix đến risk register.

---

## Table Design Principles

1. **Sparse but readable** — không thêm columns không cần thiết
2. **Bilingual headers** — tiêu đề có thể Vi hoặc En tùy context
3. **Status-colored cells** — LIVE/GAP/PLAN cells dùng color coding
4. **Scannable** — alternating row colors, clear borders
5. **Mobile** — wide tables cần horizontal scroll, không cố ép vào narrow viewport

---

## 1. Risk Register Table

Trang `/health` — 9 critical GAPs.

### Structure
```
| Phòng | Hạng mục                    | Đội   | Mức độ |
|-------|----------------------------|-------|--------|
| A     | WMS — Warehouse Management  | SIGMA | GAP    |
|       | Quản lý kho hàng thông minh |       |        |
```

### Column anatomy:
| Column | Content | Width |
|--------|---------|-------|
| Phòng | Letter (A-I) | Narrow |
| Hạng mục | Item name (EN bold) + description (VI) | Wide |
| Đội | Squad code | Narrow |
| Mức độ | GAP/PLAN badge | Narrow |

### Full risk register data:
| Phòng | Hạng mục | Đội | Mức độ |
|-------|---------|-----|--------|
| A | WMS — Warehouse Management | SIGMA | GAP |
| A | TMS — Transport Management | SIGMA | GAP |
| B | Master Data Management | BI | GAP |
| C | Disaster Recovery | BETA | GAP |
| D | iPaaS / Integration Hub | BETA | GAP |
| E | Data Protection / DLP | BETA | GAP |
| E | Security Operations | BETA | GAP |
| G | IT Service Management | BETA | GAP |
| I | Change Communication | CTO | GAP |

### Cell pattern for "Hạng mục":
```
[English abbreviation] — [English full name]
[Vietnamese description]
```

---

## 2. RACI Matrix

Trang `/org` — responsibility matrix cho squads × capabilities.

### Structure
```
              | DELTA | SIGMA | GAMMA | BETA | OMEGA | LAMBDA | BI |
Capability 1  |   R   |   A   |   C   |      |       |        |    |
Capability 2  |       |   R   |       |  A   |   C   |        | I  |
```

### RACI legend:
- **R** = Responsible — đội làm
- **A** = Accountable — đội chịu trách nhiệm cuối
- **C** = Consulted — được hỏi ý kiến
- **I** = Informed — được thông báo

### Column headers = Squad names:
DELTA · SIGMA · GAMMA · BETA · OMEGA · LAMBDA · BI

### Row headers = Capability domains or specific capabilities

### Visual:
- R/A/C/I cells có background color distinguish
- Empty cells = no involvement
- Mobile: horizontal scroll required

---

## 3. Roadmap Grid Table

Trang `/roadmap` — 5 themes × H1/H2 2026–2030.

### Structure
```
| Theme         | H1 2026 | H2 2026 | H1 2027 | ... | 2030 |
|---------------|---------|---------|---------|-----|------|
| Supply Chain  | [items] | [items] | ...     |     |      |
| Data/AI       |         | [items] | ...     |     |      |
| Personalized  |         |         | ...     |     |      |
| Measured Ops  |         |         |         |     |      |
| AI-Native     |         |         |         |     | [★]  |
```

### Column structure:
- Row headers: 5 strategic themes
- Column headers: H1/H2 halves from 2026 to 2030 (10 half-years)
- Cells: Initiative names, product launches, milestones
- Some cells span multiple columns (multi-period initiatives)

### 5 Themes:
1. Chuỗi Cung Ứng E2E (2026)
2. Dữ liệu & AI nền tảng (2027)
3. Trải nghiệm KH cá nhân hoá (2028)
4. Vận hành số đo lường được (2029)
5. Doanh nghiệp AI-native (2030)

---

## 4. Value Stream × Platform Matrix

Trang `/platforms` — subway map.

### Structure
```
         | PLAN | DESIGN | SRC | MFG | DC | RTL | OMNI | CX |
PHOENIX  |  ●   |   ●    |  ●  |  ●  |    |     |      |    |
UNICORN  |      |        |     |     |  ● |  ●  |  ●   | ●  |
IRIS     |      |        |     |     |    |  ●  |  ●   | ●  |
GLAUX    |  ●   |        |     |     |  ● |  ●  |      |    |
ATLAS    |  ●   |   ●    |  ●  |  ●  |  ● |  ●  |  ●   | ●  |
AEGIS    |  ●   |   ●    |  ●  |  ●  |  ● |  ●  |  ●   | ●  |
```

### Value Stream Stages (8):
1. PLAN — Hoạch định mùa vụ
2. DESIGN — Thiết kế & Tech Pack
3. SRC — Tìm nguồn & Mẫu (Source)
4. MFG — Sản xuất (Manufacture)
5. DC — Nhập kho & Lưu trữ (Distribution Center)
6. RTL — Retail
7. OMNI — Omnichannel
8. CX — Customer Experience

---

## 5. Capability Maturity Table (ATLAS)

Trang `/atlas` — 8-dimension maturity scoring.

### Structure
```
| Dimension          | Current | Target 2027 | Notes     |
|--------------------|---------|-------------|-----------|
| Data Sources       | Level 3 | Level 4     | 60+ src   |
| Pipeline Reliability| 85%    | 99%+        | SLA       |
| ...                |         |             |           |
```

### 8 Dimensions:
1. Nguồn dữ liệu (Data Sources)
2. Độ tin cậy Pipeline
3. Chất lượng Dữ liệu
4. Khả năng phân tích
5. ML/Predictive
6. Bảo mật & Quyền riêng tư
7. Quản trị Dữ liệu
8. Mức độ Adoption

---

## 6. Org/People Table

Trang `/org` — roles, BPs, squads.

### BP × Squad structure:
```
| BP | Squad | TBP/Lead | Headcount | Focus Area |
|----|-------|----------|-----------|------------|
| Năng lực Kinh doanh | DELTA  | [name] | [N] | PLM, CX Platform |
| Năng lực Kinh doanh | SIGMA  | [name] | [N] | Supply Chain |
| ...                 |        |        |     |              |
```

### RACI for capability domains
(see section 2 above)

---

## 7. Capabilities Framework Table

Trang `/capabilities` — 414 L3 business capabilities.

### Hierarchy:
```
L1 Domain → L2 Sub-domain → L3 Atomic Capability
```

### Structure example:
```
| L1 | L2 | L3 Capability | Maturity | APQC Ref | Squad |
|----|----|---------------|----------|----------|-------|
| Thiết kế sản phẩm | Quản lý thiết kế | Phê duyệt thiết kế | LIVE | 1.1.x | DELTA |
```

### Stats:
- 414 L3 capabilities
- 11 Phòng (domains)
- Cross-referenced with APQC PCF v7.4 + 88 VN-specific additions

---

## 8. Initiatives Investment Table

Trang `/initiatives` — capital table.

### Structure:
```
| Initiative | Theme | Method | Investment (tỷ) | P&L Lever | Priority |
|-----------|-------|--------|-----------------|-----------|----------|
| [name]    | 2026  | BUILD  | [amount]        | [lever]   | High     |
```

### Capital envelope:
- Total: 333–375 tỷ over 5 years
- Per theme allocation
- P&L levers: 6 categories

---

## Table Style Guide

### Headers
```css
/* Table headers */
font-weight: 600;
background: var(--color-surface-2);
text-transform: uppercase; /* for short column headers */
font-size: 0.875rem;
padding: 12px 16px;
```

### Rows
```css
/* Alternating rows */
background: var(--color-surface-1); /* odd */
background: var(--color-surface-0); /* even, page bg */

/* Hover */
background: var(--color-surface-2);
```

### Status cells
```css
/* GAP cell */
color: var(--color-status-gap);
font-weight: 600;

/* LIVE cell */
color: var(--color-status-live);

/* PLAN cell */
color: var(--color-status-plan);
```

### Responsive
```css
/* On mobile: scroll container */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

---

## Table Usage Summary

| Table Type | Page | Columns | Rows | Key Feature |
|-----------|------|---------|------|------------|
| Risk Register | `/health` | 4 | 9 | Status color |
| RACI Matrix | `/org` | 8+ | Many | R/A/C/I indicators |
| Roadmap Grid | `/roadmap` | 10 | 5 | Time × Theme |
| Value Stream × Platform | `/platforms` | 9 | 6 | Coverage dots |
| Capability Maturity | `/atlas` | 4–5 | 8 | Level scores |
| Capabilities Framework | `/capabilities` | 5–6 | 414 | Hierarchical |
| Investment/Capital | `/initiatives` | 6 | 41 | Financial |
