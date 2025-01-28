import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = "786fnf34f2gbey";
const REDIRECT_URI = "http://localhost:3000/auth/linkedin/callback";
const AUTH_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=openid%20profile%20email`;

const LinkedInConnection = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("linkedin_access_token") || ""
  );
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("linkedin_profile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [postContent, setPostContent] = useState("");
  const [message, setMessage] = useState("");

  const fetchAccessToken = async (code) => {
    try {
      const response = await fetch(
        "http://localhost:5000/auth/linkedin/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();
      setAccessToken(data.access_token);
      localStorage.setItem("linkedin_access_token", data.access_token);
      await fetchUserProfile(data.access_token);

      // After successful authentication, redirect to home page
      navigate('/admin/SchedulePosts/SocialAccounts');
    } catch (error) {
      console.error("Error fetching access token:", error);
      handleLogout(); // Clear data if there's an error
      navigate('/admin/SchedulePosts/SocialAccounts');
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
      localStorage.setItem("linkedin_profile", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      handleLogout(); // Clear data if there's an error
    }
  };

  const handleLogout = () => {
    setAccessToken("");
    setProfile(null);
    localStorage.removeItem("linkedin_access_token");
    localStorage.removeItem("linkedin_profile");
  };

  useEffect(() => {
    // Check if we have a stored token but no profile
    if (accessToken && !profile) {
      fetchUserProfile(accessToken);
    }

    // Handle the OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      fetchAccessToken(code);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [accessToken]);

  const handlePost = async () => {
    try {
      const response = await fetch("http://localhost:5000/linkedin/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, content: postContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      setMessage("Post created successfully");
      setPostContent(""); // Clear the post content after successful posting
    } catch (error) {
      console.error("Error posting to LinkedIn:", error);
      if (error.message.includes("401")) {
        handleLogout(); // Token might be expired
        setMessage("Session expired. Please login again.");
      } else {
        setMessage("Failed to create post");
      }
    }
  };

  // Validate token on component mount
  useEffect(() => {
    if (accessToken) {
      // Verify the token is still valid
      fetch("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Invalid token");
          }
          return response.json();
        })
        .then((data) => {
          setProfile(data);
          localStorage.setItem("linkedin_profile", JSON.stringify(data));
        })
        .catch(() => {
          handleLogout(); // Clear invalid token
        });
    }
  }, []);

  return (
    <div className="linkedin-integration">
      <h1>LinkedIn Integration</h1>

      {!accessToken ? (
        <a href={AUTH_URL}>
          <button>Connect LinkedIn</button>
        </a>
      ) : (
        <div>
          <div className="profile-section">
            <h2>Welcome, {profile?.name}</h2>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
          <textarea
            placeholder="Write something to post..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <button onClick={handlePost}>Post to LinkedIn</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default LinkedInConnection;
