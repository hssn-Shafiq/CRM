// LinkedInConnection.js
import React, { useState, useEffect } from "react";
import { Axios } from "../../config";

// Utility function to clean content and prevent UTF-8 issues
const sanitizeContent = (content) => {
  if (!content) return '';

  // Remove or replace problematic characters
  return content
    // Remove emojis and other unicode symbols
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport & Map
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    // Replace smart quotes with regular quotes
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    // Remove other problematic unicode characters
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2026]/g, '...')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

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

  const testContentEncoding = (content) => {
    try {
      // Test if content can be safely JSON encoded
      JSON.stringify({ test: content });

      // Test for problematic characters
      const problematicChars = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
      if (problematicChars.test(content)) {
        return {
          valid: false,
          error: "Content contains emojis or special characters that may cause encoding issues"
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: "Content contains invalid characters that cannot be encoded"
      };
    }
  };

  const testPost = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Test content with potential issues
      const testContent = 'Test post with special chars: "hello" \'world\' – test — emoji: 😊';
      console.log("Original content:", testContent);

      // Test content validation
      const validation = testContentEncoding(testContent);
      console.log("Content validation:", validation);

      if (!validation.valid) {
        console.log("Content failed validation:", validation.error);
        const cleanContent = sanitizeContent(testContent);
        console.log("Cleaned content:", cleanContent);

        // Test cleaned content
        const cleanValidation = testContentEncoding(cleanContent);
        console.log("Clean content validation:", cleanValidation);
      }

      alert(`Content validation test completed. Check console for details.`);
    } catch (error) {
      console.error('Content test failed:', error);
      alert(`Content test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
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
          <button
            onClick={testPost}
            className="btn btn-warning btn-sm ms-2"
          >
            Test Content
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

      {error && <div className="text-danger mt-2">{error} <button
        onClick={initiateLinkedInAuth}
        className="btn btn-primary btn-connect-custom"
      >
        Connect
      </button></div>}
    </div>
  );
};

export default LinkedInConnection;