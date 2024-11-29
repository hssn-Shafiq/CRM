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
import Facebook, { FacebookReel, FacebookShort } from "./Facebook"; // Import your Facebook component
import Linkedin from "./Linkedin"; // Import your Facebook component
import TikTok from "./TikTok";
import Pinterest from "./Pinterest";
import {
  InstagramPostPreview,
  InstagramReelPreview,
  InstagramStoryPreview,
} from "./Instagram";
import Twitter from "./Twitter";
import Whatsapp from "./Whatsapp";

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

const ReviewPost = ({
  selectedPlatforms,
  editorContent,
  uploadedMedia,
  availablemediaType,
}) => {
  const [selectedFilter, setSelectedFilter] = useState("All Accounts");

  // Function to render the appropriate platform component
  const renderPlatformComponent = (platform, platformIcon) => {
    const commonProps = {
      editorContent,
      uploadedMedia,
      icon: platformIcon,
      platform,
    };

    switch (platform.toLowerCase()) {
      case "facebook":
        if (availablemediaType === "Post") {
          return (
            <Facebook
              editorContent={editorContent}
              uploadedMedia={uploadedMedia}
              icon={platformIcon}
              platform={platform}
            />
          );
        } else if (availablemediaType === "Reel") {
          return (
            <FacebookReel
              editorContent={editorContent}
              uploadedMedia={uploadedMedia}
              icon={platformIcon}
              platform={platform}
            />
          );
        } else {
          return (
            <FacebookShort
              editorContent={editorContent}
              uploadedMedia={uploadedMedia}
              icon={platformIcon}
              platform={platform}
            />
          );
        }
        break;

      case "linkedin":
        return (
          <Linkedin
            editorContent={editorContent}
            uploadedMedia={uploadedMedia}
            icon={platformIcon}
          />
        );

      case "tiktok":
        return (
          <TikTok
            editorContent={editorContent}
            uploadedMedia={uploadedMedia}
            icon={platformIcon}
          />
        );
      case "pinterest":
        return (
          <Pinterest
            editorContent={editorContent}
            uploadedMedia={uploadedMedia}
            icon={platformIcon}
          />
          
        );
      case "instagram":
        if (availablemediaType === "Post") {
          return (
            <InstagramPostPreview
              editorContent={editorContent}
              uploadedMedia={uploadedMedia}
              icon={platformIcon}
              platform={platform}
            />
          );
        } else if (availablemediaType === "Reel") {
          return (
            <InstagramReelPreview
              editorContent={editorContent}
              uploadedMedia={uploadedMedia}
              icon={platformIcon}
              platform={platform}
            />
          );
        } else {
          return (
            <InstagramStoryPreview
              editorContent={editorContent}
              uploadedMedia={uploadedMedia}
              icon={platformIcon}
              platform={platform}
            />
          );
        };
        
      case "twitter":
        return (
          <Twitter
            editorContent={editorContent}
            uploadedMedia={uploadedMedia}
            icon={platformIcon}
          />
        );
      case "whatsapp":
        return (
          <Whatsapp
            editorContent={editorContent}
            uploadedMedia={uploadedMedia}
            icon={platformIcon}
          />
        );
      // Add other platform-specific components here
      default:
        return <p>This is a dummy post for scheduling!</p>;
    }
  };

  // Function to render the post content based on platform
  const renderPostContent = () => {
    if (!selectedPlatforms.length)
      return <p>Select a social account and a post to preview</p>;

    const filteredPlatforms =
      selectedFilter === "All Accounts"
        ? selectedPlatforms
        : selectedPlatforms.filter(
            (platform) =>
              platform.toLowerCase() === selectedFilter.toLowerCase()
          );

    return filteredPlatforms.map((platform, index) => {
      const platformIcon = platformIcons[platform];

      return (
        <div key={index} style={{ width: "100%", height: "auto" }}>
          {/* Only render the platform-specific component */}
          <div className="post-content mt-3">
            {renderPlatformComponent(platform, platformIcon)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>Post Preview</span>
        <div className="select-acc">
          <select
            className="form-select w-auto border-main"
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
      <div className="card-body text-light rounded-0 p-2 px-4" id="postPreview">
        {renderPostContent()}
      </div>
    </div>
  );
};

export default ReviewPost;
