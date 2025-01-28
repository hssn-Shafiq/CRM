import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

const UserRoles = ({
  show,
  handleClose,
  roles,
  handleEditRole,
  handleDeleteRole,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered size="xl" >
      <Modal.Header closeButton>
        <Modal.Title>Manage Roles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Role Name</th>
              <th>Routes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role.id}>
                <td>{index + 1}</td>
                <td>{role.roleName}</td>
                <td>{role.routes.join(", ")}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEditRole(role)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserRoles;
