import React, { useState } from 'react';
import '../components/SocialMediaPostSelector.css';

// Define the component
function SocialMediaPostSelector() {
  // State to track the selected platforms (can select multiple)
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // Data for social media platforms and their options
  const platforms = {
    facebook: { icon: "/images/facebook-circle.svg" },
    instagram: { icon: "/images/instagram-circle.svg" },
    linkedin: { icon: "/images/icons8-linkedin-144.png" },
  };

  // Handle platform selection (multiple selections allowed)
  const handleSelect = (platform) => {
    setSelectedPlatforms((prev) => 
      prev.includes(platform) 
        ? prev.filter((item) => item !== platform) // Deselect if already selected
        : [...prev, platform] // Add to selected platforms
    );
  };

  return (
    <div className="social-create-post d-flex">
      {Object.entries(platforms).map(([key, { icon }]) => (
        <div key={key} className="position-relative me-3" onClick={() => handleSelect(key)}>
          <img src={icon} className="social-icon" width={30} alt={key} />
          {selectedPlatforms.includes(key) && (
            <span className="tick-icon">✔</span> // Show tick if selected
          )}
        </div>
      ))}
    </div>
  );
}

export default SocialMediaPostSelector;
