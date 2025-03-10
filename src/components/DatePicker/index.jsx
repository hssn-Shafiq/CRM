import React, { useState, useEffect } from "react";
import "./date.css";

const DatePicker = ({ onDateTimeSelect }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [calendarDays, setCalendarDays] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    generateCalendarDays(currentMonth, currentYear);
  }, [currentMonth, currentYear, selectedDate]);

  const generateCalendarDays = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const now = new Date();
    
    // Create array of calendar days
    for (let i = 0; i < 42; i++) {
      if (i < firstDay || i >= firstDay + daysInMonth) {
        days.push({ day: null, isCurrentMonth: false });
      } else {
        const dayNumber = i - firstDay + 1;
        const date = new Date(year, month, dayNumber);
        const isToday = isDateToday(date);
        const isSelected = isDateSelected(date);
        const isPast = isPastDate(date);
        
        days.push({
          day: dayNumber,
          isCurrentMonth: true,
          isToday,
          isSelected,
          isPast,
          date: date
        });
      }
    }
    
    setCalendarDays(days);
  };
  
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const isDateToday = (date) => {
    if (!date) return false;
    
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDateSelected = (date) => {
    if (!selectedDate || !date) return false;
    
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateSelect = (day, isPast) => {
    if (!day) return;
    
    // Prevent selecting past dates
    if (isPast) {
      setValidationMessage("You cannot select a past date");
      return;
    }
    
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDate(selected);
    
    // Clear validation message when valid date is selected
    setValidationMessage("");
    
    // Pass the selected date and any existing time to the parent
    onDateTimeSelect(selected, selectedTime);
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);
    
    if (selectedDate) {
      // Just update with the new time, no complex validation
      onDateTimeSelect(selectedDate, newTime);
    }
  };
  
  // Remove unused validateDateTime function


  const goToPreviousMonth = () => {
    const today = new Date();
    // Prevent going to months before current month
    if (currentYear < today.getFullYear() || 
        (currentYear === today.getFullYear() && currentMonth <= today.getMonth())) {
      return;
    }
    
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Check if a week should be rendered (has at least one day in current month)
  const shouldRenderWeek = (week) => {
    return week.some(day => day.isCurrentMonth);
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-container">
        <div className="calendar-header">
          <button
            className="month-nav prev-month"
            onClick={goToPreviousMonth}
          >
            <i className="fa-solid fa-circle-chevron-left"></i>
          </button>
          <h4 className="current-month">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h4>
          <button
            className="month-nav next-month"
            onClick={goToNextMonth}
          >
            <i className="fa-solid fa-circle-chevron-right"></i>
          </button>
        </div>
        
        <div className="calendar-body">
          <div className="weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={index} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="calendar-grid">
            {weeks.map((week, weekIndex) => (
              shouldRenderWeek(week) && (
                <div key={weekIndex} className="week">
                  {week.map((day, dayIndex) => (
                    <div 
                      key={dayIndex} 
                      className={`day-cell ${!day.day ? 'inactive' : ''} 
                                 ${day.isToday ? 'today' : ''} 
                                 ${day.isSelected ? 'selected' : ''}
                                 ${day.isPast ? 'past-day' : ''}`}
                      onClick={() => handleDateSelect(day.day, day.isPast)}
                    >
                      <span className="day-number">
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
        </div>
      </div>
      
      <div className="time-picker-container">
        <input
          type="time"
          className="time-input"
          value={selectedTime}
          onChange={handleTimeChange}
          placeholder="Select Time"
        />
        {validationMessage && (
          <div className="validation-message">{validationMessage}</div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;