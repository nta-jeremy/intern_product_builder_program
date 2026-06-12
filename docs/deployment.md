# Deployment

## Platform: Vercel

## URLs
- **Production**: https://yody-itdx-intern-product-builder.vercel.app
- **Vercel Dashboard**: https://vercel.com/tunganh252s-projects/intern_product_builder_program

## Deploy Command
```bash
vercel --prod --yes
```

## Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Gemini AI API key for AI assistant features |
| `APP_URL` | Recommended | Self-referential URL for OAuth callbacks & API endpoints |

## Project Config (`vercel.json`)
- **Build Command**: `npm run build:vite`
- **Output Directory**: `dist/`
- **Framework**: None (SPA + API routes)
- **API Routes**: `/api/gemini/assist` (serverless function)

## Custom Domain
Currently using Vercel auto-assigned domain (`yody-itdx-intern-product-builder.vercel.app`). To add custom domain:
1. Go to Vercel Dashboard → Project → Domains
2. Add your domain and configure DNS

## Rollback
1. Go to [Vercel Dashboard → Deployments](https://vercel.com/tunganh252s-projects/intern_product_builder_program/deployments)
2. Find the working deployment
3. Click "•••" → "Promote to Production"

## Troubleshooting
- **Build fails**: Check `vercel.json#outputDirectory` matches actual build output
- **API 404**: Ensure `api/*.ts` files exist and `@vercel/node` is installed
- **Missing env vars**: Configure in Vercel Dashboard → Project → Environment Variables
