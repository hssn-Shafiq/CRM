import React from "react";
import "./reviewpost.css";

export const FacebookReel = ({
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

const Facebook = ({ editorContent, uploadedMedia, icon, platform }) => {
  const { images = [], videos = [] } = uploadedMedia || {};

  // Restrict videos to only one
  const singleVideo = videos.slice(0, 1);

  const renderMediaLayout = () => {
    const maxMedia = [...images.slice(0, 5), ...singleVideo];
    const extraMediaCount =
      images.length + singleVideo.length > 5 ? images.length - 5 : 0;

    if (maxMedia.length === 1) {
      return typeof maxMedia[0] === "string" && maxMedia[0].includes(".mp4") ? (
        <video src={maxMedia[0]} controls className="full-width-video" />
      ) : (
        <img src={maxMedia[0]} alt="Media 1" className="full-width-image" />
      );
    }

    if (maxMedia.length === 2) {
      return (
        <div className="facebook-two-columns-images">
          {maxMedia.map((media, index) =>
            typeof media === "string" && media.includes(".mp4") ? (
              <video
                key={index}
                src={media}
                controls
                className="two-columns-videos "
              />
            ) : (
              <img
                key={index}
                src={media}
                alt={`Media ${index + 1}`}
                className="two-columns-images column-image"
              />
            )
          )}
        </div>
      );
    }

    if (maxMedia.length === 3) {
      return (
        <div className="facebook-three-columns">
          <div className="column three-columns-1">
            {maxMedia
              .slice(0, 2)
              .map((media, index) =>
                typeof media === "string" && media.includes(".mp4") ? (
                  <video
                    key={index}
                    src={media}
                    controls
                    className="column-video column-media"
                  />
                ) : (
                  <img
                    key={index}
                    src={media}
                    alt={`Media ${index + 1}`}
                    className="column-image column-media"
                  />
                )
              )}
          </div>
          <div className="column three-columns-2">
            {typeof maxMedia[2] === "string" && maxMedia[2].includes(".mp4") ? (
              <video
                src={maxMedia[2]}
                controls
                className="column-video column-media"
              />
            ) : (
              <img
                src={maxMedia[2]}
                alt="Media 3"
                className="column-image column-media"
              />
            )}
          </div>
        </div>
      );
    }

    if (maxMedia.length > 3) {
      return (
        <div className="facebook-two-columns">
          <div className="column column_1">
            {maxMedia
              .slice(0, 2)
              .map((media, index) =>
                typeof media === "string" && media.includes(".mp4") ? (
                  <video
                    key={index}
                    src={media}
                    controls
                    className="column-video column-media"
                  />
                ) : (
                  <img
                    key={index}
                    src={media}
                    alt={`Media ${index + 1}`}
                    className="column-image column-image_2 column-media"
                  />
                )
              )}
          </div>
          <div className="column column_2">
            {maxMedia.slice(2).map((media, index) => {
              if (
                index === maxMedia.slice(2).length - 1 &&
                extraMediaCount > 0
              ) {
                return (
                  <div className="media-overlay-container" key={index}>
                    <img
                      src={media}
                      alt={`Media ${index + 3}`}
                      className="column-image column-media column-image_3"
                    />
                    <div className="media-overlay">+{extraMediaCount}</div>
                  </div>
                );
              } else {
                return typeof media === "string" && media.includes(".mp4") ? (
                  <video
                    key={index}
                    src={media}
                    controls
                    className="column-video column-media"
                  />
                ) : (
                  <img
                    key={index}
                    src={media}
                    alt={`Media ${index + 3}`}
                    className="column-image column-media column-image_3"
                  />
                );
              }
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="live-preview__content">
      <div className="live-preview__post">
        <div className="facebook-post-preview-wrapper">
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

          {/* Post content */}
          <div className="facebook-post-content">
            <div dangerouslySetInnerHTML={{ __html: editorContent }} />
          </div>

          {/* Media section */}
          <div className="facebook-preview-media">{renderMediaLayout()}</div>

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
        </div>
      </div>
    </section>
  );
};

export default Facebook;
