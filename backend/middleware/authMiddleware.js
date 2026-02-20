/**
 * JWT verification middleware - blocks request if token invalid
 */
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Read JWT from httpOnly cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub: username, role: "customer" }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
