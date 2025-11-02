import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
    window.location.href = '/';
  };

  return (
    <div style={{ width: 300, margin: '100px auto' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
