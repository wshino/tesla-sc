# Vercel Deployment Guide

This guide explains how to deploy the Tesla Supercharger Finder app to Vercel.

## Prerequisites

- GitHub account (already have)
- Repository pushed to GitHub (completed)

## Steps

### 1. Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Login with your GitHub account
5. Authorize Vercel to access your GitHub

### 2. Import Project

1. In Vercel dashboard, click "Add New..." → "Project"
2. In "Import Git Repository" section:
   - Confirm your GitHub account is connected
   - Find `wshino/tesla-sc` repository and click "Import"

### 3. Configure Project

#### Basic Settings

- **Project Name**: `tesla-sc` (or any name you prefer)
- **Framework Preset**: `Next.js` (should be auto-detected)
- **Root Directory**: `.` (no change needed)

#### Build Settings (should be auto-configured, but verify)

- **Build Command**: `pnpm build` or `npm run build`
- **Output Directory**: `.next` (no change needed)
- **Install Command**: `pnpm install` or `npm install`

### 4. Environment Variables (Important)

Add the following in "Environment Variables" section:

| Name                              | Value                           |
| --------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `your-google-maps-api-key-here` |

**Note**: For production, configure the following restrictions in Google Cloud Console:

- HTTP referrer restrictions (add your deployed URL)
- API restrictions (enable only Places API)

### 5. Deploy

1. Click "Deploy" button
2. Deployment starts (takes 2-3 minutes)
3. Once successful, you'll get URLs like:
   - `https://tesla-sc.vercel.app`
   - `https://tesla-sc-wshino.vercel.app`
   - etc.

### 6. Post-Deployment Verification

1. Access the provided URL
2. Verify the following features:
   - Map display
   - Supercharger markers
   - Current location detection
   - Nearby places display (Google Places API)

## Custom Domain Setup (Optional)

To use a custom domain:

1. Vercel Dashboard → Project → Settings → Domains
2. Click "Add" to add your domain
3. Follow the DNS configuration instructions

## Automatic Deployment

Every push to GitHub automatically triggers a deployment:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Preview Deployments

Creating a pull request automatically creates a preview environment.

## Troubleshooting

### Build Errors

1. Check Vercel logs
2. Verify `pnpm build` works locally
3. Confirm environment variables are set correctly

### Google Maps API Not Working

1. Verify API key is correctly set
2. Check Places API is enabled in Google Cloud Console
3. Set HTTP referrer restrictions for production URL

### Performance Optimization

Vercel automatically provides:

- Image optimization
- JavaScript compression
- Global CDN distribution
- Edge caching

## Monitoring and Analytics

Available in Vercel dashboard:

- Real-time traffic
- Build times
- Error logs
- Performance metrics

## Security Best Practices

1. **API Key Protection**

   - Set HTTP referrer restrictions in Google Cloud Console
   - Enable only required APIs

2. **Environment Variables**

   - Always use environment variables for sensitive data
   - Never commit `.env.local` to Git

3. **Regular Updates**
   - Keep dependencies updated
   - Address security alerts promptly

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
