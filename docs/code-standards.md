# Code Standards & Codebase Structure

> **Scope:** Next.js 16 App Router, React 19, TypeScript 5, YODY Design System v3 + shadcn (radix-nova).
> **Audience:** engineers porting lessons, adding sections, or extending overlays.
> **Last updated:** 2026-07-20

---

## 1. Directory Organization

### 1.1 Top-level rules
| Concern | Lives in | Never in |
|---------|----------|----------|
| Route segments (URL) | `app/(portal)/<segment>/page.tsx` | `components/` |
| Thin page wrappers (≤ 20 lines) | `app/(portal)/**/page.tsx` | `app/(portal)/**/page.tsx` chứa JSX phức tạp |
| Page-level section components | `components/sections/<Name>.tsx` | `app/` |
| Reusable UI primitives | `components/ui/<name>.tsx` | `components/sections/` |
| Global state / hooks | `lib/*.ts(x)` | `components/` |
| Static data (single source) | `lib/data.ts` | Inline trong component |
| Types | `lib/types.ts` | Đặt cùng component (trừ local helper) |
| Design tokens & CSS | `styles/globals.css` (YODY) + `app/globals.css` (shadcn) | Inline `<style>` |
| Build / migration scripts | `scripts/*.py` | `app/`, `components/` |
| Course content (markdown) | `knowledge/course/<lesson-folder>/` | `lib/data.ts` (chỉ metadata) |
| Plans / brainstorming | `plans/`, `docs/brainstorm/`, `docs/journals/` | `docs/` chính |

### 1.2 Route group `(portal)`
- Tất cả user-facing pages nằm trong `app/(portal)/` — route group **không** tạo URL segment.
- Chỉ `app/layout.tsx` là Server Component trong toàn bộ route tree.
- Mỗi page trong `(portal)` là Client Component (`"use client"` ở dòng đầu).

---

## 2. Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Files (mới) | kebab-case | `learn-hub-calendar.tsx`, `extract-assets.py` |
| Files (legacy, giữ nguyên) | PascalCase | `LessonI11.tsx`, `Header.tsx`, `Overlays.tsx`, `data.ts` |
| React components | PascalCase | `function Overview() {…}` |
| Functions / variables / hooks | camelCase | `openComp`, `useTheme`, `navStyle` |
| Constants (module-level) | UPPER_SNAKE_CASE | `LEVEL_LABELS`, `STORAGE_KEY`, `FINAL_SEGS` |
| Types / interfaces | PascalCase | `Lesson`, `Competency`, `LadderLevel` |
| CSS class names (custom) | kebab-case | `.i11-surface`, `.kh-part`, `.kh-toc` |
| Lesson surface class | `<lessonId>-surface` | `.i11-surface`, `.i12-surface` |
| Tone value (type) | literal union | `"mint" \| "iris" \| …` |
| Quiz answer | zero-indexed integer | `a: 2` (nghĩa là option thứ 3) |

> **Quy ước kế thừa:** Project đã có file PascalCase (`LessonI11.tsx`, `Header.tsx`, …). **Không refactor** sang kebab-case trừ khi file được tạo mới và không có lý do tham chiếu chéo.

---

## 3. TypeScript Conventions

### 3.1 Compiler
- `strict: true` (xem `tsconfig.json`)
- `noEmit: true` — chỉ typecheck, build do Next.js xử lý
- Module resolution: `bundler` (Next.js 16 mặc định)
- Path alias: `@/*` → repo root

### 3.2 Type rules
- **KHÔNG dùng `any`** — dùng `unknown` + narrowing hoặc generic constraint
- **Mọi prop của section component phải được type rõ ràng** trong interface ngay trên function:
  ```tsx
  interface OverviewProps {
    onStartLearning: () => void;
    onGoComp: () => void;
  }
  export function Overview({ onStartLearning, onGoComp }: OverviewProps) { … }
  ```
- **Type imports** dùng `import type { … } from "…"` — không trộn value + type trong cùng import trừ khi cần cả hai.
- **Discriminated unions** cho `Block` (`t: "p" | "h" | "ul" | "quote" | "code"`) — switch trên `t` để narrowing.
- **Helpers `P` và `q` exported từ `lib/data.ts`** — dùng để build `Block[]` và `QuizQuestion[]` một cách ngắn gọn:
  ```ts
  P("Đoạn văn thường")           // → { t: "p", x: "…" }
  q("Câu hỏi?", ["A", "B", "C"], 1)  // → { q, opts, a: 1 }
  ```

### 3.3 Helpers `H`, `U`, `Q`, `C` (private trong `lib/data.ts`)
- `H(x)` = heading block (private)
- `U(...items)` = unordered list block (private)
- `Q(x)` = quote block (private)
- `C(x)` = code block (private)
- Chỉ dùng nội bộ trong `lib/data.ts` — section components **import `LESSONS` đã dựng sẵn**, không tự gọi helpers.

---

## 4. "use client" Policy

### 4.1 Khi nào thêm `"use client"`
| File | Có `"use client"`? | Lý do |
|------|---------------------|-------|
| `app/layout.tsx` | ❌ Server | Metadata, font preload, FOUC script |
| `app/(portal)/layout.tsx` | ✅ Client | Wrap `PortalProvider` (context) |
| `app/(portal)/**/page.tsx` | ✅ Client | Hầu hết gọi `useRouter()` / `useParams()` |
| `components/Header.tsx` | ✅ Client | `usePathname()`, `usePortal()` |
| `components/Overlays.tsx` | ✅ Client | `useState`, `useEffect`, props từ context |
| `components/sections/*` | ✅ Client | Nhận callback props, dùng portal context |
| `components/ui/button.tsx` | ✅ Client | Re-export shadcn (đã có sẵn) |
| `lib/portal-context.tsx` | ✅ Client | `createContext` + `useState` |
| `lib/theme.ts` | ✅ Client | `useState`, `useEffect`, `localStorage` |
| `lib/data.ts` | ❌ Pure data | Chỉ constants + types |
| `lib/types.ts` | ❌ Pure types | Chỉ `type` / `interface` |
| `lib/nav.ts`, `lib/tone.ts`, `lib/utils.ts` | ❌ Pure helpers | Không có hooks |

### 4.2 Khi nào KHÔNG thêm
- File **chỉ export const / function thuần** (data, types, helper không có state).
- File **chỉ có metadata** (Next.js `Metadata` API).

### 4.3 Anti-pattern
- ❌ Thêm `"use client"` vào `lib/data.ts`, `lib/types.ts` — phá tree-shaking và tăng bundle.
- ❌ Tạo Server Component trong `app/(portal)/` — sẽ không truy cập được `PortalContext`.

---

## 5. Component Patterns

### 5.1 Thin page wrapper pattern
Mỗi page là wrapper ≤ 20 dòng, truyền callback cho section component:

```tsx
// app/(portal)/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { Overview } from "@/components/sections/Overview";

export default function HomePage() {
  const router = useRouter();
  return (
    <Overview
      onStartLearning={() => router.push("/learn-hub")}
      onGoComp={() => router.push("/competencies")}
    />
  );
}
```

### 5.2 Section component pattern
- **Một section component = một trang.**
- Section component **nhận navigation callbacks qua props** (không tự gọi `useRouter()`) → dễ test, dễ reuse.
- Section component **đọc data qua `import` trực tiếp từ `@/lib/data`** — không nhận data qua props.
- Section component **đọc state qua `usePortal()`** khi cần (vd. mở overlay).

### 5.3 Overlay pattern
- `components/Overlays.tsx` là **một component duy nhất** render cả 3 overlays (drawer, badge, quiz).
- 3 state slots trong `PortalContext`: `comp` (string|null), `badgeIdx` (number|null), `quizLessonId` (string|null).
- Mỗi overlay có z-index riêng: drawer = 80, badge modal = 80, quiz modal = 90.
- Trigger pattern:
  ```tsx
  const { openComp, openBadge, openQuiz } = usePortal();
  <button onClick={() => openComp("NL1")}>Mở NL1</button>
  <button onClick={() => openBadge(0)}>Mở YPB1</button>
  <button onClick={() => openQuiz("I1.1")}>Làm quiz I1.1</button>
  ```

### 5.4 Lesson component pattern
- 6 lesson components (`LessonI11.tsx` … `LessonI31.tsx`) là **Client Components** có kích thước lớn (700–1300 dòng).
- Render qua dispatcher trong `app/(portal)/learn/[lessonId]/page.tsx`:
  ```tsx
  if (lessonId === "I1.1") return <div className="i11-surface"><LessonI11 /></div>;
  ```
- Mỗi lesson bọc trong `<div className="<lessonId>-surface">` — surface class custom trong `styles/globals.css`.

### 5.5 UI primitive pattern (shadcn)
- `components/ui/button.tsx` dùng `cva` cho 6 variants × 8 sizes.
- Style key: shadcn tokens (`bg-primary`, `text-primary-foreground`, …) — **KHÔNG** dùng YODY CSS variables ở đây.
- Hiện chỉ Button đã được sử dụng — thêm primitive mới phải xem xét theme conflict (§6).

---

## 6. CSS Conventions

