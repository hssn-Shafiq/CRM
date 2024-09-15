// ReviewPost.js
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

const platformIcons = {
  facebook: <FaFacebook size={24} className="me-2 social-account-icon" />,
  instagram: <FaInstagram size={24} className="me-2 social-account-icon" />,
  linkedin: <FaLinkedinIn size={24} className="me-2 social-account-icon" />,
  twitter: <FaTwitter size={24} className="me-2 social-account-icon" />,
  tiktok: <FaTiktok size={24} className="me-2 social-account-icon" />,
  pinterest: <FaPinterest size={24} className="me-2 social-account-icon" />,
  whatsapp: <FaWhatsapp size={24} className="me-2 social-account-icon" />,
};

const ReviewPost = ({ selectedPlatforms, editorContent, uploadedMedia }) => {
  const [selectedFilter, setSelectedFilter] = useState("All Accounts");

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

      return (
        <>
         <div className="select-acc d-flex align-items-center justify-content-between  ">
          <strong>Select Account</strong>
          <select
            className="form-select w-auto"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="All Accounts">All Accounts</option>
            {selectedPlatforms.map((platform, index) => (
              <option key={index} value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </option>
            ))}
          </select>
         </div>
          <div className="post-card" key={index}>
            <div className="post-header bg-main">
              <div className="account-item border-0">
                <img
                  src="/images/profile.jpg"
                  alt="profile"
                  className="rounded-circle me-2"
                />
                {platformIcon}
              </div>
              <div>
                <strong className="mb-0 text-light">Hassan Shafiq</strong>
                <br />
                <small className="text-secondary">Just now</small>
              </div>
            </div>
            <div className="post-content mt-3">
              {/* Render the editor content as HTML */}
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    editorContent || "This is a dummy post for scheduling!",
                }}
              />

              {/* Display uploaded media */}
              {uploadedMedia && (
                <img
                  src={uploadedMedia}
                  className="w-100"
                  style={{ objectPosition: "top" }}
                  alt="Uploaded media"
                />
              )}
            </div>
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
        </>
      );
    });
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Post Preview</span>
        {/* Dropdown for filtering posts by platform */}
      </div>
      <div className="card-body text-light rounded-0" id="postPreview">
        {renderPostContent()}
      </div>
    </div>
  );
};

export default ReviewPost;
