# Project Overview & Product Development Requirements (PDR)

> **Project:** YODY Intern Product Builder Portal
> **Owner:** YODY Technology Department (ITDX)
> **Audience:** Intern Product Builder (L2) — Vietnamese tech interns
> **Last updated:** 2026-07-20
> **Status:** Active development — see [Project Roadmap](./project-roadmap.md)

---

## 1. Tầm nhìn & Sứ mệnh

### Tầm nhìn (Vision)
Trở thành nền tảng số chuẩn YODY cho chương trình đào tạo **Intern Product Builder** — nơi mỗi thực tập sinh công nghệ Việt Nam có thể đi từ **L1 (Cần hỗ trợ)** đến **L2 (Product Builder tốt nghiệp)** trong 14 buổi học, với khung năng lực rõ ràng, lộ trình trực quan, dự án thực chiến và hệ thống huy hiệu ghi nhận tiến bộ.

### Sứ mệnh (Mission)
- **Cá nhân hóa lộ trình:** Mỗi NL1–NL7 đều có mô tả chi tiết theo 5 cấp độ L1–L5.
- **Đo lường bằng sản phẩm:** Đánh giá qua 4 dự án capstone (I–IV) và 3 phân đoạn scorecard cuối khóa.
- **Trải nghiệm "lean-back":** Portal đọc dễ từ xa (14" laptop, projector 1080p), học liệu ≤ 20 phút mỗi buổi.

### Đối tượng sử dụng
| Nhóm | Vai trò | Mục tiêu chính |
|------|---------|----------------|
| **Intern Product Builder** | Người học (L1 → L2) | Xem khung năng lực, lộ trình, học liệu, làm bài quiz, theo dõi scorecard |
| **Trainer / Mentor** | Người hướng dẫn | Tham chiếu rubric, xem gate, đánh giá capstone |
| **PO / HR YODY** | Người quản lý chương trình | Theo dõi cohort, xem huy hiệu, đánh giá tổng thể |

> Hiện tại portal **chưa có hệ thống auth / role** — chỉ phục vụ viewing, không có learner-specific persistence (xem [Project Roadmap §5 Technical Debt](./project-roadmap.md#5-known-technical-debt)).

---

## 2. Tính năng cốt lõi

### 2.1 Bản đồ tính năng (8 modules)

| # | Module | Route | Component section | Mô tả |
|---|--------|-------|-------------------|-------|
| 1 | **Tổng quan** | `/` | `Overview.tsx` | Hero + CTA → Learn Hub + Khung năng lực |
| 2 | **Khung năng lực** | `/competencies` | `Competencies.tsx` | 7 năng lực NL1–NL7 × 5 cấp độ L1–L5 + mở drawer chi tiết |
| 3 | **Lộ trình** | `/roadmap` | `RoadmapTimeline.tsx` | 4 giai đoạn GĐ1–GĐ4 với 14 buổi + 4 gate |
| 4 | **Dự án** | `/projects` | `Products.tsx` | 4 sản phẩm capstone (I–IV) với deliverables + KPIs |
| 5 | **Học tập** | `/learn-hub` | `LearnHub.tsx` + `LearnHubCalendar.tsx` | Calendar 14 buổi + bộ lọc + danh sách buổi |
| 6 | **Chi tiết buổi học** | `/learn/[lessonId]` | `LessonI{xx}.tsx` | Bài đọc + TL;DR + Quiz (6 buổi đã port) |
| 7 | **Scorecard** | `/scorecard` | `Scorecard.tsx` | 6 tiêu chí đầu vào + 12 tiêu chí cuối khóa × 3 phân đoạn |
| 8 | **Huy hiệu** | `/badges` | `Badges.tsx` | 5 huy hiệu YPB1–YPB5 với tiêu chí mở khóa |

### 2.2 Overlay system (state-driven)
Mở từ bất kỳ trang nào qua `PortalContext`:
- **Competency Drawer** (slide-in phải, 500px) — click vào NL card
- **Badge Modal** (pop center, 460px) — click vào huy hiệu
- **Quiz Modal** (pop center, 600px, z90) — mở từ roadmap / overview

### 2.3 Theme system
- **Light + Dark mode** toggle trên header
- Persist qua `localStorage["yds-ui-theme"]` với `data-theme` attribute pattern
- FOUC prevention bằng inline script trong `app/layout.tsx`

---

## 3. Cấu trúc khóa học (14 buổi / 4 giai đoạn)

| Giai đoạn | Tuần | Buổi | Trọng tâm | Mục tiêu level |
|-----------|------|------|-----------|----------------|
| **GĐ1** · Nền tảng AI & Outcome Thinking | 1–4 | I1.1, I1.2, I2.1, I2.2 | LLM mechanics, outcome thinking, prompt cơ bản, design thinking empathy | L1 |
| **GĐ2** · Prompt & Tư duy Phân tích | 5–8 | I2.3, I3.1, I3.2, I3.3 | Critical thinking, agentic workflows, build deliverable, mentor review | L1 → L2 |
| **GĐ3** · Workflow & Độc lập | 9–11 | I4.1, I4.2, I4.3 | Advanced product mindset, dev craft, integrate & measure | L2 |
| **GĐ4** · Capstone & Vận hành | 12–14 | I5.1, I5.2, I5.3 | AI solution architecture, security/eval/ops, ship & defend | Tốt nghiệp L2 / Stretch L3 |

### 4 Gate đánh giá (gate criteria)

| Gate | Tuần | Tiêu chí nghiệm thu | Liên kết |
|------|------|----------------------|----------|
| **Gate 1** (GĐ1) | Tuần 4 | Tài liệu 1 trang: outcome + metric + giới hạn công nghệ + PII compliance | `lib/data.ts` `ROADMAP[0].gate` |
| **Gate 2** (GĐ2) | Tuần 8 | Product Spec Draft + 5 Whys + giả thuyết kiểm chứng được — Trainer duyệt | `ROADMAP[1].gate` |
| **Gate 3** (GĐ3) | Tuần 11 | Sản phẩm bàn giao bản v2 + workflow chạy được + HITL + code review pass | `ROADMAP[2].gate` |
| **Graduation** (GĐ4) | Tuần 14 | Capstone chạy được + tài liệu kiến trúc + slide bảo vệ trước Hội đồng | `ROADMAP[3].gate` |

> Chi tiết từng buổi: xem [knowledge/course/00-Course-Map.md](../knowledge/course/00-Course-Map.md).

---

## 4. Khung năng lực (7 NL × 5 level)

### 4.1 Bảy năng lực cốt lõi (NL1–NL7)

| Code | Nhóm | Tên (VI) | Tên (EN) | Lock? |
|------|------|----------|----------|-------|
| **NL1** | mindset | Outcome Thinking | Outcome Thinking | **Must-pass** |
| **NL2** | mindset | Tư duy Phản biện & Kiểm chứng | Critical Thinking | — |
| **NL3** | mindset | Tư duy Thiết kế & Thấu cảm | Design Thinking | **Must-pass** |
| **NL4** | eng | Thấu hiểu Nền tảng AI | AI Fundamentals & LLM Mechanics | — |
| **NL5** | eng | Kỹ năng Prompt & Ứng dụng Công cụ | Prompt Engineering & Tool Use | **Must-pass** |
| **NL6** | eng | Quy trình Agent & RAG | Agentic Workflows & RAG | — |
| **NL7** | eng | Dev Craft & Tích hợp | Dev Craft · Git · Debug · Test | **Must-pass** |

> 4 must-pass (NL1, NL3, NL5, NL7) là **điều kiện tiên quyết** để tốt nghiệp. Xem `GATE_TEXT[4]` trong `lib/data.ts`.

### 4.2 Thang năng lực 5 cấp (L1–L5)

| Level | Role | Mô tả | Highlight |
|-------|------|-------|-----------|
| **L1** | Học viên | Thực hiện theo hướng dẫn chi tiết từng bước. Cần kèm cặp sát sao. | — |
| **L2** | Product Builder | Xử lý công việc có phạm vi rõ ràng, sản phẩm cần review. **Bán tự chủ** — đây là level tốt nghiệp. | Gold tint (`.grad`) |
| **L3** | Product Engineer | Làm chủ từ đầu đến cuối một tính năng. Tự chủ hoàn toàn. | — |
| **L4** | Senior | Định hình định hướng phát triển dòng sản phẩm. Dẫn dắt. | — |
| **L5** | Principal / Staff | Thiết lập tiêu chuẩn chung, hướng dẫn đội ngũ. Đòn bẩy lớn. | — |

> Nguồn: `lib/data.ts` → `LADDER[]` + `ANCHORS[NL*][]` (5 mô tả/level cho mỗi năng lực).

---

## 5. Sản phẩm Capstone (4 dự án)

| Roman | Tên (VI) | Tên (EN) | Ưu tiên | Stakeholders chính |
|-------|----------|----------|---------|---------------------|
| **I** | Hệ thống ATS | Applicant Tracking System | CAO | Phòng Nhân sự, Hiring Manager |
| **II** | Agent QC cho Website YODY | Automated Quality Control Agent | CAO | QA Team, Technical Team |
| **III** | _(xem `lib/data.ts` → `PRODUCTS[2]`)_ | — | — | — |
| **IV** | _(xem `lib/data.ts` → `PRODUCTS[3]`)_ | — | — | — |

> Mỗi sản phẩm có 6 deliverables với `feature`, `output`, `kpi`, `sign[]` (người ký duyệt).

---

## 6. Huy hiệu (5 cấp YPB1–YPB5)

| Code | Tên (VI) | Tên (EN) | Tone | Điều kiện mở khóa |
|------|----------|----------|------|---------------------|
| **YPB1** | Product Explorer | Problem Alignment | mint | Hoàn thành khảo sát thực tế + Diligence Statement |
| **YPB2** | MVP Builder | Rapid Prototyping & Validation | iris | Vượt Gate YPB1→YPB2 với MVP dùng Prompt Engineering |
| **YPB3** | Product Builder | End-to-End Delivery | irisDeep | Tự chủ thiết kế automation + bàn giao tính năng chạy độc lập |
| **YPB4** | Product Engineer | Scale & Adoption | brand | Tích hợp vào vận hành thực tế, chứng minh adoption |
| **YPB5** | Product Architect | Lifecycle Launch & Graduation | gold | Triển khai productive + bảo vệ Capstone trước Hội đồng |

> YPB3 = TỐT NGHIỆP. YPB5 = cap của chương trình. Nguồn: `lib/data.ts` → `BADGES[]`.

---

## 7. Scorecard (đánh giá cuối khóa)

| Phân đoạn | Tên | Trọng số | Số tiêu chí |
|-----------|-----|----------|--------------|
| **Phân đoạn 01** | Kết quả prototype | 45đ | thuộc 12 tiêu chí cuối |
| **Phân đoạn 02** | Năng lực cốt lõi | 35đ | (NL1, NL3, NL5, NL7 weighted) |
| **Phân đoạn 03** | Quá trình & bằng chứng | 20đ | (feedback loop, PII compliance) |

- **6 tiêu chí đầu vào** (`SC_ENTRY`): prototype + acceptance criteria + 2 feedback rounds + PII compliance + L2 trên NL cốt lõi.
- **12 tiêu chí cuối khóa** (`SC_FINAL`): phân bổ vào 3 phân đoạn, mỗi tiêu chí có `id`, `max`, `name`, `kpi`, `seg`, `nl?`.

---

## 8. Success Metrics (KPIs)

### 8.1 Engagement
- ≥ 80% intern truy cập portal hàng tuần
- 100% intern hoàn thành quiz cho 6 buổi đã port
- Time-on-page trung bình: 8–12 phút / buổi (mục tiêu ≤ 20 phút theo course design)

### 8.2 Outcome (chương trình)
- ≥ 70% intern đạt L2 trên 4 must-pass (NL1, NL3, NL5, NL7)
- ≥ 60% intern tốt nghiệp YPB3
- ≥ 30% intern vươn YPB5 (Product Architect) trong cohort đầu

### 8.3 Product quality
- Lighthouse Performance ≥ 90 (desktop)
- First Contentful Paint ≤ 1.5s trên Vercel CDN
- 0 build error, 0 type error trong CI

---

## 9. Non-Goals (Out of scope)

Portal hiện tại **không** hỗ trợ:
- **Authentication / Authorization** — không có login, không có role-based UI
- **Learner-specific data persistence** — không lưu quiz answers, badge unlocks, scorecard state
- **Real-time collaboration** — không có multi-user editing hay chat
- **Backend / Database** — toàn bộ dữ liệu hardcode trong `lib/data.ts`
- **Markdown content loader** — bài học là React components, không load từ `.md`
- **Internationalization framework** — nội dung 100% tiếng Việt, có EN labels lồng ghép nhưng không có i18n runtime

> Các non-goals trên được lên kế hoạch giải quyết trong [Project Roadmap §2 Milestones](./project-roadmap.md#2-milestones).

---

## 10. Tài liệu liên quan

- [Codebase Summary](./codebase-summary.md) — Tech stack, directory map, data flow
- [System Architecture](./system-architecture.md) — Layered architecture, state, theme
- [Code Standards](./code-standards.md) — Quy ước code, naming, "use client" policy
- [Project Roadmap](./project-roadmap.md) — Milestones Q3 2026 → Q2 2027
- [Deployment Guide](./deployment.md) — Vercel setup, env vars, rollback
- [Design Guidelines](./design-guidelines.md) — YODY design tokens & rules
