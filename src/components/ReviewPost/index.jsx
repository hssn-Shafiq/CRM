import React, { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaTiktok,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Platform icons for each social media
const platformIcons = {
  facebook: <FaFacebook size={24} className="me-2 social-account-icon" />,
  instagram: <FaInstagram size={24} className="me-2 social-account-icon" />,
  linkedin: <FaLinkedinIn size={24} className="me-2 social-account-icon" />,
  twitter: <FaTwitter size={24} className="me-2 social-account-icon" />,
  tiktok: <FaTiktok size={24} className="me-2 social-account-icon" />,
  pinterest: <FaPinterest size={24} className="me-2 social-account-icon" />,
  whatsapp: <FaWhatsapp size={24} className="me-2 social-account-icon" />,
};

// Platform-specific dimensions
const platformSizes = {
  facebook: { width: '100%', height: 'auto' },
  instagram: { width: '400px', height: '400px' },
  linkedin: { width: '600px', height: 'auto' },
  twitter: { width: '500px', height: 'auto' },
  tiktok: { width: '300px', height: '600px' },
  pinterest: { width: '500px', height: 'auto' },
  whatsapp: { width: '500px', height: 'auto' },
};

const ReviewPost = ({ selectedPlatforms, editorContent, uploadedMedia }) => {
  const [selectedFilter, setSelectedFilter] = useState("All Accounts");

  // Function to render images and videos from uploaded media
  const renderMedia = (media) => {
    if (!media) return null;
    const { images = [], videos = [] } = media;

    return (
      <div className="media-gallery mt-3">
        {/* Render images */}
        {images.length > 0 && (
          <div className="media-section mb-3">
            <h6>Images</h6>
            <div className="d-flex flex-wrap gap-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  className="img-thumbnail"
                  alt={`Uploaded media ${index + 1}`}
                  style={{ objectPosition: "top" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Render videos */}
        {videos.length > 0 && (
          <div className="media-section">
            <h6>Videos</h6>
            <div className="d-flex flex-wrap gap-2">
              {videos.map((video, index) => (
                <video
                  key={index}
                  src={video}
                  controls
                  className="img-thumbnail"
                  alt={`Uploaded video ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to render the post content based on platform
  const renderPostContent = () => {
    if (!selectedPlatforms.length)
      return <p>Select a social account and a post to preview</p>;

    // Filter posts based on selected filter
    const filteredPlatforms =
      selectedFilter === "All Accounts"
        ? selectedPlatforms
        : selectedPlatforms.filter(
            (platform) =>
              platform.toLowerCase() === selectedFilter.toLowerCase()
          );

    return filteredPlatforms.map((platform, index) => {
      // Get the icon for the selected platform or use a default icon
      const platformIcon = platformIcons[platform] || (
        <FaFacebook size={24} className="me-2 social-account-icon" />
      );

      // Get platform-specific sizes
      const platformSize = platformSizes[platform] || { width: '500px', height: 'auto' };

      return (
        <div key={index} style={{ width: platformSize.width, height: platformSize.height }}>
          {/* Post card with platform-specific styling */}
          <div className="post-card" style={{ width: "100%", height: "100%" }}>
            <div className="post-header bg-main d-flex align-items-center justify-content-start">
              <div className="account-item border-0 ">
                <img
                  src="/images/profile.jpg"
                  alt="profile"
                  className="rounded-circle "
                />
                {platformIcon}
              </div>
              <div>
                <strong className="mb-0 text-light">Hassan Shafiq</strong>
                <br />
                <small className="text-secondary">Just now</small>
              </div>
            </div>

            {/* Post content from editor */}
            <div className="post-content mt-3">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    editorContent || "This is a dummy post for scheduling!",
                }}
              />

              {/* Render uploaded media (images and videos separately) */}
              {renderMedia(uploadedMedia)}
            </div>

            {/* Post actions */}
            <div className="post-actions">
              <Link to="#">
                <i className="far fa-thumbs-up"></i> Like
              </Link>
              <Link to="#">
                <i className="far fa-comment"></i> Comment
              </Link>
              <Link to="#">
                <i className="fas fa-share"></i> Share
              </Link>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Post Preview</span>
        {/* Dropdown for filtering posts by platform */}
        <div className="select-acc ">
          <select
            className="form-select w-auto border-main "
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="All Accounts">Select Accounts</option>
            {selectedPlatforms.map((platform, index) => (
              <option key={index} value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="card-body text-light rounded-0 p-2" id="postPreview">
        {renderPostContent()}
      </div>
    </div>
  );
};

export default ReviewPost;
