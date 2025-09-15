import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './requestorder.css';

const ImportModal = ({ onClose, onImport }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Instructions, 2: File Selection, 3: Data Preview, 4: Import Progress
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    currentBatch: 0,
    totalBatches: 0,
    status: '',
    errors: [],
    success: 0,
    failed: 0
  });

  // API pagination settings - adjust based on your API limits
  const BATCH_SIZE = 15; // Match your API's per_page limit
  const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay between batches

  const requiredColumns = [
    'Page',
    'Account', 
    'First Name:',
    'Last Name:',
    'Address:',
    'Email:',
    'Phone:',
    'Team/Organization Name:',
    'Your State:',
    'Choose Custom Product:',
    'Sub Category Uniforms:',
    'Sub Category Accessories:',
    'Enter Quantity:',
    'Your Required Color:',
    'Expected Delivery Date:',
    'Product Mockup details:',
    'Upload high quality Logo:',
    'Additional Requests:'
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid Excel (.xlsx, .xls) or CSV file');
      return;
    }

    setSelectedFile(file);
    setError('');
    processFile(file);
  };

  const processFile = (file) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          setError('File must contain at least a header row and one data row');
          setLoading(false);
          return;
        }

        const headers = jsonData[0];
        const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== ''));

        // Validate required columns
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          setLoading(false);
          return;
        }

        // Transform data to match API format
        const transformedData = rows.map((row, index) => {
          const rowData = {};
          headers.forEach((header, headerIndex) => {
            rowData[header] = row[headerIndex] || '';
          });

          return {
            id: index + 1, // Temporary ID for preview
            first_name: rowData['First Name:'] || '',
            last_name: rowData['Last Name:'] || '',
            full_name: `${rowData['First Name:'] || ''} ${rowData['Last Name:'] || ''}`.trim(),
            address: rowData['Address:'] || '',
            email: rowData['Email:'] || '',
            phone: rowData['Phone:'] || '',
            account: rowData['Account'] || '',
            page: rowData['Page'] || '',
            team_organization: rowData['Team/Organization Name:'] || '',
            state: rowData['Your State:'] || '',
            custom_product: rowData['Choose Custom Product:'] || '',
            sub_category_uniforms: rowData['Sub Category Uniforms:'] || '',
            sub_category_accessories: rowData['Sub Category Accessories:'] || '',
            quantity: parseInt(rowData['Enter Quantity:']) || 0,
            required_color: rowData['Your Required Color:'] || '',
            expected_delivery_date: formatDate(rowData['Expected Delivery Date:']),
            product_mockup_details: rowData['Product Mockup details:'] || '',
            logo_path: rowData['Upload high quality Logo:'] || '',
            additional_requests: rowData['Additional Requests:'] || '',
            originalRow: index + 2 // For error reporting
          };
        });

        setPreviewData(transformedData);
        setCurrentStep(3);
        setLoading(false);
      } catch (err) {
        setError('Error reading file. Please ensure it\'s a valid Excel or CSV file.');
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    
    // Handle Excel date numbers
    if (typeof dateValue === 'number') {
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
    
    return dateValue;
  };

  const validateData = () => {
    const errors = [];
    previewData.forEach((row, index) => {
      if (!row.first_name) errors.push(`Row ${row.originalRow}: First Name is required`);
      if (!row.last_name) errors.push(`Row ${row.originalRow}: Last Name is required`);
      if (!row.email) errors.push(`Row ${row.originalRow}: Email is required`);
      if (!row.phone) errors.push(`Row ${row.originalRow}: Phone is required`);
      if (!row.custom_product) errors.push(`Row ${row.originalRow}: Custom Product is required`);
      if (!row.quantity || row.quantity <= 0) errors.push(`Row ${row.originalRow}: Valid quantity is required`);
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (row.email && !emailRegex.test(row.email)) {
        errors.push(`Row ${row.originalRow}: Invalid email format`);
      }
    });

    return errors;
  };

  // Create batches for processing
  const createBatches = (data, batchSize) => {
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  };

  // Process a single batch
// ...existing code...

  // Process a single batch
  const processBatch = async (batch, batchIndex, totalBatches) => {
    try {
      setImportProgress(prev => ({
        ...prev,
        currentBatch: batchIndex + 1,
        status: `Processing batch ${batchIndex + 1} of ${totalBatches}...`
      }));

      // Remove temporary fields before sending to API
      const cleanedBatch = batch.map(({ id, originalRow, ...item }) => {
        // Ensure all required fields are present and properly formatted
        return {
          first_name: item.first_name || '',
          last_name: item.last_name || '',
          full_name: item.full_name || `${item.first_name || ''} ${item.last_name || ''}`.trim(),
          address: item.address || '',
          email: item.email || '',
          phone: item.phone || '',
          account: item.account || '',
          page: item.page || '',
          team_organization: item.team_organization || '',
          state: item.state || '',
          custom_product: item.custom_product || '',
          sub_category_uniforms: item.sub_category_uniforms || '',
          sub_category_accessories: item.sub_category_accessories || '',
          quantity: parseInt(item.quantity) || 0,
          required_color: item.required_color || '',
          expected_delivery_date: item.expected_delivery_date || '',
          product_mockup_details: item.product_mockup_details || '',
          logo_path: item.logo_path || '',
          additional_requests: item.additional_requests || ''
        };
      });

      console.log('Sending batch to API:', cleanedBatch);

      // Call the import function passed from parent
      await onImport(cleanedBatch, batchIndex + 1, totalBatches);

      // Update progress for successful batch
      setImportProgress(prev => ({
        ...prev,
        current: prev.current + batch.length,
        success: prev.success + batch.length,
        status: `Batch ${batchIndex + 1} completed successfully`
      }));

      return { success: true, count: batch.length };
    } catch (error) {
      console.error(`Batch ${batchIndex + 1} failed:`, error);
      
      // Update progress for failed batch with detailed error
      const errorMessage = `Batch ${batchIndex + 1}: ${error.message || 'Import failed'}`;
      setImportProgress(prev => ({
        ...prev,
        current: prev.current + batch.length,
        failed: prev.failed + batch.length,
        errors: [...prev.errors, errorMessage],
        status: `Batch ${batchIndex + 1} failed: ${error.message || 'Unknown error'}`
      }));

      return { success: false, error: errorMessage, count: batch.length };
    }
  };


  // Main import handler with pagination
  const handleImport = async () => {
    const validationErrors = validateData();
    if (validationErrors.length > 0) {
      setError(`Validation errors:\n${validationErrors.slice(0, 10).join('\n')}${validationErrors.length > 10 ? '\n... and more' : ''}`);
      return;
    }

    setImporting(true);
    setCurrentStep(4);
    
    // Create batches
    const batches = createBatches(previewData, BATCH_SIZE);
    const totalBatches = batches.length;

    // Initialize progress
    setImportProgress({
      current: 0,
      total: previewData.length,
      currentBatch: 0,
      totalBatches: totalBatches,
      status: 'Starting import...',
      errors: [],
      success: 0,
      failed: 0
    });

    try {
      // Process batches sequentially
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        await processBatch(batch, i, totalBatches);

        // Add delay between batches to avoid overwhelming the API
        if (i < batches.length - 1) {
          setImportProgress(prev => ({
            ...prev,
            status: `Waiting before next batch... (${DELAY_BETWEEN_BATCHES/1000}s)`
          }));
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }

      // Final status update
      setImportProgress(prev => ({
        ...prev,
        status: prev.failed > 0 
          ? `Import completed with ${prev.success} successful and ${prev.failed} failed records`
          : `Import completed successfully! ${prev.success} records imported.`
      }));

    } catch (error) {
      setImportProgress(prev => ({
        ...prev,
        status: 'Import failed due to an unexpected error',
        errors: [...prev.errors, error.message]
      }));
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      requiredColumns,
      [
        'Order Form – AthleticForce1',
        '',
        'John',
        'Doe',
        '123 Main St',
        'john.doe@example.com',
        '1234567890',
        'Sample Team',
        'California',
        'Uniform',
        'Basketball',
        '',
        '10',
        'Blue/White',
        '2025-12-01',
        'Sample mockup details',
        'https://example.com/logo.png',
        'Sample additional requests'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RequestForm Template');
    XLSX.writeFile(wb, 'RequestForm_Orders_Template.xlsx');
  };

  const handleCloseModal = () => {
    if (importing) {
      const confirmClose = window.confirm('Import is in progress. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <div className="import-modal-overlay">
      <div className="import-modal-content">
        <div className="import-modal-header">
          <h5 className="import-modal-title">
            <i className="fas fa-file-import me-2"></i>
            Import Request Form Orders
          </h5>
          <button 
            type="button" 
            className="import-close-btn" 
            onClick={handleCloseModal}
            disabled={importing}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="import-modal-body">
          {/* Step 1: Instructions */}
          {currentStep === 1 && (
            <div className="import-step">
              <div className="import-instructions">
                <div className="instruction-header">
                  <i className="fas fa-info-circle text-primary me-2"></i>
                  <h6>Import Instructions</h6>
                </div>

                <div className="instruction-content">
                  <div className="alert alert-info">
                    <h6><i className="fas fa-lightbulb me-2"></i>Before You Start:</h6>
                    <ul className="mb-0">
                      <li>Prepare your Excel (.xlsx, .xls) or CSV file</li>
                      <li>Ensure all required columns are present</li>
                      <li>Check data format matches the requirements</li>
                      <li>Large files will be processed in batches of {BATCH_SIZE} records</li>
                    </ul>
                  </div>

                  <div className="required-columns">
                    <h6><i className="fas fa-list me-2"></i>Required Columns:</h6>
                    <div className="columns-grid">
                      {requiredColumns.map((column, index) => (
                        <div key={index} className="column-item">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {column}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="format-requirements">
                    <h6><i className="fas fa-exclamation-triangle text-warning me-2"></i>Format Requirements:</h6>
                    <ul>
                      <li><strong>Date Format:</strong> YYYY-MM-DD or MM/DD/YYYY</li>
                      <li><strong>Quantity:</strong> Must be a positive number</li>
                      <li><strong>Email:</strong> Must be a valid email address</li>
                      <li><strong>Custom Product:</strong> Either "Uniform" or "Appreal/Accessories"</li>
                      <li><strong>Batch Processing:</strong> Data will be imported in batches to ensure reliability</li>
                    </ul>
                  </div>

                  <div className="template-download">
                    <button 
                      type="button" 
                      className="btn btn-outline-primary"
                      onClick={downloadTemplate}
                    >
                      <i className="fas fa-download me-2"></i>
                      Download Template
                    </button>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(2)}
                >
                  Continue to File Selection
                  <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: File Selection */}
          {currentStep === 2 && (
            <div className="import-step">
              <div className="file-upload-area">
                <div className="upload-header">
                  <i className="fas fa-cloud-upload-alt text-primary"></i>
                  <h6>Select Your File</h6>
                  <p>Choose an Excel (.xlsx, .xls) or CSV file to import</p>
                </div>

                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="importFile"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  <label htmlFor="importFile" className="file-input-label">
                    <i className="fas fa-folder-open me-2"></i>
                    {selectedFile ? selectedFile.name : 'Choose File'}
                  </label>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {loading && (
                  <div className="loading-spinner">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Processing file...</p>
                  </div>
                )}
              </div>

              <div className="step-actions">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setCurrentStep(1)}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Data Preview */}
          {currentStep === 3 && (
            <div className="import-step">
              <div className="preview-header">
                <h6>
                  <i className="fas fa-eye me-2"></i>
                  Data Preview ({previewData.length} records)
                </h6>
                <p>
                  Review the data before importing. 
                  {previewData.length > BATCH_SIZE && (
                    <span className="text-info">
                      {' '}Data will be processed in {Math.ceil(previewData.length / BATCH_SIZE)} batches of {BATCH_SIZE} records each.
                    </span>
                  )}
                </p>
              </div>

              {error && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{error}</pre>
                </div>
              )}

              <div className="preview-table-container table-responsive">
                <table className="table-dark table table-hover preview-table">
                  <thead>
                    <tr className='border-main text-center'>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Team/Org</th>
                      <th>State</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Color</th>
                      <th>Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 50).map((row, index) => (
                      <tr key={index}>
                        <td>{row.full_name}</td>
                        <td>{row.email}</td>
                        <td>{row.phone}</td>
                        <td>{row.team_organization}</td>
                        <td>{row.state}</td>
                        <td>
                          <span className={`badge ${row.custom_product?.toLowerCase() === 'uniform' ? 'bg-info' : 'bg-purple'}`}>
                            {row.custom_product}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success">{row.quantity}</span>
                        </td>
                        <td>{row.required_color}</td>
                        <td>{row.expected_delivery_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 50 && (
                  <div className="preview-note">
                    <small className="text-muted">
                      Showing first 50 records. All {previewData.length} records will be imported.
                    </small>
                  </div>
                )}
              </div>

              <div className="step-actions">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setCurrentStep(2)}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={handleImport}
                  disabled={previewData.length === 0}
                >
                  <i className="fas fa-upload me-2"></i>
                  Import {previewData.length} Records
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Import Progress */}
          {currentStep === 4 && (
            <div className="import-step">
              <div className="import-progress">
                <div className="progress-header">
                  <h6>
                    <i className="fas fa-cog fa-spin me-2"></i>
                    Importing Data
                  </h6>
                  <p>{importProgress.status}</p>
                </div>

                <div className="progress-details">
                  <div className="progress-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Records:</span>
                      <span className="stat-value">{importProgress.total}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Processed:</span>
                      <span className="stat-value">{importProgress.current}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Success:</span>
                      <span className="stat-value text-success">{importProgress.success}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Failed:</span>
                      <span className="stat-value text-danger">{importProgress.failed}</span>
                    </div>
                  </div>

                  <div className="progress-bars">
                    <div className="progress-item">
                      <label>Overall Progress</label>
                      <div className="progress">
                        <div 
                          className="progress-bar bg-primary" 
                          style={{width: `${(importProgress.current / importProgress.total) * 100}%`}}
                        >
                          {Math.round((importProgress.current / importProgress.total) * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className="progress-item">
                      <label>Batch Progress</label>
                      <div className="progress">
                        <div 
                          className="progress-bar bg-info" 
                          style={{width: `${(importProgress.currentBatch / importProgress.totalBatches) * 100}%`}}
                        >
                          {importProgress.currentBatch} / {importProgress.totalBatches}
                        </div>
                      </div>
                    </div>
                  </div>

                  {importProgress.errors.length > 0 && (
                    <div className="import-errors">
                      <h6 className="text-danger">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Errors ({importProgress.errors.length})
                      </h6>
                      <div className="error-list">
                        {importProgress.errors.slice(0, 10).map((error, index) => (
                          <div key={index} className="error-item">
                            <small>{error}</small>
                          </div>
                        ))}
                        {importProgress.errors.length > 10 && (
                          <div className="error-item">
                            <small>... and {importProgress.errors.length - 10} more errors</small>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {!importing && (
                  <div className="step-actions">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleCloseModal}
                    >
                      <i className="fas fa-check me-2"></i>
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;