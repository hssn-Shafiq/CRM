import React, {useState} from "react";
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
    Twitter: {
      icon: <FaTwitter className="text-light social-account-icon" />,
    },
    TikTok: {
      icon: <FaTiktok className="text-light social-account-icon" />,
    },
    Pinterest: {
      icon: <FaPinterest className="text-light social-account-icon" />,
    },
    Whatsapp: {
      icon: <FaWhatsapp className="text-light social-account-icon" />,
    },
  };

  const handleSelect = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((item) => item !== platform) // Deselect if already selected
        : [...prev, platform] // Add to selected platforms
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(platforms);
    }
    setSelectAll(!selectAll);
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
            <Link className="dropdown-item " to="#">
              <FaUserCircle /> Add Account
            </Link>
          </li>
        </ul>
      </div>
      <div className="social-create-post d-flex">
        {Object.entries(platforms).map(([key, { icon }]) => (
          <div
            key={key}
            className="account-item position-relative p-1 border-0"
            onClick={() => handleSelect(key)}
          >
            <img
              src="/images/profile.jpg"
              alt="profile"
              social-account-icon
              className="rounded-circle me-2 account-item-profile"
            />
            {icon}
            {selectedPlatforms.includes(key) && (
              <span className="tick-icon">
                <FaCheck />
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default SocialMediaPostSelector;
