/**
 * Auth controller: register, login (JWT + cookie, store in UserToken)
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SALT_ROUNDS = 10;
const JWT_EXPIRY = '1h';

/**
 * POST /api/register - create user with hashed password, role "customer"
 */
async function register(req, res) {
  try {
    const raw = req.body || {};
    const username = typeof raw.username === 'string' ? raw.username.trim() : '';
    const password = typeof raw.password === 'string' ? raw.password : '';
    const email = typeof raw.email === 'string' ? raw.email.trim() : '';
    const phone = typeof raw.phone === 'string' ? raw.phone.trim() : '';

    if (!username || !password || !email || !phone) {
      return res.status(400).json({ error: 'username, password, email and phone are required' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const role = 'customer';

    await db.execute(
      'INSERT INTO KodUser (username, email, password, phone, balance, role) VALUES (?, ?, ?, ?, 100000, ?)',
      [username, email, hashedPassword, phone, role]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    console.error('Register error:', err);
    // Surface database/connection errors so user can fix (tables, connection, etc.)
    let message = 'Registration failed';
    if (err.code === 'ER_NO_SUCH_TABLE') {
      message = 'Database tables missing. Run database/schema.sql in your Aiven MySQL (defaultdb).';
    } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
      message = 'Database connection failed. Check backend/.env (host, port, password) and that Aiven MySQL is reachable.';
    } else if (err.message) {
      message = `Registration failed: ${err.message}`;
    }
    res.status(500).json({ error: message });
  }
}

/**
 * POST /api/login - validate user, generate JWT, store in UserToken, send httpOnly cookie
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const [rows] = await db.execute(
      'SELECT uid, username, password, role FROM KodUser WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const payload = { sub: user.username, role: user.role || 'customer' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });

    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await db.execute(
      'INSERT INTO UserToken (token, uid, expiry) VALUES (?, ?, ?)',
      [token, user.uid, expiry]
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful', username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
}

module.exports = { register, login };
