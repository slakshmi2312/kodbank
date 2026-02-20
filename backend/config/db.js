/**
 * MySQL database connection using Aiven cloud with SSL (REQUIRED)
 * Optional: set SSL_CA_PATH to path to Aiven CA cert (e.g. ca.pem) if needed
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Port must be a number for mysql2
const port = parseInt(process.env.DB_PORT, 10) || 3306;

const sslOpts = { rejectUnauthorized: false };
if (process.env.SSL_CA_PATH) {
  const caPath = path.resolve(process.env.SSL_CA_PATH);
  if (fs.existsSync(caPath)) {
    sslOpts.ca = fs.readFileSync(caPath);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslOpts,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
});

// Test connection on startup
pool.getConnection()
  .then((conn) => {
    console.log('MySQL connected successfully');
    conn.release();
  })
  .catch((err) => {
    console.error('MySQL connection error:', err.message);
  });

module.exports = pool;
