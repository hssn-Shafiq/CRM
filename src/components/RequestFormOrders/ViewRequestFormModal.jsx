import React from 'react';
import { FaDownload } from 'react-icons/fa';

const ViewRequestFormModal = ({ order, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const handleDownloadLogo = () => {
    if (order.logo_path) {
      window.open(order.logo_path, '_blank');
    }
  };

  return (
    <div className="modal fade show" id="viewRequestFormModal" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="viewRequestFormModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="viewRequestFormModalLabel">
              <i className="fas fa-eye me-2"></i>
              Request Form Order Details
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          
          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Customer Information */}
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <h6 className="card-title mb-0">
                      <i className="fas fa-user me-2 text-primary"></i>
                      Customer Information
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="fw-bold text-muted small">Full Name:</label>
                        <p className="mb-0">{order.full_name || '-'}</p>
                      </div>
                      <div className="col-12">
                        <label className="fw-bold text-muted small">Email:</label>
                        <p className="mb-0">
                          <a href={`mailto:${order.email}`} className="text-decoration-none">
                            {order.email || '-'}
                          </a>
                        </p>
                      </div>
                      <div className="col-12">
                        <label className="fw-bold text-muted small">Phone:</label>
                        <p className="mb-0">
                          <a href={`tel:${order.phone}`} className="text-decoration-none">
                            {order.phone || '-'}
                          </a>
                        </p>
                      </div>
                    
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization Details */}
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <h6 className="card-title mb-0">
                      <i className="fas fa-building me-2 text-success"></i>
                      Organization Details
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="fw-bold text-muted small">Team/Organization:</label>
                        <p className="mb-0">{order.team_organization || '-'}</p>
                      </div>
                       <div className="col-12">
                        <label className="fw-bold text-muted small">Address:</label>
                        <p className="mb-0">{order.address || '-'}</p>
                      </div>
                      <div className="col-12">
                        <label className="fw-bold text-muted small">State:</label>
                        <p className="mb-0">
                          <span className="badge bg-secondary">{order.state || '-'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <h6 className="card-title mb-0">
                      <i className="fas fa-box me-2 text-warning"></i>
                      Product Information
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="fw-bold text-muted small">Custom Product:</label>
                        <p className="mb-0">
                          <span className={`badge ${order.custom_product?.toLowerCase() === 'uniform' ? 'bg-info' : 'bg-purple'}`}>
                            {order.custom_product || '-'}
                          </span>
                        </p>
                      </div>
                      <div className="col-6">
                        <label className="fw-bold text-muted small">Sub Category (Uniforms):</label>
                        <p className="mb-0">{order.sub_category_uniforms || '-'}</p>
                      </div>
                      <div className="col-6">
                        <label className="fw-bold text-muted small">Sub Category (Accessories):</label>
                        <p className="mb-0">{order.sub_category_accessories || '-'}</p>
                      </div>
                      <div className="col-6">
                        <label className="fw-bold text-muted small">Quantity:</label>
                        <p className="mb-0">
                          <span className="badge bg-success fs-6">{order.quantity || '0'}</span>
                        </p>
                      </div>
                      <div className="col-6">
                        <label className="fw-bold text-muted small">Required Color:</label>
                        <p className="mb-0">{order.required_color || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery & Design */}
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <h6 className="card-title mb-0">
                      <i className="fas fa-truck me-2 text-info"></i>
                      Delivery & Design
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="fw-bold text-muted small">Expected Delivery Date:</label>
                        <p className="mb-0">
                          <span className="badge bg-primary">{formatDate(order.expected_delivery_date)}</span>
                        </p>
                      </div>
                      <div className="col-12">
                        <label className="fw-bold text-muted small">Product Mockup Details:</label>
                        <p className="mb-0">{order.product_mockup_details || '-'}</p>
                      </div>
                      <div className="col-12">
                        <label className="fw-bold text-muted small">Additional Requests:</label>
                        <p className="mb-0">{order.additional_requests || '-'}</p>
                      </div>
                      {order.logo_path && (
                        <div className="col-12">
                          <label className="fw-bold text-muted small">Logo:</label>
                          <div className="mt-2">
                            <img 
                              src={order.logo_path} 
                              alt="Order Logo" 
                              className="img-fluid rounded border"
                              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                            />
                            <div className="mt-2">
                              <button 
                                onClick={handleDownloadLogo}
                                className="btn btn-outline-primary btn-sm"
                              >
                                <FaDownload className="me-1" /> Download Logo
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <h6 className="card-title mb-0">
                      <i className="fas fa-clock me-2 text-danger"></i>
                      Order Timeline
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="fw-bold text-muted small">Created At:</label>
                        <p className="mb-0">
                          <span className="badge bg-success">{formatDate(order.created_at)}</span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold text-muted small">Updated At:</label>
                        <p className="mb-0">
                          <span className="badge bg-warning">{formatDate(order.updated_at)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <i className="fas fa-times me-1"></i> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRequestFormModal;