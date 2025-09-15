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
// import SocialMediaPostingService from "../services/SocialMediaPostingService";
import SocialMediaPostingService from "../Services/SocialMediaPostingService";

Quill.register("modules/emoji", require("quill-emoji"));

// Define platform content type restrictions
const platformContentTypes = {
  facebook: ["Post", "Reel", "Story"],
  instagram: ["Post", "Reel", "Story"],
  linkedin: ["Post"],
  twitter: ["Post"],
  tiktok: ["Post"],
  pinterest: ["Post"],
  whatsapp: ["Post"],
};

function PostForm({
  selectedPlatforms,
  editorContent,
  setEditorContent,
  setUploadedMedia,
  availablemediaType,
  setAvailableMediaType,
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
  const [isPublishing, setIsPublishing] = useState(false); // For tracking publish vs schedule
  const [publishResults, setPublishResults] = useState(null); // To store detailed results

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
      setAvailablePostTypes(commonTypes.length > 0 ? commonTypes : ["Post"]);

      if (commonTypes.length > 0 && !commonTypes.includes(selectedForm)) {
        setSelectedForm(commonTypes[0]);
      }
    }
  }, [selectedPlatforms, selectedForm]);

  const handleFormSelection = (type) => {
    setSelectedForm(type);
    setAvailableMediaType(type);
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
    setError(""); // Clear any previous date/time related errors
  };

  const handleSave = () => {
    setShowModal(false);
  };

  // Validate form data before submission
  const validateFormData = (checkSchedule = true) => {
    if (!selectedPlatforms.length) {
      setError("Please select at least one platform.");
      return false;
    }

    if (!images.length && !videos.length) {
      setError("Please upload at least one media file.");
      return false;
    }

    const plainTextCaption = editorContent.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    if (!plainTextCaption.trim() && selectedForm !== "Story") {
      setError("Caption is required.");
      return false;
    }

    // Only check schedule date/time if we're scheduling
    if (checkSchedule && (!scheduleDate || !scheduleTime)) {
      setError("Please select a date and time for scheduling.");
      return false;
    }

    return true;
  };

  // Handle publishing the post immediately
  const handlePublish = async (e) => {
    e.preventDefault();
    setIsPublishing(true);

    // For "Publish Now", we don't need to validate schedule date/time
    if (!validateFormData(false)) {
      return;
    }

    await handleSubmitPost();
  };

  // Handle scheduling the post
  const handleSchedulePost = async (e) => {
    e.preventDefault();
    setIsPublishing(false);

    // Make sure we have date and time
    if (!scheduleDate || !scheduleTime) {
      setError("Please select a date and time for scheduling.");
      handleSchedule(); // Open the date picker
      return;
    }

    // Validate the form including schedule date/time
    if (!validateFormData(true)) {
      return;
    }

    await handleSubmitPost();
  };

  // Common submission handler for both publish and schedule
  const handleSubmitPost = async () => {
    setError("");
    setPublishResults(null);

    try {
      setLoading(true);
      setShowModal(false);

      // Extract plain text from editor
      const plainTextCaption = editorContent.replace(/(<([^>]+)>)/gi, "");

      // Combine all media (both images and videos)
      const allMedia = [...images, ...videos];

      // Decide whether to publish immediately or schedule
      if (isPublishing) {
        // Publish immediately to all selected platforms
        const result = await SocialMediaPostingService.postToAllPlatforms(
          plainTextCaption,
          allMedia,
          selectedPlatforms,
          selectedForm
        );

        setPublishResults(result);

        if (result.success) {
          toast.success("Post published successfully!");
        } else {
          // Handle partial success (some platforms failed)
          if (result.results && result.results.length > 0) {
            toast.success(
              `Published to ${result.results.length} platform(s) successfully!`
            );
          }

          // Show errors for failed platforms
          result.errors.forEach((err) => {
            toast.error(`Failed to post to ${err.platform}: ${err.error}`);
          });
        }
      } else {
        // Schedule for later
        if (!scheduleDate || !scheduleTime) {
          setError("Please select a date and time for scheduling.");
          return;
        }

        const result =
          await SocialMediaPostingService.schedulePostsToAllPlatforms(
            plainTextCaption,
            allMedia,
            selectedPlatforms,
            scheduleDate,
            scheduleTime,
            selectedForm
          );

        if (result.success) {
          toast.success("Post scheduled successfully!");
        } else {
          toast.error(`Failed to schedule post: ${result.error}`);
        }
      }

      // Reset form after successful submission
      // Uncomment these if you want to clear the form after submission
      // setEditorContent("");
      // setImages([]);
      // setVideos([]);
      // setUploadedMedia({ images: [], videos: [] });
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error(error.message || "Error posting data");
      setError(
        error.response?.data?.message ||
          "Failed to create the post. Please check your input data."
      );
    } finally {
      setLoading(false);
    }
  };

  // Alternative backend submission (keep as fallback)
  const handleSubmitToBackend = async (e) => {
    e.preventDefault();
    setError("");

    // Validation checks
    if (!validateFormData(true)) {
      return;
    }

    if (!scheduleDate || !scheduleTime) {
      setError("Please select a date and time for scheduling.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", editorContent.replace(/(<([^>]+)>)/gi, ""));
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
        "https://crm.digibuzzify.com/api/posts",
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
      toast.error("Error posting data:" + error.message);
      setError(
        error.response?.data?.message ||
          "Failed to create the post. Please check your input data."
      );
    } finally {
      setLoading(false);
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
            <p className="mt-3 text-light">
              {isPublishing
                ? "Publishing your post..."
                : "Scheduling your post..."}
            </p>
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
                    <div className="d-flex flex-wrap gap-2 media-preview-row">
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
                            type="button"
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
                    <div className="d-flex flex-wrap gap-2 media-preview-row">
                      {videos.map((video, index) => (
                        <div
                          key={index}
                          className="media-preview position-relative"
                        >
                          <video src={video} className="img-thumbnail" />
                          <button
                            type="button"
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

            {error && <p className="text-danger">{error}</p>}

            {/* Display results */}
            {publishResults && !loading && (
              <div className="publish-results mb-3">
                {publishResults.results &&
                  publishResults.results.length > 0 && (
                    <div className="alert alert-success">
                      <strong>Success!</strong> Published to:{" "}
                      {publishResults.results.map((r) => r.platform).join(", ")}
                    </div>
                  )}

                {publishResults.errors && publishResults.errors.length > 0 && (
                  <div className="alert alert-warning">
                    <strong>Issues:</strong>
                    <ul className="mb-0 mt-1">
                      {publishResults.errors.map((err, i) => (
                        <li key={i}>
                          {err.platform}: {err.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

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
                        <button type="button" onClick={handleSchedule}>
                          Select Now
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-publish responsive-buttons fw-semibold me-3"
                type="button"
                onClick={handlePublish}
                disabled={loading}
              >
                {loading && isPublishing ? "Publishing..." : "Publish Now"}
              </button>
              <button
                className="btn btn-schedule responsive-buttons fw-semibold me-3"
                type="button"
                onClick={handleSchedulePost}
                disabled={loading}
              >
                {loading && !isPublishing ? "Scheduling..." : "Schedule"}
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
