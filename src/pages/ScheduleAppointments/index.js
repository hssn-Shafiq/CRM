import { useEffect } from "react";
import "./appointment.css";

const ScheduleAppointments = () => {
  useEffect(() => {
    const calendarBody = document.getElementById("calendar-body");
    const monthYear = document.getElementById("month-year");
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;

    // Update the calendar on load
    updateCalendar(currentMonth, currentYear);

    // Previous month navigation
    document.querySelector(".prev-month").addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      updateCalendar(currentMonth, currentYear);
    });

    // Next month navigation
    document.querySelector(".next-month").addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      updateCalendar(currentMonth, currentYear);
    });

    function updateCalendar(month, year) {
      calendarBody.innerHTML = "";
      monthYear.textContent = `${new Date(year, month).toLocaleString(
        "default",
        { month: "long" }
      )} ${year}`;

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      let date = 1;
      for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
          const cell = document.createElement("td");
          if (i === 0 && j < firstDay) {
            cell.classList.add("inactive"); // For days of the previous month
          } else if (date > daysInMonth) {
            break; // No more days to show
          } else {
            cell.textContent = date;
            cell.classList.add("active-day"); // Style active days differently if needed
            cell.addEventListener("click", () => selectDate(cell));
            date++;
          }
          row.appendChild(cell);
        }
        calendarBody.appendChild(row);
      }
    }

    function selectDate(cell) {
      if (selectedDate) {
        selectedDate.classList.remove("selected");
      }
      selectedDate = cell;
      selectedDate.classList.add("selected");
    }
  }, []);

  return (
    <>
      <main>
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">Schedule Appointments</h2>
        </div>
        <div className="container  mb-5 book-appointments-main">
          <div className="card py-5  shadow-lg">
            <div className="row no-gutters">
              <div className="col-md-4 p-3 text-center">
                <img
                  src="/images/Profile.jpg"
                  className="img-of-lead img-fluid"
                  alt="Vikash Rathee"
                  height="150px"
                  width="150px"
                />
                <h5 className="mt-3">Hassan Shafiq</h5>
                <p>Meeting with Hassan</p>
                <div className="dropdown">
                  <button
                    className="btn"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      width={48}
                      height={48}
                      src="https://img.icons8.com/parakeet/48/meeting.png"
                      alt="meeting"
                    />
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        <img
                          className="me-2"
                          width={25}
                          height={25}
                          src="https://img.icons8.com/fluency/48/zoom.png"
                          alt="zoom"
                        />
                        Zoom
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <img
                          className="me-2"
                          width={25}
                          height={25}
                          src="https://img.icons8.com/color/48/google-meet--v1.png"
                          alt="google-meet--v1"
                        />
                        Google Meet
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <img
                          className="me-2"
                          width={25}
                          height={25}
                          src="https://img.icons8.com/color-glass/48/microsoft-teams.png"
                          alt="microsoft-teams"
                        />
                        Microsoft Teams
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <img
                          className="me-2"
                          width={25}
                          height={25}
                          src="https://img.icons8.com/fluency/48/skype.png"
                          alt="skype"
                        />
                        Skype
                      </a>
                    </li>
                  </ul>
                </div>
                <p>Setup a 1:1 meeting with Vikash, Founder and CEO of Agenty.</p>

                <a href="#">
                  <button className="btn btn-primary fw-bold w-100">Save</button>
                </a>
              </div>
              <div className="col-md-8 p-3">
                <h4 className="mb-4 bg-grey fw-semibold">
                  Select a Date &amp; Time
                </h4>
                <div className="row">
                  <div className="col-lg-8">
                    <div className="calendar-container">
                      <div className="calendar">
                        <div className="bg-header-calender d-flex justify-content-around align-items-center">
                          <button className="btn btn-link prev-month">
                            <i className="fs-3 fa-solid fa-circle-chevron-left" />
                          </button>
                          <h4 id="month-year" className="text-center" />
                          <button className="btn btn-link next-month">
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
                          <tbody id="calendar-body">
                            {/* Calendar dates will be dynamically generated here */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="time-slot-container">
                      <div className="form-group">
                        <select className="form-control form-control-sm mb-2" id="duration">
                          <option>25m</option>
                          <option>45m</option>
                          <option>60m</option>
                        </select>
                        <select className="form-control form-control-sm" id="time-format">
                          <option>12h</option>
                          <option>24h</option>
                        </select>
                      </div>
                      <ul className="list-group mt-3">
                        <li className="list-group-item">
                          <i className="far fa-clock" /> 9:00 am
                        </li>
                        <li className="list-group-item">
                          <i className="far fa-clock" /> 10:00 am
                        </li>
                        <li className="list-group-item">
                          <i className="far fa-clock" /> 2:00 pm
                        </li>
                        <li className="list-group-item">
                          <i className="far fa-clock" /> 2:25 pm
                        </li>
                        <li className="list-group-item">
                          <i className="far fa-clock" /> 3:00 pm
                        </li>
                        <li className="list-group-item">
                          <i className="far fa-clock" /> 3:25 pm
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ScheduleAppointments;
