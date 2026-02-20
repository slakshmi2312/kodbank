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

// Middleware - allow both localhost and 127.0.0.1 so register works when app is opened either way
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
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
