const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
});

module.exports = router;
