# Brainstorm — Code Review & Lint Flow (pre-commit + PR)

- **Date:** 2026-07-04
- **Status:** consensus
- **Stack:** NextJS 16 + TypeScript + Tailwind v4 + Vercel
- **Git:** GitHub (PR model)
- **Team:** Solo / 1-2 dev
- **Gate level:** Minimum (lint + typecheck + format, no full build in CI)
- **AI review:** Claude Code GitHub Action

---

## 1. Problem statement & constraints

Thiết kế luồng review code + lint trước commit và trong Pull Request cho dự án Next.js nhỏ, solo/1-2 dev. Gate phải đủ chặt để bắt lỗi sớm nhưng không cản trở tốc độ iteración.

**Constraints:**
- Không over-engineer (solo dev, YAGNI).
- Vercel đã lo build + preview deployment → không cần `next build` trong CI.
- Không có test suite hiện tại → gate dựa vào lint + typecheck + AI review.
- Phải hoạt động ngay sau setup, không cần infra phụ trợ.

---

## 2. Approaches evaluated

### A. Chỉ GitHub Actions (không Husky)
**Pros:** Không thêm dev dependency, mọi thứ tập trung CI.
**Cons:** Feedback loop chậm (phải push mới biết lint fail), dev fix nhiều round-trip, lãng phí CI minutes.
**Verdict:** Loại — friction cao cho solo dev.

### B. Chỉ Husky pre-commit (không CI)
**Pros:** Feedback tức thì, local-only.
**Cons:** Có thể `--no-verify` bypass, không bảo vệ branch, không có AI review.
**Verdict:** Loại — không đủ bảo vệ main branch.

### C. Husky pre-commit + GitHub Actions PR check + AI review ✅
**Pros:** Fast feedback local + branch protection + AI catches issue người dễ miss.
**Cons:** Setup 1 lần, cần API key.
**Verdict:** Chọn — cân bằng cho solo dev.

---

## 3. Recommended solution

### Lớp 1 — Pre-commit (local)
**Công cụ:** Husky + lint-staged
**Scope:** Chỉ staged files (fast, <2s)
- `prettier --write` — format staged files
- `eslint --fix` — auto-fix staged files
- **KHÔNG** chạy `tsc` ở đây (scan toàn project, chậm) → đẩy lên PR

### Lớp 2 — PR check (GitHub Actions)
Workflow `.github/workflows/pr-check.yml` chạy khi mở/cập nhật PR:

**Job `check` (required để merge):**
- `npm ci`
- `npm run lint` — ESLint toàn project
- `npm run format:check` — Prettier check (không fix)
- `npm run typecheck` — `tsc --noEmit`
- **Không** `next build` — Vercel preview deployment đã build, tránh trùng lặp

**Job `ai-review` (informational, không block merge):**
- Claude Code GitHub Action (`anthropics/claude-code-action`)
- Comment review chi tiết trên PR
- Cần `ANTHROPIC_API_KEY` trong GitHub Secrets

### Branch protection rules
- Require job `check` pass
- **Không** required human review (solo) — AI review đủ
- Bật required 1 approval khi team grow
- Require branches up-to-date before merge

### Scripts mới trong package.json
```json
"lint": "next lint",
"lint:fix": "next lint --fix",
"format": "prettier --write .",
"format:check": "prettier --check .",
"typecheck": "tsc --noEmit",
"prepare": "husky"
```

### Dev dependencies mới
- `husky` — git hooks
- `lint-staged` — chạy linters trên staged files
- `prettier` — formatter
- `eslint-config-prettier` — tắt ESLint rules conflict với Prettier

---

## 4. Implementation considerations & risks

**Risks:**
- ESLint config của Next 16 có thể khác phiên bản cũ → cần verify `next lint` hoạt động.
- Prettier có thể conflict với Tailwind v4 syntax → cần test trên file thực.
- Claude Code Action có giới hạn rate/cost → monitor usage.

**Files to create/modify:**
- `package.json` — thêm scripts + devDeps
- `.husky/pre-commit` — hook script
- `.lintstagedrc.json` — lint-staged config
- `.prettierrc.json` — Prettier config
- `.github/workflows/pr-check.yml` — CI workflow
- `eslint.config.mjs` — extend Next.js config + prettier (nếu chưa có)

**Rollback:** Xoá `.husky/`, xoá workflow file, gỡ scripts. Không ảnh hưởng code production.

---

## 5. Success metrics & validation

- `git commit` trigger Prettier + ESLint trên staged files, <2s.
- Mở PR → workflow chạy `check` job pass/fail rõ ràng.
- PR có comment từ Claude Code Action.
- Main branch không thể merge nếu `check` fail.
- `--no-verify` vẫn bypass được local (chấp nhận cho solo) nhưng CI sẽ block.

---

## 6. Next steps & dependencies

1. Setup Prettier + config
2. Setup ESLint (verify `next lint` Next 16)
3. Setup Husky + lint-staged + pre-commit hook
4. Tạo GitHub Actions workflow `pr-check.yml`
5. Thêm `ANTHROPIC_API_KEY` vào GitHub Secrets
6. Cấu hình branch protection trên GitHub repo settings

**Dependencies:** Không có, self-contained.

---

## 7. Decisions log

- **Bỏ `next build` trong CI** — Vercel preview đã build, tránh trùng lặp + chậm.
- **Không chạy tsc ở pre-commit** — scan toàn project chậm, đẩy lên PR.
- **Không required human review (solo)** — AI review đủ, bật khi team grow.
- **Claude Code Action làm AI review** — comment informational, không block merge.
- **Không commitlint** — giữ gate minimum, solo dev không cần quy ước message chặt.