### 6.1 Token hierarchy
| Layer | File | Tokens | Consumer |
|-------|------|--------|----------|
| **YODY DS v3** (primary) | `styles/globals.css` | `--brand`, `--iris`, `--gold`, `--mint`, `--rose`, `--bg`, `--fg-*`, … | Tất cả section components, Header, Overlays |
| **shadcn layer** (secondary) | `app/globals.css` | `--background`, `--foreground`, `--card`, `--primary`, … | `components/ui/button.tsx` only |
| **Lesson surface** | `styles/globals.css` cuối file | `.i11-surface`, `.i12-surface`, … `.i31-surface` | Lesson pages |

### 6.2 Quy tắc cứng
- ❌ **KHÔNG hardcode màu hex** trong component (`color: "#2a2b86"`) — phải dùng `var(--brand)`.
- ❌ **KHÔNG dùng Tailwind color utility** (`bg-blue-500`) — dùng YODY tokens qua inline style hoặc class `.i11-surface` etc.
- ✅ **Dùng `var(--iris)`, `var(--brand-tint)`, `var(--shadow-lg)`, …** trong inline style.
- ✅ **Font stacks:** `var(--font-body)` (Be Vietnam Pro), `var(--font-brand)` (Be Vietnam Pro), `var(--font-impact)` (Montserrat), `var(--font-display)` (Playfair Italic), `var(--font-mono)` (JetBrains Mono).
- ✅ **Surface class** cho lesson pages: bọc nội dung trong `<div className="<lessonId>-surface">` để scope custom styles.

### 6.3 Tone → color mapping
Mọi `Tone` value phải ánh xạ qua helper (`toneVal`, `toneTint`, `toneGrad`, `toneGlow`) — **không inline switch trong component**:
```ts
const TONE_MAP: Record<Tone, string> = {
  mint: "var(--mint)",
  iris: "var(--iris)",
  irisDeep: "var(--iris-deep)",
  rose: "var(--rose)",
  brand: "var(--brand)",
  gold: "var(--gold)",
};
```
> Hiện các helper này đang nằm **trong `components/Overlays.tsx`** (private). Nếu dùng ở section, **di chuyển vào `lib/tone.ts`** thay vì duplicate.

---

## 7. Theme Rules (CRITICAL)

### 7.1 Pattern: `data-theme` attribute
- YODY DS dùng `[data-theme="dark"]` selector — **KHÔNG** dùng `.dark` class.
- `STORAGE_KEY = "yds-ui-theme"` trong `lib/theme.ts`.
- Dark token override ở `styles/globals.css:1271–1286`.

### 7.2 FOUC prevention
Inline script trong `app/layout.tsx:63` phải chạy **trước hydration**:
```js
(function(){try{var t=localStorage.getItem('yds-ui-theme');if(t!=='dark'&&t!=='light')t='light';document.documentElement.dataset.theme=t;document.documentElement.dataset.surface='portal';}catch(e){document.documentElement.dataset.theme='light';document.documentElement.dataset.surface='portal';}})();
```
- Cả `<html>` và `<body>` phải có `suppressHydrationWarning` vì attribute này set trước React.

