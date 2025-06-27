import React, { useState, useEffect } from "react";

// Pinterest OAuth configuration for TRIAL ACCESS
const CLIENT_ID = process.env.REACT_APP_PINTEREST_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_PINTEREST_REDIRECT_URI || "http://localhost:3000/auth/pinterest/callback";

// Use only the scopes you have access to based on your screenshot
const SCOPES = "boards:read,pins:read,pins:write,user_accounts:read";

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
    if (!CLIENT_ID) {
      setError("Pinterest Client ID is not configured");
      return;
    }

    const state = Math.random().toString(36).substring(7);
    
    // Pinterest OAuth URL for trial access
    const oauthUrl = `https://www.pinterest.com/oauth/?` +
      `response_type=code&` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `state=${state}`;

    console.log("Pinterest OAuth URL (Trial Access):", oauthUrl);
    console.log("Environment check:");
    console.log("- CLIENT_ID:", CLIENT_ID);
    console.log("- REDIRECT_URI:", REDIRECT_URI);
    console.log("- SCOPES:", SCOPES);
    
    localStorage.setItem("pinterest_state", state);
    window.location.href = oauthUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("pinterest_token");
    localStorage.removeItem("pinterest_user_data");
    setAccessToken("");
    setProfile(null);
    setError("");
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-center">
          <p>Connecting to Pinterest (Trial Access)...</p>
        </div>
      ) : !accessToken ? (
        <div>
          <button 
            onClick={initiatePinterestAuth} 
            className="btn btn-primary btn-connect-custom"
          >
            Connect (Trial)
          </button>
          <small className="text-muted d-block mt-1">
            Pinterest Trial Access Active
          </small>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          {profile && (
            <>
              {profile.image ? (
                <img 
                  src={profile.image} 
                  alt="Profile" 
                  width="40" 
                  height="40" 
                  style={{ borderRadius: "50%" }}
                  className="me-2"
                />
              ) : (
                <div 
                  className="me-2 d-flex align-items-center justify-content-center"
                  style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "50%", 
                    backgroundColor: "#e60023",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}
                >
                  P
                </div>
              )}
              <span className="ms-2">
                {profile.username || profile.first_name || "Pinterest User"}
                {profile.account_type === 'trial' && (
                  <small className="text-muted d-block">Trial Access</small>
                )}
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

export default PinterestConnection;