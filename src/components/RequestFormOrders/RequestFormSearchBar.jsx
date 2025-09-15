import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const RequestFormSearchBar = ({ searchTerm, setSearchTerm, placeholder = "Search orders..." }) => {
  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-search-btn"
              title="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            <small>Searching for: "{searchTerm}"</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestFormSearchBar;