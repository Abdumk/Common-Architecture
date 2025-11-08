import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function RolesList({ canManage }) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (canManage) {
      api.get("/roles")
        .then(res => setRoles(res.data))
        .catch(err => console.error(err.response?.data || err.message));
    }
  }, [canManage]);

  if (!canManage) return <p>You do not have permission to manage roles.</p>;

  return (
    <div>
      <h2>Roles</h2>
      <ul>
        {roles.map(r => <li key={r.id}>{r.name} ({r.description})</li>)}
      </ul>
    </div>
  );
}
