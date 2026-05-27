# Deployment

## Platform
- **Name:** Vercel
- **Project:** intern_product_builder_program
- **Team:** tunganh252s-projects

## URLs
- **Production:** https://internproductbuilderprogram.vercel.app
- **Inspector:** https://vercel.com/tunganh252s-projects/intern_product_builder_program

## Deploy Command
```bash
vercel --prod --yes
```

## Architecture
- **Frontend:** Vite + React 19 SPA with react-router-dom (URL-based routing)
- **Intro Page:** Static HTML at `/intro/` (separate from React SPA)
- **API:** Vercel Serverless Function at `/api/gemini/assist`
- **Local Dev:** `cd src && npm run dev` (Express server on port 3000)

## Routes
| Path | Type | Description |
|------|------|-------------|
| `/` | React SPA | Overview dashboard |
| `/profile` | React SPA | Success profile criteria |
| `/products` | React SPA | 4 product descriptions |
| `/lifecycle` | React SPA | Coaching lifecycle roadmap |
| `/scorecard` | React SPA | Evaluation scorecard |
| `/journal` | React SPA | Working journal with AI assist |
| `/intro/` | Static HTML | Program introduction page |
| `/intro` | Redirect → `/intro/` | |
| `/api/gemini/assist` | Serverless | Gemini AI endpoint |

## Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini AI API key for journal assistance |

Configure in Vercel Dashboard → Settings → Environment Variables.

## Rollback
Vercel Dashboard → Select project → Deployments → Choose older deployment → Click "Promote to Production".

Or via CLI:
```bash
vercel rollback [deployment-url]
```

## Notes
- Migrated from Next.js (apps/landing-page) to Vite + React (src/)
- Express server.ts used only for local development
- Production API runs as Vercel serverless function (api/gemini/assist.ts)
- API simulates responses when GEMINI_API_KEY is not configured
- React Router (react-router-dom v7) for URL-based navigation with scroll restoration
- `/intro/` serves static HTML page outside the React SPA