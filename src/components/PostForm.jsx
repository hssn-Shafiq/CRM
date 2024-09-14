import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'quill-emoji/dist/quill-emoji.css'; 
import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import 'quill-emoji/dist/quill-emoji';
import 'quill-emoji/dist/quill-emoji.css';
Quill.register('modules/emoji', require('quill-emoji'));

function PostForm({ selectedPlatforms }) {
  const [selectedForm, setSelectedForm] = useState('Post');
  const [editorContent, setEditorContent] = useState('');
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(null);

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

  // Toolbar configuration with emoji support
  const modules = {
    toolbar: [
      ['bold', 'italic'],
      ['emoji'], // Add emoji button
    ],
    'emoji-toolbar': true, // Enable emoji toolbar
    'emoji-textarea': false, // Disable emoji textarea
    'emoji-shortname': true, // Allow shortname autocomplete
  };

  // Handle scheduling logic
  const handleSchedule = () => {
    setShowSchedulePicker(true);
  };

  const handleDateChange = (date) => {
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
              onClick={handleSchedule}
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
                minDate={new Date()}
                placeholderText="Select date and time"
                className="form-control"
              />
              <button className="btn btn-primary">Save</button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default PostForm;
