import React from "react";
import "./reviewpost.css";

const LinkedIn = ({ editorContent, uploadedMedia, icon }) => {
  const { images = [] } = uploadedMedia || {};

  const renderImagesLayout = () => {
    const maxImages = images.slice(0, 5); // Limit to 5 images
    const extraImagesCount = images.length > 5 ? images.length - 5 : 0;

    return (
      <div className={` linkedin-media-container ${images.length > 1 ? " linkedin-media-container-fheight ": ""}`}  >
        {/* First row with two images */}
        <div className={`linkedin-first-row ${images.length === 2 ? " linkedin-single-preview ": ""} `}>
          {maxImages.slice(0, 2).map((img, index) => (
            <img key={index} src={img} alt={`Media ${index + 1}`} className="linkedin-column-image" />
          ))}
        </div>
        {/* Second row with three images */}
        <div className="linkedin-second-row">
          {maxImages.slice(2).map((img, index) => {
            if (index === maxImages.slice(2).length - 1 && extraImagesCount > 0) {
              // If this is the last image and there are extra images, show the +n overlay
              return (
                <div className="media-overlay-container" key={index}>
                  <img src={img} alt={`Media ${index + 3}`} className="linkedin-column-image w-100" />
                  <div className="media-overlay">
                    +{extraImagesCount}
                  </div>
                </div>
              );
            } else {
              return (
                <img
                  key={index}
                  src={img}
                  alt={`Media ${index + 3}`}
                  className="linkedin-column-image"
                />
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="live-preview__content">
      <div className="live-preview__post">
        <div className="linkedin-post-preview-wrapper">
          <div className="linkedin-post-header">
            <div className="u-display-flex width-100 u-text-overflow-ellipsis">
              <div className="linkedin-post-preview-icon">
                <img
                  src="/images/profile.jpg"
                  alt="Profile"
                  className="linkedin-post-profile-icon"
                />
                {icon}
              </div>
              <div>
                <div className="linkedin-post-preview-account-wrapper">
                  <span className="linkedin-post-account-name">
                    Tech Sphere Logix
                  </span>
                  <div className="u-display-flex gap-4">
                    <span className="linkedin-post-account-time">Just now</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="linkedin-post-preview-icon">
              <img
                src="/images/menu.png"
                alt="More options"
                className="linkedin-post-three-dots-icon"
              />
            </div>
          </div>

          {/* Post content */}
          <div className="linkedin-post-content">
            <div dangerouslySetInnerHTML={{ __html: editorContent }} />
          </div>

          {/* Media section */}
          <div className="linkedin-preview-media">
            {renderImagesLayout()}
          </div>

          <div className="linkedin-post-footer">
            <div className="u-align-children-vertically linkedin-post-preview-icon">
              <i className="far fa-thumbs-up linkedin-post-preview-footer-icon"></i>
              Like
            </div>
            <div className="u-align-children-vertically linkedin-post-preview-icon">
              <i className="far fa-comment linkedin-post-preview-footer-icon"></i>
              Comment
            </div>
            <div className="u-align-children-vertically linkedin-post-preview-icon">
              <i className="fas fa-share linkedin-post-preview-footer-icon"></i>
              Share
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinkedIn;
