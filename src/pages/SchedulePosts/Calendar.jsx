import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./post.css";
import { ReviewPost } from "../../components/ReviewPost";
import PostCreation from "../../components/PostCreation";
const Calendar = (e) => {
  const [currentSection, setCurrentSection] = useState("daily");

  // Handler to change the visible section
  const showSection = (section) => {
    setCurrentSection(section);
  };

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // Close the calendar after date selection
  };
  return (
    <>
      <main className="calender_main_class">
        <div className="calender">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between p-4">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <button className="d-flex align-items-center calender_select btn text-light border rounded-lg p-2 me-2">
                <i className="fa-solid fa-magnifying-glass m-1" />
                <span className="" style={{ color: "#b2a79c" }}>
                  Search
                </span>
              </button>
              <div className="calender_select me-2">
                <select className="form-select border rounded-lg p-2">
                  <option value="all">All</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                </select>
              </div>
              <div className="calender_select">
                <select className="form-select border rounded-lg p-2">
                  <option>All Members</option>
                  <option>Member 1</option>
                  <option>Member 2</option>
                </select>
              </div>
            </div>

            <div>
              <div className="d-flex gap-2 calender_btn">
                <button className="btn btn-secondary rounded-lg">Feed</button>
                <button
                  className="btn btn-secondary rounded-lg"
                  onClick={() => showSection("daily")}
                >
                  Daily
                </button>
                <button
                  className="btn btn-secondary rounded-lg"
                  onClick={() => showSection("weekly")}
                >
                  Weekly
                </button>
                <button
                  className="btn btn-secondary rounded-lg"
                  onClick={() => showSection("monthly")}
                >
                  Monthly
                </button>
              </div>
            </div>
          </div>
          {/* Hidden dropdown menu for smaller screens */}
          <div
            className="d-md-none"
            id="mobile-menu"
            style={{ display: "none" }}
          >
            <div className="calender_select mb-2">
              <select className="form-select border rounded-lg p-2">
                <option value="all">All</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
              </select>
            </div>
            <div className="calender_select mb-2">
              <select className="form-select border rounded-lg p-2">
                <option>All Members</option>
                <option>Member 1</option>
                <option>Member 2</option>
              </select>
            </div>
          </div>
        </div>
        {/* ==============================  daily section  ====================== */}
        {/* Daily Section */}
        {currentSection === "daily" && (
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="d-flex align-items-center days_section justify-content-between p-2">
                  <div className="d-flex align-items-center">
                    <span className="mx-2 fw-semibold">Thursday</span>
                    <button className="btn p-0">
                      <span>&lt; </span>
                    </button>
                    <button className="btn p-0">
                      <span>&gt;</span>
                    </button>
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      id="show-date-btn"
                      className="btn p-0"
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <img
                        aria-hidden="true"
                        alt="calendar-icon"
                        src="https://openui.fly.dev/openui/24x24.svg?text=📅"
                      />
                    </button>
                    <span className="ms-2">8 Aug, 2024</span>
                  </div>
                </div>
                {/* Show calendar on button click */}
                {showCalendar && (
                  <div className="calendar-wrapper mt-2">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      inline // Shows the calendar inline
                    />
                  </div>
                )}

                {/* Display the selected date if any */}
                {selectedDate && (
                  <p className="mt-3">
                    Selected Date: {selectedDate.toLocaleDateString()}
                  </p>
                )}
                <div className="row mt-5 date_table">
                  <div className="col-12">
                    {[...Array(12).keys()].map((i) => (
                      <div key={i} className="time-slot">
                        <span className="time-label">
                          {String(i).padStart(2, "0")}:00
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-md-0 mt-4">
                <div className="bacground_clean_black" />
              </div>
            </div>
          </div>
        )}

        {/* Weekly Section */}
        {/* Weekly Section */}
        {currentSection === "weekly" && (
          <div className="container calendar-container">
            <div className="row calendar-header">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day, index) => (
                <div key={index} className="col calendar-cell mt-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="row calendar-container_bottom">
              {[
                "9 Sep",
                "10 Sep",
                "11 Sep",
                "12 Sep",
                "13 Sep",
                "14 Sep",
                "15 Sep",
              ].map((date, index) => (
                <div key={index} className="col calendar-cell">
                  <div className="date-number">{date}</div>
                  <button
                    className="hidden_portion_model mt-5"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <span>+</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Section */}
        {currentSection === "monthly" && (
          <div className="monthly_portion">
            <div className="container calendar-box">
              <div className="row weekdays-header">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day, index) => (
                  <div key={index} className="col calendar-day">
                    {day}
                  </div>
                ))}
              </div>
              {Array.from({ length: 4 }).map((_, weekIndex) => (
                <div key={weekIndex} className="row">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const date = new Date(
                      2024,
                      8,
                      weekIndex * 7 + dayIndex + 1
                    ); // 8 = September
                    const dateString = date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    });
                    return (
                      <div key={dayIndex} className="col calendar-day">
                        <span className="date-label">{dateString}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-end modal-xl w-100">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close text-light"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <PostCreation />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn- text-dark"
                  style={{ backgroundColor: "aqua" }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Calendar;
