// InstagramPreview.js
import React from "react";
// import './InstagramPreview.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BiShare, BiHeart, BiChat } from "react-icons/bi";

// Function for Instagram Post Preview
export const InstagramPostPreview = ({
  editorContent,
  uploadedMedia,
  icon,
  platform,
}) => {
  const { images = [], videos = [] } = uploadedMedia || {};

  return (
    <>
      <div className="instagram-post-preview border rounded mb-4">
        <div className="post-header d-flex align-items-center mb-2">
          <img
            src="/images/Profile.jpg"
            alt="Profile"
            className="profile-img rounded-circle me-2"
          />
          <span className="username fw-bold">hssn-shafiq</span>
        </div>
        <div className="post-image mb-2">
          {images.length > 0 ? (
            <img
              src={images[0] || "/images/Profile.jpg"}
              alt="Post"
              className="w-100"
            />
          ) : (
            " "
          )}
        </div>
        <div className="post-icon">
          {images.length > 0 ? (
            <>
              <BiHeart title="like" />
              <BiChat />
              <BiShare />
            </>
          ) : (
            " "
          )}
        </div>
        <div className="post-caption mt-2">
          <p
            className="m-0 px-3"
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        </div>
      </div>
    </>
  );
};

// Function for Instagram Reel Preview
export const InstagramReelPreview = () => (
  <div className="instagram-reel-preview border rounded p-3 mb-4">
    <div className="reel-header d-flex align-items-center mb-2">
      <img
        src="/images/Profile.jpg"
        alt="Profile"
        className="profile-img rounded-circle me-2"
      />
      <span className="username fw-bold">hssn-shafiq</span>
    </div>
    <div className="reel-video mb-2">
      <div className="reel-placeholder d-flex justify-content-center align-items-center">
        <span>Reel Preview</span>
      </div>
    </div>
    <div className="reel-caption">
      <p className="m-0">This is a sample caption for an Instagram reel.</p>
    </div>
  </div>
);

// Function for Instagram Story Preview
export const InstagramStoryPreview = () => (
  <div className="instagram-story-preview border rounded p-3 mb-4">
    <div className="story-header d-flex align-items-center mb-2">
      <img
        src="/images/Profile.jpg"
        alt="Profile"
        className="profile-img rounded-circle me-2"
      />
      <span className="username fw-bold">hssn-shafiq</span>
    </div>
    <div className="story-image">
      <div className="story-placeholder d-flex justify-content-center align-items-center">
        <span>Story Preview</span>
      </div>
    </div>
  </div>
);
