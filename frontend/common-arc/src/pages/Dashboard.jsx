import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <h2>Users</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.username}</li>)}
      </ul>
    </div>
  );
}
