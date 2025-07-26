import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";

/**
 * Fetches role permissions from Firestore and stores them in localStorage
 * This function should be called at app initialization or after login
 */
export const fetchAndStoreRolePermissions = async () => {
  try {
    // Get all roles from Firestore
    const rolesSnapshot = await getDocs(collection(db, "userRole"));
    const roles = rolesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Transform roles data into a map of role names to permitted routes
    const rolePermissions = {};

    roles.forEach((role) => {
      rolePermissions[role.roleName] = role.routes || [];
    });

    // Store in localStorage for easy access
    localStorage.setItem("rolePermissions", JSON.stringify(rolePermissions));

    // Also store allowed routes for current user if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (currentUser.Role) {
      const allowedRoutes = rolePermissions[currentUser.Role] || [];
      localStorage.setItem("allowedRoutes", JSON.stringify(allowedRoutes));
    }

    return rolePermissions;
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return {};
  }
};

/**
 * Checks if a user has permission to access a specific route
 *
 * @param {string} roleName - The user's role
 * @param {string} route - The route to check access for
 * @returns {boolean} Whether user has access to the route
 */
export const hasRoutePermission = (roleName, route) => {
  // Admin always has all permissions
  if (roleName === "Admin") {
    return true;
  }

  // Get stored permissions
  const rolePermissions =
    JSON.parse(localStorage.getItem("rolePermissions")) || {};
  const allowedRoutes = rolePermissions[roleName] || [];

  // Check if route is directly allowed
  if (allowedRoutes.includes(route)) {
    return true;
  }

  // Check if parent category is allowed
  // Example: "Shopify/OrderList" -> check if "Shopify" is allowed
  const mainCategory = route.split("/")[0];
  return allowedRoutes.includes(mainCategory);
};

/**
 * Returns filtered menu items based on user permissions
 *
 * @param {Array} menuItems - Original menu items array
 * @param {string} roleName - User's role
 * @returns {Array} Filtered menu items
 */
export const getFilteredMenuItems = (menuItems, roleName) => {
  // Admin can see all menu items
  if (roleName === "Admin") {
    return menuItems;
  }

  const rolePermissions =
    JSON.parse(localStorage.getItem("rolePermissions")) || {};
  const allowedRoutes = rolePermissions[roleName] || [];

  // Helper function to filter menu items recursively
  const filterItems = (items) => {
    return items.filter((item) => {
      // Keep items with no key (they might be headers or separators)
      if (!item.key) return true;

      // For items with children, filter children and keep parent if any children remain
      if (item.children) {
        const filteredChildren = filterItems(item.children);
        item.children = filteredChildren;
        return filteredChildren.length > 0;
      }

      // Check direct routes and main categories
      const isAllowed =
        allowedRoutes.includes(item.key) ||
        allowedRoutes.some((route) => item.key.startsWith(route + "/"));

      return isAllowed;
    });
  };

  return filterItems(menuItems);
};
