import React, { useState } from 'react';
import SearchBar from './SearchBar';
import './CustomerStyles.css';

const FilterHeader = ({ 
  selectedLead, 
  setSelectedLead, 
  onAddClick,
  onSearch,
  onFilterChange,
  totalCustomers
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    leadType: '',
    hasEmail: false,
    hasPhone: false,
    sortBy: 'name', // Default sort option
    sortOrder: 'asc' // Default sort order
  });

  // Available countries for filter dropdown
  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", 
    "Germany", "France", "Italy", "Spain", "Japan", "China"
  ];

  const leadTypes = [
    "All Leads", "Request From Leads", "Order Padding Leads", 
    "Order Deliver Leads", "Send Email Leads"
  ];

  const handleLeadTypeChange = (type) => {
    setSelectedLead(type);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [name]: newValue
      };
      
      // Pass the updated filters to parent component
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSortChange = (e) => {
    const { value } = e.target;
    setFilters(prev => {
      const newFilters = {
        ...prev,
        sortBy: value
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSortOrderChange = () => {
    setFilters(prev => {
      const newOrder = prev.sortOrder === 'asc' ? 'desc' : 'asc';
      const newFilters = {
        ...prev,
        sortOrder: newOrder
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      country: '',
      leadType: '',
      hasEmail: false,
      hasPhone: false,
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filter-header mb-4">
      <div className="row align-items-center mb-3">
        {/* Title and Customer Count */}
        <div className="col-md-6">
          <h4 className="mb-0">Customer Management</h4>
          <p className="text-muted small mb-0">
            Total Customers: <span className="fw-bold">{totalCustomers}</span>
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="col-md-6">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
      
      <div className="row align-items-center mt-3">
        {/* Lead Type Dropdown */}
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="dropdown lead-type-dropdown">
            <button
              className="btn bg-light text-dark border-dark dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
              type="button"
              id="leadsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span>{selectedLead || "Select Lead Type"}</span>
              {/* <i className="fa fa-chevron-down"></i> */}
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="leadsDropdown">
              {leadTypes.map((type) => (
                <li key={type}>
                  <a
                    className={`dropdown-item ${selectedLead === type ? 'active' : ''}`}
                    href="#!"
                    onClick={() => handleLeadTypeChange(type)}
                  >
                    {type}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Filter Button and Add Button */}
        <div className="col-md-8 d-flex justify-content-end">
          <button 
            className={`btn me-2 ${showFilters ? 'btn-info' : 'btn-outline-secondary'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="fa fa-filter me-1"></i> 
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
        </div>
      </div>
      
      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="advanced-filters mt-3 p-3 border rounded ">
          <h6 className="mb-3">Advanced Filters</h6>
          
          <div className="row">
            {/* Country Filter */}
            <div className="col-md-3 mb-3">
              <label className="form-label small">Country</label>
              <select 
                className="form-select form-select-sm" 
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            {/* Lead Type Filter */}
            <div className="col-md-3 mb-3">
              <label className="form-label small">Lead Type</label>
              <select 
                className="form-select form-select-sm"
                name="leadType"
                value={filters.leadType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {leadTypes.slice(1).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div className="col-md-3 mb-3">
              <label className="form-label small">Sort By</label>
              <select 
                className="form-select form-select-sm"
                value={filters.sortBy}
                onChange={handleSortChange}
              >
                <option value="name">Name</option>
                <option value="country">Country</option>
                <option value="email">Email</option>
              </select>
            </div>
            
            {/* Sort Order */}
            <div className="col-md-3 mb-3">
              <label className="form-label small">Sort Order</label>
              <button 
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={handleSortOrderChange}
              >
                {filters.sortOrder === 'asc' ? (
                  <><i className="fa fa-sort-amount-asc me-1"></i> Ascending</>
                ) : (
                  <><i className="fa fa-sort-amount-desc me-1"></i> Descending</>
                )}
              </button>
            </div>
          </div>
          
          <div className="row">
            {/* Has Email Checkbox */}
            <div className="col-md-3 mb-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="hasEmailCheck"
                  name="hasEmail"
                  checked={filters.hasEmail}
                  onChange={handleFilterChange}
                />
                <label className="form-check-label small" htmlFor="hasEmailCheck">
                  Has Email
                </label>
              </div>
            </div>
            
            {/* Has Phone Checkbox */}
            <div className="col-md-3 mb-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="hasPhoneCheck"
                  name="hasPhone"
                  checked={filters.hasPhone}
                  onChange={handleFilterChange}
                />
                <label className="form-check-label small" htmlFor="hasPhoneCheck">
                  Has Phone Number
                </label>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            <div className="col-md-6 d-flex justify-content-end align-items-end mb-3">
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={handleClearFilters}
              >
                <i className="fa fa-times me-1"></i> Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterHeader;