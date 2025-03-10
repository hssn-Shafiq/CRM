import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserFromLocalStorage } from '../utils/localstorage';
import { toast } from 'react-toastify';

/**
 * A component that restricts access to routes based on user roles and permissions.
 * 
 * @param {Object} props
 * @param {string} props.requiredRoute - The route path that needs permission
 * @param {React.ReactNode} props.children - Child components to render if user has permission
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ requiredRoute, children }) => {
  const user = getUserFromLocalStorage();
  
  // If user is not logged in, redirect to login
  if (!user) {
    toast.error("Please login to continue");
    return <Navigate to="/" replace />;
  } 

  // Check if user role has permission for the required route
  const userRole = user.Role || "User";
  
  // Get the route permissions from localStorage
  const rolePermissions = JSON.parse(localStorage.getItem("rolePermissions")) || {};
  
  // Get the routes allowed for this user's role
  const allowedRoutes = rolePermissions[userRole] || [];
  
  // Special case: Admin role has access to everything
  if (userRole === "Admin") {
    return children ? children : <Outlet />;
  }
  
  // Extract the main route category (e.g., "Shopify/OrderList" -> "Shopify")
  // This is used to determine if the user has access to a main category
  const mainCategory = requiredRoute.split('/')[0];
  
  // Check if user has permission for this specific route or its parent category
  const hasPermission = 
    allowedRoutes.includes(requiredRoute) || 
    allowedRoutes.includes(mainCategory);
  
  if (!hasPermission) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/admin" replace />;
  }
  
  return children ? children : <Outlet />;
};

export default ProtectedRoute;