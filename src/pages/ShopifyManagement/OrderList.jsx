import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../Services/shopifyService";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"; // Importing icons for Edit, Delete, View
import DatePicker from "react-datepicker"; // For date selection
import "react-datepicker/dist/react-datepicker.css"; // Importing date picker CSS
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All"); // "All", "Unfulfilled", "Unpaid"
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Fetch orders on component mount
  useEffect(() => {
    const getOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders); // Initialize filtered orders
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false); // Set loading to false after the fetch
      }
    };

    getOrders();
  }, []); // Empty dependency array ensures this runs only on mount

  // Handle filter changes
  useEffect(() => {
    applyFilters();
  }, [orders, filter, searchTerm, startDate, endDate, currentPage]);

  const applyFilters = () => {
    let filtered = orders;

    // Filter by order status
    if (filter === "Unfulfilled") {
      filtered = filtered.filter(order => !order.fulfillment_status);
    } else if (filter === "Unpaid") {
      filtered = filtered.filter(order => order.financial_status !== "paid");
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const customerName = `${order.customer?.first_name} ${order.customer?.last_name}`.toLowerCase();
        return (
          order.id.toString().includes(searchTerm) ||
          customerName.includes(searchTerm.toLowerCase()) ||
          (order.fulfillment_status || "Pending").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.shipping_lines.length > 0 ? "Shipped" : "Not Shipped").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.shipping_lines[0]?.title || "N/A").toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.financial_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.created_at.includes(searchTerm)
        );
      });
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    setFilteredOrders(filtered);
  };

  // Get current orders to display (pagination logic)
  const indexOfLastOrder = currentPage * entriesPerPage;
  const indexOfFirstOrder = indexOfLastOrder - entriesPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle pagination change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);

  return (
    <>
      <div className="container-fluid px-3 pt-4 parent-lead-data-form">
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">All Orders</h2>
        </div>

        {/* Filters Section */}
        <div className="filters mb-3">
          <div className="row">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Order ID, Customer, etc."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-control"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Unfulfilled">Unfulfilled</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div className="col-md-3">
              <DatePicker
                className="form-control"
                selected={startDate}
                onChange={date => setStartDate(date)}
                placeholderText="Start Date"
                isClearable
              />
            </div>
            <div className="col-md-3">
              <DatePicker
                className="form-control"
                selected={endDate}
                onChange={date => setEndDate(date)}
                placeholderText="End Date"
                isClearable
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-responsive">
          <table className="table table-hover leads-table">
            <thead>
              <tr className="border-main text-center">
                <th>Order ID</th>
                <th>Flags</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Channel</th>
                <th>Total</th>
                <th>Payment Status</th>
                <th>Fulfillment Status</th>
                <th>Items</th>
                <th>Delivery Status</th>
                <th>Delivery Method</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={20}>
                    <div className="text-center text-light">
                      Loading... please wait!
                    </div>
                  </td>
                </tr>
              ) : currentOrders && currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.id}</td>
                    <td>{order.flags || "N/A"}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      {order.customer?.first_name} {order.customer?.last_name}
                    </td>
                    <td>{order.source_name || "N/A"}</td>
                    <td>{order.total_price} {order.currency}</td>
                    <td>{order.financial_status}</td>
                    <td>{order.fulfillment_status || "Pending"}</td>
                    <td>
                      {order.line_items.map((item) => (
                        <span key={item.id}>
                          {item.name} x {item.quantity}
                        </span>
                      ))}
                    </td>
                    <td>
                      {order.shipping_lines.length > 0
                        ? "Shipped"
                        : "Not Shipped"}
                    </td>
                    <td>{order.shipping_lines[0]?.title || "N/A"}</td>
                    <td>{order.tags || "No Tags"}</td>
                    <td>
                    <Link to={`/admin/Shopify/Order/${order.id}`}>
                      <FaEye style={{ marginRight: "10px", cursor: "pointer" }} />
                    </Link>
                      <FaEdit
                        style={{ marginRight: "10px", cursor: "pointer" }}
                      />
                      <FaTrash style={{ cursor: "pointer" }} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" style={{ textAlign: "center" }}>
                    {error ? error : "No orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <ul className="pagination justify-content-center">
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${index + 1 === currentPage ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default OrderList;
