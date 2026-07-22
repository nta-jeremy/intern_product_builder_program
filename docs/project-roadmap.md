# Project Roadmap

> **Project:** YODY Intern Product Builder Portal
> **Last updated:** 2026-07-20
> **Owner:** YODY Technology (ITDX)
> **Source of truth:** GitHub Issues + plans/ folder

---

## 1. Current State (as of 2026-07-20)

### 1.1 Lesson ports
| Status | Lessons | Count |
|--------|---------|-------|
| ✅ **Ported** (component exists) | I1.1, I1.2, I2.1, I2.2, I2.3, I3.1 | **6 / 14** |
| ⏳ **Pending** (data exists, "Coming soon") | I3.2, I3.3, I4.1, I4.2, I4.3, I5.1, I5.2, I5.3 | **8 / 14** |

> 13 bản ghi trong `lib/data.ts → LESSONS[]`. 6 có React component. 7 còn lại được route tới fallback "Coming soon" trong `app/(portal)/learn/[lessonId]/page.tsx`.

### 1.2 Pages & features hoàn chỉnh
- ✅ Tất cả 8 page-level sections: Overview, Competencies, Roadmap, Badges, Scorecard, Products, LearnHub (+ Calendar), Lesson dispatcher
- ✅ 3 overlays: Competency Drawer, Badge Modal, Quiz Modal (2-phase state machine)
- ✅ Theme toggle (light/dark) với FOUC prevention
- ✅ Header (7 nav tabs) + theme toggle
- ✅ Deployment lên Vercel production

### 1.3 Build pipeline
- ✅ `scripts/extract_assets.py` (Phase 01) — chạy được
- ✅ `scripts/build_globals.py` (Phase 03) — idempotent
- ✅ `styles/globals.css` (production) — 1376 lines, committed
- ⏳ Còn 1-2 file extension issues (xem §5 Tech Debt)

### 1.4 Recent activity (last 7 days)
| Date | Plan folder | Topic |
|------|-------------|-------|
| 2026-07-13 | `plans/2026-07-13-*` | I1.2 lesson port |
| 2026-07-15 | `plans/2026-07-15-*` | I2.1 + I2.2 lesson port |
| 2026-07-17 | `plans/2026-07-17-*` | Carousel redesign |
| 2026-07-18 | `plans/2026-07-18-*` | I3.1 + I4.2 + LearnHubCalendar |
| 2026-07-19 | `plans/2026-07-19-*` | I4.2 UI sync + search |

---

## 2. Milestones

### Milestone 1 — Q3 2026 (Jul → Sep): Complete all 14 lesson detail pages
**Goal:** Mọi lesson trong `LESSONS[]` có React component riêng.

| Deliverable | Owner | Target |
|-------------|-------|--------|
| Port I3.2 (Build Deliverable & QC) | TBD | 2026-07-25 |
| Port I3.3 (Mentor Review & Iterate) | TBD | 2026-07-31 |
| Port I4.1 (Advanced Product Mindset) | TBD | 2026-08-07 |
| Port I4.2 (Dev Craft) — partially started | TBD | 2026-08-14 |
| Port I4.3 (Integrate Initiative) | TBD | 2026-08-21 |
| Port I5.1 (AI Solution Architecture) | TBD | 2026-08-28 |
| Port I5.2 (Security, Eval & Ops) | TBD | 2026-09-04 |
| Port I5.3 (Ship & Defend Capstone) | TBD | 2026-09-11 |
| Add `not-found.tsx` cho `/learn/*` | TBD | 2026-09-18 |

**Success criteria:**
- 14/14 lessons có component, route 200 OK
- Quiz data cho tất cả 14 lessons trong `LESSONS[]`
- Mỗi lesson dùng surface class `.i<XY>-surface` theo convention
- Lighthouse Performance vẫn ≥ 90

---

### Milestone 2 — Q4 2026 (Oct → Dec): Quiz persistence + badge animations
**Goal:** Quiz progress survives reload; badge unlock có feedback.

| Deliverable | Owner | Target |
|-------------|-------|--------|
| Persist quiz answers trong `localStorage` (`yds-quiz-<lessonId>`) | TBD | 2026-10-15 |
| Persist pass/fail state cho từng lesson | TBD | 2026-10-31 |
| Badge unlock state (YPB1..YPB5) trong localStorage | TBD | 2026-11-15 |
| Unlock animation: pulse + gradient sweep (dùng tone) | TBD | 2026-11-30 |
| Hiển thị "passed ✓" indicator trên roadmap | TBD | 2026-12-15 |
| Add per-page metadata (`generateMetadata`) | TBD | 2026-12-31 |

**Success criteria:**
- Reload trang sau khi pass quiz → state preserved
- Click "Retry" reset state cho lesson đó
- Badge unlock có animation ≥ 300ms, không gây layout shift
- 0 regression trên existing quiz flow

