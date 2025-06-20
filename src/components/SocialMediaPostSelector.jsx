import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaPinterest,
  FaRegCheckSquare,
  FaTiktok,
  FaTwitter,
  FaUserCircle,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../components/SocialMediaPostSelector.css";

function SocialMediaPostSelector({ selectedPlatforms, setSelectedPlatforms }) {
  const [selectAll, setSelectAll] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState({
    linkedin: null,
    facebook: null,
    // Add other platforms here as you implement them
  });
  const [tooltipVisible, setTooltipVisible] = useState(null);

  // Load connected account data on component mount
  useEffect(() => {
    // Check for LinkedIn connection
    const linkedinData = localStorage.getItem("user_data");
    if (linkedinData) {
      try {
        setConnectedAccounts(prev => ({
          ...prev,
          linkedin: JSON.parse(linkedinData)
        }));
      } catch (e) {
        console.error("Failed to parse LinkedIn profile data", e);
      }
    }

    // Add similar checks for other platforms as you implement them
    // For example:
    // const facebookData = localStorage.getItem("facebook_user_data");
    // if (facebookData) {
    //   try {
    //     setConnectedAccounts(prev => ({
    //       ...prev,
    //       facebook: JSON.parse(facebookData)
    //     }));
    //   } catch (e) {
    //     console.error("Failed to parse Facebook profile data", e);
    //   }
    // }
  }, []);

  const platforms = {
    facebook: {
      icon: <FaFacebook className="text-light social-account-icon" />,
    },
    instagram: {
      icon: <FaInstagram className="text-light social-account-icon" />,
    },
    linkedin: {
      icon: <FaLinkedinIn className="text-light social-account-icon" />,
    },
    twitter: {
      icon: <FaTwitter className="text-light social-account-icon" />,
    },
    tiktok: {
      icon: <FaTiktok className="text-light social-account-icon" />,
    },
    pinterest: {
      icon: <FaPinterest className="text-light social-account-icon" />,
    },
    whatsapp: {
      icon: <FaWhatsapp className="text-light social-account-icon" />,
    },
  };

  const handleSelect = (platform) => {
    setSelectedPlatforms(
      (prev) =>
        prev.includes(platform)
          ? prev.filter((item) => item !== platform) // Deselect if already selected
          : [...prev, platform] // Add to selected platforms
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPlatforms([]); // Deselect all platforms
    } else {
      setSelectedPlatforms(Object.keys(platforms));
    }
    setSelectAll(!selectAll); // Toggle selectAll state
  };

  const showTooltip = (platform) => {
    setTooltipVisible(platform);
  };

  const hideTooltip = () => {
    setTooltipVisible(null);
  };

  // Get profile image for a platform
  const getProfileImage = (platform) => {
    if (connectedAccounts[platform] && connectedAccounts[platform].picture) {
      return connectedAccounts[platform].picture;
    }
    return "/images/profile.jpg"; // Default image
  };

  // Get profile name for a platform
  const getProfileName = (platform) => {
    if (connectedAccounts[platform] && connectedAccounts[platform].name) {
      return connectedAccounts[platform].name;
    }
    return `Not Connected`; // Default text
  };

  // Check if account is connected
  const isConnected = (platform) => {
    return !!connectedAccounts[platform];
  };

  return (
    <>
      <div className="dropdown">
        <button
          aria-expanded="false"
          className="btn top-button rounded-5"
          data-bs-toggle="dropdown"
          id="dropdownMenuButton"
          type="button"
        >
          <i className="fa fa-chevron-down" />
        </button>
        <ul aria-labelledby="dropdownMenuButton" className="dropdown-menu">
          <li>
            <Link className="dropdown-item" onClick={handleSelectAll}>
              <FaRegCheckSquare /> {selectAll ? "Unselect All" : "Select All"}
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/admin/SchedulePosts/SocialAccounts">
              <FaUserCircle /> Manage Accounts
            </Link>
          </li>
        </ul>
      </div>
      <div className="social-create-post d-flex">
        {Object.entries(platforms).map(([key, { icon }]) => (
          <div
            key={key}
            className={`account-item position-relative p-1 border-0 ${isConnected(key) ? 'connected' : 'not-connected'}`}
            onClick={() => handleSelect(key)}
            onMouseEnter={() => showTooltip(key)}
            onMouseLeave={hideTooltip}
          >
            <img
              src={getProfileImage(key)}
              alt="profile"
              className="rounded-circle me-2 account-item-profile"
            />

            {icon}
           
            {selectedPlatforms.includes(key) && (
              <span className="tick-icon">
                <FaCheck />
              </span>
            )}
            
            {/* Custom tooltip */}
            {tooltipVisible === key && (
              <div className="custom-tooltip">
                <div className="tooltip-content">
                  {/* <div className="tooltip-header">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div> */}
                  <div className="tooltip-body">
                    {isConnected(key) ? (
                      <>
                        <img 
                          src={getProfileImage(key)} 
                          alt="profile"
                          className="tooltip-profile-img"
                        />
                        <span>{getProfileName(key)}</span>
                      </>
                    ) : (
                      <span>Not connected. Click to add.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default SocialMediaPostSelector;