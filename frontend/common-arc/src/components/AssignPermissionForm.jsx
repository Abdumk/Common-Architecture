import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AssignPermissionForm({ canManage }) {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [permissionId, setPermissionId] = useState("");

  useEffect(() => {
    if (canManage) {
      api.get("/roles").then(res => setRoles(res.data));
      api.get("/permissions").then(res => setPermissions(res.data));
    }
  }, [canManage]);

  const handleAssign = async e => {
    e.preventDefault();
    try {
      await api.post("/role-permissions", { role_id: roleId, permission_id: permissionId });
      alert("Permission assigned to role!");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (!canManage) return null;

  return (
    <form onSubmit={handleAssign}>
      <h3>Assign Permission to Role</h3>
      <select value={roleId} onChange={e => setRoleId(e.target.value)} required>
        <option value="">Select Role</option>
        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
      <select value={permissionId} onChange={e => setPermissionId(e.target.value)} required>
        <option value="">Select Permission</option>
        {permissions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <button type="submit">Assign</button>
    </form>
  );
}
