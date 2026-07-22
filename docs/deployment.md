# Deployment Guide

> **Platform:** Vercel
> **Project:** YODY Intern Product Builder Portal
> **Last updated:** 2026-07-20

---

## 1. Local Development

### 1.1 Prerequisites
| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | 24.x | Match Vercel runtime (xem `vercel.json`) |
| **npm** | bundled with Node 24 | `pnpm` / `yarn` cũng OK nếu repo chấp nhận |
| **Git** | 2.30+ | Submodules không cần |

### 1.2 First-time setup
```bash
# Clone (internal YODY org)
git clone <internal-repo-url> intern_product_builder_program
cd intern_product_builder_program

# Install deps
npm install

# Copy env template
cp .env.example .env.local
# → Edit .env.local, điền GEMINI_API_KEY (required)
```

### 1.3 Run dev server
```bash
npm run dev
# → http://localhost:3000
# → Turbopack enabled by default (Next.js 16)
```

### 1.4 Local build verification
Trước khi deploy, luôn chạy:
```bash
# Type check
npx tsc --noEmit

# Production build
npm run build

# Serve production build locally
npm start
# → http://localhost:3000 (production mode)
```

> ⚠️ Nếu `npm run build` fail với TypeScript error → fix trước khi push. Đừng dùng `// @ts-ignore` để bypass.

### 1.5 Common dev issues
- **Port 3000 đã bận:** `PORT=3001 npm run dev`
- **Stale `.next` cache:** `rm -rf .next && npm run dev`
- **Fonts không load:** check `public/fonts/` đầy đủ, network tab xem WOFF2 404

---

## 2. Vercel Configuration

### 2.1 Project setup (lần đầu)
1. Truy cập [Vercel Dashboard](https://vercel.com/tunganh252s-projects)
2. **Add New Project** → Import Git repo `intern_product_builder_program`
3. Framework: **Next.js** (auto-detected)
4. Build Command: `next build` (default — không cần override)
5. Output Directory: `.next` (default)
6. Node Version: **24.x** (Settings → General → Node Version)
7. Click **Deploy**

### 2.2 Vercel project config (đã set trong `vercel.json`)
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next"
}
```

> Node version không cần khai trong `vercel.json` — set trong Dashboard (Settings → General → Node Version = 24.x).

### 2.3 Production URLs
| Surface | URL |
|---------|-----|
| **Production** | https://yody-itdx-intern-product-builder.vercel.app |
| **Vercel Dashboard** | https://vercel.com/tunganh252s-projects/intern_product_builder_program |
| **Deployments list** | https://vercel.com/tunganh252s-projects/intern_product_builder_program/deployments |

### 2.4 Static routes (built by Next.js)
- `/` (homepage)
- `/_not-found` (Next.js default 404)
- Các route khác là dynamic (App Router) — không list trong build output

---

## 3. Environment Variables

### 3.1 Setup trên Vercel
**Path:** Dashboard → Project → Settings → Environment Variables

| Variable | Required | Environments | Description |
|----------|----------|--------------|-------------|
| `GEMINI_API_KEY` | **Yes** | Production, Preview, Development | Google Gemini API key (cho AI features) |
| `APP_URL` | Recommended | Production, Preview | Self-referential URL (vd. cho OAuth callback). Default: production URL |
| `NEXT_PUBLIC_SITE_URL` | Optional | Production | Override `metadataBase` cho OG tags |
| `TELEGRAM_BOT_TOKEN` | Optional | All | Từ `.env.example` — cho notification integration (chưa dùng runtime) |
| `TELEGRAM_CHAT_ID` | Optional | All | Từ `.env.example` — chat ID cho Telegram notification |

### 3.2 Local env
File `.env.local` (gitignored) — copy từ `.env.example`:
```bash
GEMINI_API_KEY=your_actual_key_here
APP_URL=http://localhost:3000
```

> ❌ **KHÔNG commit `.env.local`** — đã có trong `.gitignore`.
> ❌ **KHÔNG commit `GEMINI_API_KEY`** thật vào repo.

### 3.3 Secrets rotation
Nếu key bị lộ:
1. Tạo key mới trên Google AI Studio
2. Update Vercel env var
3. Redeploy (xem §4)

---

## 4. Deploy Workflow

### 4.1 Production deploy (manual)
```bash
# Từ repo root
vercel --prod --yes
```

Hoặc qua Vercel Dashboard: **Deployments** → **Redeploy** (chọn commit).

### 4.2 Auto-deploy (khi push)
- **Default branch** (`main` / `master`) → tự động deploy **Production**
- **Other branches** → tự động deploy **Preview** (URL tạm, vd. `intern-product-builder-<branch>-<hash>.vercel.app`)

### 4.3 Pre-deploy checklist
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes locally
- [ ] Tested trên dev server (`npm run dev`)
- [ ] Reviewed diff: `git diff main`
- [ ] No secrets trong code (check `.env`, `*.local`)
- [ ] Conventional commit message (vd. `feat: port I2.3 lesson`)

### 4.4 Conventional commits (khuyến nghị)
```bash
git commit -m "feat: port I2.3 lesson with quiz"
git commit -m "fix: dark mode toggle on shadcn Button"
git commit -m "docs: add system-architecture.md"
git commit -m "chore: bump Next.js 16.2.10"
```

---

## 5. Rollback

### 5.1 Vercel Dashboard (khuyến nghị)
1. Mở [Deployments](https://vercel.com/tunganh252s-projects/intern_product_builder_program/deployments)
2. Tìm deployment **trước** deployment bị lỗi
3. Click **`•••`** → **"Promote to Production"**
4. Xác nhận → Production được rollback trong ~30s

### 5.2 Vercel CLI
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

### 5.3 Git revert + redeploy
```bash
git revert <bad-commit-sha>
git push origin main
# → Vercel tự động deploy revert
```

> **Ưu tiên:** Dùng Vercel Dashboard promote (nhanh nhất, không cần git history).

---

## 6. Troubleshooting

### 6.1 `Output directory "src/dist" was not found`
- **Nguyên nhân:** `vercel.json#outputDirectory` không khớp với Next.js output.
- **Fix:** Đảm bảo `vercel.json` có `"outputDirectory": ".next"` (xem §2.2). Thường gặp khi project trước đó dùng Vite và chưa update config.

### 6.2 Build fails on TypeScript
- **Nguyên nhân:** Type error trong code.
- **Fix:**
  1. Chạy `npx tsc --noEmit` locally
  2. Fix errors theo thứ tự từ trên xuống
  3. Push lại

### 6.3 Missing env vars
- **Triệu chứng:** Runtime error khi gọi Gemini API hoặc OG image generation.
- **Fix:** Dashboard → Project → Settings → Environment Variables → thêm vars còn thiếu → Redeploy.

### 6.4 ⚠️ Theme dark mode không hoạt động trên một số UI
- **Triệu chứng:** Một số component (hiện tại: shadcn `Button`) **không respect dark mode** khi toggle theme.
- **Nguyên nhân:** shadcn key trên `.dark` class; YODY DS key trên `[data-theme="dark"]` attribute. Hai hệ không tự sync.
- **Workaround hiện tại:** Hạn chế dùng shadcn `<Button>` cho UI cần dark mode responsive. Nếu bắt buộc, dùng YODY-native button (CSS variables).
- **Permanent fix:** Xem [Project Roadmap §5.1](./project-roadmap.md#51-theme-dark-class-mismatch-).

### 6.5 FOUC (flash of unstyled content) khi load trang
- **Triệu chứng:** Trang load với light theme, sau đó flash sang dark (hoặc ngược lại).
- **Nguyên nhân:** Inline FOUC script trong `app/layout.tsx` không chạy (cache, ad-blocker, …).
- **Fix:** Check inline script còn nguyên vẹn tại `app/layout.tsx:63`. Đảm bảo `<html>` và `<body>` có `suppressHydrationWarning`.

### 6.6 Font không load / fallback về system font
- **Triệu nhân:** WOFF2/TTF files trong `public/fonts/` bị thiếu hoặc sai MIME type.
- **Fix:** Verify `public/fonts/` đầy đủ 4 files:
  - `be-vietnam-pro-400-normal.ttf`
  - `montserrat-900-normal.woff2`
  - `playfair-display-900-italic.woff2`
  - `jetbrains-mono-700-normal.woff2`
- Network tab: response phải là 200 với `Content-Type: font/woff2` (hoặc `font/ttf`).

### 6.7 Build output > 250 MB
- **Nguyên nhân:** `public/demo/Intern Product Builder Portal (standalone).html` (DC bundle) quá lớn.
- **Fix:** Xem [Project Roadmap §5.4](./project-roadmap.md#54-publicdemo-as-dead-asset) — cân nhắc move archive ra ngoài repo.

---

## 7. Custom Domain (chưa setup)

Hiện đang dùng Vercel auto-assigned domain. Để add custom domain (vd. `intern.yody.vn`):
1. Vercel Dashboard → Project → **Domains**
2. Add domain, follow DNS instructions
3. Configure ở DNS provider (Cloudflare / Route53):
   - **Apex:** `@` → `76.76.21.21` (Vercel IP)
   - **Subdomain:** `intern` → CNAME `cname.vercel-dns.com`
4. Đợi SSL propagate (≤ 24h)
5. Update `APP_URL` env var sang custom domain

---

## 8. Monitoring & Logs

### 8.1 Runtime logs
- Vercel Dashboard → Project → **Logs** tab
- Filter theo function (route), status code, time range

### 8.2 Build logs
- Vercel Dashboard → Deployments → Click deployment → **Build Logs**

### 8.3 Analytics (nếu enabled)
- Vercel Web Analytics (free tier có sẵn)
- Lighthouse audit: tự động chạy mỗi production deploy

---

## 9. Tài liệu liên quan

- [Project Overview & PDR](./project-overview-pdr.md)
- [Codebase Summary](./codebase-summary.md) — Tech stack, env vars
- [System Architecture](./system-architecture.md) — Build pipeline, theme
- [Code Standards](./code-standards.md) — Theme rules (data-theme vs .dark)
- [Project Roadmap](./project-roadmap.md) — Tech debt, milestones
