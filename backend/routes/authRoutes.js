const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const dotenv = require('dotenv');
const { verifyToken } = require("../middleware/authMiddleware");
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

    const [permRows] = await pool.query(`
      SELECT p.name FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN roles r ON r.id = rp.role_id
      JOIN user_roles ur ON ur.role_id = r.id
      WHERE ur.user_id = ?
    `, [user.id]);

    const permissions = permRows.map(p => p.name);

    // 4️⃣ Sign JWT and send response
    const token = jwt.sign(
      { id: user.id, username: user.username, permissions },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, permissions }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  // req.user is set by verifyToken middleware
  res.json(req.user);
});

module.exports = router;
