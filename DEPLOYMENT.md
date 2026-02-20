# Vercel Deployment Guide for Kodbank

## Frontend Deployment (Vercel)

### Option 1: Deploy from Root Directory

1. **Connect your GitHub repo to Vercel**
2. **Set Root Directory**: In Vercel project settings, set **Root Directory** to `frontend`
3. **Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables** (if needed):
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.vercel.app/api` or your backend server URL)

### Option 2: Deploy from Frontend Directory

1. Navigate to `frontend` folder
2. Deploy directly from there (Vercel will auto-detect Vite)

## Backend Deployment

**Important**: Your Express backend needs to be deployed separately. Options:

### Option A: Deploy Backend to Vercel (Serverless Functions)

Convert Express routes to Vercel serverless functions. See `backend/vercel-serverless/` for examples.

### Option B: Deploy Backend to Railway/Render/Heroku

Deploy the `backend` folder to a Node.js hosting service:
- Railway: https://railway.app
- Render: https://render.com
- Heroku: https://heroku.com

Then set `VITE_API_URL` in Vercel frontend environment variables to your backend URL.

### Option C: Keep Backend Local (Development Only)

For development, run backend locally and use `http://localhost:5000/api` as `VITE_API_URL`.

## Troubleshooting NOT_FOUND Error

### Issue: Routes like `/register`, `/login` return 404

**Root Cause**: React Router uses client-side routing. When you navigate directly to `/register`, Vercel tries to find a file at that path, but it doesn't exist - it's a client-side route.

**Solution**: The `vercel.json` file with `rewrites` tells Vercel to serve `index.html` for all routes, allowing React Router to handle routing.

### Verify Configuration

1. Ensure `frontend/vercel.json` exists with the rewrite rule
2. Ensure `frontend/dist/index.html` exists after build
3. Check Vercel deployment logs for build errors

## Environment Variables Setup

In Vercel Dashboard → Project Settings → Environment Variables:

- **VITE_API_URL**: `https://your-backend-url.com/api` (production backend URL)

## Testing Deployment

1. After deployment, test:
   - `/` → Should redirect to `/login`
   - `/register` → Should show register page
   - `/login` → Should show login page
   - `/dashboard` → Should show dashboard (after login)

2. If any route returns 404, check:
   - `vercel.json` rewrite configuration
   - Build output includes `dist/index.html`
   - React Router is properly configured
