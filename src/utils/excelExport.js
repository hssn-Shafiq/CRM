import * as XLSX from 'xlsx';

/**
 * Exports customer data to an Excel file
 * 
 * @param {Array} customers - The array of customer data to export
 * @param {string} filename - The name for the downloaded file
 */
export const exportToExcel = (customers, filename) => {
  // Map customers to a flattened format better suited for Excel
  const formattedData = customers.map(customer => {
    const address = customer.default_address || {};
    
    return {
      'First Name': address.first_name || customer.first_name || '',
      'Last Name': address.last_name || customer.last_name || '',
      'Email': customer.email || '',
      'Phone': address.phone || customer.phone || '',
      'Company': address.company || customer.company || '',
      'Address 1': address.address1 || '',
      'Address 2': address.address2 || '',
      'City': address.city || '',
      'Province/State': address.province || '',
      'Country': address.country || '',
      'Postal Code': address.zip || '',
      'Lead Type': customer.leadType || '',
      'Source': customer.source || '',
      'Customer ID': customer.id || '',
      'Created At': customer.createdAt ? new Date(customer.createdAt).toLocaleString() : '',
      'Notes': customer.notes || ''
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 20 }, // Company
    { wch: 25 }, // Address 1
    { wch: 20 }, // Address 2
    { wch: 15 }, // City
    { wch: 15 }, // Province/State
    { wch: 15 }, // Country
    { wch: 12 }, // Postal Code
    { wch: 15 }, // Lead Type
    { wch: 10 }, // Source
    { wch: 15 }, // Customer ID
    { wch: 20 }, // Created At
    { wch: 30 }  // Notes
  ];
  
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

  // Generate and download file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};