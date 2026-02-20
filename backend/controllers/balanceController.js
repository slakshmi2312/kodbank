/**
 * Balance controller: get balance for authenticated user (from JWT cookie)
 */
const db = require('../config/db');

/**
 * GET /api/balance - read JWT from cookie, verify, fetch balance from KodUser
 */
async function getBalance(req, res) {
  try {
    const username = req.user?.sub;
    if (!username) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [rows] = await db.execute(
      'SELECT balance FROM KodUser WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ balance: rows[0].balance });
  } catch (err) {
    console.error('Balance error:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
}

module.exports = { getBalance };
