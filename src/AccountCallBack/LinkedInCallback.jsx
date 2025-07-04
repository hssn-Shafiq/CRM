// LinkedInCallback.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CRM_API_URL = process.env.REACT_APP_CRM_API_URL;
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN;

// API configuration
const api = axios.create({
  baseURL: CRM_API_URL,
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const LinkedInCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const receivedState = urlParams.get("state");
      const storedState = localStorage.getItem("linkedin_state");
      const authError = urlParams.get("error");

      console.log("LinkedIn callback triggered");
      console.log(
        "Code:",
        code ? "Present (length: " + code.length + ")" : "Missing"
      );
      console.log(
        "State check:",
        receivedState === storedState ? "Matched" : "Mismatched"
      );
      // Clean up state parameter
      localStorage.removeItem("linkedin_state");

      // Handle LinkedIn errors
      if (authError) {
        setError(
          `LinkedIn authentication error: ${
            urlParams.get("error_description") || authError
          }`
        );
        setLoading(false);
        return;
      }

      // Validate state to prevent CSRF
      if (!receivedState || receivedState !== storedState) {
        setError("Invalid authentication state. Please try again.");
        setLoading(false);
        return;
      }

      if (!code) {
        setError("Authorization code missing from the callback.");
        setLoading(false);
        return;
      }

      try {
        const redirectUri = "http://localhost:3000/auth/linkedin/callback"; // Hardcode this value
  
        console.log("Making LinkedIn token exchange request with:");
        console.log("- Hardcoded Redirect URI:", redirectUri);
        console.log("- Client ID:", process.env.REACT_APP_LINKEDIN_CLIENT_ID);
        
        const response = await api.post("/api/auth/linkedin", {
          code,
          redirect_uri: redirectUri,
        });

        if (response.data.success) {
          // Store token and user data
          localStorage.setItem("linkedin_token", response.data.access_token);
          localStorage.setItem("user_data", JSON.stringify(response.data.user));

          // Redirect to social accounts page
          navigate("/admin/SchedulePosts/SocialAccounts", {
            replace: true,
          });
        } else {
          throw new Error(
            response.data.message || "Failed to authenticate with LinkedIn"
          );
        }
      } catch (error) {
        console.error("Error during LinkedIn callback:", error);
        if (error.response && error.response.data) {
          console.error(
            "Detailed LinkedIn error:",
            JSON.stringify(error.response.data)
          );
        }
        setError(
          error.response?.data?.message ||
            error.message ||
            "Authentication failed"
        );
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-50 py-5">
      {loading ? (
        <>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="mb-2">Connecting with LinkedIn</h3>
          <p>Please wait while we complete the authentication...</p>
        </>
      ) : (
        <div className="text-center">
          {error ? (
            <>
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/admin/SchedulePosts/SocialAccounts")}
              >
                Return to Social Accounts
              </button>
            </>
          ) : (
            <p>Redirecting...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInCallback;
