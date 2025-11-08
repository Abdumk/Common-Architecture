import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AssignRoleForm({ canManage }) {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (canManage) {
      api.get("/roles").then(res => setRoles(res.data));
      api.get("/users").then(res => setUsers(res.data));
    }
  }, [canManage]);

  const handleAssign = async e => {
    e.preventDefault();
    try {
      await api.post("/user-roles", { role_id: roleId, user_id: userId });
      alert("Role assigned to user!");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (!canManage) return null;

  return (
    <form onSubmit={handleAssign}>
      <h3>Assign Role to User</h3>
      <select value={userId} onChange={e => setUserId(e.target.value)} required>
        <option value="">Select User</option>
        {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
      </select>
      <select value={roleId} onChange={e => setRoleId(e.target.value)} required>
        <option value="">Select Role</option>
        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
      <button type="submit">Assign</button>
    </form>
  );
}
