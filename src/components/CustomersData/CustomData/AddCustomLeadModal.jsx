import React, { useState } from 'react';
// import { addCustomLead } from '../../Services/firebaseService';
import { addCustomLead } from '../../../Services/firebaseService';
const AddCustomLeadModal = ({ onLeadAdded }) => {
  const [lead, setLead] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    country: '',
    province: '',
    zip: '',
    leadType: 'Custom Lead'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the lead data with proper structure
      const leadData = {
        ...lead,
        default_address: {
          first_name: lead.first_name,
          last_name: lead.last_name,
          company: lead.company,
          address1: lead.address1,
          address2: lead.address2,
          city: lead.city,
          country: lead.country,
          province: lead.province,
          zip: lead.zip,
          phone: lead.phone
        }
      };

      // Save to Firebase
      const savedLead = await addCustomLead(leadData);
      
      // Call the callback
      if (onLeadAdded) {
        onLeadAdded(savedLead);
      }
      
      // Close the modal
      if (typeof bootstrap !== 'undefined') {
        const modalElement = document.getElementById('addCustomLeadModal');
        // eslint-disable-next-line no-undef
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
      
      // Reset the form
      setLead({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        country: '',
        province: '',
        zip: '',
        leadType: 'Custom Lead'
      });
    } catch (err) {
      setError(err.message || 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" id="addCustomLeadModal" tabIndex="-1" aria-labelledby="addCustomLeadModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addCustomLeadModalLabel">Add New Lead</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="first_name" className="form-label">First Name*</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="first_name" 
                    name="first_name"
                    value={lead.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="last_name" className="form-label">Last Name*</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="last_name" 
                    name="last_name"
                    value={lead.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    name="email"
                    value={lead.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    id="phone" 
                    name="phone"
                    value={lead.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="company" className="form-label">Company</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="company" 
                  name="company"
                  value={lead.company}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="leadType" className="form-label">Lead Type</label>
                <select 
                  className="form-select" 
                  id="leadType" 
                  name="leadType"
                  value={lead.leadType}
                  onChange={handleChange}
                >
                  <option value="Custom Lead">Custom Lead</option>
                  <option value="Request From Leads">Request From Leads</option>
                  <option value="Order Padding Leads">Order Padding Leads</option>
                  <option value="Order Deliver Leads">Order Deliver Leads</option>
                  <option value="Send Email Leads">Send Email Leads</option>
                </select>
              </div>
              
              <h6 className="mt-4">Address Details</h6>
              <hr />
              
              <div className="mb-3">
                <label htmlFor="address1" className="form-label">Address Line 1</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="address1" 
                  name="address1"
                  value={lead.address1}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="address2" className="form-label">Address Line 2</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="address2" 
                  name="address2"
                  value={lead.address2}
                  onChange={handleChange}
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label">City</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="city" 
                    name="city"
                    value={lead.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="province" className="form-label">Province/State</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="province" 
                    name="province"
                    value={lead.province}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="country" className="form-label">Country</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="country" 
                    name="country"
                    value={lead.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="zip" className="form-label">ZIP/Postal Code</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="zip" 
                    name="zip"
                    value={lead.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="modal-footer px-0 pb-0">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomLeadModal;