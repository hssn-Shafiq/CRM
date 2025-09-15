import React, { useState, useRef, useEffect } from 'react';
import { FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';

const RequestFormFilters = ({ 
  filterType, 
  setFilterType, 
  filteredCount, 
  totalCount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filterOptions = [
    { 
      value: 'all', 
      label: 'All Orders', 
      icon: 'fas fa-list'
    },
    { 
      value: 'uniform', 
      label: 'Uniforms', 
      icon: 'fas fa-tshirt'
    },
    { 
      value: 'apparel_accessories', 
      label: 'Apparel/Accessories', 
      icon: 'fas fa-hat-cowboy'
    },
    { 
      value: 'recent', 
      label: 'Recent (7 days)', 
      icon: 'fas fa-clock'
    },
    { 
      value: 'high_quantity', 
      label: 'High Quantity (20+)', 
      icon: 'fas fa-layer-group'
    },
    { 
      value: 'pending_delivery', 
      label: 'Pending Delivery', 
      icon: 'fas fa-truck'
    },
    { 
      value: 'urgent', 
      label: 'Urgent (7 days)', 
      icon: 'fas fa-exclamation-triangle'
    }
  ];

  const activeFilter = filterOptions.find(option => option.value === filterType);
  const hasActiveFilter = filterType !== 'all';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterSelect = (value) => {
    setFilterType(value);
    setIsOpen(false);
  };

  const clearFilters = (e) => {
    e.stopPropagation();
    setFilterType('all');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="filter-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`filter-dropdown-btn ${hasActiveFilter ? 'has-filter' : ''}`}
      >
        <FaFilter className="filter-icon" />
        <span className="filter-text">
          {hasActiveFilter ? activeFilter.label : 'Filter'}
        </span>
        {hasActiveFilter && (
          <span className="filter-badge">1</span>
        )}
        <FaChevronDown className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
      </button>

      {isOpen && (
        <div className="filter-dropdown-menu">
          <div className="filter-dropdown-header">
            <span className="filter-dropdown-title">
              <FaFilter className="me-2" />
              Filter Options
            </span>
            <span className="filter-results-count">
              {filteredCount} of {totalCount}
            </span>
          </div>

          <div className="filter-options-list">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterSelect(option.value)}
                className={`filter-option-item ${filterType === option.value ? 'active' : ''}`}
              >
                <i className={option.icon}></i>
                <span>{option.label}</span>
                {filterType === option.value && (
                  <i className="fas fa-check check-icon"></i>
                )}
              </button>
            ))}
          </div>

          {hasActiveFilter && (
            <div className="filter-dropdown-footer">
              <button
                onClick={clearFilters}
                className="clear-filter-btn"
              >
                <FaTimes className="me-1" />
                Clear Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestFormFilters;