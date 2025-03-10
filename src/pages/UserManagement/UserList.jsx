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
import { fetchAndStoreRolePermissions } from "../../utils/permissions";

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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesSnapshot = await getDocs(collection(db, "userRole"));
        setRoles(
          rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Error loading roles.");
      }
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
      
      // Refresh permissions in localStorage
      if (typeof fetchAndStoreRolePermissions === 'function') {
        await fetchAndStoreRolePermissions();
      }
      
      toast.success("Role updated successfully!");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error updating role.");
    } finally {
      setRowLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "Users", userId));
      toast.success("User deleted.");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleRouteChange = (route, checked) => {
    setSelectedRoutes((prev) =>
      checked 
        ? [...prev, route] 
        : prev.filter((r) => r !== route)
    );
  };

  const handleAddOrUpdateRole = async () => {
    try {
      // Add validation to prevent empty role names
      if (!name.trim()) {
        toast.error("Role name cannot be empty");
        return;
      }

      if (isEditMode) {
        await updateDoc(doc(db, "userRole", editRoleId), {
          roleName: name,
          routes: selectedRoutes, // This will be an array
        });
      } else {
        await addUserRole("userRole", {
          roleName: name,
          routes: selectedRoutes, // This will be an array
        });
      }
      
      // Refresh the roles list
      const rolesSnapshot = await getDocs(collection(db, "userRole"));
      setRoles(rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      
      // After saving, refresh permissions in localStorage
      if (typeof fetchAndStoreRolePermissions === 'function') {
        await fetchAndStoreRolePermissions();
      }
      
      toast.success("Role saved successfully!");
      setShowRoleModal(false);
      setName("");
      setSelectedRoutes([]);
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Error saving role.");
    }
  };

  const handleEditRole = (role) => {
    setEditRoleId(role.id);
    setName(role.roleName);
    
    // Make sure we handle both array and object formats for routes
    if (role.routes) {
      if (Array.isArray(role.routes)) {
        setSelectedRoutes(role.routes);
      } else if (typeof role.routes === 'object') {
        // Convert from object format (if it's in that format)
        setSelectedRoutes(Object.values(role.routes));
      } else {
        setSelectedRoutes([]);
      }
    } else {
      setSelectedRoutes([]);
    }
    
    setIsEditMode(true);
    setShowRoleModal(true);
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await deleteDoc(doc(db, "userRole", roleId));
      
      // Refresh the roles list
      const rolesSnapshot = await getDocs(collection(db, "userRole"));
      setRoles(rolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      
      // Update permissions in localStorage
      if (typeof fetchAndStoreRolePermissions === 'function') {
        await fetchAndStoreRolePermissions();
      }
      
      toast.success("Role deleted.");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Error deleting role.");
    }
  };

  // Add a temporary function to fix existing role formats
  const convertRoleRoutes = async () => {
    setLoading(true);
    try {
      const rolesSnapshot = await getDocs(collection(db, "userRole"));
      
      let updatedCount = 0;
      for (const roleDoc of rolesSnapshot.docs) {
        const roleData = roleDoc.data();
        const routes = roleData.routes;
        
        // If routes is an object with numeric keys, convert it to an array
        if (routes && typeof routes === 'object' && !Array.isArray(routes)) {
          const routesArray = Object.values(routes);
          
          // Update the document with the array
          await updateDoc(doc(db, "userRole", roleDoc.id), {
            routes: routesArray
          });
          
          updatedCount++;
        }
      }
      
      if (updatedCount > 0) {
        // Refresh the roles list
        const updatedRolesSnapshot = await getDocs(collection(db, "userRole"));
        setRoles(updatedRolesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        
        // Update permissions in localStorage
        if (typeof fetchAndStoreRolePermissions === 'function') {
          await fetchAndStoreRolePermissions();
        }
        
        toast.success(`Fixed data format for ${updatedCount} roles!`);
      } else {
        toast.info("All roles are already in the correct format.");
      }
    } catch (error) {
      console.error("Error converting routes:", error);
      toast.error("Error updating roles: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter and Search Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchTerm
      ? user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            className="btn btn-warning mx-2"
            onClick={convertRoleRoutes}
          >
            Fix Role Format
          </button>
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
        handleRouteChange={handleRouteChange}
        handleAddOrUpdateRole={handleAddOrUpdateRole}
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