---

### Milestone 3 — Q1 2027 (Jan → Mar): Scorecard data + learner progress
**Goal:** Scorecard track được learner-specific data.

| Deliverable | Owner | Target |
|-------------|-------|--------|
| Backend schema cho `learner_progress` (Postgres?) | TBD | 2027-01-15 |
| API routes (`/api/progress/[learnerId]`) | TBD | 2027-01-31 |
| Auth layer (NextAuth hoặc Clerk) — yêu cầu rõ từ PO | TBD | 2027-02-15 |
| Migrate `lib/data.ts` → DB-driven (server components fetch) | TBD | 2027-02-28 |
| Scorecard input: cho phép learner tự đánh giá từng tiêu chí | TBD | 2027-03-15 |
| Progress visualization trên Overview | TBD | 2027-03-31 |

**Success criteria:**
- Learner đăng nhập → xem được scorecard của mình
- Dữ liệu persist cross-device
- Tối đa 2-3 trang yêu cầu auth, các trang khác vẫn public

> **Caveat:** scope này cần PO confirm. Có thể delay nếu cohort đầu chưa cần persistence.

---

### Milestone 4 — Q2 2027 (Apr → Jun): Multi-cohort + mentor dashboard
**Goal:** Hỗ trợ nhiều cohort song song + view dành cho mentor.

| Deliverable | Owner | Target |
|-------------|-------|--------|
| Cohort entity: `cohortId`, `startDate`, `endDate`, `memberIds` | TBD | 2027-04-15 |
| Filter UI: chọn cohort trên header | TBD | 2027-04-30 |
| Mentor view: `/mentor` route — list learners, drag-and-drop score | TBD | 2027-05-15 |
| Gate review interface: approve/reject gate submission | TBD | 2027-05-31 |
| Export: CSV / PDF scorecard per learner | TBD | 2027-06-15 |
| Cohort completion report (auto-generated) | TBD | 2027-06-30 |

**Success criteria:**
- 2+ cohorts chạy song song không conflict
- Mentor review 1 gate ≤ 60s (UX benchmark)
- CSV export match format scorecard Google Sheets hiện tại

---

## 3. Milestone Timeline (visual)

```
2026 Q3          2026 Q4            2027 Q1            2027 Q2
Jul Aug Sep      Oct Nov Dec        Jan Feb Mar        Apr May Jun
│   │   │        │   │   │           │   │   │           │   │   │
├───┴───┤        ├───┴───┤           ├───┴───┤           ├───┴───┤
│ M1    │        │ M2    │           │ M3    │           │ M4    │
│ 14/14 │        │ Quiz  │           │ Score │           │ Cohort│
│lesson │        │+badge │           │+learn │           │+mentor│
│ports  │        │persist│           │progress│          │dash   │
└───────┘        └───────┘           └───────┘           └───────┘
```

---

## 4. Feature Backlog (prioritized)

| Priority | Feature | Source |
|----------|---------|--------|
| P0 | Port 8 remaining lessons (M1) | Roadmap M1 |
| P0 | Add `not-found.tsx` + per-page metadata | Tech debt §5 |
| P1 | Quiz persistence (M2) | Roadmap M2 |
| P1 | Badge unlock animations (M2) | Roadmap M2 |
| P2 | Learner-specific scorecard (M3) | Roadmap M3 |
| P2 | Auth (NextAuth/Clerk) | Roadmap M3 |
| P3 | Multi-cohort (M4) | Roadmap M4 |
| P3 | Mentor dashboard (M4) | Roadmap M4 |
| P4 | Remove `public/demo/` (archive) | Open question §6 |
| P4 | Migrate I3.1 sample filename `x-dc` (legacy) | Open question §6 |
| P4 | Add real search to LearnHub | Plan 2026-07-19 |
| P5 | Carousel redesign (research outcome) | Plan 2026-07-17 |

---

## 5. Known Technical Debt

### 5.1 Theme `.dark` class mismatch ⚠️
- **Vấn đề:** shadcn `<Button>` (trong `components/ui/button.tsx`) dùng `dark:` variant của Tailwind, key trên `.dark` class. YODY DS key trên `[data-theme="dark"]`.
- **Hậu quả:** shadcn Button **không tự động respect dark mode** khi user toggle theme. Hiện Button được dùng rất ít, chưa ảnh hưởng UX.
- **Fix options:**
  1. Convert `<Button>` thành YODY-native (dùng `var(--*)` tokens) — tốn ~ 1-2 ngày
  2. Thêm JS hook trong `useTheme` để set `.dark` class song song với `data-theme` — 30 phút nhưng hack
  3. Chấp nhận limitation, document rõ — 5 phút
- **Recommendation:** Option 1 nếu Button được dùng rộng hơn trong tương lai; Option 3 nếu scope M1-M2.

