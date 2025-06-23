// LinkedInConnection.js
import React, { useState, useEffect } from "react";
import axios from "axios";

// API configuration
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// LinkedIn OAuth configuration
const CLIENT_ID = "786fnf34f2gbey";
const REDIRECT_URI = encodeURIComponent(
  "http://localhost:3000/auth/linkedin/callback"
);
const SCOPES = encodeURIComponent("openid profile email");
const STATE = Math.random().toString(36).substring(7);
const AUTH_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&state=${STATE}`;

const LinkedInConnection = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("linkedin_token") || ""
  );
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if we have a token but no profile
    if (accessToken && !profile) {
      const savedProfile = localStorage.getItem("user_data");
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Failed to parse stored profile", e);
        }
      }
    }
  }, [accessToken, profile]);

  const initiateLinkedInAuth = () => {
    // Store state parameter for CSRF protection
    localStorage.setItem("linkedin_state", STATE);
    window.location.href = AUTH_URL;
  };

  const handleLogout = () => {
    localStorage.removeItem("linkedin_token");
    localStorage.removeItem("user_data");
    setAccessToken("");
    setProfile(null);
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-center">
          <p>Connecting to LinkedIn...</p>
        </div>
      ) : !accessToken ? (
        <button 
          onClick={initiateLinkedInAuth} 
          className="btn btn-primary btn-connect-custom"
        >
          Connect
        </button>
      ) : (
        <div className="d-flex align-items-center">
          {profile && (
            <>
              {profile.picture && (
                <img 
                  src={profile.picture} 
                  alt="Profile" 
                  width="40" 
                  height="40" 
                  style={{ borderRadius: "50%" }}
                  className="me-2"
                />
              )}
              <span className="ms-2">{profile.name || "LinkedIn User"}</span>
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

export default LinkedInConnection;