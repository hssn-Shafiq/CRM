import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get the orderId from the URL
import { fetchSingleOrders } from "../../Services/shopifyService"; // Import the service to fetch order details

const OrderDetail = () => {
  const { orderId } = useParams(); // Get the orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const fetchedOrder = await fetchSingleOrders({ orderId });
        setOrder(fetchedOrder);
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>Order Details for Order ID: {orderId}</h2>
      <div className="card">
        <div className="card-body text-dark">
          <h5 className="card-title">Order Information</h5>
          <p><strong>Customer:</strong> {order.customer?.first_name} {order.customer?.last_name}</p>
          <p><strong>Total Price:</strong> {order.total_price} {order.currency}</p>
          <p><strong>Payment Status:</strong> {order.financial_status}</p>
          <p><strong>Fulfillment Status:</strong> {order.fulfillment_status || "Pending"}</p>
          <p><strong>Delivery Method:</strong> {order.shipping_lines[0]?.title || "N/A"}</p>

          {/* Additional details can go here */}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
