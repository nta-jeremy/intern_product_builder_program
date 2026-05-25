# YODY ITDX EA Portal — Design System Overview

> **Phiên bản:** Portal v2.3 · T5/2026  
> **Scope:** Enterprise Architecture Portal — tài liệu nội bộ ITDX YODY  
> **URL:** https://yody-itdx-ea.vercel.app/

---

## Mục đích

Design system này mô tả ngôn ngữ thiết kế của cổng thông tin Kiến trúc Doanh nghiệp YODY (ITDX EA Portal) — một tài liệu nội bộ dạng "living document" phục vụ chuyển đổi số giai đoạn 2026–2030 IPO.

Portal không phải consumer product. Đây là **strategic communication layer** giữa ITDX và ban lãnh đạo YODY — mỗi trang là một "chương" trong câu chuyện chuyển đổi số.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Rendering | SSR (Server-Side Rendered) |
| Images | `next/image` với optimization |
| Fonts | System / Web fonts (inferred) |
| Deploy | Vercel |

---

## Cấu trúc Portal

Portal được tổ chức thành **4 chương** (chapters), mỗi chương là một góc nhìn khác nhau:

| Chương | Tên | Câu hỏi | Pages |
|--------|-----|---------|-------|
| 01 | Tầm nhìn | Where are we going? | `/` |
| 02 | Bức tranh | What do we have now? | `/platforms`, `/atlas`, `/capabilities`, `/org` |
| 03 | Chiến lược | How will we get there? | `/digitization-framework`, `/principles`, `/ai-native-enterprise`, `/initiatives` |
| 04 | Hành trình | When and how far? | `/roadmap`, `/health` |

---

## Design Principles

### 1. Narrative-first
Mỗi trang kể một câu chuyện có đầu-cuối. Layout theo dạng scroll dài với các section Roman numeral (I, II, III...) dẫn dắt người đọc.

### 2. Data-grounded
Mọi claim đều có số liệu cụ thể đi kèm. KPI cards, metric bars, và inline citations (McKinsey, BCG, Bain) là pattern xuyên suốt.

### 3. Bilingual by design
Tiếng Việt cho narrative, tiếng Anh cho technical terms. Không dịch platform names, product names, hay thuật ngữ kỹ thuật. Pattern này nhất quán ở mọi trang.

### 4. Status transparency
Hệ thống badge LIVE/DEV/PLAN/GAP được dùng nhất quán để phản ánh thực trạng, không che giấu gap. GAP items hiện màu cảnh báo rõ ràng.

### 5. IPO-ready credibility
Visual language hướng đến tính chuyên nghiệp của tài liệu IPO — bảng biểu chuẩn, số liệu có nguồn, version tracking (sha commit), timestamps.

---

## Files trong Design System

| File | Nội dung |
|------|---------|
| `00-overview.md` | Overview này |
| `01-foundations-colors.md` | Color palette, semantic colors, status colors |
| `02-foundations-typography.md` | Type scale, font patterns, heading styles |
| `03-foundations-spacing-layout.md` | Spacing scale, grid, section structure |
| `04-components-navigation.md` | Navbar, footer, sidebar outline, chapter nav |
| `05-components-cards.md` | KPI cards, platform cards, insight callouts |
| `06-components-status-badges.md` | LIVE/DEV/PLAN/GAP system, BUILD/BUY tags |
| `07-components-tables.md` | RACI, roadmap grid, risk register tables |
| `08-components-sections.md` | Page sections, scroll structure, chapter headers |
| `09-patterns-content.md` | Writing patterns, Vi/En mixing, content structure |
| `10-patterns-data-viz.md` | Charts, maturity bars, progress indicators |

---

## Bối cảnh kinh doanh

- **Tổ chức:** YODY Fashion — chuỗi thời trang fast-fashion VN
- **Mục tiêu 2030:** Doanh thu 5.806 tỷ, IPO, AI-Native Enterprise
- **Đội ITDX:** 3 BPs × 7 Squads (DELTA, SIGMA, GAMMA, BETA, OMEGA, LAMBDA, BI)
- **6 Platforms:** PHOENIX, UNICORN, IRIS, GLAUX, ATLAS, AEGIS
- **86 sản phẩm:** 41 LIVE · 7 DEV · 20 PLAN · 18 GAP
- **DMI 2026:** 32/100 → **Mục tiêu 2030:** 65/100

---

*Design system này được reverse-engineered từ rendered HTML. Với Next.js + Tailwind CSS, token values chính xác cần xem source code hoặc devtools.*
