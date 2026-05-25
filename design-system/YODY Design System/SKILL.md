---
name: yody-design
description: Use this skill to generate well-branded interfaces and assets for YODY (Vietnamese fashion retail brand and its ITDX Enterprise Architecture portal), either for production or throwaway prototypes/mocks/decks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. Aesthetic: art-modern, minimal, hightech, AI-style, Inter-led typography with full Vietnamese diacritic support.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files (`colors_and_type.css`, `assets/`, `preview/`, `ui_kits/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions (audience, surface — internal portal vs marketing vs deck, Vietnamese vs English copy, density level), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

**Quick anchors when starting a new artifact:**
- Drop `colors_and_type.css` into the `<head>` — gives you all tokens.
- Default to white background. Brand navy `#2a2b86` is the workhorse; gold `#fcaf16` is decoration only (never text/buttons).
- Inter for everything UI/display. JetBrains Mono for status tags & technical anchors.
- Status pills: LIVE / BUILD / GAP / PLAN — uppercase mono, pill shape, never emoji.
- Vietnamese labels + English tech terms is the bilingual default.
- Drill-down = right-side slide-in panel, never a new page.
- See `ui_kits/itdx-portal/` for live component examples.
