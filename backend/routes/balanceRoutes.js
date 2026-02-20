/**
 * Balance routes - protected by JWT middleware
 */
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getBalance } = require('../controllers/balanceController');

const router = express.Router();

router.get('/balance', authMiddleware, getBalance);

module.exports = router;
