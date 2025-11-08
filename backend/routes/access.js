const express = require("express");
const router = express.Router();
const { verifyToken, checkPermission } = require("../middleware/authMiddleware");
const db = require("../config/db");

// ✅ Get all users (admin or manager)
router.get("/users", verifyToken, checkPermission("view_users"), async (req, res) => {
  const [users] = await db.query("SELECT id, username, email FROM users");
  res.json(users);
});

router.get("/roles", verifyToken, checkPermission("manage_roles"), async (req, res) => {
  const [rows] = await db.query("SELECT * FROM roles");
  res.json(rows);
});

router.post("/roles", verifyToken, checkPermission("manage_roles"), async (req, res) => {
  const { name, description } = req.body;
  await db.query("INSERT INTO roles (id, name, description) VALUES (UUID(), ?, ?)", [name, description]);
  res.json({ message: "Role created" });
});

// ---- Permissions ----
router.get("/permissions", verifyToken, checkPermission("manage_roles"), async (req, res) => {
  const [rows] = await db.query("SELECT * FROM permissions");
  res.json(rows);
});

router.post("/permissions", verifyToken, checkPermission("manage_roles"), async (req, res) => {
  const { name, description } = req.body;
  await db.query("INSERT INTO permissions (id, name, description) VALUES (UUID(), ?, ?)", [name, description]);
  res.json({ message: "Permission created" });
});

// ---- Assign Permission to Role ----
router.post("/role-permissions", verifyToken, checkPermission("manage_roles"), async (req, res) => {
  const { role_id, permission_id } = req.body;
  await db.query("INSERT INTO role_permissions (id, role_id, permission_id) VALUES (UUID(), ?, ?)", [role_id, permission_id]);
  res.json({ message: "Permission assigned to role" });
});

// ---- Assign Role to User ----
router.post("/user-roles", verifyToken, checkPermission("manage_roles"), async (req, res) => {
  const { user_id, role_id } = req.body;
  await db.query("INSERT INTO user_roles (id, user_id, role_id) VALUES (UUID(), ?, ?)", [user_id, role_id]);
  res.json({ message: "Role assigned to user" });
});


module.exports = router;
