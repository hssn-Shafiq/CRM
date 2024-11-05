import React from "react";

const Pinterest = ({ editorContent, uploadedMedia, icon }) => {
  const { images = [], videos = [] } = uploadedMedia || {};
  const maxImages = 5;

  const renderMediaContent = () => {
    if (videos.length > 0) {
      return (
        <video
          className="pinterest-post-preview-video"
          src={videos[0]}
          controls
        />
      );
    } else if (images.length > 0) {
      const visibleImages = images.slice(0, maxImages);
      const remainingCount = images.length - maxImages;
      
      return (
        <div className="pinterest-image-grid">
          {visibleImages.map((image, index) => (
            <div key={index} className={`grid-image-${index + 1}`}>
              <img src={image} alt={`pinterest-preview-${index}`} />
              {index === maxImages - 1 && remainingCount > 0 && (
                <div className="more-overlay">+{remainingCount}</div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return <img src="/images/Profile.jpg" alt="default" />;
    }
  };

  return (
    <div className="pinterest-post-preview text-center">
      <div className="pinterest-post-wrapper u-align-children-center">
        <div className="pinterest-post-header">
          <img
            className="pinterest-post-profile-picture"
            src="https://example.com/path/to/profile.jpg"
            alt="Profile"
          />
          <div className="pinterest-post-username">User Name</div>
        </div>
        
        <div className="pinterest-media-container">{renderMediaContent()}</div>
        
        <div className="pinterest-post-footer">
          <div className="pinterest-post-caption">{editorContent}</div>
          <div className="pinterest-engagement-section">
            <button className="pinterest-like-btn">
              <i className="icon-like" /> Like
            </button>
            <button className="pinterest-comment-btn">
              <i className="icon-comment" /> Comment
            </button>
            <button className="pinterest-share-btn">
              <i className="icon-share" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pinterest;
