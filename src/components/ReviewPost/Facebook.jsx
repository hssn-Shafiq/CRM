import React from "react";
import "./reviewpost.css";

export const FacebookReel = () => {
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
                src="https://cdn.publer.io/uploads/picture/facebook/366626813203750.jpg?v=a2b277b10ab957daa721"
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

export const FacebookShort = () => {
  return (
    <>
      <div className="u-align-children-center snipcss-1Y3V4 d-flex align-items-center justify-content-center">
        <div className="facebook-reel-preview-wrapper u-align-children-vertically">
          <div className="facebook-reel-preview-footer">
            <div className="u-align-children-vertically u-margin-bottom-15">
              <img
                className="facebook-reel-preview-account img img-circle img-responsive u-image-fit u-margin-right-10"
                src="https://cdn.publer.io/uploads/picture/facebook/366626813203750.jpg?v=a2b277b10ab957daa721"
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

  console.log("selected plafrom is ", platform);

  const renderImagesLayout = () => {
    const maxImages = images.slice(0, 5); // Limit to 5 images
    const extraImagesCount = images.length > 5 ? images.length - 5 : 0;

    if (maxImages.length === 1) {
      // Single full-width image
      return (
        <img src={maxImages[0]} alt="Media 1" className="full-width-image" />
      );
    }

    if (maxImages.length === 2) {
      // Two images in two columns
      return (
        <div className=" facebook-two-columns-images">
          {maxImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Media ${index + 1}`}
              className="column-image column-image_2"
            />
          ))}
        </div>
      );
    }

    if (maxImages.length === 3) {
      // First two images in 1st column, third image in 2nd column
      return (
        <div className="facebook-three-columns">
          <div className="column">
            <img src={maxImages[0]} alt="Media 1" className="column-image" />
            <img src={maxImages[1]} alt="Media 2" className="column-image" />
          </div>
          <div className="column">
            <img src={maxImages[2]} alt="Media 3" className="column-image" />
          </div>
        </div>
      );
    }

    if (maxImages.length > 3) {
      // First two images in 1st column, three images in 2nd column
      return (
        <div className="facebook-two-columns">
          <div className="column column_1">
            <img
              src={maxImages[0]}
              alt="Media 1"
              className="column-image column-image_2"
            />
            <img
              src={maxImages[1]}
              alt="Media 2"
              className="column-image column-image_2"
            />
          </div>
          <div className="column">
            {maxImages.slice(2).map((img, index) => {
              if (
                index === maxImages.slice(2).length - 1 &&
                extraImagesCount > 0
              ) {
                // If this is the last image and there are extra images, show the +n overlay
                return (
                  <div className="image-overlay-container" key={index}>
                    <img
                      src={img}
                      alt={`Media ${index + 3}`}
                      className="column-image"
                    />
                    <div className="image-overlay">+{extraImagesCount}</div>
                  </div>
                );
              } else {
                return (
                  <img
                    key={index}
                    src={img}
                    alt={`Media ${index + 3}`}
                    className="column-image"
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
          <div className="facebook-preview-media">{renderImagesLayout()}</div>

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
