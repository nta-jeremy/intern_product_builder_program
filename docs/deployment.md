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
- **Framework**: Next.js (auto-detected)
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Node Version**: 24.x
- **Static Routes**: `/`, `/_not-found`

## Custom Domain
Currently using Vercel auto-assigned domain (`yody-itdx-intern-product-builder.vercel.app`). To add custom domain:
1. Go to Vercel Dashboard → Project → Domains
2. Add your domain and configure DNS

## Rollback
1. Go to [Vercel Dashboard → Deployments](https://vercel.com/tunganh252s-projects/intern_product_builder_program/deployments)
2. Find the working deployment
3. Click "•••" → "Promote to Production"

## Troubleshooting
- **`Output directory "src/dist" was not found`**: Ensure `vercel.json#outputDirectory` matches Next.js build output (`.next`). Common cause: project was previously Vite/other framework and `outputDirectory` not updated.
- **Build fails on TypeScript**: Run `npm run build` locally first; fix type errors before deploying.
- **Missing env vars**: Configure in Vercel Dashboard → Project → Environment Variables.
