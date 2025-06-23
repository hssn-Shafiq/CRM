import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { hasRoutePermission, fetchAndStoreRolePermissions } from "../utils/permissions";
import { getUserFromLocalStorage } from "../utils/localstorage";
import RouteLoader from "./RouteLoader";

const ProtectedRoute = ({ children, requiredRoute }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Immediately check if user exists in localStorage before any async operations
  const userExists = getUserFromLocalStorage() !== null;

  useEffect(() => {
    // If no user exists, skip the authorization check completely
    if (!userExists) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    const checkAuthorization = async () => {
      try {
        setIsLoading(true);
        
        // Make sure permissions are loaded before checking
        await fetchAndStoreRolePermissions();
        
        // Safely check permissions with error handling
        try {
          const hasPermission = hasRoutePermission(requiredRoute);
          setIsAuthorized(hasPermission);
        } catch (permError) {
          console.error("Permission check error:", permError);
          // Default to true if there's an error checking permissions
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
        setIsAuthorized(false);
      } finally {
        // Add a small delay for smoother transitions
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    checkAuthorization();
  }, [requiredRoute, userExists]);

  // If user doesn't exist, immediately redirect to login
  if (!userExists) {
    return <Navigate to="/" replace />;
  }

  // Only show loading if user exists and we're checking permissions
  if (isLoading) {
    return <RouteLoader text="Please Wait..." />;
  }

  if (isAuthorized === false) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;