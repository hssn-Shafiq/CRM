import React, { useState, useEffect } from 'react';
import './CustomerStyles.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typingTimer, setTypingTimer] = useState(null);
  const doneTypingInterval = 500; // wait 500ms after user stops typing

  useEffect(() => {
    // Clean up the timer when the component unmounts
    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [typingTimer]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear any existing timer
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    
    // Set a new timer
    const timer = setTimeout(() => {
      onSearch(value);
    }, doneTypingInterval);
    
    setTypingTimer(timer);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="input-group">
        <span className="input-group-text bg-transparent border-end-0">
          <i className="fa fa-search text-light"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-2"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <button
            className="btn btn-outline-secondary border-start-0"
            type="button"
            onClick={handleClear}
          >
            <i className="fa fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;