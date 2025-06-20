import React from 'react';

const BulkDeleteModal = ({ selectedCount, onConfirm, isDeleting }) => {
  return (
    <div className="modal fade" id="bulkDeleteModal" tabIndex="-1" aria-labelledby="bulkDeleteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="bulkDeleteModalLabel">Confirm Bulk Delete</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-danger">
              <i className="fa fa-exclamation-triangle me-2"></i>
              Warning! This action cannot be undone.
            </div>
            <p>
              Are you sure you want to delete the <strong>{selectedCount}</strong> selected lead{selectedCount !== 1 ? 's' : ''}?
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fa fa-trash me-1"></i> Delete Selected
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteModal;