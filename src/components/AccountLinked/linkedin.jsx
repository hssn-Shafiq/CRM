// LinkedInConnection.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Constants
const CLIENT_ID = "786fnf34f2gbey";
const REDIRECT_URI = encodeURIComponent(
  "http://localhost:3000/auth/linkedin/callback"
);
const SCOPES = encodeURIComponent("openid profile email ");
const AUTH_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&state=${Math.random().toString(36).substring(7)}`;

// API configuration
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request/response interceptors for debugging
api.interceptors.request.use((request) => {
  console.log("API Request:", {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers,
  });
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

const LinkedInConnection = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("linkedin_access_token") || ""
  );
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccessToken = async (code) => {
    setIsLoading(true);
    setError("");
    console.log("Initiating token exchange with code:", code);

    try {
      // Changed endpoint to match your server route
      const response = await api.post("/auth/linkedin/token", {
        code,
        redirect_uri: REDIRECT_URI, // Send unencoded redirect_uri
      });

      console.log("Token exchange successful:", response.data);

      if (response.data.access_token) {
        setAccessToken(response.data.access_token);
        localStorage.setItem(
          "linkedin_access_token",
          response.data.access_token
        );

        // If we have user data, save it
        if (response.data.user) {
          setProfile(response.data.user);
          localStorage.setItem(
            "linkedin_profile",
            JSON.stringify(response.data.user)
          );
        }

        navigate("/admin/SchedulePosts/SocialAccounts");
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      console.error("Token exchange failed:", error);
      setError(
        error.response?.data?.message || "Failed to connect with LinkedIn"
      );
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAccessToken("");
    setProfile(null);
    localStorage.removeItem("linkedin_access_token");
    localStorage.removeItem("linkedin_profile");
    // setMessage("");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    console.log("URL Parameters:", {
      code,
      error,
      errorDescription,
    });

    if (error) {
      setError(`LinkedIn Error: ${errorDescription || error}`);
      navigate("/admin/SchedulePosts/SocialAccounts");
      return;
    }

    if (code) {
      fetchAccessToken(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate]);

  // const handlePost = async () => {
  //   if (!postContent.trim()) {
  //     setMessage("Please enter content to post");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const response = await api.post("/api/linkedin/post", {
  //       accessToken,
  //       content: postContent
  //     });

  //     if (response.data.success) {
  //       setMessage("Post created successfully");
  //       setPostContent("");
  //     }
  //   } catch (error) {
  //     console.error("Error posting to LinkedIn:", error);
  //     if (error.response?.status === 401) {
  //       setMessage("Session expired. Please login again.");
  //       handleLogout();
  //     } else {
  //       setMessage("Failed to create post. Please try again.");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="linkedin-integration p-4">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Integration</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">
          <p>Connecting to LinkedIn...</p>
        </div>
      ) : !accessToken ? (
        <a href={AUTH_URL} className="inline-block">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Connect LinkedIn
          </button>
        </a>
      ) : (
        <div className="connected-view">
          {profile && (
            <div className="profile-section mb-4">
              <h2 className="text-xl">Welcome, {profile.name}</h2>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2"
              >
                Disconnect LinkedIn
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInConnection;
