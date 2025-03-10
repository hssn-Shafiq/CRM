import React, { useState } from "react";
import TruncateText from "../../Services/TruncateText";

const PinterestPreview = ({ editorContent, uploadedMedia }) => {
  const { images = [], videos = [] } = uploadedMedia || {};
  const [activeSlide, setActiveSlide] = useState(0);

  // Handle slide navigation
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="pinterest-preview-wrapper">
      <div className="pinterest-preview-container">
        {/* Header Info */}
        <div className="pinterest-header">
          <div className="pinterest-username">Username</div>
          <div className="pinterest-followers">1.2k followers</div>
        </div>

       
     {editorContent && (
          <TruncateText
          text={editorContent || "A caption below"}
          color="dark"
          maxLength={45}
        />
        )}

        {/* Media Container */}
        <div className="pinterest-media-container">
          {videos.length > 0 ? (
            <div className="pinterest-video-wrapper">
              <video
                src={videos[0]}
                className="pinterest-video"
                playsInline
                muted
                autoPlay={false}
                controls={false}
              />
              <div
                className="pinterest-play-icon"
                onClick={() => {
                  // Simple play logic
                  const videoElement =
                    document.querySelector(".pinterest-video");
                  if (videoElement) {
                    videoElement.play();
                  }
                }}
              >
                ▶
              </div>
            </div>
          ) : images.length > 0 ? (
            <div className="pinterest-images-wrapper">
              {images.length === 1 ? (
                // Single image
                <div className="pinterest-single-image">
                  <img src={images[0]} alt="Pinterest" />
                </div>
              ) : (
                // Multiple images (carousel style)
                <div className="pinterest-image-carousel">
                  <img
                    src={images[activeSlide]}
                    alt={`Pinterest post ${activeSlide + 1}`}
                    className="pinterest-carousel-image"
                  />

                  {/* Image counter */}
                  <div className="pinterest-image-counter">
                    {activeSlide + 1}/{images.length}
                  </div>

                  {/* Navigation buttons */}
                  <button
                    className="pinterest-nav-btn pinterest-prev-btn"
                    onClick={prevSlide}
                  >
                    ‹
                  </button>
                  <button
                    className="pinterest-nav-btn pinterest-next-btn"
                    onClick={nextSlide}
                  >
                    ›
                  </button>

                  {/* Dot indicators */}
                  <div className="pinterest-indicators">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`pinterest-indicator ${
                          index === activeSlide ? "active" : ""
                        }`}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="pinterest-placeholder">
              <span>Add an image or video</span>
            </div>
          )}

          {/* Action buttons */}
          <button className="pinterest-save-button">Save</button>
          <div className="pinterest-action-buttons">
            <button className="pinterest-action-btn pinterest-comment-btn">
              <span>💬</span>
              <span>12</span>
            </button>
            <button className="pinterest-action-btn pinterest-like-btn">
              <span>❤</span>
              <span>243</span>
            </button>
            <button className="pinterest-action-btn pinterest-share-btn">
              <span>↗</span>
            </button>
          </div>
        </div>

        {/* Creator info (at bottom) */}
        <div className="pinterest-creator">
          <img
            src="/images/Profile.jpg"
            alt="Creator"
            className="pinterest-creator-img rounded-circle"
            width="100"
            height="100"
          />
          <div className="pinterest-creator-name">Username</div>
        </div>
      </div>
    </div>
  );
};

export default PinterestPreview;
