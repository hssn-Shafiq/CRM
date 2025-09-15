import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";
import { Checkbox } from "antd";

const RoleModal = ({
  show,
  handleClose,
  isEditMode,
  name,
  setName,
  selectedRoutes,
  setSelectedRoutes,
  handleRouteChange,
  handleAddOrUpdateRole,
  allRoutes,
}) => {
  // Group routes by category
  const routeCategories = {
    Users: ["Users", "Users/User-List", "RegisteredUser"],
    SchedulePosts: [
      "SchedulePosts",
      "SchedulePosts/Create-Post",
      "SchedulePosts/Calendar",
      "SchedulePosts/Posts",
      "SchedulePosts/SocialAccounts",
    ],
    Marketing: [
      "Marketing",
      "Contacts",
      "Emails",
      "Templates",
      "CustomerSegments",
    ],
    Invoicing: [
      "Invoicing",
      "Invoicing/Dashboard",
      "Invoicing/List", 
      "Invoicing/Create",
      "Invoicing/Edit",
      "Invoicing/Detail",
      "Invoicing/Templates",
      "Invoicing/Automation"
    ],
    Shopify: [
      "Shopify",
      "Shopify/OrderList",
      "Shopify/CustomOrderList",
      "Shopify/Delivered-Orders",
      "Shopify/Cancelled-Orders",
    ],
    Other: ["Dashboard", "Settings"],
  };

  // Function to handle parent category selection
  const handleCategoryChange = (category, checked) => {
    if (checked) {
      // Add all routes from this category
      const categoryRoutes = routeCategories[category];
      const newRoutes = [...selectedRoutes];

      categoryRoutes.forEach((route) => {
        if (!newRoutes.includes(route)) {
          newRoutes.push(route);
        }
      });

      setSelectedRoutes(newRoutes);
    } else {
      // Remove all routes from this category
      const categoryRoutes = routeCategories[category];
      setSelectedRoutes(
        selectedRoutes.filter((route) => !categoryRoutes.includes(route))
      );
    }
  };

  // Check if all routes in a category are selected
  const isCategorySelected = (category) => {
    const categoryRoutes = routeCategories[category];
    return categoryRoutes.every((route) => selectedRoutes.includes(route));
  };

  // Check if some (but not all) routes in a category are selected
  const isCategoryIndeterminate = (category) => {
    const categoryRoutes = routeCategories[category];
    const selectedCategoryRoutes = categoryRoutes.filter((route) =>
      selectedRoutes.includes(route)
    );
    return (
      selectedCategoryRoutes.length > 0 &&
      selectedCategoryRoutes.length < categoryRoutes.length
    );
  };

  // Handle the select all checkbox
  const handleSelectAll = (checked) => {
    if (checked) {
      // Flatten all routes from all categories
      const allRoutesArray = Object.values(routeCategories).flat();
      setSelectedRoutes(allRoutesArray);
    } else {
      setSelectedRoutes([]);
    }
  };

  // Check if all routes are selected
  const isAllSelected = () => {
    const allRoutesArray = Object.values(routeCategories).flat();
    return allRoutesArray.every((route) => selectedRoutes.includes(route));
  };

  // Check if some routes are selected
  const isAllIndeterminate = () => {
    return selectedRoutes.length > 0 && !isAllSelected();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? "Edit Role" : "Add New Role"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Role Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter role name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Routes</Form.Label>

            {/* Select All Checkbox */}
            <div className="mb-3 d-flex align-items-center">
              <Checkbox
                checked={isAllSelected()}
                indeterminate={isAllIndeterminate()}
                onChange={(e) => handleSelectAll(e.target.checked)}
              >
                <strong className="text-secondary">Select All Routes</strong>
              </Checkbox>
            </div>

            {/* Route Categories */}
            <div className="route-categories">
              {Object.entries(routeCategories).map(([category, routes]) => (
                <Card key={category} className="mb-3">
                  <Card.Header>
                    <Checkbox
                      checked={isCategorySelected(category)}
                      indeterminate={isCategoryIndeterminate(category)}
                      onChange={(e) =>
                        handleCategoryChange(category, e.target.checked)
                      }
                    >
                      <strong>{category}</strong>
                    </Checkbox>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-wrap">
                      {routes.map((route) => (
                        <div
                          key={route}
                          className="mb-2 me-3"
                          style={{ minWidth: "200px" }}
                        >
                          <Checkbox
                            checked={selectedRoutes.includes(route)}
                            onChange={(e) =>
                              handleRouteChange(route, e.target.checked)
                            }
                          >
                            {route.includes("/") ? route.split("/")[1] : route}
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddOrUpdateRole}>
          {isEditMode ? "Update Role" : "Add Role"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoleModal;
