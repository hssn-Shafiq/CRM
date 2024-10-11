import React, { useState } from "react";
import { Checkbox, Button } from "antd";
import { getRoutePermissions, setRoutePermissions } from "../../utils/permissions";

const UserPermission = () => {
  const [permissions, setPermissions] = useState(getRoutePermissions());

  const handlePermissionChange = (role, route) => {
    const updatedPermissions = {
      ...permissions,
      [role]: permissions[role].includes(route)
        ? permissions[role].filter((r) => r !== route)
        : [...permissions[role], route],
    };
    setPermissions(updatedPermissions);
  };

  const savePermissions = () => {
    setRoutePermissions(permissions);
    alert("Permissions updated successfully.");
  };

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

  return (
    <div className="container-fluid px-3 pt-4">
      <h2 className="text-uppercase p-2 page-title text-center">Manage User Permissions</h2>
      <div className="container my-5">
      <div className="row ">
        {["Admin", "SubAdmin", "CoAdmin"].map((role) => (
          <div className="col-md-4" key={role}>
            <div className="border-end pe-4">
              <h4 className="pb-2">{role}</h4>
              {allRoutes.map((route) => (
                <div
                  key={route}
                  className="d-flex align-items-center py-2 border-bottom"
                >
                  <Checkbox
                    checked={permissions[role].includes(route)}
                    onChange={() => handlePermissionChange(role, route)}
                    className="text-light"
                  >
                    {route}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Button type="primary" onClick={savePermissions}>
          Save Permissions
        </Button>
      </div>
      </div>
      
    </div>
  );
};

export default UserPermission;
