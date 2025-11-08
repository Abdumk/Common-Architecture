import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UsersList from "../components/UsersList";
import RolesList from "../components/RolesList";
import AddRoleForm from "../components/AddRoleForm";
import AssignPermissionForm from "../components/AssignPermissionForm";
import AssignRoleForm from "../components/AssignRoleForm";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const perms = user?.permissions || [];

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.username}</p>
      <button onClick={logout}>Logout</button>

      {/* Users */ console.log("permissions-- ", perms, "user-- ", user)}
      <UsersList canView={perms.includes("view_users")} />

      <RolesList canManage={perms.includes("manage_roles")} />
      <AddRoleForm canManage={perms.includes("manage_roles")} />

      {/* <PermissionsList canManage={perms.includes("manage_roles")} /> */}
      {/* <AddPermissionForm canManage={perms.includes("manage_roles")} /> */}

      <AssignPermissionForm canManage={perms.includes("manage_roles")} />
      <AssignRoleForm canManage={perms.includes("manage_roles")} />
    </div>
  );
}