### 5.2 No per-page metadata
- **Hiện trạng:** Chỉ có root `metadata` trong `app/layout.tsx`. Mọi page share default title `"Intern Product Builder Portal"`.
- **Hậu quả:** SEO yếu, OpenGraph share chung 1 image.
- **Fix:** Thêm `generateMetadata` cho từng page trong `(portal)/`. Ưu tiên trong M2.

### 5.3 No `not-found.tsx`
- **Hiện trạng:** Route `/learn/I3.2` (chưa port) hiển thị "Coming soon" (custom fallback trong page.tsx). Route không tồn tại (vd. `/learn/INVALID`) sẽ dùng Next.js default 404.
- **Fix:** Thêm `app/(portal)/learn/[lessonId]/not-found.tsx` + `app/(portal)/not-found.tsx` cho top-level 404.

### 5.4 `public/demo/` as dead asset
- **Hiện trạng:** `public/demo/Intern Product Builder Portal (standalone).html` (DC bundle) chiếm ~3-5 MB trong repo. Không được load runtime — chỉ là input cho `extract_assets.py`.
- **Hậu quả:** Repo nặng hơn cần thiết, build context lớn hơn.
- **Fix options:**
  1. Move ra ngoài repo (vd. Google Drive / S3 archive)
  2. Git LFS cho file này
  3. Xóa sau khi xác nhận không còn cần port
- **Status:** Open question (xem §6).

### 5.5 No CI/CD
- **Hiện trạng:** Build chỉ chạy khi push lên Vercel. Không có pre-deploy lint / typecheck / test gate.
- **Fix:** Thêm GitHub Actions workflow `.github/workflows/ci.yml`: lint → typecheck → build → Lighthouse audit.
- **Priority:** P1 (sau M1).

### 5.6 Inline styles > 50% trong components
- **Hiện trạng:** Đa số section components dùng `style={{…}}` inline thay vì class. Đếm nhanh: ~ 60% `style` vs 40% `className`.
- **Hậu quả:** Khó scan, không có CSS minification cho inline, không có design system enforcement.
- **Fix:** Từ từ migrate sang class (utility class từ YODY DS). Ưu tiên component nào có > 30 inline styles.

---

## 6. Open Questions

### 6.1 Có giữ `public/demo/` trong repo không?
- **Tradeoff:** Archive giữ nguyên → dễ port lại nếu cần. Xóa → repo nhẹ hơn.
- **Recommendation:** Move ra S3/GDrive sau khi M1 xong (Q3 2026 cuối).

### 6.2 I3.1 sample filename có còn dùng `x-dc` không?
- **Hiện trạng:** Trong `lib/data.ts` có comment "Lesson block helpers (ported verbatim from x-dc; behavior preserved)". `x-dc` là tên cũ của design system sample.
- **Question:** Có rename helper / reference sang `yody-ds-v3` không?
- **Recommendation:** Rename comment + helper references trong M1 cleanup.

### 6.3 ADR path drift
- **Hiện trạng:** `docs/decisions/` chỉ có 1 file (`260611-1629-progressive-spiral-primary-lifecycle.md`). Các quyết định gần đây nằm rải rác trong `plans/` và `docs/brainstorm/`.
- **Question:** Có migrate các decision quan trọng từ plans/ sang `docs/decisions/` không?
- **Recommendation:** Có — chọn 3-5 ADR quan trọng nhất trong M1 cleanup.

### 6.4 Có nên dùng `dynamic import()` cho lesson components?
- **Hiện trạng:** `app/(portal)/learn/[lessonId]/page.tsx` import 6 lesson components statically. Initial JS bundle lớn.
- **Tradeoff:** Static import → đơn giản, eager. Dynamic → bundle nhỏ hơn nhưng thêm complexity.
- **Recommendation:** Sau M1 (khi 14/14 ported), đo bundle size. Nếu > 200KB cho lesson routes → chuyển dynamic.

### 6.5 `learn/I3.1` sample có file `lesson-final.html` cũ — cần giữ không?
- Cần check `knowledge/course/I3.1-Agentic-Workflows-RAG/` xem có file legacy nào không được reference.

---

## 7. Tài liệu liên quan

- [Project Overview & PDR](./project-overview-pdr.md) — Vision, modules, KPIs, non-goals
- [Codebase Summary](./codebase-summary.md) — Tech stack, file count
- [System Architecture](./system-architecture.md) — Layered architecture, state, theme
- [Code Standards](./code-standards.md) — Naming, "use client", theme rules
- [Deployment Guide](./deployment.md) — Vercel, env vars, rollback
- `docs/decisions/` — ADR(s) (1 file hiện tại)
- `docs/brainstorm/` — 4 records (port plan, code review, i11 port, i22 port)
- `plans/` — Work-in-progress plans (8+ items)
