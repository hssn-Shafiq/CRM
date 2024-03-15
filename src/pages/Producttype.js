import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import axios from "axios";
const ProductType = () => {
  const [type, setType] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [types, setTypes] = useState([]);
  const [editableRows, setEditableRows] = useState({}); // Track which rows are in edit mode

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await axios.get("https://circularclientapi.azurewebsites.net/api/product-types");
      console.log("Response data:", response.data);
      const typesData = response.data.results || [];
      setTypes(typesData);
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editingTypeId) {
        response = await axios.put(
          `https://circularclientapi.azurewebsites.net/api/product-types/${editingTypeId}`,
          {
            type: type,
          }
        );
      } else {
        response = await axios.post("https://circularclientapi.azurewebsites.net/api/product-types", {
          type: type,
        });
      }

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(editingTypeId ? "Product type updated successfully!" : "Product type added successfully!");
        setType("");
        setEditingTypeId(null);
        fetchTypes();
      } else {
        setError(editingTypeId ? "Failed to update product type. Please try again later." : "Failed to add product type. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleEdit = (typeId) => {
    const typeToEdit = types.find((type) => type.id === typeId);
    if (typeToEdit) {
      setType(typeToEdit.type);
      setEditingTypeId(typeId);
      setEditableRows((prevEditableRows) => ({
        ...prevEditableRows,
        [typeId]: true,
      }));
    }
  };

  const handleDelete = async (typeId) => {
    try {
      const response = await axios.delete(`https://circularclientapi.azurewebsites.net/api/product-types/${typeId}`);
      if (response.status === 200) {
        setSuccessMessage("Product type deleted successfully!");
        fetchTypes();
      } else {
        setError("Failed to delete product type. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleSave = () => {
    setEditableRows({}); // Clear all editable rows
    setEditingTypeId(null); // Reset editing mode
    // Perform save operation here if needed
  };

  const handleCancel = () => {
    setEditableRows({}); // Clear all editable rows
    setEditingTypeId(null); // Reset editing mode
    // Reset form fields here if needed
  };

  return (
    <>
        <div className="container-fluid px-3 pt-4">
          <div className="text-center  ">
            <h2 className="text-uppercase p-2 page-title">
              Manage Product Type
            </h2>
          </div>
        <div className="row ">
          <div className="col-lg-12 mt-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label><b>Product Type</b></Form.Label>
                <Form.Control type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Product type" required />
              </Form.Group>
              <Button type="submit">{editingTypeId ? "Update" : "Submit"}</Button>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            </Form>
            <div className="mt-4">
            <div className="text-center  ">
            <h2 className="text-uppercase p-2 page-title">
              All Product Type
            </h2>
          </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((type, index) => (
                    <tr key={type.id}>
                      <td>{index + 1}</td>
                      <td>
                        {editableRows[type.id] ? (
                          <Form.Control
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                          />
                        ) : (
                          type.type
                        )}
                      </td>
                      <td className="d-flex align-items-center justify-content-evenly">
                        {editableRows[type.id] ? (
                          <>
                            <Button onClick={() => handleSave()} variant="success">Save</Button>
                            <Button onClick={() => handleCancel()} variant="secondary" className="ml-3">Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => handleEdit(type.id)} variant="success" className="ml-3">Edit</Button>
                            <Button onClick={() => handleDelete(type.id)} variant="danger" className="ml-3">Delete</Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductType;
