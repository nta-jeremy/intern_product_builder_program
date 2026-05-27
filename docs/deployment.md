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
- **Frontend:** Vite + React 19 SPA (served as static files)
- **API:** Vercel Serverless Function at `/api/gemini/assist`
- **Local Dev:** `cd src && npm run dev` (Express server on port 3000)

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