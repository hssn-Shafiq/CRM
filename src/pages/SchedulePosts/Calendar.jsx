import React, { useState } from "react";
import DatePicker from "react-datepicker";
import PostCreation from "../../components/PostCreation";
import "react-datepicker/dist/react-datepicker.css";
import "./post.css";
import { useFetchPosts } from "../../Hooks/useFetchPosts";
import {
  FaCalendarTimes,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaTiktok,
  FaPinterest,
  FaWhatsapp,
  FaEye,
} from "react-icons/fa";

const Calendar = () => {
  const { fPosts, loading, error } = useFetchPosts(); // Fetch posts from your API
  const [currentSection, setCurrentSection] = useState("daily");
  const [selectedPost, setSelectedPost] = useState(null); // Store the selected post

  // Get the current date and time
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);

  // Get the current day index (0 - Sunday, 6 - Saturday)
  const today = currentDate.getDay();
  const [currentDayIndex, setCurrentDayIndex] = useState(today);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Handler to change the visible section
  const showSection = (section) => {
    setCurrentSection(section);
  };

  // Update the selected date and the current day index based on the selected date
  const updateSelectedDate = (newDate) => {
    setSelectedDate(newDate);
    const newDayIndex = newDate.getDay(); // Get the new day index based on the selected date
    setCurrentDayIndex(newDayIndex); // Update the current day index
  };

  // Disable going to the previous day before today by comparing dates
  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1); // Move to the previous day

    // Check if the new date is today or a future date
    if (newDate >= currentDate) {
      updateSelectedDate(newDate); // Update the selected date and day index only if it's not before today
    }
  };

  // Allow moving to the next day
  const handleNext = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1); // Move to the next day
    updateSelectedDate(newDate); // Update the selected date and day index
  };

  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (date) => {
    // Prevent selecting a date before today
    if (date >= currentDate) {
      updateSelectedDate(date); // Update both date and day index when user selects a date
      setShowCalendar(false); // Close the calendar after date selection
    }
  };

  // Filter posts that match the selected date
  const filteredPosts = fPosts.filter((post) => {
    const postDate = new Date(post.scheduled_for);
    return (
      postDate.toDateString() === selectedDate.toDateString() // Check if the post date matches the selected date
    );
  });

  // Render platform icons based on platform array
  const renderPlatformIcons = (platforms) => {
    const iconsMap = {
      facebook: <FaFacebook key="facebook" />,
      instagram: <FaInstagram key="instagram" />,
      linkedin: <FaLinkedin key="linkedin" />,
      twitter: <FaTwitter key="twitter" />,
      tiktok: <FaTiktok key="tiktok" />,
      pinterest: <FaPinterest key="pinterest" />,
      whatsapp: <FaWhatsapp key="whatsapp" />,
    };

    return platforms.map((platform) => iconsMap[platform] || null);
  };

  // Render the posts under the corresponding time slots
  const renderPostsByTime = (hour) => {
    return filteredPosts
      .filter((post) => {
        const postTime = new Date(post.scheduled_for).getHours();
        return postTime === hour;
      })
      .map((post) => (
        <div key={post.id} className="post-card w-75">
          <div className="post-header bg-transparent text-light d-flex align-items-center justify-content-between px-0">
            <span className="m-0 d-flex gap-2">
              {renderPlatformIcons(post.platform)}
            </span>
            <FaEye
              className="eye-icon text-secondary"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedPost(post)} // Set the clicked post as the selected post
            />
          </div>
          <div className="post-body">
            <p className="text-secondary">{post.caption}</p>
            {post.media.length > 0 &&
              post.media.map((mediaItem, index) => (
                <img
                  key={index}
                  src={mediaItem || "/images/profile.jpg"}
                  width={80}
                  height={50}
                  // src="/images/profile.jpg"
                  className="me-2"
                  alt="thubnails"
                />
              ))}
          </div>
          <div className="post-footer text-secondary mt-2 text-end">
            <FaClock className="clock-icon" />{" "}
            {post.scheduled_for.split(" ")[1]}
          </div>
        </div>
      ));
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
        </div>

        {/* Daily Section */}
        {currentSection === "daily" && (
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="d-flex align-items-center days_section justify-content-between p-2">
                  <div className="d-flex align-items-center">
                    <span className="mx-2 fw-semibold">
                      {daysOfWeek[currentDayIndex]}{" "}
                      {/* Show the current day name */}
                    </span>
                    <button
                      className="btn p-0"
                      onClick={handlePrevious}
                      disabled={selectedDate <= currentDate} // Disable previous day button if it's today or earlier
                    >
                      <span>&lt;</span>
                    </button>
                    <button className="btn p-0" onClick={handleNext}>
                      <span>&gt;</span>
                    </button>
                  </div>
                  <div className="d-flex align-items-center">
                    <button>
                      <FaCalendarTimes />
                    </button>
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
                    <span className="ms-2">
                      {selectedDate
                        ? selectedDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "select a date"}
                    </span>
                  </div>
                </div>

                {/* Show calendar on button click */}
                {showCalendar && (
                  <div
                    className="calendar-wrapper mt-2 position-absolute"
                    width={400}
                  >
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      inline // Shows the calendar inline
                      minDate={currentDate} // Prevent selecting past dates
                      className="w-100"
                    />
                  </div>
                )}

                <div className="row mt-5 date_table">
                  <div className="col-12">
                    {/* Time slots */}
                    {[...Array(24).keys()].map((i) => (
                      <div
                        key={i}
                        className="time-slot d-flex flex-column h-auto align-items-start py-4"
                      >
                        <span className="time-label">
                          {String(i).padStart(2, "0")}:00
                        </span>
                        {/* Render the posts that are scheduled for this hour */}
                        {renderPostsByTime(i)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Show post details when a post is selected */}
              <div className="col-lg-6 mt-md-0 mt-4">
                <div className="bacground_clean_black h-auto p-3 text-light">
                  {selectedPost ? (
                    <>
                      <h4>{selectedPost.caption}</h4>
                      <p>
                        <strong>Scheduled For:</strong>{" "}
                        {selectedPost.scheduled_for}
                      </p>
                      <div className="show-side-img d-flex gap-1 px-1 flex-wrap flex-md-nowrap">
                      {selectedPost.media.length > 0 &&
                        selectedPost.media.map((mediaItem, index) => (
                          <img
                            key={index}
                            src={mediaItem || "/images/profile.jpg"}
                            className="me-2 w-50"
                            alt="thubnails"
                          />
                        ))}
                      </div>
                      
                      <p>
                        <strong>Platforms:</strong>{" "}
                        {renderPlatformIcons(selectedPost.platform)}
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedPost.location}
                      </p>
                      <p>
                        <strong>Call to Action:</strong>{" "}
                        {selectedPost.call_to_action}
                      </p>
                    </>
                  ) : (
                    <p>
                      No post selected. Click on the eye icon to view post
                      details.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
