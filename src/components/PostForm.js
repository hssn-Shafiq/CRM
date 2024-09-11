import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker from 'emoji-picker-react';

function PostForm() {
  const [selectedForm, setSelectedForm] = useState('Post');
  const [editorContent, setEditorContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
      [{ 'emoji': 'emoji' }], // Custom button for emoji picker
    ],
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
          <button type='button' className="btn responsive-buttons me-1 btn-emoji me-3" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <i className="fa-regular fa-face-smile"></i>
              </button>
              {showEmojiPicker && (
                <EmojiPicker onEmojiClick={addEmoji} />
              )}
            {/* React Quill Editor */}
            <ReactQuill
              value={editorContent}
              onChange={setEditorContent}
              modules={modules}
              placeholder="Write something..."
              theme="snow"
            />
          </div>

          <div className="button-section-text-area">

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
