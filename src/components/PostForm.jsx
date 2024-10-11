// PostForm.js
import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import "quill-emoji/dist/quill-emoji.css";
import { Quill } from "react-quill";
import "quill-emoji/dist/quill-emoji";
import { AiOutlineClose } from "react-icons/ai";
import { FaCalendar, FaPlus } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "./DatePicker";
import axios from "axios";
import { ClipLoader } from "react-spinners";

Quill.register("modules/emoji", require("quill-emoji"));

// Define platform content type restrictions
const platformContentTypes = {
  facebook: ["Post", "Reel", "Story"],
  instagram: ["Post", "Reel", "Story"],
  linkedin: ["Post"],
  twitter: ["Post"],
  tiktok: ["Reel"],
  pinterest: ["Post"],
  whatsapp: ["Post"],
};

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
  const [images, setImages] = useState([]); // For storing images
  const [videos, setVideos] = useState([]); // For storing videos
  const [showModal, setShowModal] = useState(false);
  const [availablePostTypes, setAvailablePostTypes] = useState(["Post"]);
  const [error, setError] = useState("");
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (selectedPlatforms.length === 0) {
      setAvailablePostTypes(["Post"]); // Default to Post if no platforms selected
    } else {
      const commonTypes = selectedPlatforms.reduce((acc, platform) => {
        const platformTypes =
          platformContentTypes[platform.toLowerCase()] || [];
        return acc.length === 0
          ? platformTypes
          : acc.filter((type) => platformTypes.includes(type));
      }, []);
      setAvailablePostTypes(commonTypes);

      if (!commonTypes.includes(selectedForm)) {
        setSelectedForm(commonTypes[0]);
      }
    }
  }, [selectedPlatforms, selectedForm]);

  const handleFormSelection = (type) => {
    setSelectedForm(type);

    // Clear images if switching to "Reel" or "Story"
    if (type === "Reel" || type === "Story") {
      setImages([]); // Remove selected images
      setUploadedMedia((prevMedia) => ({
        ...prevMedia,
        images: [], // Clear images in uploadedMedia state
      }));
    }
  };

  // Handle media upload based on selected form type
  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];
    const newVideos = [];

    files.forEach((file) => {
      if (file.type.startsWith("image/") && selectedForm === "Post") {
        newImages.push(URL.createObjectURL(file));
      } else if (file.type.startsWith("video/")) {
        newVideos.push(URL.createObjectURL(file));
      }
    });

    // Merge new media with existing media
    setImages((prevImages) => [...prevImages, ...newImages]);
    setVideos((prevVideos) => [...prevVideos, ...newVideos]);

    setUploadedMedia((prevMedia) => ({
      images: [...(prevMedia?.images || []), ...newImages],
      videos: [...(prevMedia?.videos || []), ...newVideos],
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    setUploadedMedia((prevMedia) => ({
      ...prevMedia,
      images: updatedImages,
    }));
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);

    setUploadedMedia((prevMedia) => ({
      ...prevMedia,
      videos: updatedVideos,
    }));
  };

  const handleSchedule = () => {
    setShowModal(true);
  };

  const handleDateTimeSelect = (date, time) => {
    setScheduleDate(date);
    setScheduleTime(time);
  };

  const handleSave = () => {
    setShowModal(false);
  };
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validation checks
    if (!selectedPlatforms.length) {
      setError("Please select at least one platform.");
      return;
    }
    if (!scheduleDate || !scheduleTime) {
      setError("Please select a date and time for scheduling.");
      return;
    }
    if (!images.length && !videos.length) {
      setError("Please upload at least one media file.");
      return;
    }

    const plainTextCaption = editorContent.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    if (!plainTextCaption.trim() && selectedForm !== "Story") {
      setError("Caption is required.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", plainTextCaption);
    formData.append(
      "scheduled_for",
      `${scheduleDate.toISOString().split("T")[0]} ${scheduleTime}`
    );
    for (const pltf of selectedPlatforms) {
      formData.append("platform[]", pltf);
    }
    formData.append("user_id", 10);

    // Append media files from the images and videos state
    for (const img of images) {
      const file = await fetch(img).then((r) => r.blob());
      formData.append("media[]", file);
    }

    for (const video of videos) {
      const file = await fetch(video).then((r) => r.blob());
      formData.append("media[]", file);
    }

    try {
      setLoading(true);
      setShowModal(false);
      const token = "Bearer 1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";
      const response = await axios.post(
        "https://crmapi.alayaarts.com/api/posts",
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Post scheduled successfully!");
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error("Error posting data:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create the post. Please check your input data."
      );
    } finally {
      setLoading(false);
      // window.location.reload();
    }
  };

  const modules = {
    toolbar: [["bold", "italic"], ["emoji"]],
    "emoji-toolbar": true,
    "emoji-textarea": false,
    "emoji-shortname": true,
  };

  return (
    <>
      <ToastContainer />
      <div>
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

        {loading ? (
          <div className="text-center p-4">
            <ClipLoader color="#fff" loading={loading} size={50} />
          </div>
        ) : (
          <form id="postForm">
            {/* Hide Quill for Story */}
            {selectedForm !== "Story" && (
              <div className="form-group mb-3 writing_post">
                <ReactQuill
                  value={editorContent}
                  onChange={setEditorContent}
                  modules={modules}
                  placeholder="Write something..."
                  theme="snow"
                />
              </div>
            )}
            <div className="input-group mb-3">
              <input
                className="form-control bg-dark text-light d-none"
                id="inputGroupFile02"
                type="file"
                accept={
                  selectedForm === "Reel" || selectedForm === "Story"
                    ? "video/*"
                    : "image/*,video/*"
                }
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
                Click to select{" "}
                {selectedForm === "Reel" || selectedForm === "Story"
                  ? "videos"
                  : "images/videos"}
              </button>
            </div>
            {loading ? (
              <div className="loader">{ClipLoader} </div>
            ) : (
              <div>
                {images.length > 0 && selectedForm !== "Story" && (
                  <div className="media-preview-main mb-3 d-flex gap-2">
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
                    <div className="media-preview position-relative">
                      <div className="add-new d-flex align-items-center justify-content-center ">
                        <FaPlus
                          className="fs-4 text-light "
                          onClick={() =>
                            document.getElementById("inputGroupFile02").click()
                          }
                        />
                      </div>
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
                          <video
                            src={video}
                            controls
                            className="img-thumbnail"
                          />
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
            {error && <p className="text-danger">{error}</p>}{" "}
            {/* Display error messages */}
            <div className="date_show">
              <div className="show text-light">
                {scheduleDate ? (
                  <>
                   <div className="date_sel d-flex gap-2 align-items-center">
                    <FaCalendar />
                    {`${
                      scheduleDate.toISOString().split("T")[0]
                    },  ${scheduleTime}`}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="date_sel d-flex gap-2 align-items-center">
                      <FaCalendar />
                      <p className="mb-0">
                        No date selected{" "}
                        <button type="button" onClick={handleSchedule}>Select Now</button>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end">
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
                onClick={handleSubmit}
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
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default PostForm;
