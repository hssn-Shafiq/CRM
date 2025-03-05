// LinkedInCallback.js (Frontend)
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Backend API configuration
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true
});

// LinkedIn OAuth configuration
const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const CLIENT_ID = "786fnf34f2gbey";
const REDIRECT_URI = "http://localhost:3000/auth/linkedin/callback"; // Frontend callback URL

// Function to initiate LinkedIn login
export const initiateLinkedInLogin = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'openid profile email',
    state: Math.random().toString(36).substring(7)
  });

  window.location.href = `${LINKEDIN_AUTH_URL}?${params.toString()}`;
};

const LinkedInCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          // Send the code to your backend
          const response = await api.post('/api/auth/linkedin', { 
            code,
            redirect_uri: REDIRECT_URI
          });

          if (response.data.success) {
            localStorage.setItem('linkedin_token', response.data.access_token);
            localStorage.setItem('user_data', JSON.stringify(response.data.user));
            navigate('/admin/SchedulePosts/SocialAccounts');
          }
        } catch (error) {
          console.error('Error during LinkedIn callback:', error);
          navigate('/admin/SchedulePosts/SocialAccounts');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Connecting with LinkedIn</h2>
        <p>Please wait while we complete the authentication...</p>
      </div>
    </div>
  );
};

export default LinkedInCallback;