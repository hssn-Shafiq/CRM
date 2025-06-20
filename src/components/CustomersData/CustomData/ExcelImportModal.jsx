import React, { useState } from 'react';
import { uploadExcelAndProcess, addBulkCustomLeads } from '../../../Services/firebaseService';
import * as XLSX from 'xlsx';

const ExcelImportModal = ({ onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1 for upload, 2 for preview, 3 for mapping

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    
    if (selectedFile) {
      // Read the Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Remove empty rows
          const filteredData = jsonData.filter(row => row.some(cell => cell !== null && cell !== ''));
          
          // Extract headers and first few rows for preview
          const headers = filteredData[0];
          const previewRows = filteredData.slice(1, 6); // Show up to 5 rows in preview
          
          setPreview({ headers, previewRows });
          setStep(2);
        } catch (err) {
          setError('Error parsing Excel file. Please make sure it is a valid Excel file.');
          console.error(err);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const processFinalData = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Read file again for full processing
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON with headers
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Map the Excel data to our customer data structure
          const mappedCustomers = jsonData.map(row => {
            return {
              first_name: row['First Name'] || '',
              last_name: row['Last Name'] || '',
              email: row['Email'] || '',
              phone: row['Phone'] || '',
              company: row['Company'] || '',
              leadType: row['Lead Type'] || 'Custom Lead',
              source: 'imported', // Changed from 'custom' to 'imported'
              importDate: new Date().toISOString(),
              importSource: file.name,
              default_address: {
                first_name: row['First Name'] || '',
                last_name: row['Last Name'] || '',
                company: row['Company'] || '',
                address1: row['Address'] || row['Address 1'] || '',
                address2: row['Address 2'] || '',
                city: row['City'] || '',
                country: row['Country'] || '',
                province: row['Province'] || row['State'] || '',
                zip: row['Zip'] || row['Postal Code'] || '',
                phone: row['Phone'] || ''
              }
            };
          });
          
          // Upload to Firebase
          await addBulkCustomLeads(mappedCustomers);
          
          // Complete the process
          setLoading(false);
          onImportComplete(mappedCustomers);
          
          // Close the modal
          if (typeof bootstrap !== 'undefined') {
            const modalElement = document.getElementById('excelImportModal');
            // eslint-disable-next-line no-undef
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        } catch (err) {
          setError('Error processing Excel data: ' + err.message);
          setLoading(false);
          console.error(err);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Error uploading file: ' + err.message);
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="modal fade" id="excelImportModal" tabIndex="-1" aria-labelledby="excelImportModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="excelImportModalLabel">Import Leads from Excel</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            {step === 1 && (
              <div>
                <p>Upload an Excel file with your leads. The file should have columns for:</p>
                <ul>
                  <li>First Name</li>
                  <li>Last Name</li>
                  <li>Email</li>
                  <li>Phone</li>
                  <li>Company (optional)</li>
                  <li>Address (optional)</li>
                  <li>City (optional)</li>
                  <li>Country (optional)</li>
                  <li>Province/State (optional)</li>
                  <li>Zip/Postal Code (optional)</li>
                  <li>Lead Type (optional)</li>
                </ul>
                <div className="mb-3">
                  <label htmlFor="excelFile" className="form-label">Select Excel File</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="excelFile" 
                    accept=".xlsx, .xls" 
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
            
            {step === 2 && preview && (
              <div>
                <h6>Preview:</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        {preview.headers.map((header, index) => (
                          <th key={index}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.previewRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                          {/* Add empty cells if row is shorter than headers */}
                          {Array.from({ length: Math.max(0, preview.headers.length - row.length) }).map((_, i) => (
                            <td key={`empty-${rowIndex}-${i}`}></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="alert alert-info">
                  <p>We'll attempt to match these columns to our lead data structure.</p>
                  <p>Preview shows first 5 rows of {file?.name}</p>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {step === 1 ? (
              <>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={processFinalData}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Importing...
                    </>
                  ) : 'Import Data'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportModal;