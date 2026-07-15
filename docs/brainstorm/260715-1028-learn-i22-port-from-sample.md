# Brainstorm — Port UI buổi học I2.2 từ sample HTML sang NextJS

- **Ngày:** 2026-07-15
- **Source:** `knowledge/course/I2.2-Design-Thinking-Empathy-Ideation/I2.2-sample.html` (676 dòng, HTML sạch — không bundled)
- **Blueprint:** `components/sections/LessonI21.tsx` (port I2.1 cùng pattern, đã chạy production)
- **Stack target:** NextJS 16 (App Router) · React 19 · inline-style + CSS tokens YODY (`styles/globals.css`)
- **Status:** Consensus — chốt port trực tiếp 1:1

---

## 1. Problem statement

Xây UI/UX cho buổi học **I2.2 — Design Thinking: Empathy & Ideation** tuân thủ đúng giao diện file sample `I2.2-sample.html`. Sample là một DC component (`class Component extends DCLogic`) với nội dung **đã thiết kế hoàn chỉnh** — 3 màn hình (Overview → Read → Exam), 2 phần đọc, 20 câu Final Exam.

**Yêu cầu đã chốt với user:**
1. Port **1:1** — giữ 100% nội dung, layout, màu, copy từ sample. Không tinh chỉnh.
2. Exam 20 câu — lấy trực tiếp từ sample HTML (đã có sẵn Phần A/B + giải thích why).
3. Phạm vi đầy đủ: component + route + CSS surface + wire nav.

**Khác biệt với I2.1:** 2 phần đọc (thay vì 3), chủ đề Empathy & Ideation, có card "Báo cáo Insight" (gold) ở overview, có props `examScore` (default 16) + `showTerms` (default true). Còn lại cùng kiến trúc.

## 2. Phân tích sample

Sample = 1 React component (`<script type="text/x-dc" data-dc-script>` ở cuối file, line 494-674):

- **State:** `{ page: 'overview'|'read'|'exam', part: 0|1, answers: {}, submitted: false }`
- **3 màn hình** chia bằng `sc-if`:
  - **Overview** (line 42-174): grid `1fr 340px` + sidebar sticky, breadcrumb, 2 eyebrow pill (I2.2 + NL3 must-pass), H1 với serif italic "Empathy & Ideation", meta (120/34/2), "Vì sao quan trọng", "Mục tiêu" 5 checklist 2 cột, 2 cards phần đọc (roman numeral iris/gold + tags + time), Final Exam card dashed iris, **Báo cáo Insight card** (gold), Thuật ngữ (must-know/nice-know, toggle `showTerms`).
  - **Read** (line 178-434): sidebar TOC 290px sticky + article max 740px.
    - **Part 1** (line 211-299, iris): drop cap "N", Say-Do gap (2-card grid + iceberg figure), phỏng vấn 4 rule cards (iris/gold/rose/mint), insight vs tóm tắt (figure), empathy map 4 ô (data-driven `empathy`), AI rules (4 tag cards `aiRules`), Tóm tắt dark + Tự kiểm tra.
    - **Part 2** (line 302-419, gold): drop cap "P", user journey map (5 cột data-driven `journey` + emotion dip bar), HMW (pain→HMW figure + 3 rule cards `hmw`), ideation diverge/converge (2-card + pipeline figure + 2 filter cards), 4 ý tưởng (`ideas` với testable/hoãn badge), Báo cáo Insight 3 step, Tóm tắt dark + Tự kiểm tra, CTA Final Exam.
    - Prev/next nav (line 422-431).
  - **Exam** (line 438-487): max 820px, 20 câu (10 Phần A + 10 Phần B), pick → nộp → chấm (✓ mint / ✕ rose) + giải thích why, card kết quả pass/fail, "Làm lại", sticky submit bar với counter answered.
- **Logic** (line 495-673): `partMeta()` (2 phần + màu), `examData()` (20 câu + correct + why), `renderVals()` (tính score/result/toc/prev/next/empathy/aiRules/journey/hmw/ideas).

**Tokens YODY** = subset `styles/globals.css` đã có sẵn: `--iris`, `--gold`, `--rose`, `--mint`, `--bg-warm`, `--bg-ink`, `--font-impact`, `--font-serif`, `--font-body`, `--font-mono`, `--font-brand`, `--font-numeric`, `--fg-1/2/3`, `--border`, `--shadow-lg`. **Không cần thêm CSS token.**

**Classes custom** (4): `.kh-part`, `.kh-toc`, `.kh-opt`, `.kh-nav` — đã có pattern scoped `.i21-surface .kh-*` trong globals.css (line 1330-1343), chỉ cần clone thành `.i22-surface`.

## 3. Phương án — chỉ 1 hướng hợp lý

### Port trực tiếp sample → `LessonI22.tsx` theo blueprint `LessonI21.tsx`

Không có phương án thay thế nghiêm túc. `LessonI21.tsx` đã giải quyết toàn bộ bài toán port cùng kiến trúc (3 màn hình, state, exam logic, responsive). I2.2 đơn giản hơn I2.1 (2 phần thay vì 3). Copy pattern, thay nội dung.

