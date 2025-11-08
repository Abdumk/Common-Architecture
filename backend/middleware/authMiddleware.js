const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../config/db');
dotenv.config();

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // <-- contains id, username, permissions
    next();
  });
};


exports.checkPermission = (permissionName) => async (req, res, next) => {
  const userId = req.user.id;

  // Join through user_roles -> role_permissions -> permissions
  const [rows] = await pool.query(
    `SELECT p.name FROM permissions p
     JOIN role_permissions rp ON p.id = rp.permission_id
     JOIN roles r ON r.id = rp.role_id
     JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
    [userId]
  );

  const userPermissions = rows.map(r => r.name);
  if (userPermissions.includes(permissionName)) return next();
  return res.status(403).json({ message: "Access denied" });
};
