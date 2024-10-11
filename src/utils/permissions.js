// utils/permissions.js
export const defaultRoutePermissions = {
  Admin: [
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
    "BookedAppointments",
    "ScheduleAppointments",
    "Marketing",
    "Settings",
    "RegisteredUser",
  ],
  SubAdmin: [
    "Dashboard",
    "SchedulePosts",
    "Create-Post",
    "Calendar",
    "Shopify",
    "OrderList",
    "BookedAppointments",
    "ScheduleAppointments",
    "Settings",
  ],
  CoAdmin: [
    "Dashboard",
    "SchedulePosts",
    "Create-Post",
    "Calendar",
    "BookedAppointments",
    "Settings",
  ],
};

// A function to get the route permissions from localStorage or the default
export const getRoutePermissions = () => {
  return JSON.parse(localStorage.getItem("routePermissions")) || defaultRoutePermissions;
};

// A function to save the updated route permissions to localStorage
export const setRoutePermissions = (permissions) => {
  localStorage.setItem("routePermissions", JSON.stringify(permissions));
};
