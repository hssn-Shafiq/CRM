import React from 'react';

const CustomerTable = ({ 
  customers, 
  onView, 
  onEdit, 
  onDelete,
  enableBulkActions = false,
  onBulkSelectChange,
  selectedCustomers = []
}) => {
  if (!customers || customers.length === 0) {
    return <div className="alert alert-info">No customers found matching the criteria.</div>;
  }
  
  // Helper function to get source badge
  const getSourceBadge = (source) => {
    switch(source) {
      case 'shopify':
        return <span className="badge bg-primary">Shopify</span>;
      case 'imported':
        return <span className="badge bg-success">Imported</span>;
      case 'custom':
        return <span className="badge bg-info">Custom</span>;
      default:
        return <span className="badge bg-secondary">{source || 'Unknown'}</span>;
    }
  };

  // Handle individual checkbox selection
  const handleCheckboxChange = (customer) => {
    if (onBulkSelectChange) {
      const isSelected = selectedCustomers.some(c => c.id === customer.id);
      if (isSelected) {
        onBulkSelectChange(selectedCustomers.filter(c => c.id !== customer.id));
      } else {
        onBulkSelectChange([...selectedCustomers, customer]);
      }
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    if (onBulkSelectChange) {
      if (e.target.checked) {
        // Only allow selection of non-shopify leads
        const selectableCustomers = customers.filter(c => c.source !== 'shopify');
        onBulkSelectChange(selectableCustomers);
      } else {
        onBulkSelectChange([]);
      }
    }
  };

  // Check if all selectable customers are selected
  const areAllSelected = () => {
    const selectableCount = customers.filter(c => c.source !== 'shopify').length;
    return selectableCount > 0 && selectedCustomers.length === selectableCount;
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped customer-table">
        <thead>
          <tr>
            {enableBulkActions && (
              <th>
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  checked={areAllSelected()}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Country</th>
            <th>Lead Type</th>
            <th>Source</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => {
            const address = customer.default_address || {};
            const name = `${address.first_name || customer.first_name || ''} ${address.last_name || customer.last_name || ''}`.trim();
            const phone = address.phone || customer.phone || 'N/A';
            const country = address.country || customer.country || 'N/A';
            const isSelected = selectedCustomers.some(c => c.id === customer.id);
            const isSelectable = customer.source !== 'shopify';
            
            return (
              <tr key={customer.id}>
                {enableBulkActions && (
                  <td>
                    {isSelectable && (
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(customer)}
                      />
                    )}
                  </td>
                )}
                <td>{name || 'N/A'}</td>
                <td>{customer.email || 'N/A'}</td>
                <td>{phone}</td>
                <td>{country}</td>
                <td>{customer.leadType || 'N/A'}</td>
                <td>
                  {getSourceBadge(customer.source)}
                  {customer.importSource && 
                    <div className="small text-muted mt-1" title={`Imported on ${new Date(customer.importDate).toLocaleString()}`}>
                      {customer.importSource}
                    </div>
                  }
                </td>
                <td>
                  <div className="btn-group">
                    <button 
                      className="btn btn-sm bg-dark"
                      onClick={() => onView(customer)}
                    >
                      <i className="fa fa-eye text-light"></i>
                    </button>
                    <button 
                      className="btn btn-sm bg-dark"
                      onClick={() => onEdit(customer)}
                    >
                      <i className="fa fa-pencil text-primary"></i>
                    </button>
                    <button 
                      className="btn btn-sm bg-dark"
                      onClick={() => onDelete(customer.id, customer.source)}
                    >
                      <i className="fa fa-trash text-danger"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;