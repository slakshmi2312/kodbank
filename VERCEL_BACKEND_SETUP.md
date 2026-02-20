# Backend Setup for Vercel Deployment

## Problem: Check Balance Redirects to Login

When deployed to Vercel, the frontend at `http://kodbanktokenauthentication.vercel.app/` cannot reach the backend because:

1. **Backend is not deployed** - The frontend tries to call `http://localhost:5000/api` which doesn't exist in production
2. **CORS issues** - Backend needs to allow the Vercel domain
3. **Cookie issues** - Cross-origin cookies need special settings

## Solution: Deploy Backend Separately

### Option 1: Deploy Backend to Railway (Recommended)

1. **Sign up at Railway**: https://railway.app
2. **Create new project** → Deploy from GitHub
3. **Select your repo** → Choose `backend` folder
4. **Set environment variables** in Railway:
   ```
   DB_HOST=your-aiven-host.aivencloud.com
   DB_PORT=14184
   DB_USER=avnadmin
   DB_PASSWORD=your-aiven-password
   DB_NAME=defaultdb
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   FRONTEND_URL=https://kodbanktokenauthentication.vercel.app
   ```
   
   **Note**: Get these values from your `backend/.env` file or Aiven dashboard.
5. **Get backend URL** from Railway (e.g., `https://kodbank-backend.railway.app`)

### Option 2: Deploy Backend to Render

1. **Sign up at Render**: https://render.com
2. **Create new Web Service**
3. **Connect GitHub** → Select `backend` folder
4. **Set environment variables** (same as above)
5. **Get backend URL** from Render

### Option 3: Deploy Backend to Heroku

1. **Sign up at Heroku**: https://heroku.com
2. **Create new app**
3. **Deploy from GitHub** → Select `backend` folder
4. **Set Config Vars** (same as above)
5. **Get backend URL** from Heroku

## Configure Frontend (Vercel)

After deploying backend, set environment variable in Vercel:

1. **Go to Vercel Dashboard** → Your project → Settings → Environment Variables
2. **Add new variable**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api` (replace with your actual backend URL)
   - **Environment**: Production, Preview, Development
3. **Redeploy** the frontend

## Verify Setup

1. **Check backend is running**: Visit `https://your-backend-url.com/health` → Should return `{"status":"ok"}`
2. **Check CORS**: Backend should allow `https://kodbanktokenauthentication.vercel.app`
3. **Test login**: Login should set cookie
4. **Test balance**: Check balance should work without redirecting to login

## Troubleshooting

### Still redirecting to login?

1. **Check browser console** (F12) → Look for API errors
2. **Check Network tab** → See if `/api/balance` request is being made
3. **Check cookies** → Application tab → Cookies → Should see `token` cookie after login
4. **Verify backend URL** → Ensure `VITE_API_URL` is set correctly in Vercel

### Cookie not being sent?

- Cookies require `secure: true` and `sameSite: 'none'` for cross-origin
- Backend must set these correctly (already fixed in code)
- Browser must allow third-party cookies (some browsers block these)

### CORS error?

- Backend CORS must include your Vercel domain
- Already added `https://kodbanktokenauthentication.vercel.app` to allowed origins

**Important**: Never commit `.env` files or expose passwords in documentation. Use environment variables in your hosting platform.

## Quick Test

After setup, test this flow:

1. **Register** → Should work
2. **Login** → Should redirect to dashboard
3. **Check Balance** → Should show balance, NOT redirect to login

If step 3 fails, check:
- Backend is running and accessible
- `VITE_API_URL` is set in Vercel
- Cookies are being set (check browser DevTools)
