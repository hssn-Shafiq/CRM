// Updated Pinterest Callback for trial access
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

      console.log("Pinterest callback triggered (Trial Access)");
      console.log("Code:", code ? "Present (length: " + code.length + ")" : "Missing");
      console.log("State check:", receivedState === storedState ? "Matched" : "Mismatched");
      
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
  
        console.log("Making Pinterest token exchange request (Trial Access):");
        console.log("- Redirect URI:", redirectUri);
        console.log("- Client ID:", process.env.REACT_APP_PINTEREST_CLIENT_ID);
        
        // Use direct axios call to localhost:5000 instead of CRM API
        const response = await axios.post("http://localhost:5000/api/auth/pinterest", {
          code,
          redirect_uri: redirectUri,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Pinterest auth response:", response.data);

        if (response.data.success) {
          // Store token and user data
          localStorage.setItem("pinterest_token", response.data.access_token);
          localStorage.setItem("pinterest_user_data", JSON.stringify(response.data.user));

          // Show success message for trial access
          if (response.data.trial_access) {
            console.log("Pinterest trial access connected successfully!");
          }

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
        console.error("Detailed Pinterest error:", error.response?.data);
        
        let errorMessage = "Authentication failed";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
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
          <small className="text-muted">Trial Access Mode</small>
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