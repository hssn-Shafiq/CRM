// PostForm.js
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import "quill-emoji/dist/quill-emoji.css";
import { Quill } from "react-quill";
import "quill-emoji/dist/quill-emoji";
import "quill-emoji/dist/quill-emoji.css";
import { AiOutlineClose } from "react-icons/ai"; // Import close icon
import { FaFile, FaPlus } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "./DatePicker";

Quill.register("modules/emoji", require("quill-emoji"));

function PostForm({
  selectedPlatforms,
  editorContent,
  setEditorContent,
  setUploadedMedia,
}) {
  const [selectedForm, setSelectedForm] = useState("Post");
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDate, setScheduleDate] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [mediaPreview, setMediaPreview] = useState(null); // State to manage media preview
  const [showModal, setShowModal] = useState(false);
  const datePickerRef = useRef(null); // Ref for the DatePicker component

  // Define the available post types for each platform
  const platformPostLimits = {
    facebook: ["Post", "Reel", "Story"],
    instagram: ["Post", "Reel", "Story"],
    linkedin: ["Post"],
    twitter: ["Post"],
    tiktok: ["Reel"],
    pinterest: ["Post"],
    whatsapp: ["Post"],
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

  // Handle file upload
  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result); // Set media preview
        setUploadedMedia(reader.result); // Set uploaded media as base64
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected media
  const handleRemoveMedia = () => {
    setMediaPreview(null);
    setUploadedMedia(null);
  };

  // Toolbar configuration with emoji support
  const modules = {
    toolbar: [
      ["bold", "italic"],
      ["emoji"], // Add emoji button
    ],
    "emoji-toolbar": true,
    "emoji-textarea": false,
    "emoji-shortname": true,
  };

  // Open the modal for scheduling
  const handleSchedule = () => {
    setShowModal(true);
  };
  // Function to handle receiving date and time from DatePicker component
  const handleDateTimeSelect = (date, time) => {
    setScheduleDate(date);
    setScheduleTime(time);
  };

  return (
    <div>
      {/* Buttons to select form type */}
      <div className="d-flex mb-3">
        {availablePostTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleFormSelection(type)}
            className={`btn btn-outline-secondary me-2 ${
              selectedForm === type ? "active" : ""
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {selectedForm === "Story" ? (
        <form id="storyForm">
          <div className="input-group mb-3">
            <input
              className="form-control bg-dark text-light d-none"
              id="uploadMedia"
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload} // Handle media upload
            />
            <button
              type="button"
              className="btn btn-primary w-100 bg-dark border-main rounded-2"
              onClick={() => document.getElementById("uploadMedia").click()}
            >
              Click to select media
            </button>
          </div>

          {loading ? (
            <div className="loader">Loading...</div> // Loader while media is loading
          ) : (
            mediaPreview && (
              <div className="media-preview-main">
                <div className="media-preview position-relative">
                  <img
                    src={mediaPreview}
                    alt="Selected Media"
                    className="img-thumbnail"
                  />
                  <button
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    onClick={handleRemoveMedia}
                  >
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            )
          )}
        </form>
      ) : (
        <form id="postForm">
          <div className="form-group mb-3 writing_post">
            {/* React Quill Editor */}
            <ReactQuill
              value={editorContent}
              onChange={setEditorContent} // Update the editor content state
              modules={modules}
              placeholder="Write something..."
              theme="snow"
            />
          </div>
          {loading ? (
            <div className="loader">Loading...</div> // Loader while media is loading
          ) : (
            mediaPreview && (
              <>
                <div className="media-preview-main d-flex align-items-center gap-2 mb-3">
                  <div className="media-preview position-relative">
                    <img
                      src={mediaPreview}
                      alt="Selected Media"
                      className="img-thumbnail w-100"
                    />
                    <button
                      className="btn btn-outline-danger text-dark fw-bolder btn-sm position-absolute top-0 end-0"
                      onClick={handleRemoveMedia}
                    >
                      <AiOutlineClose />
                    </button>
                  </div>
                  <div className="media-preview position-relative">
                    <div className="add-new d-flex align-items-center justify-content-center">
                      <FaPlus
                        className="fs-4 text-light"
                        onClick={() =>
                          document.getElementById("inputGroupFile02").click()
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )
          )}

          <div className="input-group mb-3">
            <input
              className="form-control bg-dark text-light d-none"
              id="inputGroupFile02"
              type="file"
              onChange={handleMediaUpload} // Handle media upload
            />
            <button
              type="button"
              className="btn btn-primary w-100 bg-dark border-main rounded-2"
              onClick={() =>
                document.getElementById("inputGroupFile02").click()
              }
            >
              Click to select media
            </button>
          </div>
          <div className="button-section-text-area"></div>

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
              type="button"
              onClick={handleSchedule}
            >
              Schedule
            </button>
          </div>

          {/* Calendar and Time Picker for scheduling */}
          {scheduleDate && scheduleTime && (
            <div className="mt-3 text-light">
              Selected Date and Time:{" "}
              {`${scheduleDate.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })} ${scheduleTime}`}
            </div>
          )}
        </form>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date and Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePicker onDateTimeSelect={handleDateTimeSelect} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostForm;
