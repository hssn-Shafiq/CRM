import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db, addUserRole } from "../../firebase/Config";
import UserTable from "./UserTable";
import RoleModal from "./RoleModal";
import UserRoles from "./UserRoles";
import Loader from "../../components/Loader";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [rowLoading, setRowLoading] = useState({});
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showManageRoles, setShowManageRoles] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [editRoleId, setEditRoleId] = useState(null);
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("");

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
    const unsubscribe = onSnapshot(collection(db, "Users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesSnapshot = await getDocs(collection(db, "userRole"));
      setRoles(
        rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchRoles();
  }, []);

  const handleRoleSelect = (userId, newRole) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleRoleSave = async (userId) => {
    setRowLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await updateDoc(doc(db, "Users", userId), {
        Role: selectedRoles[userId],
      });
      toast.success("Role updated successfully!");
    } catch (error) {
      toast.error("Error updating role.");
    } finally {
      setRowLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "Users", userId));
      toast.success("User deleted.");
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  const handleAddOrUpdateRole = async () => {
    try {
      if (isEditMode) {
        await updateDoc(doc(db, "userRole", editRoleId), {
          roleName: name,
          routes: selectedRoutes,
        });
      } else {
        await addUserRole("userRole", {
          roleName: name,
          routes: selectedRoutes,
        });
      }
      toast.success("Role saved successfully!");
    } catch {
      toast.error("Error saving role.");
    }
    setShowRoleModal(false);
    setName("");
    setSelectedRoutes([]);
  };

  const handleEditRole = (role) => {
    setEditRoleId(role.id);
    setName(role.roleName);
    setSelectedRoutes(role.routes);
    setIsEditMode(true);
    setShowRoleModal(true);
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await deleteDoc(doc(db, "userRole", roleId));
      toast.success("Role deleted.");
    } catch {
      toast.error("Error deleting role.");
    }
  };

  // Filter and Search Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchTerm
      ? user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.Role || "User").toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesFilter = selectedRoleFilter
      ? user.Role === selectedRoleFilter
      : true;

    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loader />;

  return (
    <div className="container-fluid px-3 pt-4 mb-5">
      <div className="text-center">
        <h2 className="text-uppercase p-2 page-title">
          Manage All Users & Roles
        </h2>
      </div>
      {/* Search and Filter Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or role"
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-25"
          value={selectedRoleFilter}
          onChange={(e) => setSelectedRoleFilter(e.target.value)}
        >
          <option value="">Filter by Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.roleName}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>

      <div className="container table-responsive border-0 mt-3">
        <div className="new_role d-flex justify-content-end mb-3 text-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsEditMode(false); // Reset to add mode
              setName(""); // Clear the role name field
              setSelectedRoutes([]); // Clear the selected routes
              setShowRoleModal(true); // Show the modal
            }}
          >
            Add New Role
          </button>
          <button
            className="btn btn-primary mx-3"
            onClick={() => setShowManageRoles(true)}
          >
            Manage Roles
          </button>
        </div>
        <UserTable
          users={filteredUsers}
          roles={roles}
          selectedRoles={selectedRoles}
          rowLoading={rowLoading}
          handleRoleSelect={handleRoleSelect}
          handleRoleSave={handleRoleSave}
          handleDeleteUser={handleDeleteUser}
        />
      </div>
      <RoleModal
        show={showRoleModal}
        handleClose={() => setShowRoleModal(false)}
        isEditMode={isEditMode}
        name={name}
        setName={setName}
        selectedRoutes={selectedRoutes}
        setSelectedRoutes={setSelectedRoutes}
        handleRouteChange={(route, checked) =>
          setSelectedRoutes((prev) =>
            checked ? [...prev, route] : prev.filter((r) => r !== route)
          )
        }
        handleAddOrUpdateRole={handleAddOrUpdateRole}
        allRoutes={allRoutes}
      />
      <UserRoles
        show={showManageRoles}
        handleClose={() => setShowManageRoles(false)}
        roles={roles}
        handleEditRole={handleEditRole}
        handleDeleteRole={handleDeleteRole}
      />
    </div>
  );
};

export default UserList;
