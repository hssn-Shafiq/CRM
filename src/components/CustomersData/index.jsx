// src/Components/CustomerData.jsx
import React, { useState, useEffect } from 'react';
import RequestFromLeads from '../Leads/RequestFromLeads';
import OrderPaddingLeads from '../Leads/OrderPaddingLeads';
import OrderDeliverLeads from '../Leads/OrderDeliverLeads';
import SendEmailLeads from '../Leads/SendEmailLeads';
import { fetchCustomers } from '../../Services/shopifyService'; // Updated fetch function
import Loader from '../Loader';


const CustomerData = () => {


  const [customers, setCustomers] = useState([]); // State to store fetched customer data
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [editCustomer, setEditCustomer] = useState(null); // For editing customer data
  const [isEditing, setIsEditing] = useState(false); // For modal add/edit mode
  const customersPerPage = 10; // Show 10 rows per page

  // Set default value for selectedLead state to "All Leads"
  const [selectedLead, setSelectedLead] = useState('All Leads'); // State for currently selected lead type

  // Fetch customer data from the API on component mount
  useEffect(() => {
    const getCustomers = async () => {
      setLoading(true);
      try {
        const customerData = await fetchCustomers();
        setCustomers(customerData); // Set fetched customer data
      } catch (err) {
        setError(err.message || 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };
    getCustomers();
  }, []);


  // Pagination calculations
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // Function to handle delete (Remove a customer)
  const handleDelete = (id) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
  };

  // Function to filter leads based on the selected type
  const filterLeadsByType = () => {
    if (selectedLead === 'All Leads') {
      return currentCustomers; // Show all customers
    }
    return currentCustomers.filter((customer) => customer.leadType === selectedLead);
  };

  // Function to render the selected component
  const renderLeadComponent = () => {
    const leadData = filterLeadsByType();
    switch (selectedLead) {
      case 'Request From Leads':
        return <RequestFromLeads leads={leadData} />;
      case 'Order Padding Leads':
        return <OrderPaddingLeads leads={leadData} />;
      case 'Order Deliver Leads':
        return <OrderDeliverLeads leads={leadData} />;
      case 'Send Email Leads':
        return <SendEmailLeads leads={leadData} />;
      case 'All Leads':
        return (
          <div className="table-responsive">
            <table className="table table-hover align-middle leads-table" id='customerTable'>
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
                {leadData.length > 0 ? (
                  leadData.map(({ id, first_name, last_name, company, address1, country, province, city, email, phone }) => (
                    <tr key={id}>
                      <td>{`${first_name} ${last_name}`}</td>
                      <td>{company || 'No company'}</td>
                      <td>{address1 || 'No address'}</td>
                      <td>{country || 'No country'}</td>
                      <td>{province || 'No state'}</td>
                      <td>{city || 'No city'}</td>
                      <td>{email}</td>
                      <td>{phone || 'No phone'}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2">
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
    return <div className="text-danger">{error}</div>;
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
                {selectedLead || 'Select Lead Type'}
              </button>
              <ul className="dropdown-menu" aria-labelledby="leadsDropdown">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => setSelectedLead('All Leads')}
                  >
                    All Leads
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => setSelectedLead('Request From Leads')}
                  >
                    Request From Leads
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => setSelectedLead('Order Padding Leads')}
                  >
                    Order Padding Leads
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => setSelectedLead('Order Deliver Leads')}
                  >
                    Order Deliver Leads
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => setSelectedLead('Send Email Leads')}
                  >
                    Send Email Leads
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Render the selected lead component */}
        <div className="lead-content">
          {renderLeadComponent()}
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 && 'active'}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
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
                <form >
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
