/**
 * Kodbank backend - Express server with JWT auth and MySQL
 */
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const balanceRoutes = require('./routes/balanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - allow localhost, 127.0.0.1, and Vercel deployment URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://kodbanktokenauthentication.vercel.app',
  'http://kodbanktokenauthentication.vercel.app',
  process.env.FRONTEND_URL, // Set this in backend .env for production
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    // Check if origin is allowed
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api', authRoutes);
app.use('/api', balanceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Kodbank backend running on http://localhost:${PORT}`);
});