### 7.3 Anti-pattern ⚠️
- ❌ **Dùng `.dark` class** trong component hoặc CSS — sẽ không match YODY selector.
- ❌ **Toggle theme bằng cách set `className`** trên root — phải dùng `dataset.theme`.
- ❌ **Dùng shadcn `<Button>` cho UI cần dark mode responsive** — shadcn key trên `.dark`, YODY key trên `[data-theme]`. Hiện `Button` có thể **không respect dark mode**. (Xem [Project Roadmap §5](./project-roadmap.md#5-known-technical-debt).)

---

## 8. Data Conventions

### 8.1 Single source of truth
- **Mọi data hiển thị trên UI phải từ `lib/data.ts`** (hoặc import xuyên qua nó).
- ❌ Không hardcode text trong component khi text đó có thể nằm trong data layer.
- ❌ Không duplicate `LESSONS`, `BADGES`, `COMPS` ở nơi khác.

### 8.2 Exports của `lib/data.ts`
| Export | Type | Purpose |
|--------|------|---------|
| `LEVEL_LABELS`, `LEVEL_MULT`, `LEVEL_DESC` | `string[]`, `number[]` | 4 mức đánh giá (Cần hỗ trợ → Vượt kỳ vọng) |
| `LADDER` | `LadderLevel[]` | 5 cấp L1–L5 + role + desc |
| `COMPS` | `Competency[]` | 7 năng lực NL1–NL7 |
| `PRODUCTS` | `Product[]` | 4 sản phẩm capstone (I–IV) |
| `SC_ENTRY` | `ScoreEntry[]` | 6 tiêu chí đầu vào |
| `SC_FINAL` | `ScoreFinal[]` | 12 tiêu chí cuối khóa (3 segments) |
| `FINAL_SEGS` | `string[]` | 3 tên phân đoạn |
| `GATE_TEXT` | `string[]` | 5 acceptance criteria text |
| `ROADMAP` | `RoadmapItem[]` | 4 giai đoạn GĐ1–GĐ4 |
| `ANCHORS` | `AnchorMap` | 5 mô tả/level cho mỗi NL (record NL1..NL7) |
| `BADGES` | `Badge[]` | 5 huy hiệu YPB1–YPB5 |
| `LESSONS` | `Lesson[]` | 13 bản ghi (6 có component, 7 "coming soon") |
| `P` (exported), `H`/`U`/`Q`/`C` (private) | block helpers | Dựng `Block[]` |
| `q` (exported) | quiz helper | Dựng `QuizQuestion` |
| `L` (private) | lesson factory | Dựng `Lesson` record |

### 8.3 Lesson block shapes
```ts
type Block =
  | { t: "p";      x: string }       // đoạn văn
  | { t: "h";      x: string }       // heading
  | { t: "ul";     items: string[] } // bullet list
  | { t: "quote";  x: string }       // trích dẫn
  | { t: "code";   x: string };      // code block
```
- Switch trên `t` để render — discriminated union narrowing.
- Quiz: `{ q: string; opts: string[]; a: number }` — `a` là **zero-indexed**.

### 8.4 Lesson data conventions
- 13 lessons trong `LESSONS[]`, 6 có React component (`LessonI11` … `LessonI31`).
- 7 lessons chưa port (`I3.2`, `I3.3`, `I4.1`, `I4.2`, `I4.3`, `I5.1`, `I5.2`, `I5.3`) — fallback "Coming soon" trong `[lessonId]/page.tsx`.
- Mỗi lesson có: `id`, `lv` (giai đoạn), `title`, `sub`, `read` (thời lượng), `blocks`, `tldr[]`, `quiz[]`.

---

## 9. Data Migration Pipeline

### 9.1 Khi nào chạy
| Script | Trigger | Idempotent? |
|--------|---------|-------------|
| `scripts/extract_assets.py` | Một lần khi port từ DC bundle mới | ❌ Ghi đè |
| `scripts/build_globals.py` | Mỗi khi `styles/globals.raw.css` đổi | ✅ Có thể chạy lại |

### 9.2 Quy tắc
- **KHÔNG commit `public/demo/*` output** — nó là input, không phải artifact.
- `styles/globals.css` (production) phải **luôn được commit** — Vercel build cần file này.
- `styles/globals.raw.css` (nếu có) — generated, có thể gitignore hoặc giữ tùy team.

---

## 10. DON'T (Anti-patterns)

| ❌ Đừng | ✅ Làm thế này |
|--------|----------------|
| Thêm `"use client"` vào `lib/data.ts` / `lib/types.ts` | Để chúng là module thuần |
| Tạo file mới trong `app/(portal)/**` mà không có page wrapper | Mỗi route cần `page.tsx` |
| Dùng `useState` trong lesson component cho state UI nặng | Move lên `PortalContext` nếu cần share |
| Hardcode `color: "#2a2b86"` trong JSX | Dùng `var(--brand)` |
| Dùng `class="bg-blue-500"` cho accent | Dùng YODY tokens |
| Dùng `.dark` class cho theme | Dùng `data-theme` attribute |
| Inline switch `tone === "iris" ? "var(--iris)" : …` trong component | Import helper từ `lib/tone.ts` |
| Tạo `Block[]` bằng literal `{ t: "p", x: "…" }` | Dùng `P("…")` exported helper |
| Thêm `lesson` mới vào `LESSONS[]` mà quên check `[lessonId]/page.tsx` | Cập nhật dispatcher song song |
| Commit `.env` hoặc `GEMINI_API_KEY` | Chỉ commit `.env.example` (chỉ placeholder) |
| Refactor `Header.tsx` → `header.tsx` (PascalCase → kebab-case) | Giữ nguyên, follow existing pattern |

---

## 11. Tài liệu liên quan

- [Codebase Summary](./codebase-summary.md) — Tech stack, file count, entry points
- [System Architecture](./system-architecture.md) — Layered view, state, theme subsystem
- [Project Overview & PDR](./project-overview-pdr.md) — Vision, course, KPIs
- [Project Roadmap](./project-roadmap.md) — Milestones, tech debt (incl. theme `.dark` mismatch)
- [Design Guidelines](./design-guidelines.md) — YODY DS tokens (canonical reference)
