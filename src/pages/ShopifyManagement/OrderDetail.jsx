import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleOrders } from "../../Services/shopifyService"; // Import the service to fetch order details
import { fetchProductDetails } from "../../Services/shopifyProductServices"; // Import the service to fetch product images

import { FaEdit, FaTrash, FaPrint } from "react-icons/fa"; // Icons for buttons
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Loader from "../../components/Loader";

const OrderDetail = () => {
  const { orderId } = useParams(); // Get the orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const fetchedOrder = await fetchSingleOrders({ orderId });
        setOrder(fetchedOrder);

        // Fetch images for each product
        const images = {};
        for (const item of fetchedOrder.line_items) {
          const productImages = await fetchProductDetails(item.product_id);
          images[item.product_id] = productImages; // Store all images for this product
        }
        setProductImages(images);
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId]);

  const getImageForVariant = (product_id, variant_id) => {
    // Get all images for the given product_id
    const images = productImages[product_id] || [];

    // First, try to find the image that has a matching variant_id
    const variantImage = images.find((image) =>
      image.variant_ids.includes(variant_id)
    );

    // If a matching image is found, return its URL, otherwise return the product image (first one)
    return variantImage
      ? variantImage.src
      : images[0]?.src || "https://via.placeholder.com/50";
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main>
      <div className="container-fluid mt-4 px-4 mb-4">
        {/* Order Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2>Order #{order.order_number}</h2>
            <p className="text-secondary">
              <p className="text-secondary">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                { " \t"}
                at { " \t"}
                {new Date(order.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </p>
            <span className="badge px-3 py-2 bg-success me-2">
              {order.financial_status}
            </span>
            <span className="badge px-3 py-2 bg-dark border-main">
              {order.fulfillment_status || "Unfulfilled"}
            </span>
          </div>
          <div>
            <button className="btn btn-primary bg-main border-main me-2">
              <FaEdit /> Edit
            </button>
            <button className="btn text-secondary me-2 bg-main border-main">
              <FaPrint /> Print
            </button>
          </div>
        </div>

        {/* Order Status Section */}
        <div className="row">
          {/* Left Side (Product Information) */}
          <div className="col-lg-8 mx-0">
            <div className="card mb-3 bg-main border-main text-light">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <span className="badge border-main px-4 py-2 ">Unfulfilled</span>{" "}
                 (
                  {order.line_items.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )} items
                  )
                </h5>
                <p>
                  <strong>Delivery method:</strong>{" "}
                  {order.shipping_lines[0]?.title || "N/A"}
                </p>
                {/* Products List */}
                {order.line_items.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center justify-content-between border-bottom py-3"
                  >
                    <div className="d-flex align-items-center">
                      {/* Fetch the image corresponding to the variant_id */}
                      <img
                        src={
                          getImageForVariant(
                            item.product_id,
                            item.variant_id
                          ) || "https://via.placeholder.com/50"
                        }
                        alt={item.name}
                        className="img-fluid me-3 rounded-3"
                        width={50}
                      />
                      <div>
                        <p className="mb-0">
                          <strong>{item.name}</strong>
                        </p>
                        <small>{item.variant_title}</small>
                      </div>
                    </div>
                    <div>
                      <p className="mb-0">
                        ${item.price} x {item.quantity}
                      </p>
                      <p className="text-end">
                        <strong>
                          ${(item.price * item.quantity).toFixed(2)}
                        </strong>
                      </p>
                    </div>
                  </div>
                ))}
                {/* Fulfillment Button */}
                <button className="btn btn-info fw-medium mt-3">Fulfill items</button>
              </div>
            </div>
          </div>

          {/* Right Side (Customer & Shipping Information) */}
          <div className="col-lg-4">
            {/* Customer Information */}
            <div className="card mb-3 bg-main border-main text-light">
              <div className="card-body">
                <h5 className="card-title">Customer</h5>
                <p>
                  <strong>
                    {order.customer?.first_name} {order.customer?.last_name}
                  </strong>
                </p>
                <p>
                  <a href={`mailto:${order.contact_email}`}>
                    {order.contact_email}
                  </a>
                </p>
                <p>
                  <strong>Shipping address:</strong>
                </p>
                <p>
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                  <br />
                  {order.shipping_address.address1}
                  <br />
                  {order.shipping_address.city},{" "}
                  {order.shipping_address.province_code}{" "}
                  {order.shipping_address.zip}
                  <br />
                  {order.shipping_address.country_name}
                </p>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="card bg-main border-main text-light">
              <div className="card-body">
                <h5 className="card-title">Summary</h5>
                <p>
                  <strong>
                    Subtotal (
                    {order.line_items.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                    )}{" "}
                    items):
                  </strong>{" "}
                  ${order.current_subtotal_price}
                </p>
                <p>
                  <strong>Discount:</strong> -${order.current_total_discounts}
                </p>
                <p>
                  <strong>Shipping:</strong> $
                  {order.total_shipping_price_set.shop_money.amount}
                </p>
                <h5>
                  <strong>Total:</strong> ${order.total_price}
                </h5>
                <p className="text-muted">Paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetail;
