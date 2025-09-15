import React, { useState } from 'react';
import { postRequestOrders } from '../../Services/shopifyService';

const EditRequestFormModal = ({ order, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: order.first_name || '',
    last_name: order.last_name || '',
    email: order.email || '',
    phone: order.phone || '',
    address: order.address || '',
    state: order.state || '',
    team_organization: order.team_organization || '',
    custom_product: order.custom_product || '',
    sub_category_uniforms: order.sub_category_uniforms || '',
    sub_category_accessories: order.sub_category_accessories || '',
    quantity: order.quantity || '',
    required_color: order.required_color || '',
    expected_delivery_date: order.expected_delivery_date || '',
    product_mockup_details: order.product_mockup_details || '',
    additional_requests: order.additional_requests || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.custom_product.trim()) newErrors.custom_product = 'Custom product is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        id: order.id,
        full_name: `${formData.first_name} ${formData.last_name}`.trim()
      };
      
      await postRequestOrders(updatedData);
      onSave();
    } catch (error) {
      console.error('Error updating order:', error);
      setErrors({ submit: 'Failed to update order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show" id="editRequestFormModal" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="editRequestFormModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-dark text-light">
            <h5 className="modal-title" id="editRequestFormModalLabel">
              <i className="fas fa-edit me-2"></i>
              Edit Request Form Order
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close" disabled={loading}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.submit}
                </div>
              )}
              
              <div className="row g-4">
                {/* Customer Information Section */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-primary text-white">
                      <h6 className="card-title mb-0">
                        <i className="fas fa-user me-2"></i>
                        Customer Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">First Name *</label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                            placeholder="Enter first name"
                          />
                          {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Last Name *</label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                            placeholder="Enter last name"
                          />
                          {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="Enter email address"
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Phone *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            placeholder="Enter phone number"
                          />
                          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Address</label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control"
                            rows="2"
                            placeholder="Enter address"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter state"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization & Product Section */}
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-success text-white">
                      <h6 className="card-title mb-0">
                        <i className="fas fa-box me-2"></i>
                        Organization & Product
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-bold">Team/Organization</label>
                          <input
                            type="text"
                            name="team_organization"
                            value={formData.team_organization}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter team or organization name"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Custom Product *</label>
                          <select
                            name="custom_product"
                            value={formData.custom_product}
                            onChange={handleChange}
                            className={`form-select ${errors.custom_product ? 'is-invalid' : ''}`}
                          >
                            <option value="">Select Product Type</option>
                            <option value="Uniform">Uniform</option>
                            <option value="Appreal/Accessories">Apparel/Accessories</option>
                          </select>
                          {errors.custom_product && <div className="invalid-feedback">{errors.custom_product}</div>}
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Sub Category (Uniforms)</label>
                          <input
                            type="text"
                            name="sub_category_uniforms"
                            value={formData.sub_category_uniforms}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter uniform subcategory"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Sub Category (Accessories)</label>
                          <input
                            type="text"
                            name="sub_category_accessories"
                            value={formData.sub_category_accessories}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter accessories subcategory"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Quantity *</label>
                          <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                            placeholder="Enter quantity"
                          />
                          {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Expected Delivery Date</label>
                          <input
                            type="date"
                            name="expected_delivery_date"
                            value={formData.expected_delivery_date}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Required Color</label>
                          <input
                            type="text"
                            name="required_color"
                            value={formData.required_color}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter required color"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-info text-white">
                      <h6 className="card-title mb-0">
                        <i className="fas fa-clipboard me-2"></i>
                        Additional Details
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Product Mockup Details</label>
                          <textarea
                            name="product_mockup_details"
                            value={formData.product_mockup_details}
                            onChange={handleChange}
                            className="form-control"
                            rows="4"
                            placeholder="Enter product mockup details"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Additional Requests</label>
                          <textarea
                            name="additional_requests"
                            value={formData.additional_requests}
                            onChange={handleChange}
                            className="form-control"
                            rows="4"
                            placeholder="Enter any additional requests"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer bg-light">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                <i className="fas fa-times me-1"></i> Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-warning"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-1"></i> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRequestFormModal;