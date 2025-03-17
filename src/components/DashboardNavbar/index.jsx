import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DashboardNavbar.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DashboardNavbar = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  
  // Create refs for the dropdown containers
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const calendarIconRef = useRef(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleStartDatePicker = () => {
    setIsStartDateOpen(!isStartDateOpen);
    setIsEndDateOpen(false);
  };

  const toggleEndDatePicker = () => {
    setIsEndDateOpen(!isEndDateOpen);
    setIsStartDateOpen(false);
  };

  const toggleDatePicker = () => {
    if (!isStartDateOpen && !isEndDateOpen) {
      setIsStartDateOpen(true);
    } else {
      setIsStartDateOpen(false);
      setIsEndDateOpen(false);
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both date pickers and the calendar icon
      if (
        startDateRef.current && 
        !startDateRef.current.contains(event.target) &&
        endDateRef.current && 
        !endDateRef.current.contains(event.target) &&
        calendarIconRef.current && 
        !calendarIconRef.current.contains(event.target) &&
        isStartDateOpen || isEndDateOpen
      ) {
        setIsStartDateOpen(false);
        setIsEndDateOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStartDateOpen, isEndDateOpen]);

  return (
    <div className="dashboard-container w-100">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            {/* Blue icon button */}
            <button className="dashboard-icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-grid-1x2" viewBox="0 0 16 16">
                <path d="M6 1H1v14h5V1zm9 0h-5v5h5V1zm0 9v5h-5v-5h5zM0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm1 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-5z"/>
              </svg>
            </button>
            
            {/* Dashboard title */}
            <h4 className="dashboard-title">Dashboard</h4>
          </div>
          
          <div className="navbar-right">
            {/* Date range picker */}
            <div className="date-range-picker">
              <div 
                className="date-input" 
                onClick={toggleStartDatePicker}
                ref={startDateRef}
              >
                <span className={!startDate ? "Start Date" : ""}>
                  {startDate ? formatDate(startDate) : "Start Date"}
                </span>
                
                {isStartDateOpen && (
                  <div className="date-picker-container start-date-picker">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        handleStartDateChange(date);
                        setIsStartDateOpen(false);
                      }}
                      inline
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                    />
                  </div>
                )}
              </div>
              
              <div className="arrow-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
              </div>
              
              <div 
                className="date-input" 
                onClick={toggleEndDatePicker}
                ref={endDateRef}
              >
                <span className={!endDate ? "End Date" : ""}>
                  {endDate ? formatDate(endDate) : "End Date"}
                </span>
                
                {isEndDateOpen && (
                  <div className="date-picker-container end-date-picker">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        handleEndDateChange(date);
                        setIsEndDateOpen(false);
                      }}
                      inline
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                    />
                  </div>
                )}
              </div>
              
              <div 
                className="calendar-icon" 
                onClick={toggleDatePicker}
                ref={calendarIconRef}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                </svg>
              </div>
            </div>
            
            {/* Three dots menu */}
            <button className="menu-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" fill="#212529" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Gray separator line */}
      <div className="separator-line"></div>
    </div>
  );
};

export default DashboardNavbar;