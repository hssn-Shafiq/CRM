import React from 'react';

const BulkDeleteModal = ({ selectedCount, onConfirm, onCancel }) => {
  return (
    <div className="modal fade show" id="bulkDeleteModal" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="bulkDeleteModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="bulkDeleteModalLabel">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Confirm Bulk Delete
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel} aria-label="Close"></button>
          </div>
          
          <div className="modal-body text-center p-4">
            <div className="mb-4">
              <i className="fas fa-trash-alt text-danger" style={{ fontSize: '4rem' }}></i>
            </div>
            <h6 className="mb-3">Are you sure you want to delete the selected orders?</h6>
            <p className="mb-3">
              You are about to delete <strong className="text-danger">{selectedCount}</strong> selected request form order{selectedCount > 1 ? 's' : ''}.
            </p>
            <div className="alert alert-warning d-flex align-items-center" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <div>
                <strong>Warning:</strong> This action cannot be undone.
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <i className="fas fa-times me-1"></i> Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              <i className="fas fa-trash me-1"></i> Delete {selectedCount} Order{selectedCount > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteModal;