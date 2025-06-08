# Deployment Guide

## Recommended: Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your `tesla-sc` repository

2. **Configure Environment Variables**
   In Vercel dashboard, add:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Custom Domain (Optional)
- In Vercel dashboard → Settings → Domains
- Add your custom domain

## Alternative: Deploy to Cloudflare Pages

### Setup
1. Install Cloudflare adapter:
   ```bash
   pnpm add -D @cloudflare/next-on-pages
   ```

2. Update `package.json`:
   ```json
   "scripts": {
     "pages:build": "npx @cloudflare/next-on-pages",
     "pages:deploy": "wrangler pages deploy .vercel/output/static"
   }
   ```

3. Deploy:
   ```bash
   pnpm pages:build
   pnpm pages:deploy
   ```

## Alternative: Deploy to Google Cloud Run

### Using existing Docker setup

1. **Build and push image**:
   ```bash
   # Build production image
   docker build -f Dockerfile.prod -t gcr.io/YOUR_PROJECT_ID/tesla-sc .
   
   # Push to Google Container Registry
   docker push gcr.io/YOUR_PROJECT_ID/tesla-sc
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy tesla-sc \
     --image gcr.io/YOUR_PROJECT_ID/tesla-sc \
     --platform managed \
     --region asia-northeast1 \
     --allow-unauthenticated \
     --set-env-vars "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key"
   ```

## Environment Variables

All deployment methods require:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

## Performance Tips

1. **Image Optimization**
   - Use Next.js Image component (already implemented)
   - Consider using Cloudflare Images or similar CDN

2. **API Caching**
   - Consider caching Google Places API responses
   - Use Vercel Edge Config for dynamic configuration

3. **Monitoring**
   - Vercel Analytics (built-in)
   - Google Analytics (optional)

## Security Considerations

1. **API Key Protection**
   - Restrict Google Maps API key to your domain
   - Use environment variables (never commit keys)

2. **Rate Limiting**
   - Consider implementing rate limiting for API routes
   - Use Vercel Edge Middleware for protection