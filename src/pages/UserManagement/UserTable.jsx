import React from "react";
import { FaTrash } from "react-icons/fa";

const UserTable = ({
  users,
  roles,
  selectedRoles,
  rowLoading,
  handleRoleSelect,
  handleRoleSave,
  handleDeleteUser,
}) => {
  return (
    <table className="table table-hover leads-table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Change Role</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user.id}>
            <th scope="row" className="text-light">{index + 1}</th>
            <td>{user.userName}</td>
            <td>{user.userEmail}</td>
            <td>{user.Role || "User"}</td>
            <td>
              <select
                value={selectedRoles[user.id] || user.Role || "User"}
                onChange={(e) => handleRoleSelect(user.id, e.target.value)}
                className="form-select bg-main border-main text-secondary"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </td>
            <td className="d-flex gap-2 align-items-center justify-content-center">
              <button
                className="btn btn-primary bg-main"
                onClick={() => handleRoleSave(user.id)}
                disabled={rowLoading[user.id]}
              >
                {rowLoading[user.id] ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteUser(user.id)}
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
