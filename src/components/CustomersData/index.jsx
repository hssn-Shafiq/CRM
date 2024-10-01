import React, { useEffect, useState } from "react";
import { fetchCustomers } from "../../Services/shopifyService"; // Adjust the path to the service

const CustomerData = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [editCustomer, setEditCustomer] = useState(null); // For editing customer data
  const [isEditing, setIsEditing] = useState(false); // For modal add/edit mode
  const customersPerPage = 10; // Show 10 rows per page

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const customerData = await fetchCustomers();
        setCustomers(customerData);
      } catch (err) {
        setError("Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };
    getCustomers();
  }, []);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // Function to handle delete
  const handleDelete = (id) => {
    // const updatedCustomers = customers.filter((customer) => customer.id !== id);
    // setCustomers(updatedCustomers);
  };

  // Function to handle add/edit (opens modal and fills the form with the selected row's data)
  const handleEdit = (customer = null) => {
    if (customer) {
      setEditCustomer({
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        company: customer.default_address?.company || "",
        address1: customer.default_address?.address1 || "",
        country: customer.default_address?.country || "",
        province: customer.default_address?.province || "",
        city: customer.default_address?.city || "",
        email: customer.email,
        phone: customer.phone || "",
      });
      setIsEditing(true); // Set to edit mode
    } else {
      setEditCustomer({
        first_name: "",
        last_name: "",
        company: "",
        address1: "",
        country: "",
        province: "",
        city: "",
        email: "",
        phone: "",
      });
      setIsEditing(false); // Set to add mode
    }
  };

  // Function to handle modal form submission (update or add customer data)
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditing) {
      // Update logic
      const updatedCustomers = customers.map((customer) =>
        customer.id === editCustomer.id ? editCustomer : customer
      );
      //   setCustomers(updatedCustomers);
    } else {
      // Add new customer logic
      const newCustomer = { ...editCustomer, id: Date.now() }; // Assigning a temporary ID for demonstration
      //   setCustomers([newCustomer, ...customers]);
    }
    // setEditCustomer(null); 
  };

  return (
    <>
      <div className="container-fluid lead-table-container mt-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col-lg-6">
            <div className="dropdown">
              <button
                className="btn bg-light text-dark border-dark dropdown-toggle"
                type="button"
                id="leadsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                All Leads
              </button>
              <ul className="dropdown-menu" aria-labelledby="leadsDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    New Lead
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Account Lead
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Request from Lead
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Order Deliver Leads
                  </a>
                </li>
              </ul>
            </div>

          </div>
          <div className="col-lg-6 add-lead-data-btn">
            <button className="btn bg-light text-dark border-dark" type="button">
              <i className="fas fa-folder"></i> Create Folder
            </button>
            <button className="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#leadFormModal" onClick={() => handleEdit()}>
              Add Lead +
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle leads-table">
            <thead>
              <tr className="border-main">
                <th>Name</th>
                <th>Company</th>
                <th>Address</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="text-center text-danger">
                    {error}
                  </td>
                </tr>
              ) : currentCustomers.length > 0 ? (
                currentCustomers.map(({ id, first_name, last_name, default_address, email, phone }) => (
                  <tr key={id}>
                    <td>{`${first_name} ${last_name}`}</td>
                    <td>{default_address?.company || "No company"}</td>
                    <td>{default_address?.address1 || "No address"}</td>
                    <td>{default_address?.country || "No country"}</td>
                    <td>{default_address?.province || "No state"}</td>
                    <td>{default_address?.city || "No city"}</td>
                    <td>{email}</td>
                    <td>{phone || "No phone"}</td>
                    <td>
                      {/* Edit and Delete Icons */}
                      <button className="btn btn-warning btn-sm me-2" data-bs-toggle="modal" data-bs-target="#leadFormModal" onClick={() => handleEdit({ id, first_name, last_name, default_address, email, phone })}>
                        <i className="fa fa-pencil" />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>
                        <i className="fa fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No customer data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 && "active"}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal for Adding/Editing Lead */}
      <div
        className="modal fade"
        id="leadFormModal"
        tabIndex={-1}
        aria-labelledby="leadFormModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark text-center" id="leadFormModalLabel">
                {isEditing ? "Edit Lead" : "Add Lead"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {editCustomer && (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.first_name}
                        onChange={(e) => setEditCustomer({ ...editCustomer, first_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.last_name}
                        onChange={(e) => setEditCustomer({ ...editCustomer, last_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-dark">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCustomer.company}
                      onChange={(e) => setEditCustomer({ ...editCustomer, company: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-dark">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCustomer.address1}
                      onChange={(e) => setEditCustomer({ ...editCustomer, address1: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-4 mb-3">
                      <label className="form-label text-dark">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.country}
                        onChange={(e) => setEditCustomer({ ...editCustomer, country: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label className="form-label text-dark">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.province}
                        onChange={(e) => setEditCustomer({ ...editCustomer, province: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label className="form-label text-dark">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.city}
                        onChange={(e) => setEditCustomer({ ...editCustomer, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editCustomer.email}
                        onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editCustomer.phone}
                        onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? "Update Lead" : "Add Lead"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerData;
