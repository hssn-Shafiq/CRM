import React, { useState } from 'react';
import { exportToExcel } from '../../utils/excelExport';
import * as XLSX from 'xlsx';

const ExportModal = ({ data, activeTab }) => {
  const [exportOptions, setExportOptions] = useState({
    includeContact: true,
    includeAddress: true,
    includeLeadInfo: true,
    includeMetadata: false,
    includeNotes: false,
    exportAll: true,
    exportCurrentPage: false,
    exportSelected: false
  });

  const [filename, setFilename] = useState(`${activeTab === 'shopify' ? 'Shopify' : 'Custom'}-Leads-${new Date().toISOString().slice(0, 10)}`);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle radio buttons differently
    if (name.startsWith('export')) {
      const exportOptions = {
        exportAll: false,
        exportCurrentPage: false,
        exportSelected: false
      };
      
      exportOptions[name] = true;
      setExportOptions(prev => ({ ...prev, ...exportOptions }));
      return;
    }
    
    // Handle checkboxes and text inputs
    setExportOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleExport = () => {
    // Prepare the data based on options
    const prepareData = (customers) => {
      return customers.map(customer => {
        const address = customer.default_address || {};
        const result = {};
        
        // Contact information
        if (exportOptions.includeContact) {
          result['First Name'] = address.first_name || customer.first_name || '';
          result['Last Name'] = address.last_name || customer.last_name || '';
          result['Email'] = customer.email || '';
          result['Phone'] = address.phone || customer.phone || '';
          result['Company'] = address.company || customer.company || '';
        }
        
        // Address information
        if (exportOptions.includeAddress) {
          result['Address 1'] = address.address1 || '';
          result['Address 2'] = address.address2 || '';
          result['City'] = address.city || '';
          result['Province/State'] = address.province || '';
          result['Country'] = address.country || '';
          result['Postal Code'] = address.zip || '';
        }
        
        // Lead information
        if (exportOptions.includeLeadInfo) {
          result['Lead Type'] = customer.leadType || '';
          result['Source'] = customer.source || '';
        }
        
        // Metadata
        if (exportOptions.includeMetadata) {
          result['Customer ID'] = customer.id || '';
          result['Created At'] = customer.createdAt ? new Date(customer.createdAt).toLocaleString() : '';
          result['Updated At'] = customer.updatedAt ? new Date(customer.updatedAt).toLocaleString() : '';
          if (customer.importSource) {
            result['Import Source'] = customer.importSource;
            result['Import Date'] = customer.importDate ? new Date(customer.importDate).toLocaleString() : '';
          }
        }
        
        // Notes
        if (exportOptions.includeNotes) {
          result['Notes'] = customer.notes || '';
        }
        
        return result;
      });
    };
    
    // Export the data
    const exportData = prepareData(data);
    
    // Create worksheet from the prepared data
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    
    // Generate and download file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    // Close the modal
    if (typeof bootstrap !== 'undefined') {
      const modalElement = document.getElementById('exportModal');
      // eslint-disable-next-line no-undef
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  };

  return (
    <div className="modal fade" id="exportModal" tabIndex="-1" aria-labelledby="exportModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exportModalLabel">Export {activeTab === 'shopify' ? 'Shopify' : 'Custom'} Leads</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="filename" className="form-label">Filename</label>
              <input
                type="text"
                className="form-control"
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Include Data:</label>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="includeContact"
                  name="includeContact"
                  checked={exportOptions.includeContact}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="includeContact">Contact Information</label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="includeAddress"
                  name="includeAddress"
                  checked={exportOptions.includeAddress}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="includeAddress">Address Information</label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="includeLeadInfo"
                  name="includeLeadInfo"
                  checked={exportOptions.includeLeadInfo}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="includeLeadInfo">Lead Information</label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="includeMetadata"
                  name="includeMetadata"
                  checked={exportOptions.includeMetadata}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="includeMetadata">Metadata (ID, dates, etc.)</label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="includeNotes"
                  name="includeNotes"
                  checked={exportOptions.includeNotes}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="includeNotes">Notes</label>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Export Options:</label>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="exportAll"
                  name="exportAll"
                  checked={exportOptions.exportAll}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="exportAll">
                  Export all leads ({data.length})
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleExport}>
              <i className="fa fa-download me-1"></i> Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;