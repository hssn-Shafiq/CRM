import React, { useEffect, useState } from "react";
// import { fetchOrders } from '../shopifyService';
import { fetchOrders } from "../Services/shopifyService";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state

  useEffect(() => {
    const getOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false); // Set loading to false after the fetch
      }
    };

    getOrders();
  }, []); // Empty dependency array ensures this runs only on mount

  console.log("orders in view orders are ",orders);
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Customer Orders</h2>
      {orders && orders.length > 0 ? (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              Order ID: {order.id}, Customer: {order.customer_name}, Total:{" "}
              {order.total_price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderList;
