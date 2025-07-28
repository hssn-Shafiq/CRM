import React, { useState, useEffect } from "react";

// Pinterest OAuth configuration
const CLIENT_ID = process.env.REACT_APP_PINTEREST_CLIENT_ID;
const REDIRECT_URI = encodeURIComponent(
  process.env.REACT_APP_PINTEREST_REDIRECT_URI || "http://localhost:3000/auth/pinterest/callback"
);
const SCOPES = encodeURIComponent("boards:read,pins:read,pins:write");
const STATE = Math.random().toString(36).substring(7);
const AUTH_URL = `https://www.pinterest.com/oauth/?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&state=${STATE}`;

const PinterestConnection = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("pinterest_token") || ""
  );
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if we have a token but no profile
    if (accessToken && !profile) {
      const savedProfile = localStorage.getItem("pinterest_user_data");
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Failed to parse stored Pinterest profile", e);
        }
      }
    }
  }, [accessToken, profile]);

  const initiatePinterestAuth = () => {
    // Store state parameter for CSRF protection
    localStorage.setItem("pinterest_state", STATE);
    window.location.href = AUTH_URL;
  };

  const handleLogout = () => {
    localStorage.removeItem("pinterest_token");
    localStorage.removeItem("pinterest_user_data");
    setAccessToken("");
    setProfile(null);
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-center">
          <p>Connecting to Pinterest...</p>
        </div>
      ) : !accessToken ? (
        <button 
          onClick={initiatePinterestAuth} 
          className="btn btn-primary btn-connect-custom"
        >
          Connect
        </button>
      ) : (
        <div className="d-flex align-items-center">
          {profile && (
            <>
              {profile.image && (
                <img 
                  src={profile.image} 
                  alt="Profile" 
                  width="40" 
                  height="40" 
                  style={{ borderRadius: "50%" }}
                  className="me-2"
                />
              )}
              <span className="ms-2">{profile.username || "Pinterest User"}</span>
              <button 
                onClick={handleLogout} 
                className="btn btn-sm btn-danger ms-3"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      )}

      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

export default PinterestConnection;