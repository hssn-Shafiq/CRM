import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker from 'emoji-picker-react';
import DatePicker from 'react-datepicker';  // Import DatePicker component
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles

function PostForm({ selectedPlatforms }) {
  const [selectedForm, setSelectedForm] = useState('Post');
  const [editorContent, setEditorContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false); // State to toggle date picker
  const [scheduleDate, setScheduleDate] = useState(null); // State to hold the selected date and time

  // Define the available post types for each platform
  const platformPostLimits = {
    facebook: ['Post', 'Reel', 'Story'],
    instagram: ['Post', 'Reel', 'Story'],
    linkedin: ['Post'],
    twitter: ['Post'],
    tiktok: ['Reel'],
    pinterest: ['Post'],
    whatsapp: ['Post'],
  };

  // Get the common post types across all selected platforms
  const availablePostTypes = selectedPlatforms.reduce((acc, platform) => {
    const platformTypes = platformPostLimits[platform.toLowerCase()] || [];
    return acc.length === 0
      ? platformTypes
      : acc.filter((type) => platformTypes.includes(type));
  }, []);

  // Handle form type selection
  const handleFormSelection = (type) => {
    setSelectedForm(type);
  };

  // Handle emoji select
  const addEmoji = (event, emojiObject) => {
    setEditorContent((prevContent) => prevContent + emojiObject.emoji);
    setShowEmojiPicker(false); // Close emoji picker after selection
  };

  // Toolbar configuration
  const modules = {
    toolbar: [
      ['bold', 'italic'],
      [{ emoji: 'emoji' }], // Custom button for emoji picker
    ],
  };

  // Handle scheduling logic
  const handleSchedule = () => {
    setShowSchedulePicker(true); // Show date and time picker when clicking on "Schedule"
  };

  const handleDateChange = (date) => {
    // Only allow future dates
    const now = new Date();
    if (date > now) {
      setScheduleDate(date);
    } else {
      alert("Please select a future date and time.");
    }
  };

  return (
    <div>
      {/* Buttons to select form type */}
      <div className="d-flex mb-3">
        {availablePostTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleFormSelection(type)}
            className={`btn btn-outline-secondary me-2 ${selectedForm === type ? 'active' : ''}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Conditional Rendering of Forms */}
      {selectedForm === 'Story' ? (
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
        <form id="postForm">
          <div className="form-group mb-3 writing_post">
            <button
              type="button"
              className="btn responsive-buttons me-1 btn-emoji me-3"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <i className="fa-regular fa-face-smile"></i>
            </button>
            {showEmojiPicker && <EmojiPicker onEmojiClick={addEmoji} />}
            {/* React Quill Editor */}
            <ReactQuill
              value={editorContent}
              onChange={setEditorContent}
              modules={modules}
              placeholder="Write something..."
              theme="snow"
            />
          </div>

          <div className="button-section-text-area"></div>

          <div className="input-group mb-3">
            <input className="form-control bg-dark text-light" id="inputGroupFile02" type="file" />
            <label className="input-group-text bg-dark text-light" htmlFor="inputGroupFile02">
              Upload
            </label>
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn btn-outline-secondary responsive-buttons fw-semibold me-3" type="button">
              Draft
            </button>
            <button className="btn btn-publish responsive-buttons fw-semibold me-3" type="submit">
              Publish
            </button>
            <button
              className="btn btn-schedule responsive-buttons fw-semibold me-3"
              type="button"
              onClick={handleSchedule} // Show the calendar and time picker when clicked
            >
              Schedule
            </button>
          </div>

          {/* Calendar and Time Picker for scheduling */}
          {showSchedulePicker && (
            <div className="mt-3 d-flex align-items-center justify-content-end gap-2">
              <label className="text-light">Pick a date and time:</label>
              <DatePicker
                selected={scheduleDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()} // Prevent selecting past dates
                placeholderText="Select date and time"
                className="form-control"
              />
              <button className="btn btn-primary">
                Save
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default PostForm;
