# 🎓 Intern Product Builder Portal

![YODY](https://img.shields.io/badge/YODY-ITDX%20Technology-2a2b86?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-Internal-success?style=for-the-badge)

Portal quản lý chương trình đào tạo Intern Product Builder của YODY — nền tảng tích hợp khung năng lực, lộ trình học tập, dự án thực chiến, scorecard và hệ thống huy hiệu cho thực tập sinh công nghệ.

---

## 📖 Giới thiệu

Intern Product Builder Portal là nền tảng học tập số dành riêng cho chương trình thực tập Product Builder của YODY Technology. Hệ thống cung cấp:

- **Khung năng lực chi tiết** (NL1–NL7) được thiết kế theo lộ trình L2–L5
- **Lộ trình học tập 14 buổi** bao gồm kiến thức AI, Product Mindset, Design Thinking, và kỹ thuật
- **Dự án thực chiến** với AI integration, đầy đủ gate đánh giá và feedback loop
- **Scorecard năng lực** theo dõi tiến trình phát triển của từng thực tập sinh
- **Hệ thống huy hiệu** ghi nhận các thành tích và cột mốc quan trọng
- **Quiz và bài kiểm tra** đánh giá mức độ hiểu bài sau mỗi buổi học

Được xây dựng theo Design System chuẩn YODY với **aesthetic: light hightech · art accent reserve · craftsmanship · AI-native**, portal mang lại trải nghiệm học tập trực quan, hiện đại và chuyên nghiệp.

---

## ✨ Tính năng chính

### 📚 Quản lý lộ trình học tập
- Xem tổng quan 14 buổi học theo 4 giai đoạn
- Truy cập tài liệu đọc và bài giảng cho từng buổi
- Theo dõi tiến trình học tập cá nhân

### 🎯 Khung năng lực
- 7 năng lực cốt lõi: NL1–NL7
- Mô tả chi tiết từng level (L1–L5)
- Track tiến trình phát triển năng lực

### 🚀 Lộ trình phát triển
- Visual roadmap cho toàn bộ khóa học
- Xem kết nối giữa các buổi và năng lực tương ứng
- Hiển thị status cho từng buổi (Planned/In Progress/Completed)

### 💳 Hệ thống huy hiệu
- Collection huy hiệu theo thành tích
- Visual progression với unlock milestones
- Personal achievement showcase

### 📊 Scorecard năng lực
- Dashboard theo dõi performance
- Metrics và KPI cho từng năng lực
- Historical progress tracking

### 🧠 Quiz & Assessment
- Interactive quiz sau mỗi buổi học
- Real-time feedback
- Progress tracking và achievement badges

---

## 🏗️ Cấu trúc dự án

```
intern_product_builder_program/
├── app/                      # Next.js App Router
│   ├── (portal)/           # Portal pages
│   │   ├── layout.tsx      # Portal layout wrapper
│   │   ├── page.tsx        # Homepage / Overview
│   │   ├── roadmap/        # Learning roadmap
│   │   ├── competencies/   # Competency framework
│   │   ├── badges/         # Badge collection
│   │   ├── scorecard/      # Scorecard dashboard
│   │   └── quiz/           # Quiz interface
│   ├── layout.tsx          # Root layout with metadata
│   └── globals.css         # Global styles & design tokens
├── components/             # React components
│   ├── Header/             # Navigation header
│   ├── Overlays/           # Modals, drawers, badges
│   └── sections/           # Page sections (Overview, etc.)
├── lib/                    # Utilities & logic
│   ├── portal-context.tsx  # Portal state management
│   └── ...                 # Helper functions
├── knowledge/              # Course content (markdown)
│   └── course/             # 14 buổi học materials
│       ├── 00-Course-Map.md
│       ├── I1.1-AI-Fundamentals/
│       ├── I1.2-Outcome-Thinking-PII/
│       └── ...             # Other sessions
├── docs/                   # Documentation
│   ├── deployment.md       # Deployment guide
│   └── design-guidelines.md # YODY design system
├── public/                 # Static assets
│   ├── fonts/              # Custom fonts
│   └── thumbnails/         # OG images
├── scripts/                # Build & utility scripts
├── styles/                 # Additional stylesheets
├── AGENTS.md               # AI agent configuration
├── components.json         # shadcn/ui configuration
├── next.config.ts          # Next.js config
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind CSS config
└── vercel.json             # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 24.x or higher
- **npm** or **yarn** package manager
- **Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/intern-product-builder-portal.git
   cd intern-product-builder-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the portal.

### Build for Production

```bash
npm run build
npm start
```

---

## 🏢 Deployment

### Platform: Vercel

This project is configured for automatic deployment on Vercel.

**Production URL**: https://yody-itdx-intern-product-builder.vercel.app

**Manual deployment**:
```bash
vercel --prod --yes
```

### Environment Variables on Vercel

Configure these in your Vercel project settings:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Gemini AI API key for AI assistant features |
| `APP_URL` | Recommended | Self-referential URL for OAuth callbacks & API endpoints |

### Rollback

1. Go to [Vercel Dashboard → Deployments](https://vercel.com/tunganh252s-projects/intern_product_builder_program/deployments)
2. Find the working deployment
3. Click "•••" → "Promote to Production"

For detailed deployment information, see [docs/deployment.md](docs/deployment.md).

---

## 🎨 Design System

This project follows the **YODY Design System** for tech landing pages.

### Brand Identity

- **Brand**: YODY — Vietnamese mass-market fashion brand (274 stores, IPO target 2030)
- **Aesthetic**: light hightech · art accent reserve · craftsmanship · AI-native
- **Primary Colors**:
  - `--brand`: #2a2b86 (Primary navy)
  - `--brand-gold`: #fcaf16 (Decorative gold)

### Typography

- **Montserrat**: Headlines, H1/H2, display text
- **Be Vietnam Pro**: Brand chrome, card titles
- **Inter**: Body, labels, captions
- **Playfair Display Italic**: Hero only (1 moment per page)
- **JetBrains Mono**: Tags, code, technical metadata

### Component Guidelines

- **White-dominant design** with generous whitespace
- **Iris accent** (#7c6cf5) for AI/tech elements (90% of accent surface)
- **Soft brand-tinted shadows**, never neutral black
- **4px base unit** for spacing system

For complete design specifications, see [docs/design-guidelines.md](docs/design-guidelines.md).

---

## 📚 Course Content Structure

The course consists of **14 sessions** organized into 4 phases:

### Phase 1 (Weeks 1–4): AI Foundations & Outcome Thinking
- I1.1: AI Fundamentals & LLM Mechanics
- I1.2: Outcome Thinking & PII Compliance
- I2.1: Prompt Engineering & Tool Use
- I2.2: Design Thinking: Empathy & Ideation

### Phase 2 (Weeks 5–8): Prompt & Analytical Thinking
- I2.3: Critical Thinking: Root Cause & Hypothesis
- I3.1: Agentic Workflows & RAG
- I3.2: Build Deliverable & Quality Control
- I3.3: Design Thinking: Collaboration & Iteration

### Phase 3 (Weeks 9–11): Workflow & Independent Development
- I4.1: Advanced Product Mindset & Ownership
- I4.2: Dev Craft: Git, Read/Debug AI Code, Testing
- I4.3: Integrate Initiative & Measure Outcomes

### Phase 4 (Weeks 12–14): Capstone & Operations
- I5.1: AI Solution Architecture
- I5.2: Security, Eval & Operations
- I5.3: Ship & Defend Capstone

Each session includes:
- **Learning objectives** & competency mapping
- **Reading materials** (≤20 min per file)
- **Self-assessment** quizzes
- **Practical exercises** & deliverables

For the complete course map, see [knowledge/course/00-Course-Map.md](knowledge/course/00-Course-Map.md).

---

## 🔧 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.2 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui + Radix UI |
| **State Management** | React Context API |
| **AI Integration** | Google Gemini API |
| **Fonts** | Google Fonts (Montserrat, Inter, Playfair Display) + Self-hosted (Be Vietnam Pro, JetBrains Mono) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |
| **Version Control** | Git |

---

## 📋 Scripts

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Utilities
npm run lint         # Run ESLint (if configured)
npm run typecheck    # Run TypeScript type checking (if configured)
```

---

## 🤝 Contributing

This is an internal YODY project. For contribution guidelines and code review process, please refer to the internal documentation or contact the development team.

---

## 📄 License

**Internal Use Only** — This project is proprietary software developed by YODY Technology. Unauthorized copying, distribution, or modification is strictly prohibited.

---

## 👥 Team & Contact

- **Product Owner**: YODY Technology Department
- **Development Team**: YODY ITDX Technology
- **Design System**: YODY Enterprise Architecture

For issues, questions, or support, please use the internal communication channels or contact the development team directly.

---

## 🔗 Resources

- **Production**: [https://yody-itdx-intern-product-builder.vercel.app](https://yody-itdx-intern-product-builder.vercel.app)
- **Vercel Dashboard**: [https://vercel.com/tunganh252s-projects/intern_product_builder_program](https://vercel.com/tunganh252s-projects/intern_product_builder_program)
- **Design Guidelines**: [docs/design-guidelines.md](docs/design-guidelines.md)
- **Deployment Guide**: [docs/deployment.md](docs/deployment.md)
- **Course Map**: [knowledge/course/00-Course-Map.md](knowledge/course/00-Course-Map.md)

---

<div align="center">

**Built with ❤️ by Jeremy Nguyen in YODY Technology**

*Empowering the next generation of product builders in Vietnam*

</div>