# Brainstorm — Port Intern Product Builder Portal sang NextJS (từ bundled HTML)

- **Date:** 2026-07-03
- **Status:** consensus
- **Source of truth:** `public/demo/Intern Product Builder Portal (standalone).html`
- **Stack target:** NextJS (App Router) + Tailwind v4 + shadcn
- **Fidelity contract:** Pixel-perfect visual + behavior (full 6 tabs + interactions)
- **Port strategy:** Fidelity-first (giữ inline style gốc, bóc tokens verbatim)

---

## 1. Problem statement & constraints

Tái tạo portal NextJS tuân thủ 100% design system & behavior của file HTML bundled.

**Cản trở thực tế (phải nói thẳng):**

- File HTML KHÔNG phải source NextJS. Là artifact của **DC bundler** — 1 engine template riêng (`<x-dc>` + `sc-if`/`sc-for`/`{{ }}`/`style-hover`) + vanilla JS state class + bản build sẵn của shadcn registry (`YODYDesignSystem` namespace, 532KB).
- Repo hiện tại **rỗng**: commit mới nhất đã `remove the intern product builder project directory`. Không có source gốc. Chỉ có 1 file đóng gói + `docs/` + cây `knowledge/design-system-sample/` rỗng (chỉ `.DS_Store`).
- => Không có cách nào "reuse" source. Phải **reconstruct** từ artifact.

**Cản trở về "NextJS + Tailwind + shadcn" vs "100% giống":**

- Markup gốc inline-style dày đặc (~280 KB inline CSS), gần như KHÔNG dùng shadcn primitives trong markup thực (registry chỉ là dep compiled, không được call).
- shadcn đóng vai trò overlay-only (Dialog/Sheet) — không phải foundation UI. Ép dùng shadcn cho mọi element = drift visual chắc chắn.

**Quyết định user đã chốt:**

1. Fidelity-first: giữ inline style gốc verbatim, bóc CSS tokens ra `globals.css`, Tailwind chỉ phụ, shadcn overlay-only.
2. Đủ 6 tab + full interaction (dark mode, scorecard grading, quiz, drawer, badge modal).

---

## 2. Anatomy của file HTML (đã verify)

| Khối | Vị trí | Kích thước | Vai trò |
|---|---|---|---|
| Bundler loader | line 37–172 | ~3 KB | runtime giải nén manifest → blob URLs, swap document, re-exec scripts. **Bỏ qua khi port** (NextJS thay thế). |
| Manifest `__bundler/manifest` | line 174 | 37 entries | base64+gzip: 2 JS (DC engine 22 KB, DS registry 150 KB compressed → 532 KB) + 9 woff2 + 28 ttf. **Phải extract** để có fonts + tokens. |
| Template `__bundler/template` | line 182 | 218 KB JSON-string |DOCTYPE+head+body|. Body chứa `<x-dc>` với 3 `<style>` + markup template + `<script type="text/x-dc">`. |
| Style block #1 | x-dc offset 0–~52 KB | ~52 KB | `@font-face` self-host (JetBrains Mono woff2 only — ttf còn lại trong manifest). |
| Style block #2 | offset ~52–109 KB | ~57 KB | YODY Design System tokens (`:root` + 4 `[data-surface]` adapters) + component CSS (`.s-eyebrow`, `.s-card`, animations `dcFade`...). **Đây là source của sự thật visual.** |
| Body markup | offset 109 KB–163 KB | ~54 KB | Header sticky + 6 `<main>` sections + overlay. Cú pháp `{{ }}` / `sc-if` / `sc-for` / `style-hover`. |
| `text/x-dc` script | offset 163 KB–end | ~54 KB | Data model + state class: `LEVEL_LABELS`, `LADDER`, `COMPS`, `PRODUCTS`, `roadmap`, `badges`, `quiz`, `scorecard` logic. **Không framework — vanilla `this.setState`.** |

**6 tabs xác định:** Tổng quan · Khung năng lực · Dự án thực chiến · Scorecard · Lộ trình & Học · Huy hiệu.

---

## 3. Evaluated approaches

### 3.1 Approach A — Fidelity-first (CHỌN)

**Ý tưởng:** File HTML là 1 trang SPA single-route với state `tab`. Port sang 1 route NextJS (`/`), state quản lý bằng `useState`/`useReducer`. Markup chuyển inline HTML → JSX `style={{}}` từng prop. Tokens CSS verbatim vào `globals.css`. shadcn dùng đúng vai trò gốc: overlay (Sheet/Dialog cho drawer năng lực + badge modal).

**Pros:**
- Rủi ro visual drift **thấp nhất** — giữ nguyên mọi CSS var, mọi inline style, mọi font-face.
- shadcn đúng vai trò gốc (overlay) — không bị "ép buộc" gây drift.
- Verify "100% giống" khả thi: screenshot diff gốc vs port.
- Data model vanilla JS port sang TypeScript `const` dễ — chỉ cần khai báo type.

