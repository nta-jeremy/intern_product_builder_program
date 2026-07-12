# Brainstorm — Port UI buổi học I1.1 từ bundled HTML sang NextJS

- **Ngày:** 2026-07-12
- **Source:** `knowledge/course/I1.1-AI-Fundamentals/I1.1-sample.html` (bundled DC preview, đã giải nén → `learn-unpacked.html`, 3237 dòng)
- **Stack target:** NextJS 15 (App Router) · Tailwind v4 · shadcn (đã có trong dự án)
- **Status:** Consensus — chốt phương án port trực tiếp

---

## 1. Problem statement

Xây UI/UX cho buổi học **I1.1 — AI Fundamentals & LLM Mechanics** tuân thủ đúng giao diện file sample `I1.1-sample.html`. Sample là một bundled DC component (React + Babel standalone) nén trong 3 thẻ `<script type="__bundler/*">`. Khi mở bằng browser, JS giải nén + render 3 màn hình (Overview → Read → Exam) với nội dung **đã thiết kế tay hoàn chỉnh** (không phải khung trống, không render từ markdown).

**Yêu cầu đã chốt với user:**
1. UI nằm ở route mới `/learn/I1.1` (trong portal layout `(portal)/`).
2. Nội dung = 4 file lý thuyết + Final Exam (20 câu) — **tất cả đã có sẵn trong sample**, không cần parse .md.
3. Mức tương tác: reader tĩnh + TOC + quiz tương tác (sample có sẵn chấm điểm + giải thích).
4. Giữ nguyên Header/Overlays của portal — **không thay đổi Header.tsx hiện tại**. Chỉ port phần nội dung (từ breadcrumb `<div data-screen-label="Tổng quan I1.1">` trở đi).
5. Giống sample nhất có thể.

## 2. Khám phá sample (sau khi giải nén)

Sample là **1 React component** (`class Component extends DCLogic`) với:
- **State:** `{ page: 'overview'|'read'|'exam', part: 0-3, answers: {}, submitted: false }`
- **3 màn hình** chia bằng `sc-if`:
  - **Overview** (line 2535-2658): grid `1fr 340px` + sidebar sticky, breadcrumb, eyebrow pill, H1 serif italic, meta (120/64/4), "Vì sao quan trọng", "Mục tiêu" checklist 2 cột, 4 cards phần đọc (roman numeral + tags + time), Final Exam card (gold), Thuật ngữ (Phải biết/Biết thêm).
  - **Read** (line 2661-3018): sidebar TOC 290px sticky + article max 740px, 4 phần (`isPart1`→`isPart4`) mỗi phần có: drop cap Playfair 74px, figure vẽ tay (probability bars, context window desk, temperature slider, embedding space), callout iris/gold/rose, 3-card grid (Tiền/Tốc độ/Giới hạn), strategy cards 01/02/03, bảng dark header, "Tóm tắt 3 ý" dark `--bg-ink` + gold label, "Tự kiểm tra" `<ol>`, prev/next nav.
  - **Exam** (line 3021-3070): max 820px, 20 câu 4 opts A/B/C/D badge, pick → nộp → chấm (✓ mint / ✕ rose) + giải thích, card kết quả mint/rose, "Làm lại".
- **Logic** (line 3078-3234): `partMeta()` (4 phần + màu), `examData()` (20 câu + correct + why), `renderVals()` (tính score/result/toc/prev/next).

**Tokens YODY** dùng trong sample = subset của `styles/globals.css` đã có sẵn (iris/gold/mint/rose/brand, `--bg-warm`, `--bg-ink`, 4 font families, `.cta-*`, `.s-eyebrow`). **Không cần thêm CSS.**

**Classes custom trong sample** (chỉ 3): `.kh-part`, `.kh-toc`, `.kh-opt`, `.kh-nav` — định nghĩa trong 1 `<style>` block nhỏ (line 2506-2516), cần port sang globals.css hoặc inline.

## 3. Phương án đánh giá

### A. Port trực tiếp sample → 1 component NextJS (KHUYẾN NGHỊ ✓)

**Cấu trúc:**
```
app/(portal)/learn/[lessonId]/page.tsx   ← "use client", lấy lessonId, render <LessonI11/>
components/sections/LessonI11.tsx        ← port nguyên JSX + state sample
```

