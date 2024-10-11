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
import { FaTrash, FaPlus } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { Checkbox } from "antd";
import { getUserFromLocalStorage } from "../../utils/localstorage";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [rowLoading, setRowLoading] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [roles, setRoles] = useState([]); // State to store fetched roles

  const loginUser = auth.currentUser;

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

  useEffect(() => {
    // Fetch users from Firestore with real-time updates
    const unsubscribe = onSnapshot(collection(db, "Users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
      setLoading(false);
    }, (error) => {
      toast.error("Failed to fetch users: " + error.message);
      setLoading(false);
    });

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
      const rolesList = rolesSnapshot.docs.map((doc) => doc.data().roleName);
      setRoles(rolesList);
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
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleRouteChange = (route, checked) => {
    setSelectedRoutes((prevRoutes) =>
      checked ? [...prevRoutes, route] : prevRoutes.filter((r) => r !== route)
    );
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        roleName: name,
        routes: selectedRoutes,
      };
      await addUserRole("userRole", data);
      toast.success("Role added successfully.");
      setShowModal(false);
      setName("");
      setSelectedRoutes([]);
         // Fetch the updated list of roles after adding a new role
         await fetchRoles();
    } catch (error) {
      toast.error("Error adding new role: " + error.message);
    } finally {
      setLoading(false);

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
          <div className="new_role mb-3 text-end">
            <button
              className="btn btn-primary bg-main border-main mb-0"
              type="button"
              onClick={handleShow}
            >
              <FaPlus className="me-1 mt-0" /> Add New Role
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
                  <th scope="row" className="text-light">
                    {index + 1}
                  </th>
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
                      {roles.map((role, idx) => (
                        <option key={idx} value={role}>
                          {role}
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

      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered="true"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Role</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-main border-main text-light">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Role Name:</label>
                <input
                  type="text"
                  className="input-group  bg-main border-main text-secondary rounded-3 p-2 px-2"
                  placeholder="Manager, Co-admin,..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="form-group mt-3">
                  <label className="form-label">Select Routes:</label>
                </div>
                {allRoutes.map((route) => (
                  <div
                    key={route}
                    className="col-md-6 d-flex align-items-center py-2 "
                  >
                    <Checkbox
                      className="text-secondary"
                      checked={selectedRoutes.includes(route)}
                      onChange={(e) =>
                        handleRouteChange(route, e.target.checked)
                      }
                    >
                      {route}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-main border-main text-light">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddRole}>
            Add Role
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserList;
