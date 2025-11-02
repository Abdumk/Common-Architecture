const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();

// Register
router.post("/register", async (req, res) => {
  const { username, password, email, group_id } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  try {
    const [exists] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
    if (exists.length) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (id, username, password, email, group_id)
       VALUES (UUID(), ?, ?, ?, ?)`,
      [username, hash, email || null, group_id || null]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
