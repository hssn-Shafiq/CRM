import React, { useState } from 'react';
import "./post.css";

const Calendar = (e) => {
  const [currentSection, setCurrentSection] = useState('daily');

  // Handler to change the visible section
  const showSection = (section) => {
    setCurrentSection(section);
  };
  return (
    
   <>
   <main className="calender_main_class" >
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
      <button
          className="btn btn-secondary rounded-lg"
          
        >
          Feed
        </button>
        <button
          className="btn btn-secondary rounded-lg"
          onClick={() => showSection('daily')}
        >
          Daily
        </button>
        <button
          className="btn btn-secondary rounded-lg"
          onClick={() => showSection('weekly')}
        >
          Weekly
        </button>
        <button
          className="btn btn-secondary rounded-lg"
          onClick={() => showSection('monthly')}
        >
          Monthly
        </button>
      </div>
    </div>
    </div>
    {/* Hidden dropdown menu for smaller screens */}
    <div className="d-md-none" id="mobile-menu" style={{ display: "none" }}>
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
{currentSection === 'daily' && (
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
                  <button id="show-date-btn" className="btn p-0">
                    <img
                      aria-hidden="true"
                      alt="calendar-icon"
                      src="https://openui.fly.dev/openui/24x24.svg?text=📅"
                    />
                  </button>
                  <span className="ms-2">8 Aug, 2024</span>
                </div>
              </div>
              <div className="row mt-5 date_table">
                <div className="col-12">
                  {[...Array(12).keys()].map((i) => (
                    <div key={i} className="time-slot">
                      <span className="time-label">{String(i).padStart(2, '0')}:00</span>
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
     {currentSection === 'weekly' && (
        <div className="container calendar-container">
          <div className="row calendar-header">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
              <div key={index} className="col calendar-cell mt-2">
                {day}
              </div>
            ))}
          </div>
          <div className="row calendar-container_bottom">
        {['9 Sep', '10 Sep', '11 Sep', '12 Sep', '13 Sep', '14 Sep', '15 Sep'].map((date, index) => (
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
      {currentSection === 'monthly' && (
        <div className="monthly_portion">
          <div className="container calendar-box">
            <div className="row weekdays-header">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                <div key={index} className="col calendar-day">
                  {day}
                </div>
              ))}
            </div>
            {Array.from({ length: 4 }).map((_, weekIndex) => (
              <div key={weekIndex} className="row">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const date = new Date(2024, 8, weekIndex * 7 + dayIndex + 1); // 8 = September
                  const dateString = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
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
        <div className="modal-dialog modal-dialog-end modal-lg">
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
              <div className="container py-4">
                <div className="row">
                  {/* Sidebar */}
                  <div className="col-12 col-lg-3 mb-4 mb-lg-0">
                    <div className="border-end p-3 bg-dark text-light">
                      <h2 className="h5">Create</h2>
                      <ul className="list-unstyled mt-3">
                        <li><a href="#" className="d-block py-2 text-light rounded hover-bg-light text-decoration-none">Home</a></li>
                        <li><a href="#" className="d-block py-2 text-light rounded hover-bg-light text-decoration-none">Posts</a></li>
                        <li><a href="#" className="d-block py-2 text-light rounded hover-bg-light text-decoration-none">Calendar</a></li>
                        <li><a href="#" className="d-block py-2 text-light rounded hover-bg-light text-decoration-none">Explore</a></li>
                        <li><a href="#" className="d-block py-2 text-light rounded hover-bg-light text-decoration-none">Media Library</a></li>
                        <li><a href="#" className="d-block py-2 text-light rounded hover-bg-light text-decoration-none">Analytics</a></li>
                      </ul>
                      <div className="mt-4">
                        <p className="text-muted">No accounts to select</p>
                        <button className="btn btn-light mt-2">Add Account</button>
                      </div>
                    </div>
                  </div>
                  {/* Main Content */}
                  <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                    <div className="mb-4">
                      <input type="text" placeholder="Search" className="form-control" />
                    </div>
                    <div className="border rounded p-3 bg-dark">
                      <h3 className="h6">Add labels</h3>
                      <textarea placeholder="Write something or use shortcodes, spintax ..." className="form-control h-100 mt-2" defaultValue={""} />
                      <div className="mt-4">
                        <button className="btn btn-secondary w-100">Click or Drag &amp; Drop media</button>
                      </div>
                      <div className="d-flex justify-content-end mt-4">
                        <div>
                          <button className="btn btn-outline-secondary text-light">Draft</button>
                          <button className="btn btn- text-dark" style={{ backgroundColor: "aqua" }}>Schedule</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Post Preview */}
                  <div className="col-12 col-lg-3">
                    <h3 className="h6">Post Preview</h3>
                    <div className="border rounded h-100 bg-dark mt-2" />
                    {/* <p className="text-muted">Select a social account and a post to preview</p> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn- text-dark" style={{ backgroundColor: "aqua" }}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    
  

</main>

   </>
  );
};

export default Calendar;
