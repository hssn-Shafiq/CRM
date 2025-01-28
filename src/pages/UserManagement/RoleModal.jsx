import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
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
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
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
            <div className="d-flex flex-wrap">
              {allRoutes.map((route) => (
                <Checkbox
                  key={route}
                  checked={selectedRoutes.includes(route)}
                  onChange={(e) => handleRouteChange(route, e.target.checked)}
                >
                  {route}
                </Checkbox>
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
