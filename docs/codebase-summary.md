# Codebase Summary

> **Project:** YODY Intern Product Builder Portal
> **Repo root:** `/Users/tunganh252/Desktop/Work/Yody/others/intern_product_builder_program`
> **Last updated:** 2026-07-20
> **Total LOC (app + components + lib + scripts + styles):** ~13,934 lines

---

## 1. Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | Next.js (App Router, Turbopack default) | 16.2.10 | Route group `(portal)` wraps all pages |
| **Language** | TypeScript | 5 | Strict mode |
| **Runtime** | React | 19.2.4 | Server + Client components |
| **Styling** | Tailwind CSS | 4 | `app/globals.css` (shadcn layer) + `styles/globals.css` (YODY DS) |
| **UI primitives** | shadcn/ui (radix-nova) + Radix UI | `shadcn@4.12.0`, `radix-ui@1.6.1` | Currently only `Button` used |
| **Variant utility** | class-variance-authority | 0.7.1 | For `Button` variants |
| **Class merge** | clsx + tailwind-merge | 2.1.1 / 3.6.0 | `cn()` helper in `lib/utils.ts` |
| **Icons** | lucide-react | 1.23.0 | Monoline, 1.75px stroke |
| **Animation** | tw-animate-css | 1.4.0 | Tailwind v4 animation utility |
| **Deployment** | Vercel | — | Auto-detected, Node 24.x |
| **AI integration** | Google Gemini API | (env-driven) | Key: `GEMINI_API_KEY` |

