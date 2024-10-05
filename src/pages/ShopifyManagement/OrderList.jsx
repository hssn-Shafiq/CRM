import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../Services/shopifyService";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { Dropdown } from "react-bootstrap";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const entriesPerPage = 10;

  // Columns management
  const allColumns = [
    { name: "Order ID", key: "id" },
    { name: "Date", key: "created_at" },
    { name: "Customer", key: "customer" },
    { name: "Total", key: "total_price" },
    { name: "Payment Status", key: "financial_status" },
    { name: "Fulfillment Status", key: "fulfillment_status" },
    { name: "Delivery Status", key: "delivery_status" },
    { name: "Delivery Method", key: "delivery_method" },
    { name: "Items", key: "items" },
  ];

  const [visibleColumns, setVisibleColumns] = useState([
    "Order ID",
    "Date",
    "Customer",
    "Total",
  ]); // Initial visible columns

  const hiddenColumns = allColumns.filter(
    (col) => !visibleColumns.includes(col.name)
  );

  // Fetch orders on component mount, only if not already cached
  useEffect(() => {
    const cachedOrders = localStorage.getItem("cachedOrders");

    if (cachedOrders) {
      const parsedOrders = JSON.parse(cachedOrders);
      setOrders(parsedOrders);
      setFilteredOrders(parsedOrders);
      setLoading(false);
    } else {
      const getOrders = async () => {
        try {
          const fetchedOrders = await fetchOrders();
          if (fetchedOrders && fetchedOrders.length > 0) {
            setOrders(fetchedOrders);
            setFilteredOrders(fetchedOrders);
            localStorage.setItem("cachedOrders", JSON.stringify(fetchedOrders));
          }
        } catch (err) {
          setError("Failed to fetch orders");
        } finally {
          setLoading(false);
        }
      };
      getOrders();
    }
  }, []); // Empty dependency array ensures this runs only on mount

  // Handle filter changes and search
  useEffect(() => {
    applyFilters();
  }, [orders, filter, searchTerm, startDate, endDate, currentPage]);

  // Function to apply filters
  const applyFilters = () => {
    let filtered = orders;

    if (filter === "Unfulfilled") {
      filtered = filtered.filter((order) => !order.fulfillment_status);
    } else if (filter === "Unpaid") {
      filtered = filtered.filter((order) => order.financial_status !== "paid");
    }

    if (searchTerm) {
      filtered = filtered.filter((order) => {
        const customerName = `${order.customer?.first_name} ${order.customer?.last_name}`.toLowerCase();
        return (
          order.id.toString().includes(searchTerm) ||
          customerName.includes(searchTerm.toLowerCase()) ||
          (order.fulfillment_status || "Pending")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (order.shipping_lines.length > 0 ? "Shipped" : "Not Shipped")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (order.shipping_lines[0]?.title || "N/A")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.financial_status
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.created_at.includes(searchTerm)
        );
      });
    }

    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    setFilteredOrders(filtered);
  };

  // Get current orders to display (pagination logic)
  const indexOfLastOrder = currentPage * entriesPerPage;
  const indexOfFirstOrder = indexOfLastOrder - entriesPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Handle pagination change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);

  // Function to handle adding a new column
  const handleAddColumn = (column) => {
    if (!visibleColumns.includes(column)) {
      setVisibleColumns((prevColumns) => [...prevColumns, column]);
    }
  };

  const renderColumnData = (order, columnKey) => {
    switch (columnKey) {
      case "id":
        return order.id;
      case "created_at":
        return new Date(order.created_at).toLocaleDateString();
      case "customer":
        return `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`;
      case "total_price":
        return `${order.total_price} ${order.currency}`;
      case "financial_status":
        return order.financial_status;
      case "fulfillment_status":
        return order.fulfillment_status || "Pending";
      case "delivery_method":
        return order.shipping_lines[0]?.title || "N/A";
      case "items":
        return order.line_items.map((item) => (
          <span key={item.id}>
            {item.name} x {item.quantity}
          </span>
        ));
      default:
        return "";
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container-fluid px-3 pt-4 parent-lead-data-form">
      <div className="text-center">
        <h2 className="text-uppercase p-2 page-title">All Orders</h2>
      </div>

      {/* Filters Section */}
      <div className="filters my-3 mt-5">
        <div className="row align-items-center">
          <div className="col-md-2">
            <label className="text-white">Filter by Status</label>
            <select
              className="form-control bg-main border-main text-light"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Unfulfilled">Pending</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="text-white">Start Date</label>
            <div className="input-group ">
              <DatePicker
                className="form-control bg-main border-main text-light"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                isClearable
              />
            </div>
          </div>
          <div className="col-md-3">
            <label className="text-white">End Date</label>
            <div className="input-group ">
              <DatePicker
                className="form-control bg-main border-main text-light"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                isClearable
              />
            </div>
          </div>
          <div className="col-md-4">
            <label className="text-white">Search Orders</label>
            <div className="input-group  ">
              <span className="input-group-text bg-main border-main">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control bg-main border-main text-light"
                placeholder="Search by Order ID, Customer, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-responsive">
        <table className="table table-hover leads-table">
          <thead>
            <tr className="border-main text-center">
              {visibleColumns.map((col) => (
                <th key={col}>{col}</th>
              ))}

              {/* Dropdown for remaining columns */}
              <th>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="dropdown-basic"
                    className="btn-sm bg-main border-main"
                  >
                    <FaPlus />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {hiddenColumns.map((col) => (
                      <Dropdown.Item
                        key={col.name}
                        onClick={() => handleAddColumn(col.name)}
                      >
                        {col.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </th>
            </tr>
          </thead>
          <tbody >
            {currentOrders && currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={index}>
                  {visibleColumns.map((column) => (
                    <td key={column}>
                      {renderColumnData(order, allColumns.find((col) => col.name === column)?.key)}
                    </td>
                  ))}
                  <td>
                    <Link to={`/admin/Shopify/Order/${order.id}`}>
                      <FaEye
                        style={{ marginRight: "10px", cursor: "pointer" }}
                      />
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
              className={`page-item ${
                index + 1 === currentPage ? "active" : ""
              }`}
            >
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderList;
