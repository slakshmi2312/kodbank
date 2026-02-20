# Environment Variables Setup

## Backend URL Configuration

The frontend uses `VITE_API_URL` environment variable to connect to the backend API.

### Production (Vercel)

**Backend deployed at:** `https://kodbank-pzd4.onrender.com`

**Set in Vercel:**

1. Go to **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://kodbank-pzd4.onrender.com/api`
   - **Environments**: ✅ Production ✅ Preview ✅ Development
4. Click **Save**
5. **Redeploy** your frontend

### Local Development

**No environment variable needed** - defaults to `http://localhost:5001/api`

Make sure:
- Backend is running on port 5001 locally
- Frontend uses Vite proxy in dev mode (already configured)

### How It Works

- **Production**: Uses `VITE_API_URL` from Vercel environment variables
- **Local Dev**: Falls back to `http://localhost:5001/api` if `VITE_API_URL` is not set
- **Never hardcoded**: All backend URLs come from environment variables

### Verify Setup

After setting `VITE_API_URL` in Vercel:

1. Redeploy frontend
2. Open browser DevTools (F12) → Console
3. Login → Check console logs
4. Should see API requests going to: `https://kodbank-pzd4.onrender.com/api`