> ⚠️ **Two parallel CSS systems:** `styles/globals.css` (YODY DS, 1376 lines, primary) vs `app/globals.css` (shadcn Tailwind v4, 145 lines, currently only consumed by `components/ui/button.tsx`). See [System Architecture §5 Theme](./system-architecture.md#5-theme-subsystem).

---

## 2. Top-Level Directory Map

| Path | Purpose | LOC |
|------|---------|-----|
| `app/` | Next.js App Router root | 297 |
| `app/layout.tsx` | **Root layout (Server Component)** — metadata, FOUC script, font preload | 105 |
| `app/globals.css` | shadcn Tailwind v4 layer (`@import "tailwindcss"` + `@theme inline`) | 145 |
| `app/(portal)/layout.tsx` | **Portal layout (Client Component)** — wraps `PortalProvider` + `Header` + `Overlays` | 49 |
| `app/(portal)/page.tsx` → `/` | Overview (thin wrapper around `Overview.tsx`) | 14 |
| `app/(portal)/{badges,competencies,projects,roadmap,scorecard,learn-hub}/page.tsx` | Thin wrappers → section components | 7–12 each |
| `app/(portal)/learn/[lessonId]/page.tsx` | **Dynamic dispatcher** for 6 implemented lessons | 87 |
| `components/Header.tsx` | Sticky header, 7 nav tabs, theme toggle (44×44) | 225 |
| `components/Overlays.tsx` | **Single component** rendering 3 overlays (drawer, badge, quiz) state-driven | 1028 |
| `components/sections/` | 14 page-level section components (8 page sections + 6 lesson components) | ~7,995 |
| `components/ui/button.tsx` | shadcn Button (6 variants × 8 sizes via cva) | 67 |
| `lib/types.ts` | All TypeScript types (Tone, Lesson, Block, Quiz, etc.) | 120 |
| `lib/data.ts` | **Single source of truth** — hardcoded data (LESSONS, COMPS, LADDER, BADGES, ROADMAP, etc.) | 1313 |
| `lib/portal-context.tsx` | React Context: theme + 3 overlay states + roadmap→quiz navigation | 70 |
| `lib/theme.ts` | `useTheme` hook, `STORAGE_KEY="yds-ui-theme"`, `data-theme` attribute | 28 |
| `lib/nav.ts` | Nav tab style helpers (`navStyle`, `segTab`) | 70 |
| `lib/tone.ts` | Tone utility (6 tones) | 27 |
| `lib/utils.ts` | `cn()` class merge helper | 6 |
| `styles/globals.css` | **YODY Design System v3** — vanilla CSS + CSS variables + keyframes + surface adapters | 1376 |
| `scripts/extract_assets.py` | Phase 01 migration: DC bundle → fonts + raw CSS + raw data.ts + asset map | 238 |
| `scripts/build_globals.py` | Phase 03 idempotent: rewrites `styles/globals.raw.css` → `styles/globals.css` | 102 |
| `public/fonts/` | Self-hosted Be Vietnam Pro, Montserrat, Playfair Display, JetBrains Mono | — |
| `public/thumbnails/` | OG image (1200×630) | — |
| `public/demo/` | **Legacy DC bundle** (standalone HTML) — read-only archive, not loaded at runtime | — |
| `knowledge/course/` | 14 lesson folders + `_ops/` (Lab-Spec, Lich-Release) + `00-Course-Map.md` (248 lines) | — |
| `knowledge/design-system-sample/` | Reference YODY DS samples | — |
| `knowledge/SCORE CARD - Product Builder/` | Google Sheets export (index.html + sheet.css) | — |
| `plans/` | Work-in-progress plan folders (8+ items, 2026-07-13 → 2026-07-19) | — |
| `docs/decisions/` | ADR(s) — currently 1 file (`260611-1629-progressive-spiral-primary-lifecycle.md`) | — |
| `docs/brainstorm/` | 4 records (port plan, code review, i11 port, i22 port) | — |
| `docs/journals/` | Working journals (4 files) | — |

---

## 3. File Count & LOC Summary

| Group | Files | Total LOC |
|-------|-------|-----------|
| `app/**/*.tsx` | 11 | 297 |
| `components/*.tsx` | 2 (Header, Overlays) | 1,253 |
| `components/sections/*.tsx` | 14 | 7,995 |
| `components/ui/*.tsx` | 1 (button) | 67 |
| `lib/*.ts` + `lib/*.tsx` | 7 | 1,634 |
| `styles/globals.css` | 1 | 1,376 |
| `app/globals.css` | 1 | 145 |
| `scripts/*.py` | 2 | 340 |
| **Grand total (excl. `public/`, `knowledge/`, `plans/`, `docs/`)** | **39** | **~13,107** |

> Top 5 largest files:
> 1. `components/sections/LessonI12.tsx` — 1,301 lines
> 2. `components/sections/LessonI11.tsx` — 1,036 lines (tied)
> 3. `components/sections/LessonI23.tsx` — 1,036 lines (tied)
> 4. `components/sections/LessonI31.tsx` — 885 lines
> 5. `components/sections/LessonI21.tsx` — 810 lines

---

## 4. Key Entry Points

| Entry | Path | Type | Purpose |
|-------|------|------|---------|
| **Root metadata** | `app/layout.tsx` | Server Component | Sets `<html lang="vi">`, OpenGraph, FOUC script, font preload |
| **Theme bootstrap** | inline script in `app/layout.tsx:63` | Browser-side | Reads `localStorage["yds-ui-theme"]` → sets `data-theme` on `<html>` |
| **Portal shell** | `app/(portal)/layout.tsx` | Client Component | Wraps `PortalProvider` → `PortalShell` (Header + children + Overlays) |
| **State hub** | `lib/portal-context.tsx` | React Context | Single source for theme + 3 overlays + roadmap-quiz bridge |
| **Data hub** | `lib/data.ts` | Static module | 13 lesson records, 7 competencies, 5 badges, 4 roadmap stages, etc. |
| **Header** | `components/Header.tsx` | Client | 7 nav tabs, `usePathname()` for active state, theme toggle |
| **Overlays** | `components/Overlays.tsx` | Client | Renders 3 modals state-driven from `usePortal()` |
| **Section components** | `components/sections/*.tsx` | Client | One per route — page is a thin wrapper, section is the heavy work |

---

## 5. Data Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Build time                                                  │
│                                                              │
│  public/demo/Intern...html (DC bundle)                       │
│       │                                                      │
│       ▼  scripts/extract_assets.py (Phase 01)                │
│                                                              │
│  public/fonts/  +  styles/globals.raw.css  +  lib/data.ts    │
│                                              (raw)           │
│       │                                                      │
│       ▼  scripts/build_globals.py (Phase 03, idempotent)     │
│                                                              │
│  styles/globals.css  (production-ready, 1376 lines)          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Runtime (browser)                                           │
│                                                              │
│  styles/globals.css                                          │
│       │                                                      │
│       ▼  CSS variables (--brand, --iris, --gold, …)          │
│                                                              │
│  lib/data.ts ──► components/sections/* ──► app/(portal)/*    │
│       │              │                       │               │
│       │              │  usePortal()          │               │
│       │              ▼                       │               │
│       │       components/Overlays.tsx        │               │
│       │                                      ▼               │
│       │                              PortalContext           │
│       │                              (theme, overlays)       │
│       ▼                                                      │
│  HTML rendered  ──► inline FOUC script sets data-theme       │
│       │                                                      │
│       ▼                                                      │
│  React 19 hydrate  ──► PortalProvider mounts                 │
└─────────────────────────────────────────────────────────────┘
```

### 5.1 Read path (cold load)
1. Browser requests `/`
2. Vercel serves `app/layout.tsx` Server Component
3. Inline FOUC script reads `localStorage["yds-ui-theme"]` and sets `data-theme` on `<html>` before hydration
4. Fonts preloaded: Be Vietnam Pro (TTF), Montserrat 900 (WOFF2), Playfair Display Italic (WOFF2), JetBrains Mono 700 (WOFF2)
5. HTML body renders `<div data-surface="portal">` from `app/(portal)/layout.tsx`
6. React 19 hydrates → `PortalProvider` mounts → Header + page section + Overlays all wired to context

### 5.2 Write path (state changes)
- **Theme toggle** → `useTheme()` updates state → `useEffect` writes `data-theme` + `localStorage`
- **Open competency drawer** → `openComp(code)` → `Overlays.tsx` sees `compCode` prop → renders drawer
- **Open quiz** → `openQuiz("I1.2")` → `quizLessonId` in context → `Overlays.tsx` fetches `LESSONS` from `lib/data.ts`

---

## 6. Build & Runtime Dependencies

### 6.1 Production dependencies (`package.json`)
```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^1.23.0",
  "next": "16.2.10",
  "radix-ui": "^1.6.1",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "shadcn": "^4.12.0",
  "tailwind-merge": "^3.6.0",
  "tw-animate-css": "^1.4.0"
}
```

### 6.2 Dev dependencies
```json
{
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

### 6.3 Environment variables
| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `APP_URL` | Recommended | Self-referential URL |
| `NEXT_PUBLIC_SITE_URL` | Optional | Overrides `metadataBase` for OG |

> Chi tiết: [Deployment Guide §3](./deployment.md#3-environment-variables).

### 6.4 Build pipeline (Python, not runtime)
- `scripts/extract_assets.py` — chạy **một lần** khi migrate từ DC bundle
- `scripts/build_globals.py` — chạy **idempotent** mỗi khi `styles/globals.raw.css` thay đổi
- Không có runtime coupling giữa scripts và Next.js build — toàn bộ output được commit vào repo

---

## 7. Tài liệu liên quan

- [Project Overview & PDR](./project-overview-pdr.md) — vision, modules, course, KPIs
- [System Architecture](./system-architecture.md) — layered architecture, state, theme
- [Code Standards](./code-standards.md) — naming, "use client", CSS, theme rules
- [Project Roadmap](./project-roadmap.md) — current state, milestones, tech debt
- [Deployment Guide](./deployment.md) — Vercel, env vars, rollback
