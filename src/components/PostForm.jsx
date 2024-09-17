// PostForm.js
import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import "quill-emoji/dist/quill-emoji.css";
import { Quill } from "react-quill";
import "quill-emoji/dist/quill-emoji";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "./DatePicker";
import axios from "axios"; // Import axios for API requests
import { ClipLoader } from "react-spinners"; // Import a spinner loader from react-spinners

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
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const datePickerRef = useRef(null);

  const handleFormSelection = (type) => {
    setSelectedForm(type);
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = [];
    const videoFiles = [];

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        imageFiles.push(URL.createObjectURL(file));
      } else if (file.type.startsWith("video/")) {
        videoFiles.push(URL.createObjectURL(file));
      }
    });

    setImages((prevImages) => [...prevImages, ...imageFiles]);
    setVideos((prevVideos) => [...prevVideos, ...videoFiles]);
    setUploadedMedia({ images: imageFiles, videos: videoFiles });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  const handleSchedule = () => {
    setShowModal(true);
  };

  const handleDateTimeSelect = (date, time) => {
    setScheduleDate(date);
    setScheduleTime(time);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Extract plain text from ReactQuill content if necessary
    const plainTextCaption = editorContent.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    // Ensure the caption is not empty
    if (!plainTextCaption.trim()) {
      alert("Caption is required.");
      return;
    }
    // Prepare the payload for the API
    const formData = new FormData();

    // Append each field to FormData correctly
    formData.append("caption", plainTextCaption); // Add caption correctly
    formData.append("link_preview", "https://example.com"); // Replace with your link preview
    formData.append("location", "New York"); // Replace with location data if available
    formData.append(
      "scheduled_for",
      `${scheduleDate.toISOString().split("T")[0]} ${scheduleTime}`
    );
    formData.append("call_to_action", "Learn More About");
    for (const pltf of selectedPlatforms) {
      formData.append("platform[]", pltf);
    }
    formData.append("user_id", 10); // Replace with the actual user ID if needed

    // Append media files from the images and videos state
    for (const img of images) {
      const file = await fetch(img).then((r) => r.blob()); // Convert blob URL to actual blob
      formData.append("media[]", file); // Append each file to the FormData
    }

    for (const video of videos) {
      const file = await fetch(video).then((r) => r.blob()); // Convert blob URL to actual blob
      formData.append("media[]", file); // Append each file to the FormData
    }

    try {
      setLoading(true);
      setShowModal(false);
      // console.log("the data that is pasing is", payload);

      const token = "Bearer 1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";
      // Make the API request to the endpoint
      const response = await axios.post(
        "https://crmapi.alayaarts.com/api/posts",
        formData,
        {
          headers: {
            Authorization: `${token}`, // Include the token in the request headers
            "Content-Type": "multipart/form-data", // Set content type to FormData
          },
        }
      );

      alert("Post schedule successfully!");
    } catch (error) {
      console.error("Error posting data:", error);
      if (error.response && error.response.data) {
        alert(`Failed to create the post: ${error.response.data.message}`);
      } else {
        alert("Failed to create the post. Please check your input data.");
      }
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const modules = {
    toolbar: [["bold", "italic"], ["emoji"]],
    "emoji-toolbar": true,
    "emoji-textarea": false,
    "emoji-shortname": true,
  };

  return (
    <div>
      <div className="d-flex mb-3">
        {(selectedPlatforms.includes("facebook") ||
          selectedPlatforms.includes("instagram")) &&
          ["Post", "Reel", "Story"].map((type) => (
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
      {loading ? (
        <div className="text-center p-4">
        <ClipLoader color="#fff" loading={loading} size={50} />

        </div>
      ) : (
        <form id="postForm">
          <div className="form-group mb-3 writing_post">
            <ReactQuill
              value={editorContent}
              onChange={setEditorContent}
              modules={modules}
              placeholder="Write something..."
              theme="snow"
            />
          </div>

          <div className="input-group mb-3">
            <input
              className="form-control bg-dark text-light d-none"
              id="inputGroupFile02"
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaUpload}
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

          {loading ? (
            <div className="loader">{ClipLoader} </div>
          ) : (
            <div>
              {images.length > 0 && (
                <div className="media-preview-main mb-3">
                  <h5 className="text-light">Images</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="media-preview position-relative"
                      >
                        <img
                          src={img}
                          alt={`selected `}
                          className="img-thumbnail"
                        />
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 end-0"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {videos.length > 0 && (
                <div className="media-preview-main mb-3">
                  <h5 className="text-light">Videos</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {videos.map((video, index) => (
                      <div
                        key={index}
                        className="media-preview position-relative"
                      >
                        <video src={video} controls className="img-thumbnail" />
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 end-0"
                          onClick={() => handleRemoveVideo(index)}
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-outline-secondary responsive-buttons fw-semibold me-3"
              type="button"
            >
              Draft
            </button>
            <button
              className="btn btn-publish responsive-buttons fw-semibold me-3"
              type="button"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
            <button
              className="btn btn-schedule responsive-buttons fw-semibold me-3"
              type="button"
              onClick={handleSchedule}
            >
              Schedule
            </button>
          </div>
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
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostForm;
