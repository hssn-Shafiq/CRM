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

const PinterestCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const receivedState = urlParams.get("state");
      const storedState = localStorage.getItem("pinterest_state");
      const authError = urlParams.get("error");

      console.log("Pinterest callback triggered");
      console.log(
        "Code:",
        code ? "Present (length: " + code.length + ")" : "Missing"
      );
      console.log(
        "State check:",
        receivedState === storedState ? "Matched" : "Mismatched"
      );
      
      // Clean up state parameter
      localStorage.removeItem("pinterest_state");

      // Handle Pinterest errors
      if (authError) {
        setError(
          `Pinterest authentication error: ${
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
        const redirectUri = process.env.REACT_APP_PINTEREST_REDIRECT_URI || "http://localhost:3000/auth/pinterest/callback";
  
        console.log("Making Pinterest token exchange request with:");
        console.log("- Redirect URI:", redirectUri);
        console.log("- Client ID:", process.env.REACT_APP_PINTEREST_CLIENT_ID);
        
        const response = await api.post("/api/auth/pinterest", {
          code,
          redirect_uri: redirectUri,
        });

        if (response.data.success) {
          // Store token and user data
          localStorage.setItem("pinterest_token", response.data.access_token);
          localStorage.setItem("pinterest_user_data", JSON.stringify(response.data.user));

          // Redirect to social accounts page
          navigate("/admin/SchedulePosts/SocialAccounts", {
            replace: true,
          });
        } else {
          throw new Error(
            response.data.message || "Failed to authenticate with Pinterest"
          );
        }
      } catch (error) {
        console.error("Error during Pinterest callback:", error);
        if (error.response && error.response.data) {
          console.error(
            "Detailed Pinterest error:",
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
          <h3 className="mb-2">Connecting with Pinterest</h3>
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

export default PinterestCallback;