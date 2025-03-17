import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "react-feather"; // Ensure react-feather is installed
import "./dashboardcard.css"; // Import the custom CSS file

const ManualActionsComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="card manual-actions-card w-100 border-0 rounded-3 shadow-sm overflow-hidden">
      <div className="card-body p-0">
        {/* Header Section */}
        <div className="funnel-header-section">
          <h5 className="funnel-dashboard-title">Manual Action</h5>
          <div 
            className="funnel-dropdown-container d-none d-lg-block" 
            ref={dropdownRef}
          >
            <button className="funnel-dropdown-button" onClick={toggleDropdown}>
              <span>Customers and Job Value</span>
              <ChevronDown size={16} color="#6C757D" />
            </button>

            {dropdownOpen && (
              <div className="funnel-dropdown-menu">
                <div className="funnel-dropdown-item">Customers and Job Value</div>
                <div className="funnel-dropdown-item">Revenue</div>
                <div className="funnel-dropdown-item">Conversions</div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Section */}
        <div className="d-flex justify-content-between metrics-container">
          <div className="d-flex flex-column align-items-center metric-item">
            <p className="metric-label mb-2">Phone</p>
            <p className="metric-value">0</p>
          </div>

          <div className="d-flex flex-column align-items-center metric-item">
            <p className="metric-label mb-2">SMS</p>
            <p className="metric-value">0</p>
          </div>

          <div className="d-flex flex-column align-items-center metric-item">
            <p className="metric-label mb-2">Total Pending</p>
            <p className="metric-value">0</p>
          </div>
        </div>

        {/* Action Link Section */}
        <div className="d-flex justify-content-center action-link-container">
          <a href="#" className="action-link d-flex align-items-center">
            Go to Manual Actions
            <svg className="ms-1 arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ManualActionsComponent;