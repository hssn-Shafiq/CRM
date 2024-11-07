// InstagramPreview.js
import React from 'react';
// import './InstagramPreview.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Function for Instagram Post Preview
export const InstagramPostPreview = () => (
  <div className="instagram-post-preview border rounded p-3 mb-4">
    <div className="post-header d-flex align-items-center mb-2">
      <img
        src="/images/Profile.jpg"
        alt="Profile"
        className="profile-img rounded-circle me-2"
      />
      <span className="username fw-bold">hssn-shafiq</span>
    </div>
    <div className="post-image mb-2">
      <img
        src="/images/Profile.jpg"
        alt="Post"
        className="w-100"
      />
    </div>
    <div className="post-caption">
      <p className="m-0">This is a sample caption for an Instagram post.</p>
    </div>
  </div>
);

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
