// LinkedInConnection.js
import React, { useState, useEffect } from "react";
import { Axios } from "../../config";

const LinkedInConnection = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("linkedin_token") || ""
  );
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const REDIRECT_URI = process.env.REACT_APP_LINKEDIN_REDIRECT_URI || "http://localhost:3000/linkedin/callback";

  useEffect(() => {
    // Check if we have a token but no profile
    if (accessToken && !profile) {
      fetchProfile();
    } else if (accessToken) {
      const savedProfile = localStorage.getItem("user_data");
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Failed to parse stored profile", e);
          fetchProfile();
        }
      }
    }
  }, [accessToken]);

  const fetchProfile = async () => {
    if (!accessToken) return;
    
    try {
      setIsLoading(true);
      setError("");
      const response = await Axios.get('linkedin/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (response.data.success) {
        const userData = response.data.user;
        setProfile(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      setError("Failed to fetch profile. Please reconnect.");
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const initiateLinkedInAuth = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log("Initiating LinkedIn auth with redirect URI:", REDIRECT_URI);
      
      // Get auth URL from Laravel backend
      const response = await Axios.get('auth/linkedin/url', {
        params: {
          redirect_uri: REDIRECT_URI
        }
      });
      
      console.log("Auth URL response:", response.data);
      
      if (response.data.success) {
        // Store state parameter for CSRF protection
        localStorage.setItem("linkedin_state", response.data.state);
        window.location.href = response.data.auth_url;
      } else {
        throw new Error(response.data.message || 'Failed to get auth URL');
      }
    } catch (error) {
      console.error("Error initiating LinkedIn auth:", error);
      console.error("Error details:", error.response?.data);
      setError(`Failed to initiate LinkedIn authentication: ${error.response?.data?.message || error.message}`);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("linkedin_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("linkedin_state");
    setAccessToken("");
    setProfile(null);
    setError("");
  };

  const testConnection = async () => {
    try {
      console.log('Testing Laravel connection...');
      const response = await Axios.get('health');
      console.log('Health check result:', response.data);
      alert('Connection to Laravel backend successful!');
    } catch (error) {
      console.error('Connection test failed:', error);
      alert(`Connection test failed: ${error.message}`);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-center">
          <p>Connecting to LinkedIn...</p>
        </div>
      ) : !accessToken ? (
        <div>
          <button 
            onClick={initiateLinkedInAuth} 
            className="btn btn-primary btn-connect-custom"
          >
            Connect
          </button>
          <button 
            onClick={testConnection} 
            className="btn btn-secondary btn-sm ms-2"
          >
            Test Connection
          </button>
        </div>
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
              <span className="ms-2">
                {profile.name || profile.given_name || profile.family_name || "LinkedIn User"}
              </span>
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