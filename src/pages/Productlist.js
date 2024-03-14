import React, { useEffect,useState } from "react";
import {Container,Table, Form,Col, Button, Row} from "react-bootstrap"
import { Link } from "react-router-dom";


const Productlist = () => {
  const [products, setProducts] = useState([]);
  const [editableRows, setEditableRows] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => {
      fetchProducts();
  }, []);

  const fetchProducts = async () => {
      try {
          const response = await fetch("https://circularclientapi.azurewebsites.net/api/products");
          if (response.ok) {
              const data = await response.json();
              setProducts(data.results);
              const initialEditableRows = {};
              data.results.forEach((product) => {
                  initialEditableRows[product.id] = false;
              });
              setEditableRows(initialEditableRows);
          } else {
              console.error("Failed to fetch products");
          }
      } catch (error) {
          console.error("Error fetching products:", error);
      }
  };

  const handleEdit = (productId) => {
      setEditableRows((prevState) => ({
          ...prevState,
          [productId]: !prevState[productId],
      }));
      setEditId(productId); // Set the editId when editing starts
  };

  const handleSave = async () => {
      const updatedProduct = products.find((product) => product.id === editId);
      const requestBody = updatedProduct;

      try {
          const response = await fetch(`https://circularclientapi.azurewebsites.net/api/products/${editId}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  accept: "*/*",
              },
              body: JSON.stringify(requestBody),
          });
          if (response.ok) {
              console.log("Product updated successfully");
              setEditId(null); // Reset editId after saving
          } else {
              console.error("Failed to update product");
          }
      } catch (error) {
          console.error("Error updating product:", error);
      }
  };

  const handleDelete = async (productId) => {
      try {
          const response = await fetch(`https://circularclientapi.azurewebsites.net/api/products/${productId}`, {
              method: "DELETE",
              headers: {
                  accept: "*/*",
              },
          });
          if (response.ok) {
              console.log("Product deleted successfully");
              // Remove the deleted product from the products list
              setProducts(products.filter((product) => product.id !== productId));
          } else {
              console.error("Failed to delete product");
          }
      } catch (error) {
          console.error("Error deleting product:", error);
      }
  };

  return (
    <div>
            <main>
                <Container  className="container-fluid px-3 pt-4">
                <div className="text-center bg-dark ">
        <h2 className="text-uppercase p-2 page-title">Product List</h2>
        </div>
                    <Row className="text-light">
                        <Col lg={12} className="p-3">
                            <div className="product-view">
                                <Table responsive bordered hover>
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: "40px" }}>ID</th>
                                            <th style={{ minWidth: "120px" }}>Name:</th>
                                            <th style={{ minWidth: "200px" }}>Description:</th>
                                            <th style={{ minWidth: "200px" }}>Code:</th>
                                            <th style={{ minWidth: "60px" }}>Category:</th>
                                            <th style={{ minWidth: "60px" }}>Size:</th>
                                            <th style={{ minWidth: "80px" }}>Brand:</th>
                                            <th style={{ minWidth: "80px" }}>Color:</th>
                                            <th style={{ minWidth: "80px" }}>Price:</th>
                                            <th style={{ minWidth: "100px" }}>Sale-Price:</th>
                                            <th style={{ minWidth: "100px" }}>RentPrice4Days</th>
                                            <th style={{ minWidth: "100px" }}>RentPrice8Days</th>
                                            <th style={{ minWidth: "100px" }}>RentPrice16Days</th>
                                            <th style={{ minWidth: "100px" }}>RentPrice30Days</th>
                                            <th>Images:</th>
                                            <th>Status</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id}>

                                                {editableRows[product.id] ? (
                                                    <>
                                                        <td>{product.id}</td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.name} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.details} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.categoryId} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.size} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.brand} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.color} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.rrp} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.sellPrice} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.rentPrice4Days} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.rentPrice8Days} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.rentPrice16Days} />
                                                        </td>
                                                        <td>
                                                            <Form.Control type="text" defaultValue={product.rentPrice30Days} />
                                                        </td>
                                                        <td>
                                                            {product.productImages.map((image) => (
                                                                <img key={image.id} src={image.url} alt={image.name} style={{ maxWidth: "100px" }} />
                                                            ))}
                                                        </td>
                                                        <td className="d-flex gap-2">
                                                            <Button variant="primary" onClick={handleSave}>
                                                                Save
                                                            </Button>{" "}
                                                            <Button variant="secondary" onClick={() => handleEdit(product.id)}>
                                                                Cancel
                                                            </Button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{product.id}</td>
                                                        <td>{product.name}</td>
                                                        <td>{product.details}</td>
                                                        <td>{product.code}</td>
                                                        <td>{product.categoryId}</td>
                                                        <td>{product.size}</td>
                                                        <td>{product.brand}</td>
                                                        <td>{product.color}</td>
                                                        <td>{product.rrp}</td>
                                                        <td>{product.sellPrice}</td>
                                                        <td>{product.rentPrice4Days}</td>
                                                        <td>{product.rentPrice8Days}</td>
                                                        <td>{product.rentPrice16Days}</td>
                                                        <td>{product.rentPrice30Days}</td>
                                                        <td>
                                                            {product.productImages.map((image) => (
                                                                <img key={image.id} src={image.url} alt={image.name} style={{ maxWidth: "100px" }} />
                                                            ))}
                                                        </td>
                                                        <td>Active</td>
                                                        <td>
                                                            <Button variant="primary" onClick={() => handleEdit(product.id)}>
                                                                Edit
                                                            </Button>
                                                            </td>
                                                            <td>
                                                                <Button variant="danger" onClick={() => handleDelete(product.id)}>
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
  );
};

export default Productlist;