**Việc cần làm:**
1. Copy JSX nội dung (line 2535-3075, bỏ header sticky 2522-2532) vào `LessonI11.tsx`.
2. Đổi cú pháp DC → JSX: `sc-if`→`{cond && ...}`, `sc-for`→`.map()`, `{{ }}`→`{}`, `onclick`→`onClick`.
3. Chuyển `class Component extends DCLogic` → function component + `useState`/`useMemo`.
4. Giữ nguyên toàn bộ inline style + tokens `var(--*)`.
5. Port 3 class `.kh-*` + 1 `<style>` block nhỏ vào `styles/globals.css` (hoặc inline trong component).
6. Route `/learn/[lessonId]/page.tsx`: nếu `lessonId === 'I1.1'` render `<LessonI11/>`, else fallback.

**Ưu:**
- Giống sample 100% (fidelity-first, đúng tinh thần plan `260703-1214-nextjs-port`).
- Nội dung đã thiết kế sẵn → không cần converter markdown, không cần sinh ảnh.
- Tái dụng toàn bộ tokens/globals.css/components hiện có.
- 1 file component + 1 file route → KISS.
- Quiz tương tác (chấm điểm + giải thích) đã có sẵn trong sample → làm luôn được.

**Nhược:**
- Component dài (~600 dòng JSX) — nhưng sample vốn vậy, chia nhỏ sẽ mất fidelity. Chấp nhận được vì 1-use.
- Khó scale cho 13 buổi sau (mỗi buổi 1 component riêng) — nhưng YAGNI: lo sau khi có sample buổi 2.
- Phải chuyển tay cú pháp DC → JSX (~30 phút, dễ sai) → verify bằng visual diff.

### B. JSON + Block[] mở rộng (đã loại)

Sample không render từ data có cấu trúc — nội dung là JSX taylor-made với figure vẽ tay. Ép vào Block[] mất thiết kế. **Loại.**

### C. Parse markdown runtime (đã loại)

Sample không dùng markdown. File .md là source tài liệu, sample đã "design" lại. Parse .md sẽ ra giao diện khác sample. **Loại.**

## 4. Quyết định

**Phương án A — Port trực tiếp.** Lý do:
- Fidelity-first: đúng yêu cầu "giống sample nhất".
- KISS: 1 component + 1 route.
- YAGNI: không xây abstraction cho 13 buổi khi mới có 1 sample.
- Tái dụng: tokens/globals.css/Header portal hiện có không đụng.
- Nội dung + tương tác đã có sẵn → không工作量 thêm.

## 5. Rủi ro & cách xử lý

| Rủi ro | Khả năng | Tác động | Xử lý |
|---|---|---|---|
| Cú pháp DC `sc-if`/`sc-for`/`{{ }}` chuyển sai | Cao | Build fail / render sai | Chia nhỏ theo màn, verify từng màn bằng `next dev` |
| 3 class `.kh-*` thiếu CSS | TB | Hover/style hỏng | Port 3 class + 1 `<style>` block vào globals.css |
| Header portal trùng với header sample | Cao | 2 header chồng nhau | Bỏ header sticky của sample (line 2522-2532), giữ Header.tsx |
| Component quá dài khó review | TB | Maintainability | Chia 3 sub-component: `OverviewScreen`/`ReadScreen`/`ExamScreen` trong cùng file |
| Dark mode (portal có) sample không test | TB | Token dark có thể hỏng figure | Sample dùng `var(--*)` → tự adapt; verify dark mode |
| Route động `/learn/[lessonId]` cần fallback | Thấp | 404 buổi khác | If/else fallback "Coming soon" cho lessonId ≠ I1.1 |

## 6. Success criteria

1. `/learn/I1.1` render 3 màn hình (Overview/Read/Exam) đúng sample — visual diff ≤ 2% (cùng viewport 1180px).
2. Click 4 card phần → chuyển màn Read đúng phần, TOC highlight đúng.
3. Exam: pick 20 câu → nộp → hiện score + ✓/✕ + giải thích + card kết quả mint/rose.
4. "Làm lại" reset answers. Prev/Next chuyển phần.
5. Header/Overlays portal không đổi — `Header.tsx` nguyên vẹn.
6. `npm run build` + `tsc --noEmit` pass.
7. Dark mode (portal có) không hỏng figure/bảng.

## 7. Next steps

1. Tạo plan triển khai chi tiết (gọi `/ck:plan`).
2. Plan chia 4 phase: scaffold route → port overview → port read → port exam → audit.
3. Verify mỗi phase bằng `next dev` + visual check.

## 8. Files tham chiếu

- Sample gốc: `knowledge/course/I1.1-AI-Fundamentals/I1.1-sample.html`
- Sample giải nén: `learn-unpacked.html` (3237 dòng — xóa sau khi port xong)
- Tokens: `styles/globals.css` (1312 dòng, đã có full YODY design system)
- Portal layout: `app/(portal)/layout.tsx`, `components/Header.tsx`
- Pattern component: `components/sections/Roadmap.tsx` (tham chiếu style inline + tokens)