**Cons:**
- Code JSX nhiều inline style (không idiomatic Tailwind) — nhưng đó là bản chất của file gốc, không phải vấn đề của approach.
- `style-hover` (17 chỗ) là cú pháp riêng của x-dc, không tồn tại trong React → phải chuyển sang `hover:` variant Tailwind hoặc `onMouseEnter/Leave` + state. **Đây là điểm port duy nhất có nguy cơ drift** — cần kỹ thuật `hover:` bằng CSS class nhỏ (`globals.css`) thay vì inline.

**Rủi ro kỹ thuật cần xử lý:**
1. `style-hover` → định nghĩa utility class trong `globals.css` (vd `.hov-bg-muted:hover { background: var(--bg-muted) }`), dùng `className` thay inline.
2. `sc-if` → `{cond && <...>}`. `sc-for` → `.map()`.
3. `{{ expr }}` → `{expr}` JSX.
4. Dark mode: gốc dùng `data-theme="dark"` trên root div + `localStorage('yds-ui-theme')`. Port: cùng cơ chế + `next-themes` (optional) hoặc tự viết hook SSR-safe.
5. Fonts: extract 9 woff2 + 28 ttf ra `/public/fonts/`, sửa `url(...)` trong `@font-face` từ UUID sang path thật.

### 3.2 Approach B — Tailwind-native (loại)

**Ý tưởng:** Map mọi token sang `@theme` Tailwind v4, viết lại markup bằng utilities, shadcn primitives cho mọi card/button.

**Pros:** idiomatic, maintainable, đúng tinh thần stack.

**Cons:**
- "100% giống" gần như **không đạt** — inline style gốc phức tạp (gradient stops, multi-shadow, clamp()…), map sang utilities dễ sai subtle value.
- Thời gian 2–3× A. Verify fidelity phải screenshot từng tab + mỗi state.
- shadcn primitives có style riêng (radius, padding, shadow) **khác** gốc → drift ngay cả khi data đúng.

**Verdict:** Loại. Mâu thuẫn trực tiếp với yêu cầu "100% giống".

### 3.3 Approach C — Hybrid (loại)

**Ý tưởng:** Tokens qua `@theme` (có utilities), inline style giữ chỗ gốc dùng inline, shadcn cho overlay.

**Pros:** cân bằng.

**Cons:** sinh 2 phong cách code song song trong cùng project — cognitive load cao, drift risk giữa 2 phong cách. KISS: chọn 1 phong cách.

**Verdict:** Loại. Tăng complexity không lời giải.

---

## 4. Final recommended solution

**Stack:**
- NextJS 15 (App Router) — single route `/`, client component chính (cần interaction + theme).
- Tailwind v4 — config `@theme inline` tham chiếu tokens (cho utilities khi cần), nhưng foundation là `globals.css` chứa tokens verbatim từ file gốc.
- shadcn — cài subset: `sheet` (drawer năng lực), `dialog` (badge modal, quiz modal), `button` (optional, chỉ nếu needed). **Không thay thế inline-style cards.**
- TypeScript — data model port sang `lib/data.ts` với type.

**Cấu trúc đề xuất:**

```
app/
  layout.tsx          # <html data-theme> + font preload + globals.css
  page.tsx            # client component, useState tab, render <Portal/>
components/
  Portal.tsx          # shell: header + nav + <main> switch
  sections/
    Overview.tsx      # tab "Tổng quan"
    Competencies.tsx  # tab "Khung năng lực" + drawer
    Products.tsx      # tab "Dự án thực chiến"
    Scorecard.tsx     # tab "Scorecard" + grading interaction
    Roadmap.tsx       # tab "Lộ trình & Học" + quiz modal
    Badges.tsx        # tab "Huy hiệu" + badge modal
  ui/                 # shadcn primitives (sheet/dialog/button)
lib/
  data.ts             # LADDER, COMPS, PRODUCTS, ROADMAP, BADGES, QUIZ
  types.ts
  theme.ts            # SSR-safe theme hook (data-theme + localStorage)
styles/
  globals.css         # tokens verbatim + @font-face (sửa url) + .s-* classes + hover utilities
public/
  fonts/              # 9 woff2 + 28 ttf extract từ manifest
```

**Quy trình port (8 bước):**

