# ITDX EA Portal — UI Kit

High-fidelity recreation of the YODY ITDX Enterprise Architecture portal (Next.js 16 app from `fioenix/yody-itdx-ea`, `docs/DESIGN.md`).

## Files

- `index.html` — Interactive dashboard demo (Tổng quan + TOGAF domain grid + drill-down side panel)
- `components.jsx` — Header, KpiCard, StatusTag, DomainBadge, DomainCard, SidePanel, FilterPills, SectionHeader, Insight
- `styles.css` — Component CSS (uses tokens from `../../colors_and_type.css`)

## Behaviour demonstrated

- Sticky pill-nav header with brand-tinted active state
- KPI row with 3px accent bars, count-style numerals, trend deltas
- TOGAF domain cards filterable by status (ALL / LIVE / BUILD / GAP / PLAN)
- Click any domain → side panel slides in from right (300ms `cubic-bezier(.34, 1.56, .64, 1)` overshoot, Esc/backdrop close)
- Status tags use JetBrains Mono uppercase + brand-tinted pill style

## Coverage vs source app

Implemented: header, KPI cards, status tags, domain badges + cards, side panel, filter pills, section headers, insight callout.
Out of scope (live app has these but not recreated here, as they are screen-specific):
- D3 donut + bar charts (V3 Investment view)
- Mindmap force layout (V2)
- Roadmap horizontal timeline grid (V5)
- Org chart (V4 Governance)

These would be added as additional pages if extending the kit.
