import React from "react";

const TikTok = ({ editorContent, uploadedMedia, icon }) => {
  const { images = [], videos = [] } = uploadedMedia || {};

  return (
    <div className="tiktok_review_main text-center">
      <div className="u-align-children-center d-flex align-items-center justify-content-center">
        <div className="tiktok-post-preview-wrapper u-align-children-vertically">
          <div className="tiktok-post-preview-sidenav">
            <img
              className="tiktok-post-preview-account"
              src="https://cdn.publer.io/uploads/picture/tiktok/95cb4156-8e50-57df-ae4a-7dd672789f97.jpg?v=394d03cb872f89a4baa9"
              alt="Account"
            />
            <i className="tiktok-post-preview-heart" />
            <span className="tiktok-post-preview-icon-text">17.3K</span>
            <i className="tiktok-post-preview-comment" />
            <span className="tiktok-post-preview-icon-text">1126</span>
            <i className="tiktok-post-preview-share" />
            <span className="tiktok-post-preview-icon-text">568</span>
          </div>
          <div className="tiktok-post-preview-footer">
            <div className="tiktok-post-preview-caption isBold">
              Hassan Shafiq
            </div>
            <div className="tiktok-post-preview-caption">{editorContent}</div>
            <div className="tiktok-post-preview-music u-align-children-vertically">
            <i class="fa-solid fa-music"></i>
              <span className="tiktok-post-preview-song">
                <marquee direction="left">
                  original sound - Hassan Shafiq
                </marquee>
              </span>
              <div className="tiktok-post-preview-album">
                <img
                  src="https://cdn.publer.io/uploads/picture/tiktok/95cb4156-8e50-57df-ae4a-7dd672789f97.jpg?v=394d03cb872f89a4baa9"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="tiktok-preview-media u-position-relative">
            {videos.length > 0 ? (
              <video
                className="tiktok-post-preview-video"
                src={videos[0]}
                controls
              />
            ) : images.length > 0 ? (
              <div className="carousel-root">
                <div
                  className="carousel carousel-slider style-o4U68"
                  id="style-o4U68"
                >
                  {images.length > 1 && (
                    <>
                      <div className="tiktok_carousel_indicator_main">
                        <span className="tiktok_carousel_indicator"></span>
                        <span className="tiktok_carousel_indicator"></span>
                      </div>
                    </>
                  )}
                  <div className="slider-wrapper axis-horizontal">
                    <ul
                      className="slider animated style-4lAHK"
                      id="style-4lAHK"
                    >
                      {images.map((image, index) => (
                        <li className="slide" key={index}>
                          <img src={image} alt={`slide-${index}`} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <img src="/images/Profile.jpg" alt="default" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTok;
