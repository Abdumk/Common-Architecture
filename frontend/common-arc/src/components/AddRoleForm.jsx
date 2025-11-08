import React, { useState } from "react";
import api from "../services/api";

export default function AddRoleForm({ canManage }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/roles", { name, description });
      setName("");
      setDescription("");
      alert("Role created!");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (!canManage) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Role</h3>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Role name" required />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <button type="submit">Create Role</button>
    </form>
  );
}