1. **Extract assets** — script Python đọc manifest, gzip-decode, ghi 9 woff2 + 28 ttf ra `public/fonts/`. Verify: `ls public/fonts | wc -l` = 37, mime đúng.
2. **Extract tokens** — copy style block #2 verbatim ra `globals.css`. Sửa mỗi `src: url("<uuid>")` → `url("/fonts/<name>.woff2")` (map UUID→filename từ manifest). Verify: mở `globals.css`, grep 0 UUID còn sót.
3. **Extract data** — copy nội dung `text/x-dc` script ra `lib/data.ts`, bọc type, tách thành `LADDER/COMPS/PRODUCTS/ROADMAP/BADGES/QUIZ`. Verify: `tsc --noEmit` pass.
4. **Port header + nav** — convert HTML inline → JSX `style={{}}`. State `tab` + 6 handler. Verify: click nav đổi tab, active style đúng.
5. **Port 6 sections** — từng `<main>` → 1 component. Markup inline verbatim. `sc-if`→`&&`, `sc-for`→`.map`. Verify mỗi section: screenshot so gốc.
6. **Port interactions** — scorecard grading (state + derived total/pct/gates), quiz (start/submit/retry), drawer (Sheet shadcn), badge modal (Dialog shadcn), theme toggle. Verify: chạy từng flow, so behavior gốc.
7. **`style-hover` → utilities** — định nghĩa `.hov-*:hover` class trong `globals.css` (17 chỗ), thay `style-hover="..."` bằng `className="hov-..."`. Verify: hover mỗi button, so gốc.
8. **Fidelity audit** — chạy `next dev`, screenshot 6 tab × 2 theme = 12 shot, đặt cạnh screenshot file HTML gốc (cùng viewport). Diff visual. Fix từng mismatch.

**Thời gian ước tính:** 2–3 ngày làm việc cho 1 dev (đã biết NextJS) — chi phí chính nằm ở bước 5 (port 54 KB markup) và bước 8 (audit).

---

## 5. Risks & mitigations

| Rủi ro | Mức | Mitigation |
|---|---|---|
| `style-hover` không có tương đương inline trong React | Tb | Định nghĩa 17 utility class `.hov-*` trong globals.css. Đã có đủ thông tin từ 17 chỗ dùng. |
| Font không load do path sai / mime sai | Tb | Extract script ghi kèm manifest UUID→filename map; verify bằng DevTools Network tab. |
| Dark mode flash (FOUC) | Thấp | Gốc dùng inline script trong `<head>` đọc localStorage trước hydrate — port cùng pattern trong `layout.tsx` `<script dangerouslySetInnerHTML>`. |
| shadcn primitives override style gốc | Tb | Chỉ dùng shadcn cho overlay (Sheet/Dialog) — không cho card/button trong main content. Style gốc inline giữ nguyên. |
| Markup gốc có SVG inline phức tạp (icon paths) | Thấp | Copy verbatim vào JSX. SVG attrs convert `stroke-width`→`strokeWidth` etc. |
| `{{ }}` expr có logic phức tạp (derived state) | Tb | Port logic vào `useMemo`/`useReducer`. Giữ tên biến gốc để debug. |
| Quiz/scorecard state machine dễ sai | Tb | Đọc kỹ `text/x-dc` script (54 KB) — có sẵn `submitQuiz/retryQuiz/calcGates`. Port từng method 1:1. |

---

## 6. Success metrics & validation

**Pixel-match:**
- 12 screenshot (6 tab × light/dark) đặt cạnh gốc, diff ≤ ~2% (cho phép anti-aliasing).
- Hover states: 17 điểm `style-hover` đúng visual.
- Overlay: drawer năng lực + badge modal + quiz modal đúng vị trí/size/anim.

**Behavior match:**
- 6 tab switch hoạt động.
- Dark mode toggle + persist `localStorage('yds-ui-theme')`.
- Scorecard: chấm đủ điều kiện → status text đổi "Đã đủ điều kiện kết luận", gates pass.
- Quiz: start → answer → submit → score → retry → close.
- Drawer năng lực: click comp → mở, click X → đóng.
- Badge modal: click badge → mở detail.

**Non-goal (theo chốt user):** không cần giữ engine x-dc, không cần giữ markup gốc verbatim ở cấp source — chỉ cần visual + behavior giống.

---

## 7. Next steps & dependencies

1. User approve báo cáo này.
2. (Optional) `/plan` để tạo implementation plan chi tiết từng phase — kế thừa context báo cáo này làm argument.
3. Extract script Python (bước 1) — chạy 1 lần, output vào `public/fonts/` + `styles/globals.css` draft.
4. Scaffold NextJS project (`create-next-app` --typescript --tailwind --app).
5. Port theo 8 bước mục 4.

**Dependencies:**
- Node 18+ / NextJS 15.
- Python 3 (chỉ để extract 1 lần).
- shadcn CLI (`npx shadcn@latest init`).

**Không cần:**
- Database, API, backend — portal thuần client-side.
- Router đa route — 1 route `/` đủ (gốc cũng là SPA single-view với tab state).

---

## 8. Open questions (không chặn, để plan xử lý)

- Có cần SEO/meta per-tab không? Gốc là SPA single title. Nếu không yêu cầu → giữ 1 title.
- Có cần i18n tách file không? Gốc 100% tiếng Việt inline. Recommend: giữ inline (YAGNI) trừ khi có yêu cầu đa ngôn ngữ.
- Có cần persistence scorecard/quiz state (localStorage)? Gốc KHÔNG persist state này. Recommend: giống gốc, không persist (YAGNI).