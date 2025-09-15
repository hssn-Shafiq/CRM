import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const RequestFormExportModal = ({ data, onClose, filename = 'request-form-orders' }) => {
  const [selectedFormat, setSelectedFormat] = useState('xlsx');
  const [selectedFields, setSelectedFields] = useState({
    full_name: true,
    email: true,
    phone: true,
    team_organization: true,
    custom_product: true,
    quantity: true,
    required_color: true,
    expected_delivery_date: true,
    state: true,
    address: true,
    sub_category_uniforms: true,
    sub_category_accessories: true,
    product_mockup_details: true,
    additional_requests: true,
    created_at: true
  });
  const [exporting, setExporting] = useState(false);

  const fieldLabels = {
    full_name: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    team_organization: 'Team/Organization',
    custom_product: 'Custom Product',
    quantity: 'Quantity',
    required_color: 'Required Color',
    expected_delivery_date: 'Expected Delivery Date',
    state: 'State',
    address: 'Address',
    sub_category_uniforms: 'Sub Category Uniforms',
    sub_category_accessories: 'Sub Category Accessories',
    product_mockup_details: 'Product Mockup Details',
    additional_requests: 'Additional Requests',
    created_at: 'Created Date'
  };

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const selectAllFields = () => {
    const allSelected = Object.values(selectedFields).every(selected => selected);
    const newState = {};
    Object.keys(selectedFields).forEach(field => {
      newState[field] = !allSelected;
    });
    setSelectedFields(newState);
  };

  const formatDataForExport = () => {
    const selectedFieldKeys = Object.keys(selectedFields).filter(field => selectedFields[field]);
    
    return data.map(item => {
      const exportItem = {};
      selectedFieldKeys.forEach(field => {
        const label = fieldLabels[field];
        let value = item[field];
        
        // Format specific fields
        if (field === 'created_at' || field === 'expected_delivery_date') {
          value = value ? new Date(value).toLocaleDateString() : '';
        } else if (field === 'quantity') {
          value = value || 0;
        }
        
        exportItem[label] = value || '';
      });
      return exportItem;
    });
  };

  const handleExport = async () => {
    setExporting(true);
    
    try {
      const exportData = formatDataForExport();
      const timestamp = new Date().toISOString().split('T')[0];
      const finalFilename = `${filename}_${timestamp}`;

      if (selectedFormat === 'xlsx') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Request Form Orders');
        XLSX.writeFile(wb, `${finalFilename}.xlsx`);
      } else if (selectedFormat === 'csv') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${finalFilename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (selectedFormat === 'json') {
        const jsonData = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${finalFilename}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const selectedFieldCount = Object.values(selectedFields).filter(Boolean).length;

  return (
    <div className="export-modal-overlay">
      <div className="export-modal-content">
        <div className="export-modal-header">
          <h5 className="export-modal-title">
            <i className="fas fa-download me-2"></i>
            Export Request Form Orders
          </h5>
          <button type="button" className="export-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="export-modal-body">
          <div className="export-info">
            <p>Export {data.length} request form orders to your preferred format.</p>
          </div>

          <div className="export-format-section">
            <h6>Export Format</h6>
            <div className="format-options">
              <label className="format-option">
                <input
                  type="radio"
                  name="format"
                  value="xlsx"
                  checked={selectedFormat === 'xlsx'}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                />
                <span className="format-label">
                  <i className="fas fa-file-excel text-success me-2"></i>
                  Excel (.xlsx)
                </span>
              </label>
              <label className="format-option">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={selectedFormat === 'csv'}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                />
                <span className="format-label">
                  <i className="fas fa-file-csv text-info me-2"></i>
                  CSV (.csv)
                </span>
              </label>
              <label className="format-option">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={selectedFormat === 'json'}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                />
                <span className="format-label">
                  <i className="fas fa-file-code text-warning me-2"></i>
                  JSON (.json)
                </span>
              </label>
            </div>
          </div>

          <div className="export-fields-section">
            <div className="fields-header">
              <h6>Select Fields to Export</h6>
              <button
                type="button"
                onClick={selectAllFields}
                className="select-all-btn"
              >
                {Object.values(selectedFields).every(selected => selected) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="fields-grid">
              {Object.entries(fieldLabels).map(([field, label]) => (
                <label key={field} className="field-option">
                  <input
                    type="checkbox"
                    checked={selectedFields[field]}
                    onChange={() => handleFieldToggle(field)}
                  />
                  <span className="field-label">{label}</span>
                </label>
              ))}
            </div>
            
            <div className="selected-count">
              {selectedFieldCount} field{selectedFieldCount !== 1 ? 's' : ''} selected
            </div>
          </div>
        </div>

        <div className="export-modal-footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
            disabled={exporting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExport}
            disabled={exporting || selectedFieldCount === 0}
          >
            {exporting ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Exporting...
              </>
            ) : (
              <>
                <i className="fas fa-download me-2"></i>
                Export {data.length} Records
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestFormExportModal;