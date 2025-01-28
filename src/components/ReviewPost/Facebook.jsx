import React from "react";
import "./reviewpost.css";

export const FacebookReel = ({
  editorContent,
  uploadedMedia,
  icon,
  platform,
}) => {
  const { images = [], videos = [] } = uploadedMedia || {};

  const maxVideo = videos.slice(0, 1);

  console.log("max video is ", maxVideo);
  return (
    <>
      <div className="u-align-children-center snipcss-1Y3V4 d-flex align-items-center justify-content-center">
        <div className="facebook-reel-preview-wrapper u-align-children-vertically">
          <div className="facebook-reel-preview-sidenav">
            <i class="fa-regular fa-thumbs-up"></i>
            <span className="facebook-reel-preview-text u-margin-top-5">
              15.6K
            </span>
            <i class="fa-regular fa-comment"></i>
            <span className="facebook-reel-preview-text u-margin-top-5">
              937
            </span>
            <i class="fa-solid fa-share"></i>
            <span className="facebook-reel-preview-text u-margin-top-5">
              119
            </span>
            <i class="fa-solid fa-ellipsis"></i>
          </div>
          <div className="facebook-reel-preview-footer">
            <div className="u-align-children-vertically u-margin-bottom-15">
              <img
                className="facebook-reel-preview-account img img-circle img-responsive u-image-fit u-margin-right-10"
                src={images[0] || "/images/Profile.jpg"}
                alt=""
              />
              <span className="facebook-reel-preview-text isBold">
                Tech Sphere Logix
              </span>
            </div>
            <div className="u-display-flex gap-8 mt-3">
              <div className="facebook-reel-preview-music u-align-children-vertically">
                <i class="fa-solid fa-music"></i>
                <span className="facebook-reel-preview-song facebook-reel-preview-text">
                  <marquee direction="left">
                    Tech Sphere Logix • Original Audio
                  </marquee>
                </span>
              </div>
            </div>
          </div>
          <div className="u-width-100 ">
            <div className="" role="region" tabIndex={-1}>
              <video
                className="video-react-video w-100"
                autoPlay
                src={maxVideo}
              ></video>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const FacebookShort = ({
  editorContent,
  uploadedMedia,
  icon,
  platform,
}) => {
  const { images = [], videos = [] } = uploadedMedia || {};
  return (
    <>
      <div className="u-align-children-center snipcss-1Y3V4 d-flex align-items-center justify-content-center">
        <div className="facebook-reel-preview-wrapper u-align-children-vertically">
          <div className="facebook-reel-preview-footer">
            <div className="u-align-children-vertically u-margin-bottom-15">
              <img
                className="facebook-reel-preview-account img img-circle img-responsive u-image-fit u-margin-right-10"
                src={images[0] || "/images/Profile.jpg"}
                alt=""
              />
              <span className="facebook-reel-preview-text isBold">
                Tech Sphere Logix
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Update the MediaItem component
const MediaItem = ({ media, index = 0, className, isFirstColumn = false }) => {
  const altText = isFirstColumn ? "First Media" : `Media ${index + 1}`;
  return (
    <img
      key={index}
      src={media}
      alt={altText}
      className={`column-image ${className}`}
    />
  );
};

const MediaOverlay = ({ media, extraCount }) => (
  <div className="facebook-media-overlay-container">
    <img
      src={media}
      alt="Third Visible Media"
      className="column-image column-media h-100"
    />
    {extraCount > 0 && <div className="media-overlay">+{extraCount}</div>}
  </div>
);

const PostHeader = ({ icon }) => (
  <div className="facebook-post-header">
    <div className="u-display-flex u-width-100 u-text-overflow-ellipsis">
      <div className="facebook-post-preview-icon">
        <img
          src="/images/profile.jpg"
          alt="Profile"
          className="facebook-post-profile-icon"
        />
        {icon}
      </div>
      <div>
        <div className="facebook-post-preview-account-wrapper">
          <div className="facebook-album-preview-account">
            <span className="facebook-post-account-name">
              Tech Sphere Logix
            </span>
          </div>
          <div className="u-display-flex gap-4">
            <span className="facebook-post-account-time">Just now</span>
          </div>
        </div>
      </div>
    </div>
    <div className="facebook-post-preview-icon">
      <img
        src="/images/menu.png"
        alt="More options"
        className="facebook-post-three-dots-icon"
      />
    </div>
  </div>
);

const PostFooter = () => (
  <div className="facebook-post-footer">
    <div className="u-align-children-vertically facebook-post-preview-icon">
      <i className="far fa-thumbs-up facebook-post-preview-footer-icon"></i>
      Like
    </div>
    <div className="u-align-children-vertically facebook-post-preview-icon">
      <i className="far fa-comment facebook-post-preview-footer-icon"></i>
      Comment
    </div>
    <div className="u-align-children-vertically facebook-post-preview-icon">
      <i className="fas fa-share facebook-post-preview-footer-icon"></i>
      Share
    </div>
  </div>
);

const MediaLayout = ({ maxMedia, extraMediaCount }) => {
  if (!maxMedia.length) return null;

  if (maxMedia.length === 1) {
    return <MediaItem media={maxMedia[0]} className="full-width-image" />;
  }

  if (maxMedia.length === 2) {
    return (
      <div className="facebook-two-columns">
        {maxMedia.map((media, index) => (
          <MediaItem
            key={index}
            media={media}
            index={index}
            className="two-columns-images column-media"
          />
        ))}
      </div>
    );
  }

  const firstColumnMedia = maxMedia[0];
  const secondColumnItems = maxMedia.slice(1);
  const visibleItems = secondColumnItems.slice(0, 3);

  return (
    <div className="facebook-two-columns">
      <div className="column preview-column-1">
        <MediaItem
          media={firstColumnMedia}
          className="column-media"
          isFirstColumn
        />
      </div>

      <div
        className={`column preview-column-2 ${
          maxMedia.length > 3 ? "preview-column-2-extended" : ""
        }`}
      >
        {visibleItems.slice(0, 2).map((media, index) => (
          <MediaItem
            key={index}
            media={media}
            index={index}
            className="column-media"
          />
        ))}
        {visibleItems.length >= 3 && (
          <MediaOverlay media={visibleItems[2]} extraCount={extraMediaCount} />
        )}
      </div>
    </div>
  );
};

const Facebook = ({ editorContent, uploadedMedia, icon, platform }) => {
  const { images = [], videos = [] } = uploadedMedia || {};
  const singleVideo = videos.slice(0, 1);
  const maxMedia = [...images.slice(0, 4), ...singleVideo];
  const extraMediaCount =
    images.length + singleVideo.length > 4 ? images.length - 4 : 0;

  return (
    <section className="live-preview__content">
      <div className="live-preview__post">
        <div className="facebook-post-preview-wrapper">
          <PostHeader icon={icon} />

          <div className="facebook-post-content">
            <div dangerouslySetInnerHTML={{ __html: editorContent }} />
          </div>

          <div className="facebook-preview-media">
            {videos.length > 0 ? (
              <video
                className="facebook-post-preview-video w-100"
                src={singleVideo}
                autoPlay
                muted
              />
            ) : (
              <MediaLayout
                maxMedia={maxMedia}
                extraMediaCount={extraMediaCount}
              />
            )}
          </div>

          <PostFooter />
        </div>
      </div>
    </section>
  );
};

export default Facebook;
