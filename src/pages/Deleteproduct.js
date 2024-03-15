import React,{useState} from "react";
import { Button, Toast, Form } from "react-bootstrap";

const Deleteproduct = () => {
    const [productId, setProductId] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
  
    const handleDelete = async () => {
      try {
        const response = await fetch(
          `https://circularclientapi.azurewebsites.net/api/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setToastMessage("Product deleted successfully");
        } else {
          setToastMessage(data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        setToastMessage("An error occurred while deleting product");
      } finally {
        setShowToast(true);
      }
    };

    return (
        <>
         <div>
      <div className="container-fluid px-3 pt-4">
      <div className="text-center  ">
        <h2 className="text-uppercase p-2 page-title">Delete Product</h2>
        </div>
        <div className="row" >
          <div className="col-lg-12 pt-5 px-3">
          <Form.Group controlId="productIdInput">
            <Form.Label><h5>Product ID</h5></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </Form.Group>
          <Button onClick={handleDelete} style={{marginTop:"20px",fontSize:"16px",fontWeight:"600",padding:"15px",borderRadius:"10px"}}>Delete Product</Button>
          <Toast show={showToast} onClose={() => setShowToast(false)}>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
          </div>
         
        </div>
      </div>
    </div>
        </>
    )
}

export default Deleteproduct;