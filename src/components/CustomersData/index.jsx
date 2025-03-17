// src/Components/CustomerData.jsx
import React, { useState, useEffect, useMemo } from "react";
import RequestFromLeads from "../Leads/RequestFromLeads";
import OrderPaddingLeads from "../Leads/OrderPaddingLeads";
import OrderDeliverLeads from "../Leads/OrderDeliverLeads";
import SendEmailLeads from "../Leads/SendEmailLeads";
import { fetchCustomers } from "../../Services/shopifyService"; // Using your existing fetch function
import Loader from "../Loader";

const CustomerData = () => {
  const [allCustomers, setAllCustomers] = useState([]); // Store all customers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editCustomer, setEditCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLead, setSelectedLead] = useState("All Leads");
  const customersPerPage = 10;

  // Fetch all customer data once on component mount
  useEffect(() => {
    const getCustomers = async () => {
      setLoading(true);
      try {
        const customerData = await fetchCustomers();
        // Ensure we have an array, even if the API returns null/undefined
        setAllCustomers(Array.isArray(customerData) ? customerData : []);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(err.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };
    getCustomers();
  }, []);

  // Function to filter leads based on the selected type
  const filteredCustomers = useMemo(() => {
    if (selectedLead === "All Leads") {
      return allCustomers; // Show all customers
    }
    return allCustomers.filter(
      (customer) => customer.leadType === selectedLead
    );
  }, [allCustomers, selectedLead]);

  // Calculate pagination
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / customersPerPage);
  
  // Get current page data
  const currentCustomers = useMemo(() => {
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    return filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  }, [filteredCustomers, currentPage, customersPerPage]);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  // Function to handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const updatedCustomers = allCustomers.filter((customer) => customer.id !== id);
      setAllCustomers(updatedCustomers);
      
      // If after deletion the current page would be empty and not the first page,
      // go to the previous page
      const newTotalPages = Math.ceil(updatedCustomers.length / customersPerPage);
      if (currentPage > newTotalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Function to handle edit
  const handleEdit = (customer) => {
    // Get complete customer data including default_address
    const fullCustomer = allCustomers.find(c => c.id === customer.id);
    
    // Create an enriched customer object with data from default_address
    const enrichedCustomer = {
      ...customer,
      // If editing is needed for other address fields, add them here
      address2: fullCustomer?.default_address?.address2 || '',
      zip: fullCustomer?.default_address?.zip || '',
      country_code: fullCustomer?.default_address?.country_code || '',
      province_code: fullCustomer?.default_address?.province_code || '',
      original: fullCustomer // Store the original for reference
    };
    
    setEditCustomer(enrichedCustomer);
    setIsEditing(true);
    
    // Open the modal if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
      // eslint-disable-next-line no-undef
      const modal = new bootstrap.Modal(document.getElementById('leadFormModal'));
      modal.show();
    }
  };

  // Function to add a new customer
  const handleAdd = () => {
    setEditCustomer({
      id: null,
      first_name: '',
      last_name: '',
      company: '',
      address1: '',
      address2: '',
      country: '',
      country_code: '',
      province: '',
      province_code: '',
      city: '',
      zip: '',
      email: '',
      phone: ''
    });
    setIsEditing(false);
    // Open the modal if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
      // eslint-disable-next-line no-undef
      const modal = new bootstrap.Modal(document.getElementById('leadFormModal'));
      modal.show();
    }
  };

  // Function to handle save
  const handleSave = (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you'd call an API here
      if (isEditing) {
        // Get the original customer to preserve any fields we're not explicitly changing
        const originalCustomer = editCustomer.original || allCustomers.find(c => c.id === editCustomer.id);
        
        // Create updated customer with proper structure
        const updatedCustomer = {
          ...originalCustomer,
          email: editCustomer.email,
          first_name: editCustomer.first_name,
          last_name: editCustomer.last_name,
          // Update default_address if it exists, otherwise create it
          default_address: {
            ...(originalCustomer?.default_address || {}),
            first_name: editCustomer.first_name,
            last_name: editCustomer.last_name,
            company: editCustomer.company,
            address1: editCustomer.address1,
            address2: editCustomer.address2,
            city: editCustomer.city,
            country: editCustomer.country,
            country_code: editCustomer.country_code,
            province: editCustomer.province,
            province_code: editCustomer.province_code,
            zip: editCustomer.zip,
            phone: editCustomer.phone
          }
        };
        
        // Update customers array
        const updatedCustomers = allCustomers.map(c => 
          c.id === editCustomer.id ? updatedCustomer : c
        );
        setAllCustomers(updatedCustomers);
      } else {
        // Add new customer with proper structure including default_address
        const newCustomerId = Date.now();
        const newCustomer = { 
          id: newCustomerId,
          email: editCustomer.email,
          first_name: editCustomer.first_name,
          last_name: editCustomer.last_name,
          leadType: selectedLead !== "All Leads" ? selectedLead : "Request From Leads",
          // Create proper default_address structure
          default_address: {
            id: newCustomerId + 1, // Just to have a different ID
            customer_id: newCustomerId,
            first_name: editCustomer.first_name,
            last_name: editCustomer.last_name,
            company: editCustomer.company,
            address1: editCustomer.address1,
            address2: editCustomer.address2,
            city: editCustomer.city,
            country: editCustomer.country,
            country_code: editCustomer.country_code,
            province: editCustomer.province,
            province_code: editCustomer.province_code,
            zip: editCustomer.zip,
            phone: editCustomer.phone,
            default: true
          }
        };
        setAllCustomers([...allCustomers, newCustomer]);
      }
      
      // Close the modal if Bootstrap is available
      if (typeof bootstrap !== 'undefined') {
        const modalEl = document.getElementById('leadFormModal');
        // eslint-disable-next-line no-undef
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
    } catch (err) {
      console.error("Error saving customer:", err);
      setError(err.message || "Failed to save customer");
    }
  };

  // Function to render the selected component
  const renderLeadComponent = () => {
    switch (selectedLead) {
      case "Request From Leads":
        return <RequestFromLeads leads={currentCustomers} />;
      case "Order Padding Leads":
        return <OrderPaddingLeads leads={currentCustomers} />;
      case "Order Deliver Leads":
        return <OrderDeliverLeads leads={currentCustomers} />;
      case "Send Email Leads":
        return <SendEmailLeads leads={currentCustomers} />;
      case "All Leads":
        return (
          <div className="table-responsive">
            <table className="table table-hover align-middle leads-table" id="customerTable">
              <thead>
                <tr className="border-main">
                  <th>Name</th>
                  {/* <th>Company</th> */}
                  {/* <th>Address</th> */}
                  <th>Country</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers && currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => {
                    // Extract from default_address if available, otherwise use top-level data
                    const address = customer.default_address || {};
                    
                    // Use address fields if available, otherwise fallback to top-level fields
                    const firstName = address.first_name || customer.first_name || '';
                    const lastName = address.last_name || customer.last_name || '';
                    const company = address.company || customer.company || '';
                    const addressLine = address.address1 || customer.address1 || '';
                    const country = address.country || customer.country || '';
                    const province = address.province || customer.province || '';
                    const city = address.city || customer.city || '';
                    const phone = address.phone || customer.phone || '';
                    
                    return (
                    <tr key={customer.id}>
                      <td>{`${firstName} ${lastName} `}</td>
                      {/* <td>{company || "N/A"}</td> */}
                      {/* <td>{addressLine || "N/A"}</td> */}
                      <td>{country || "N/A"}</td>
                      <td>{province || "N/A"}</td>
                      <td>{city || "N/A"}</td>
                      <td>{customer.email || "N/A"}</td>
                      <td>{phone || "N/A"}</td>
                      <td>
                        <button 
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit({
                            id: customer.id,
                            first_name: firstName,
                            last_name: lastName,
                            company: company,
                            address1: addressLine,
                            country: country,
                            province: province,
                            city: city,
                            email: customer.email,
                            phone: phone,
                          })}
                        >
                          <i className="fa fa-pencil" />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <i className="fa fa-trash" />
                        </button>
                      </td>
                    </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No leads available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      default:
        return <div>Please select a lead type from the dropdown.</div>;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

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
                {selectedLead || "Select Lead Type"}
              </button>
              <ul className="dropdown-menu" aria-labelledby="leadsDropdown">
                <li>
                  <a
                    className="dropdown-item"
                    href="#!"
                    onClick={() => setSelectedLead("All Leads")}
                  >
                    All Leads
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#!"
                    onClick={() => setSelectedLead("Request From Leads")}
                  >
                    Request From Leads
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#!"
                    onClick={() => setSelectedLead("Order Padding Leads")}
                  >
                    Order Padding Leads
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#!"
                    onClick={() => setSelectedLead("Order Deliver Leads")}
                  >
                    Order Deliver Leads
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#!"
                    onClick={() => setSelectedLead("Send Email Leads")}
                  >
                    Send Email Leads
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleAdd}>
              <i className="fa fa-plus me-1"></i> Add Lead
            </button>
          </div>
        </div>

        {/* Render the selected lead component */}
        <div className="lead-content">{renderLeadComponent()}</div>

        {/* Pagination - only show if we have more than 1 page */}
        {totalPages > 1 && (
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              
              {/* Dynamic pagination with limited page buttons */}
              {(() => {
                let pages = [];
                
                // Always show first page
                if (totalPages > 0) {
                  pages.push(
                    <li key={1} className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                    </li>
                  );
                }
                
                // Add ellipsis if needed
                if (currentPage > 3) {
                  pages.push(
                    <li key="ellipsis1" className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                
                // Add pages around current page
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                  if (i <= totalPages - 1 && i >= 2) {
                    pages.push(
                      <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
                      </li>
                    );
                  }
                }
                
                // Add ellipsis if needed
                if (currentPage < totalPages - 2) {
                  pages.push(
                    <li key="ellipsis2" className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                
                // Always show last page
                if (totalPages > 1) {
                  pages.push(
                    <li key={totalPages} className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                    </li>
                  );
                }
                
                return pages;
              })()}
              
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
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
              <h5
                className="modal-title text-dark text-center"
                id="leadFormModalLabel"
              >
                {isEditing ? "Edit Lead" : "Add Lead"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {editCustomer && (
                <form onSubmit={handleSave}>
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.first_name || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            first_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.last_name || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            last_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-dark">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCustomer.company || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-dark">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCustomer.address1 || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          address1: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-dark">Address 2</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCustomer.address2 || ''}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          address2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.country || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            country: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">Country Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.country_code || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            country_code: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 mb-3">
                      <label className="form-label text-dark">State/Province</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.province || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            province: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-lg-3 mb-3">
                      <label className="form-label text-dark">Province Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.province_code || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            province_code: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-lg-3 mb-3">
                      <label className="form-label text-dark">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.city || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            city: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-lg-3 mb-3">
                      <label className="form-label text-dark">ZIP/Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editCustomer.zip || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            zip: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editCustomer.email || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label text-dark">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editCustomer.phone || ''}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isEditing ? "Update Lead" : "Add Lead"}
                    </button>
                  </div>
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