import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "react-feather";
import "./dashboardcard.css"; // Import the external CSS file

const TaskList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Add click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <div className="task-card">
      {/* Header section */}
      <div className="task-header">
        <h5 className="task-title">Task List</h5>
        <div className="dropdown-container d-lg-block d-none" ref={dropdownRef}>
          <div className="task-dropdowns">
            {/* Dropdown 1: Pending */}
            <div className="task-dropdown">
              <button
                className="task-dropdown-btn"
                onClick={() => toggleDropdown("pending")}
              >
                <span>Pending</span>
                <ChevronDown size={16} color="#6C757D" />
              </button>
              {activeDropdown === "pending" && (
                <div className="task-dropdown-menu">
                  <div className="task-dropdown-item">All Tasks</div>
                  <div className="task-dropdown-item">Urgent Tasks</div>
                  <div className="task-dropdown-item">Completed Tasks</div>
                </div>
              )}
            </div>

            {/* Dropdown 2: Due Date */}
            <div className="task-dropdown">
              <button
                className="task-dropdown-btn"
                onClick={() => toggleDropdown("dueDate")}
              >
                <span>Due Date</span>
                <ChevronDown size={16} color="#6C757D" />
              </button>
              {activeDropdown === "dueDate" && (
                <div className="task-dropdown-menu">
                  <div className="task-dropdown-item">Today</div>
                  <div className="task-dropdown-item">This Week</div>
                  <div className="task-dropdown-item">This Month</div>
                </div>
              )}
            </div>

            {/* Dropdown 3: Ahmad */}
            <div className="task-dropdown">
              <button
                className="task-dropdown-btn"
                onClick={() => toggleDropdown("ahmad")}
              >
                <span>Ahmad</span>
                <ChevronDown size={16} color="#6C757D" />
              </button>
              {activeDropdown === "ahmad" && (
                <div className="task-dropdown-menu">
                  <div className="task-dropdown-item">Assigned to Me</div>
                  <div className="task-dropdown-item">Assigned by Me</div>
                  <div className="task-dropdown-item">Team Tasks</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading & No Data Section */}
      <div className="task-content">
        {isLoading ? (
          <div className="task-loading">
            <div className="task-icon-container task-loading-animation">
              <svg
                className="task-icon task-spinner"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="task-text-secondary">Loading...</p>
          </div>
        ) : (
          <div className="task-no-data">
            <div className="task-icon-container">
              <svg
                className="task-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="task-no-data-text">No Data Found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;