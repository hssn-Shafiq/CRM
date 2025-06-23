/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';

const EditCustomerModal = ({ customer, isEditing, onSave }) => {
  const [editedCustomer, setEditedCustomer] = useState({});

  // Update the form when the customer prop changes
  useEffect(() => {
    if (customer) {
      setEditedCustomer(customer);
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedCustomer);
    
    // Close modal
    if (typeof bootstrap !== 'undefined') {
      const modalEl = document.getElementById('editCustomerModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  if (!customer) return null;

  return (
    <div
      className="modal fade"
      id="editCustomerModal"
      tabIndex={-1}
      aria-labelledby="editCustomerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-dark" id="editCustomerModalLabel">
              {isEditing ? "Edit Customer" : "Add Customer"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-lg-6">
                  <label className="form-label text-dark">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    value={editedCustomer.first_name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label text-dark">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    value={editedCustomer.last_name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-lg-6">
                  <label className="form-label text-dark">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={editedCustomer.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label text-dark">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={editedCustomer.phone || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Company</label>
                <input
                  type="text"
                  name="company"
                  className="form-control"
                  value={editedCustomer.company || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Address Line 1</label>
                <input
                  type="text"
                  name="address1"
                  className="form-control"
                  value={editedCustomer.address1 || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Address Line 2</label>
                <input
                  type="text"
                  name="address2"
                  className="form-control"
                  value={editedCustomer.address2 || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="row mb-3">
                <div className="col-lg-6">
                  <label className="form-label text-dark">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    value={editedCustomer.country || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label text-dark">Country Code</label>
                  <input
                    type="text"
                    name="country_code"
                    className="form-control"
                    value={editedCustomer.country_code || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-lg-4">
                  <label className="form-label text-dark">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={editedCustomer.city || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label text-dark">State/Province</label>
                  <input
                    type="text"
                    name="province"
                    className="form-control"
                    value={editedCustomer.province || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label text-dark">ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="zip"
                    className="form-control"
                    value={editedCustomer.zip || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-lg-6">
                  <label className="form-label text-dark">Province Code</label>
                  <input
                    type="text"
                    name="province_code"
                    className="form-control"
                    value={editedCustomer.province_code || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update Customer" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;