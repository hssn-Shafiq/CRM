import { React, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import axios from "axios";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup.string().required("Tag is Required"),
  color: yup
    .array()
    .min(1, "Pick at least one color")
    .required("Color is Required"),
  quantity: yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
  const [formData, setFormData] = useState({
    categoryId: "",
    typeId: 1, // Default value
    designerId: "",
    productGenCategoryId: "",
    name: "",
    size: "",
    internationalSize: "",
    brand: "",
    color: "",
    condition: "",
    sellPrice: "",
    rentPrice4Days: "",
    rentPrice8Days: "",
    rentPrice16Days: "",
    rentPrice30Days: "",
    rrp: "",
    code: "",
    details: "",
    isEbayStore: true,
    deletedBy: 0,
    modifiedBy: 0,
    createdBy: 0,
    productImages: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageURLs, setSelectedImageURLs] = useState([]);

  const [categories, setCategories] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignerId, setSelectedDesignerId] = useState(null);
  const [selectedDesignerName, setSelectedDesignerName] = useState("");

  const [edits, setEdits] = useState([]);
  const [selectedEditId, setSelectedEditId] = useState(null);
  const [selectedEditName, setSelectedEditName] = useState("");

  const [productCatGen, setProductCatGen] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchDesigners();
    fetchProductTypes();
    fetchEdits(); // Fetch edits data
    fetchCataGenId();
  }, []);

  const fetchCataGenId = async () => {
    try {
      const response = await fetch(
        "https://circularclientapi.azurewebsites.net/api/product-gen-categories"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Category Gen");
      }
      const data = await response.json();
      setProductCatGen(data.results);
    } catch (error) {
      console.error("Error fetching Category Gen:", error);
      toast.error("Error fetching Category Gen");
    }
  };

  const fetchEdits = async () => {
    try {
      const response = await fetch(
        "https://circularclientapi.azurewebsites.net/api/product-edits"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch edits");
      }
      const data = await response.json();
      setEdits(data.results);
    } catch (error) {
      console.error("Error fetching edits:", error);
      toast.error("Error fetching edits");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://circularclientapi.azurewebsites.net/api/product-categories"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.results);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  console.log("fetch catagory", categories);

  const fetchDesigners = async () => {
    try {
      const response = await fetch(
        "https://circularclientapi.azurewebsites.net/api/product-designers"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch designers");
      }
      const data = await response.json();
      setDesigners(data.results);
    } catch (error) {
      console.error("Error fetching designers:", error);
      toast.error("Error fetching designers");
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await fetch(
        "https://circularclientapi.azurewebsites.net/api/product-types"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product types");
      }
      const data = await response.json();
      setProductTypes(data.results);
    } catch (error) {
      console.error("Error fetching product types:", error);
      toast.error("Error fetching product types");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "rrp") {
      const rrp = parseFloat(value);

      // Calculate Sell Price (70% of RRP)
      const sellPrice = Math.round(rrp * 0.7);

      // Calculate Rent Price (4 days) - 20% of sell price
      const rentPrice4Days = Math.round(sellPrice * 0.2);

      // Calculate PER DAY RATE (4 Day base rate)
      const perDayRate4Days = Math.round(rentPrice4Days / 4);

      // Calculate PER DAY RATE (8)
      const perDayRate8Days = Math.round(perDayRate4Days * 0.7);

      // Calculate Rent Price (8 days)
      const rentPrice8Days = Math.round(perDayRate8Days * 8);

      // Calculate PER DAY RATE (16)
      const perDayRate16Days = Math.round(perDayRate8Days * 0.5);

      // Calculate Rent Price (16 days)
      const rentPrice16Days = Math.round(perDayRate16Days * 16);

      // Calculate PER DAY RATE (30)
      const perDayRate30Days = Math.round(perDayRate16Days * 0.7);

      // Calculate Rent Price (30 days)
      const rentPrice30Days = Math.round(perDayRate30Days * 30);

      setFormData((prevState) => ({
        ...prevState,
        sellPrice: `AU$${sellPrice}`,
        rentPrice4Days: `AU$${rentPrice4Days}`,
        rentPrice8Days: `AU$${rentPrice8Days}`,
        rentPrice16Days: `AU$${rentPrice16Days}`,
        rentPrice30Days: `AU$${rentPrice30Days}`,
        discountPerDay4Days: `AU$${perDayRate4Days}`,
        discountPerDay8Days: `AU$${perDayRate8Days}`,
        discountPerDay16Days: `AU$${perDayRate16Days}`,
        discountPerDay30Days: `AU$${perDayRate30Days}`,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setSelectedImages(Array.from(files)); // Ensure selectedImages is always an array
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setSelectedImageURLs(urls);
  };

  const handleDesignerSearch = (e) => {
    setSearchTerm(e.target.value);
    setSelectedDesignerId(null); // Reset selected designer when typing in the search filter
  };

  const handleDesignerSelection = (designerId, designerName) => {
    setSelectedDesignerId(designerId);
    setSelectedDesignerName(designerName);
    console.log("Selected designer ID:", designerId);
  };

  const handleDesignerChange = (e) => {
    const designerId = e.target.value;
    const designerName = e.target.options[e.target.selectedIndex].text;
    setSelectedDesignerId(designerId);
    setSelectedDesignerName(designerName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedImages.length < 4) {
        toast.error("Please upload at least 4 images.");
        return;
      }

      // Cloudinary configuration...
      const cloudinaryConfig = {
        cloudName: "lms-empty",
        apiKey: "465825886714436",
        apiSecret: "_XtyARctyPki8NutUmKpElof_Cw",
        uploadPreset: "vikings",
        uploadUrl: "https://api.cloudinary.com/v1_1/lms-empty/image/upload",
      };

      // Prepare an array to store promises for uploading images
      const uploadPromises = selectedImages.map((image) => {
        const formDataCloudinary = new FormData();
        formDataCloudinary.append("file", image);
        formDataCloudinary.append(
          "upload_preset",
          cloudinaryConfig.uploadPreset
        );

        // Return the axios post promise
        return axios.post(cloudinaryConfig.uploadUrl, formDataCloudinary);
      });

      // Wait for all images to be uploaded
      const cloudinaryResponses = await Promise.all(uploadPromises);

      // Get image URLs from Cloudinary responses...
      const uploadedImageUrls = cloudinaryResponses.map(
        (response) => response.data.secure_url
      );

      // Prepare data to send to backend API...
      const requestData = {
        ...formData,
        designerId: selectedDesignerId,
        editId: selectedEditId, // Add editId to formData
        productGenCategoryId: formData.productGenCategoryId,
        productImages: uploadedImageUrls.map((url, index) => ({
          url,
          name: `Image ${index + 1}`,
        })),
      };

      // Send data to backend API...
      const response = await fetch(
        "https://circularclientapi.azurewebsites.net/api/products",
        {
          method: "POST",
          body: JSON.stringify(requestData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error adding product");
      }

      const data = await response.json();
      console.log("Product added successfully:", data);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
  };

  const filteredDesigners = designers.filter((designer) =>
    designer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle clicking on calculated fields to update them
  const handleEditableClick = (fieldName, calculatedValue) => {
    // Update the form data with the calculated value
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: calculatedValue,
    }));
  };

  return (
    <main>
      <Container className="container-fluid px-3 pt-4">
        <div className="text-center bg-dark ">
        <h2 className="text-uppercase p-2 page-title">Add Product</h2>
        </div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6} className="mt-4">
              <Form.Group className="mb-3 mt-3 Category-admin">
                <Form.Label>
                  <b>Category*</b>
                </Form.Label>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 mt-3 Category-admin">
                <Form.Label>
                  <b>Product Type*</b>
                </Form.Label>
                <Form.Select
                  name="typeId"
                  value={formData.typeId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Product Type</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 mt-3 Category-admin">
                <Form.Label>
                  <b>Search Designer*</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  value={selectedDesignerId}
                  onChange={handleDesignerChange}
                >
                  <option value="">Select Designer</option>
                  {designers.map((designer) => (
                    <option key={designer.id} value={designer.id}>
                      {designer.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3 mt-3 Category-admin">
                <Form.Label>
                  <b>Selected Designer</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={selectedDesignerName}
                  readOnly
                  // style={{ display: "none" }}
                />
                {/* <p>{selectedDesignerName}</p> */}
              </Form.Group>

              <Form.Group className="mb-3 mt-3 Category-admin">
                <Form.Label>
                  <b>Select Edit*</b>
                </Form.Label>
                <Form.Select
                  name="editId"
                  value={selectedEditId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedEditId(selectedId);
                    const selectedEdit = edits.find(
                      (edit) => edit.id === parseInt(selectedId)
                    );
                    if (selectedEdit) {
                      setSelectedEditName(selectedEdit.name);
                    }
                  }}
                >
                  <option value="">Select Edit</option>
                  {edits.map((edit) => (
                    <option key={edit.id} value={edit.id}>
                      {edit.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 mt-3 Category-admin">
                <Form.Label>
                  <b>Product Category Generation*</b>
                </Form.Label>
                <Form.Select
                  name="productGenCategoryId"
                  value={formData.productGenCategoryId}
                  onChange={handleInputChange}
                  style={{ color: "black" }} // Adjust text color to ensure visibility
                >
                  <option value="">Select Category Generation</option>
                  {productCatGen.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      style={{ color: "black" }}
                    >
                      {category.type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 mt-3 brand-admin">
                <Form.Label>
                  <b>Brand*</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3 mt-3">
                <Form.Label>
                  <b>Code*</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3 mt-3">
                <Form.Label>
                  <b>Name*</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3 mt-3 Category-admin">
                <Form.Label>
                  <b>International Size*</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="internationalSize"
                  value={formData.internationalSize}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6} className="mt-4">
              {/* Inputs placed in one column */}
              <Form.Group className="mb-3 mt-3" onSubmit={handleSubmit}>
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>
                    <b>Rent Price 4 Days*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="rentPrice4Days"
                    value={formData.rentPrice4Days}
                    onChange={handleInputChange}
                    onClick={() =>
                      handleEditableClick(
                        "rentPrice4Days",
                        formData.rentPrice4Days
                      )
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>
                    <b>Rent Price 8 Days*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="rentPrice8Days"
                    value={formData.rentPrice8Days}
                    onChange={handleInputChange}
                    onClick={() =>
                      handleEditableClick(
                        "rentPrice8Days",
                        formData.rentPrice8Days
                      )
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>
                    <b>Rent Price 16 Days*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="rentPrice16Days"
                    value={formData.rentPrice16Days}
                    onChange={handleInputChange}
                    onClick={() =>
                      handleEditableClick(
                        "rentPrice16Days",
                        formData.rentPrice16Days
                      )
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>
                    <b>Rent Price 30 Days*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="rentPrice30Days"
                    value={formData.rentPrice30Days}
                    onChange={handleInputChange}
                    onClick={() =>
                      handleEditableClick(
                        "rentPrice30Days",
                        formData.rentPrice30Days
                      )
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3 mt-3 Category-admin">
                  <Form.Label>
                    <b>Color*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>
                    <b>Condition*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>
                    <b>RRP*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="rrp"
                    value={formData.rrp}
                    onChange={handleInputChange}
                    onClick={() => handleEditableClick("rrp", formData.rrp)}
                  />
                </Form.Group>
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>
                    <b>Sell Price*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="sellPrice"
                    value={formData.sellPrice}
                    onChange={handleInputChange}
                    onClick={() =>
                      handleEditableClick("sellPrice", formData.sellPrice)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3 mt-3">
                  <Form.Label>
                    <b>Details*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3 mt-3 Category-admin">
                  <Form.Label>
                    <b>Size*</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form.Group>
            </Col>
            <Form.Group className="Category-admin">
                  <Form.Label>
                    <b>
                      Upload Images*{" "}
                      <span
                        style={{
                          fontSize: "12px !important",
                          textTransform: "capitalize",
                          color: "#f5f5f5e0",
                        }}
                      >
                        (Please Select atleast four images)
                      </span>
                    </b>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="images"
                    accept="image/*"
                    title="Please select atleast four images"
                    multiple
                    onChange={handleImageChange} // Add this onChange handler
                  />
                </Form.Group>
                <div className="text-center">
            <Button type="submit" className="move-step-admin mb-3 mt-3 w-100">
              Submit
            </Button>
            </div>
          </Row>
        </Form>
        <Form.Group className="mb-3 mt-3 Category-admin">
          <Form.Label>
            <b>Selected Images</b>
          </Form.Label>
          <div>
            {selectedImageURLs.map((url, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Image
                  src={url}
                  alt={`Product Image ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "10px",
                  }}
                />
                <p>{`Image ${index + 1}: ${url}`}</p>
                <span style={{ marginLeft: "10px" }}>✔️</span>{" "}
                {/* Tick symbol */}
              </div>
            ))}
          </div>
        </Form.Group>
      </Container>
    </main>
  );
};

export default Addproduct;
