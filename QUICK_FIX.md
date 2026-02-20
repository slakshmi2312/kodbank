# Quick Fix: Check Balance Redirecting to Login

## 🔍 Root Cause

**What's happening:**
- Frontend is deployed to Vercel: `http://kodbanktokenauthentication.vercel.app/`
- Frontend tries to call backend API at `/api/balance`
- Backend is NOT deployed, so API call fails → 401 error → Redirects to login

**Why it happens:**
- The frontend defaults to `http://localhost:5000/api` when `VITE_API_URL` is not set
- In production (Vercel), `localhost:5000` doesn't exist
- The API call fails, Dashboard sees 401, redirects to login

## ✅ Immediate Fix

### Step 1: Deploy Backend

Choose one platform:

**Railway (Easiest):**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select `backend` folder
4. Add environment variables (see `VERCEL_BACKEND_SETUP.md`)
5. Get backend URL (e.g., `https://kodbank-backend.railway.app`)

**Render:**
1. Go to https://render.com
2. New Web Service → Connect GitHub → Select `backend`
3. Add environment variables
4. Get backend URL

### Step 2: Set Frontend Environment Variable

1. **Vercel Dashboard** → Your project → Settings → Environment Variables
2. **Add**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api` (use your actual backend URL)
   - **Environments**: Production, Preview, Development
3. **Redeploy** frontend

### Step 3: Verify

1. Open your Vercel app
2. Login
3. Click "Check Balance"
4. Should show balance (not redirect to login)

## 🔧 What I Fixed in Code

1. **CORS**: Added `https://kodbanktokenauthentication.vercel.app` to allowed origins
2. **Cookies**: Fixed cross-origin cookie settings (`sameSite: 'none'`, `secure: true`)
3. **Error messages**: Better error messages to show what's wrong
4. **Logging**: Added console logs to help debug

## 📋 Checklist

- [ ] Backend deployed (Railway/Render/Heroku)
- [ ] Backend URL is accessible (test `/health` endpoint)
- [ ] `VITE_API_URL` set in Vercel environment variables
- [ ] Frontend redeployed after setting `VITE_API_URL`
- [ ] Test login → should work
- [ ] Test check balance → should NOT redirect to login

## 🐛 Still Not Working?

1. **Open browser DevTools** (F12)
2. **Console tab**: Look for errors
3. **Network tab**: Check `/api/balance` request
   - Status code? (Should be 200, not 401)
   - Response? (Should have balance data)
4. **Application tab → Cookies**: Check if `token` cookie exists after login

If cookie doesn't exist:
- Backend might not be setting it correctly
- Check backend logs for errors
- Verify CORS is allowing your Vercel domain
