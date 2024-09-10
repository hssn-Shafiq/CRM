import React, { useState } from 'react';


function PostForm() {
  // State to track the selected form type
  const [selectedForm, setSelectedForm] = useState('Post');

  // Handle form type selection
  const handleFormSelection = (type) => {
    setSelectedForm(type);
  };

  return (
    <div>
      {/* Buttons to select form type */}
      <div className="d-flex mb-3">
        <button onClick={() => handleFormSelection('Post')} className="btn btn-outline-secondary me-2">
          Post
        </button>
        <button onClick={() => handleFormSelection('Reel')} className="btn btn-outline-secondary me-2">
          Reel
        </button>
        <button onClick={() => handleFormSelection('Story')} className="btn btn-outline-secondary">
          Story
        </button>
      </div>

      {/* Conditional Rendering of Forms */}
      {selectedForm === 'Story' ? (
        // Simplified form for Story
        <form id="storyForm">
          <div className="input-group mb-3">
            <input
              className="form-control bg-dark text-light"
              id="uploadMedia"
              type="file"
              accept="image/*,video/*"
            />
            <label className="input-group-text bg-dark text-light" htmlFor="uploadMedia">
              Upload your media
            </label>
          </div>
        </form>
      ) : (
        // Full form for Post and Reel
        <form id="postForm">
          <div className="form-group mb-3">
            <textarea
              className="form-control"
              id="postText"
              placeholder="Write something or use shortcodes, spintax ..."
              rows={5}
            />
          </div>
          <div className="button-section-text-area d-flex justify-content-between align-content-center">
            <div className="ai-button">
              <div className="btn fw-semibold responsive-buttons">
                <i className="fa-solid fa-hashtag text-secondary me-2"></i>
                Hashtag
              </div>
              <div className="btn responsive-buttons fw-semibold">
                <i className="fa-solid fa-ear-listen text-secondary me-2"></i>
                AI Assist
              </div>
            </div>
            <div className="blod-itallic-imoji d-flex justify-content-center align-items-center">
              <div className="btn responsive-buttons me-1 fw-bold btn-outline-secondary">B</div>
              <div className="btn responsive-buttons me-1 fw-bold btn-outline-secondary">I</div>
              <div className="btn responsive-buttons me-1 btn-emoji me-3">
                <i className="fa-regular fa-face-smile"></i>
              </div>
            </div>
          </div>
          <div className="input-group mb-3">
            <input
              className="form-control bg-dark text-light"
              id="inputGroupFile02"
              type="file"
            />
            <label className="input-group-text bg-dark text-light" htmlFor="inputGroupFile02">
              Upload
            </label>
          </div>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-outline-secondary responsive-buttons fw-semibold me-3"
              type="button"
            >
              Draft
            </button>
            <button
              className="btn btn-publish responsive-buttons fw-semibold me-3"
              type="submit"
            >
              Publish
            </button>
            <button
              className="btn btn-schedule responsive-buttons fw-semibold me-3"
              type="submit"
            >
              Schedule
            </button>
            <div className="dropup-center dropup">
              <button
                aria-expanded="false"
                className="btn btn-schedule text-light"
                data-bs-toggle="dropdown"
                type="button"
              >
                <i className="fa-solid fa-square-caret-up"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="fa-solid fa-calendar-days text-secondary me-2"></i>
                    Schedule
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="fa-solid fa-calendar-check text-secondary me-2"></i>
                    AutoSchedule
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="fa-solid fa-recycle text-secondary me-2"></i>
                    Recycle
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="fa-regular fa-window-restore text-secondary me-2"></i>
                    Recurring
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default PostForm;