**Cấu trúc:**
```
components/sections/LessonI22.tsx     ← MỚI — port nguyên JSX + state sample
app/(portal)/learn/[lessonId]/page.tsx ← EDIT — thêm branch I2.2 (3 dòng)
styles/globals.css                    ← EDIT — thêm block .i22-surface (~15 dòng)
```

**Việc cần làm:**
1. Tạo `LessonI22.tsx` từ blueprint `LessonI21.tsx`:
   - Thay PART_META (2 phần: iris Thấu cảm / gold Journey-HMW).
   - Thay OBJECTIVES, MUST_KNOW, NICE_KNOW, META.
   - Port 2 phần đọc (Part1View = Thấu cảm + Empathy Map; Part2View = Journey + HMW + Ideation) — giữ nguyên toàn bộ figure, callout, data array.
   - Port EXAM (20 câu, copy từ `examData()` line 522-546).
   - Giữ component phụ `TldrDark`, `SelfCheck`.
   - Thêm card "Báo cáo Insight" (gold) vào Overview — sample có, I2.1 không có.
   - State/handler `go`/`pick`/`submit`/`reset` — copy y nguyên.
2. Đăng ký route `I2.2` trong `learn/[lessonId]/page.tsx` (pattern giống I2.1).
3. Thêm CSS `.i22-surface` block vào `styles/globals.css` (clone từ `.i21-surface`, đổi `i21-` → `i22-` cho 3 class responsive: `i22-overview-grid`, `i22-read-layout`, `i22-read-toc`).

## 4. Navigation wiring — gần như tự động

- **Roadmap** (`Roadmap.tsx:771`): đã có `href={/learn/${ls.id}}` — link tới I2.2 **đã hoạt động** ngay khi route đăng ký (I2.2 đã có trong `LESSONS` array, `lib/data.ts:825`).
- **Header**: không link trực tiếp tới lesson (tab-based: home/competencies/...), **không cần sửa**.
- **"Coming soon"**: fallback trong `learn/[lessonId]/page.tsx` tự động biến mất khi thêm branch I2.2.

→ **Nav wiring = 0 file thêm**, chỉ cần đăng ký route.

## 5. Risks & mitigation

| Rủi ro | Mức | Giải pháp |
|---|---|---|
| Thiếu 1 figure/callout khi port tay | TB | Đối chiếu từng section sample ↔ component khi review; sample chỉ 676 dòng nên rà dễ |
| Exam câu sai index `correct` | Thấp | Copy nguyên mảng `examData()`, không đánh số lại |
| Responsive breakpoint thiếu | Thấp | Clone y nguyên block `.i22-surface` từ `.i21-surface` |
| `dangerouslySetInnerHTML` cho HTML entity trong tóm tắt | Thấp | Theo pattern I2.1 (dùng cho `<b>`, `<i>` inline) — đã chạy ổn |

## 6. Success criteria

1. `/learn/I2.2` render 3 màn hình (overview/read/exam) giống sample pixel-cận.
2. 2 phần đọc hiển thị đúng: Part 1 (iris, empathy map 4 ô) + Part 2 (gold, journey 5 cột + HMW + ideation).
3. Exam 20 câu hoạt động: pick → submit → chấm (✓/✕) + giải thích + pass/fail card + "Làm lại".
4. Card "Báo cáo Insight" (gold) hiển thị ở overview.
5. Prev/next nav + TOC sidebar chuyển phần đúng.
6. Roadmap link tới I2.2 hoạt động (không "Coming soon").
7. `npm run build` pass, không TypeScript error.
8. Responsive: mobile gập grid overview 1 cột, TOC thành top bar (như I2.1).

## 7. Files chạm

| File | Action | LOC ước tính |
|---|---|---|
| `components/sections/LessonI22.tsx` | CREATE | ~600-700 (I2.1 là ~700 với 3 phần; I2.2 có 2 phần nên ít hơn) |
| `app/(portal)/learn/[lessonId]/page.tsx` | EDIT | +4 (import + branch) |
| `styles/globals.css` | EDIT | +15 (clone .i22-surface block) |

**Tổng: 3 file, ~620-720 LOC mới.**

## 8. Next steps

Sau consensus này, tạo implementation plan chi tiết (chia phase) qua `/plan` nếu user muốn. Plan sẽ gồm:
- Phase 1: Tạo `LessonI22.tsx` skeleton (state + 3 screen shell) → verify: render không lỗi
- Phase 2: Port Overview screen → verify: so từng section với sample
- Phase 3: Port Part 1 (Thấu cảm) → verify: empathy map + figure đúng
- Phase 4: Port Part 2 (Journey/HMW/Ideation) → verify: journey 5 cột + pipeline figure đúng
- Phase 5: Port Exam (20 câu) → verify: chấm điểm đúng với answer key
- Phase 6: Wire route + CSS + build → verify: `/learn/I2.2` hoạt động end-to-end
