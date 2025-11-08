import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function UsersList({ canView }) {
  const [users, setUsers] = useState([]);

 useEffect(() => {
  if (canView) {
    api.get("/users", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setUsers(res.data))
      .catch(err => console.error("Users fetch error:", err.response?.data || err.message));
  }
}, [canView]);


  if (!canView) return <p>You do not have permission to view users.</p>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.username} ({u.email})</li>)}
      </ul>
    </div>
  );
}
