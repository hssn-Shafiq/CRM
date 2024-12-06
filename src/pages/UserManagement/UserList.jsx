import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { db, auth, addUserRole } from "../../firebase/Config";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore"; // Firestore functions
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { Checkbox } from "antd";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [rowLoading, setRowLoading] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [roles, setRoles] = useState([]); // State to store fetched roles
  const [showRolesModal, setShowRolesModal] = useState(false); // Show roles management modal
  const [isEditMode, setIsEditMode] = useState(false); // To check if it's edit mode
  const [editRoleId, setEditRoleId] = useState(null); // Store role id for editing
  const allRoutes = [
    "Dashboard",
    "Users",
    "User-List",
    "User-Permission",
    "SchedulePosts",
    "Create-Post",
    "Calendar",
    "Shopify",
    "OrderList",
    "Delivered-Orders",
    "Cancelled-Orders",
    "Marketing",
    "Settings",
    "RegisteredUser",
  ];

  // Fetch users from Firestore with real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Users"),
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
        setLoading(false);
      },
      (error) => {
        toast.error("Failed to fetch users: " + error.message);
        setLoading(false);
      }
    );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const rolesCollection = collection(db, "userRole");
      const rolesSnapshot = await getDocs(rolesCollection);
      const rolesList = rolesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRoles(rolesList);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch roles: " + error.message);
    }
  };

  const handleRoleSelect = (userId, newRole) => {
    setSelectedRoles((prevRoles) => ({
      ...prevRoles,
      [userId]: newRole,
    }));
  };

  const handleRoleSave = async (userId) => {
    const newRole = selectedRoles[userId];

    const updatedFields = {
      Role: newRole, // Update the role field with the selected role
      isAdmin: false,
      isSubAdmin: false,
      isCoAdmin: false,
    };

    setRowLoading((prevLoading) => ({
      ...prevLoading,
      [userId]: true,
    }));

    try {
      const userDoc = doc(db, "Users", userId);
      await updateDoc(userDoc, updatedFields);
      toast.success("User role updated successfully.");
    } catch (error) {
      toast.error("Error updating role: " + error.message);
    } finally {
      setRowLoading((prevLoading) => ({
        ...prevLoading,
        [userId]: false,
      }));
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "Users", userId));
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error("Error deleting user: " + error.message);
    }
  };

  const handleShow = () => {
    setShowModal(true);
    setIsEditMode(false); // Set to add mode
    setName("");
    setSelectedRoutes([]);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleRouteChange = (route, checked) => {
    setSelectedRoutes((prevRoutes) =>
      checked ? [...prevRoutes, route] : prevRoutes.filter((r) => r !== route)
    );
  };

  const handleAddOrUpdateRole = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Update role in Firestore
      try {
        const roleRef = doc(db, "userRole", editRoleId);
        await updateDoc(roleRef, { roleName: name, routes: selectedRoutes });
        toast.success("Role updated successfully.");
      } catch (error) {
        toast.error("Error updating role: " + error.message);
      }
    } else {
      // Add new role
      try {
        const data = { roleName: name, routes: selectedRoutes };
        await addUserRole("userRole", data);
        toast.success("Role added successfully.");
      } catch (error) {
        toast.error("Error adding role: " + error.message);
      }
    }

    setShowModal(false);
    setName("");
    setSelectedRoutes([]);
    fetchRoles(); // Refresh roles after addition or update
  };

  const handleEditRole = (role) => {
    setEditRoleId(role.id); // Set the id of the role to edit
    setName(role.roleName);
    setSelectedRoutes(role.routes || []);
    setIsEditMode(true); // Set to edit mode
    setShowModal(true);
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await deleteDoc(doc(db, "userRole", roleId));
      toast.success("Role deleted successfully.");
      fetchRoles(); // Refresh roles after deletion
    } catch (error) {
      toast.error("Error deleting role: " + error.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container-fluid px-3 pt-4 parent-lead-data-form">
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">
            Manage All Users & Roles
          </h2>
        </div>
        <div className="container table-responsive border-0 mt-3">
          <div className="new_role d-flex justify-content-end  mb-3 text-end">
            <button
              className="btn btn-primary mb-0 bg-main border-main mb-0"
              type="button"
              onClick={handleShow}
            >
              <FaPlus className="me-1 mt-0" /> Add New Role
            </button>
            <button
              className="btn btn-primary bg-main border-main mb-0 mx-3"
              onClick={() => setShowRolesModal(true)}
            >
             <FaEdit className="me-1 mt-0" />  Manage Roles
            </button>
          </div>
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
                      value={selectedRoles[user.id] || user.role || "User"}
                      onChange={(e) =>
                        handleRoleSelect(user.id, e.target.value)
                      }
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
        </div>
      </div>

      {/* Modal for Adding/Editing Role */}
      <Modal show={showModal} onHide={handleClose} backdrop="static" size="md" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Role" : "Add New Role"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-main border-main text-light">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role name"
                  className="input-group  bg-main border-main text-secondary rounded-3 p-2 px-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select Routes</Form.Label>
              <div className="d-flex flex-wrap">
                {allRoutes.map((route) => (
                  <div key={route} className="col-md-6 d-flex align-items-center py-2">
                    <Checkbox
                      className="text-secondary"
                      checked={selectedRoutes.includes(route)}
                      onChange={(e) => handleRouteChange(route, e.target.checked)}
                    >
                      {route}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-main border-main text-light">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdateRole}>
            {isEditMode ? "Update Role" : "Add Role"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Roles Modal */}
      <Modal show={showRolesModal} onHide={() => setShowRolesModal(false)}  keyboard={false} centered size="xl"  >
        <Modal.Header closeButton>
          <Modal.Title>Manage Roles</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark-bl table_style">
          <table className="table table-hover  table_style">
            <thead>
              <tr>
                <th>#</th>
                <th>Role_Name</th>
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
                  <td className="d-flex ">
                    <button className="btn btn-sm bg-main  btn-primary me-2" onClick={() => handleEditRole(role)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm bg-main btn-danger" onClick={() => handleDeleteRole(role.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer className="bg-dark ">
          <Button variant="secondary" className="bg-main border-main" onClick={() => setShowRolesModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserList;
