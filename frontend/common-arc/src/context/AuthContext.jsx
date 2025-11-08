import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Whenever token changes, fetch user info
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);

      // Fetch user info from backend
      axios.get('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error("Failed to fetch user info:", err);
        setUser(null);
        setToken(null);
      });

    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post('http://localhost:5000/auth/login', { username, password });
    setUser(res.data.user);
    setToken(res.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
