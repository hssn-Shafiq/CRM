// DatePicker.js
import React, { useState, useEffect } from "react";
import "./date.css";

const DatePicker = ({ onDateTimeSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    updateCalendar(currentMonth, currentYear);
  }, [currentMonth, currentYear, selectedDate]);

  const updateCalendar = (month, year) => {
    const calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let date = 1;

    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td");
        if (i === 0 && j < firstDay) {
          cell.classList.add("inactive");
        } else if (date > daysInMonth) {
          break;
        } else {
          cell.textContent = date;
          cell.classList.add("active-day");

          // Highlight the selected date
          if (
            selectedDate &&
            selectedDate.getDate() === date &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year
          ) {
            cell.classList.add("selected");
          }

          cell.onclick = () => handleDateSelect(date);
          date++;
        }
        row.appendChild(cell);
      }
      calendarBody.appendChild(row);
    }
  };

  const handleDateSelect = (day) => {
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDate(selected);
    onDateTimeSelect(selected, selectedTime);

    // Update visual selection immediately
    const previouslySelected = document.querySelector(".selected");
    if (previouslySelected) {
      previouslySelected.classList.remove("selected");
    }

    // Highlight the newly selected date
    const calendarBody = document.getElementById("calendar-body");
    const cells = calendarBody.getElementsByTagName("td");
    for (let cell of cells) {
      if (cell.textContent == day) {
        cell.classList.add("selected");
      }
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    if (selectedDate) {
      onDateTimeSelect(selectedDate, e.target.value);
    }
  };

  return (
    <>
      <div className="calendar-container book-appointments-main">
        <div className="calendar">
          <div className="bg-header-calender d-flex justify-content-around align-items-center">
            <button
              className="btn btn-link prev-month"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
            >
              <i className="fs-3 fa-solid fa-circle-chevron-left" />
            </button>
            <h4 id="month-year" className="text-center">
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h4>
            <button
              className="btn btn-link next-month"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
            >
              <i className="fs-3 fa-solid fa-circle-chevron-right" />
            </button>
          </div>
          <table className="table table-borderless bg-light">
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody id="calendar-body"></tbody>
          </table>
        </div>
      </div>
      <div className="time-picker px-3">
        <input
          type="time"
          className="w-100 bg-main p-1 text-light text-center border-main rounded-3"
          value={selectedTime}
          onChange={handleTimeChange}
        />
      </div>
    </>
  );
};

export default DatePicker;
