import React from 'react';

const ViewCustomerModal = ({ customer }) => {
  if (!customer) return null;
  
  const address = customer.default_address || {};
  
  // Merge data from both customer and address
  const customerData = {
    first_name: address.first_name || customer.first_name || '',
    last_name: address.last_name || customer.last_name || '',
    email: customer.email || '',
    phone: address.phone || customer.phone || '',
    company: address.company || customer.company || '',
    address1: address.address1 || customer.address1 || '',
    address2: address.address2 || customer.address2 || '',
    city: address.city || customer.city || '',
    province: address.province || customer.province || '',
    country: address.country || customer.country || '',
    zip: address.zip || customer.zip || '',
  };

  return (
    <div
      className="modal fade"
      id="viewCustomerModal"
      tabIndex={-1}
      aria-labelledby="viewCustomerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <h5 className="modal-title" id="viewCustomerModalLabel">
              Customer Details
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            {/* Customer Profile Card */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="customer-avatar bg-primary text-white me-3">
                    {customerData.first_name.charAt(0)}{customerData.last_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="mb-1">{`${customerData.first_name} ${customerData.last_name}`}</h3>
                    {customerData.company && (
                      <div className="text-muted mb-1">
                        <i className="fa fa-building me-2"></i>
                        {customerData.company}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-uppercase text-muted mb-2">Contact</h6>
                    <div className="d-flex align-items-center mb-2">
                      <i className="fa fa-envelope me-2 text-primary"></i>
                      {customerData.email || "No email provided"}
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fa fa-phone me-2 text-primary"></i>
                      {customerData.phone || "No phone provided"}
                    </div>
                  </div>
                  
                  {/* Address Information */}
                  <div className="col-md-6">
                    <h6 className="text-uppercase text-muted mb-2">Location</h6>
                    <div className="d-flex align-items-center mb-2">
                      <i className="fa fa-map-marker me-2 text-primary"></i>
                      <div>
                        {customerData.address1 && <div>{customerData.address1}</div>}
                        {customerData.address2 && <div>{customerData.address2}</div>}
                        {customerData.city && customerData.province && (
                          <div>
                            {customerData.city}, {customerData.province} {customerData.zip}
                          </div>
                        )}
                        {customerData.country && <div>{customerData.country}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detailed Information Table */}
            <h6 className="text-uppercase text-muted mb-3">Additional Details</h6>
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">Customer ID</th>
                  <td>{customer.id}</td>
                </tr>
                <tr>
                  <th scope="row">First Name</th>
                  <td>{customerData.first_name}</td>
                </tr>
                <tr>
                  <th scope="row">Last Name</th>
                  <td>{customerData.last_name}</td>
                </tr>
                <tr>
                  <th scope="row">Email</th>
                  <td>{customerData.email}</td>
                </tr>
                <tr>
                  <th scope="row">Phone</th>
                  <td>{customerData.phone}</td>
                </tr>
                <tr>
                  <th scope="row">Company</th>
                  <td>{customerData.company || "N/A"}</td>
                </tr>
                <tr>
                  <th scope="row">Address Line 1</th>
                  <td>{customerData.address1}</td>
                </tr>
                <tr>
                  <th scope="row">Address Line 2</th>
                  <td>{customerData.address2 || "N/A"}</td>
                </tr>
                <tr>
                  <th scope="row">City</th>
                  <td>{customerData.city}</td>
                </tr>
                <tr>
                  <th scope="row">State/Province</th>
                  <td>{customerData.province}</td>
                </tr>
                <tr>
                  <th scope="row">Postal/ZIP Code</th>
                  <td>{customerData.zip || "N/A"}</td>
                </tr>
                <tr>
                  <th scope="row">Country</th>
                  <td>{customerData.country}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerModal;