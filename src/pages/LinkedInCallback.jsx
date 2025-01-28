import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "https://crmapi.alayaarts.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const LinkedInCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const response = await api.post('/auth/linkedin/callback', {
            code,
            redirect_uri: 'http://localhost:3000/auth/linkedin/callback'
          }, {
            withCredentials: true
          });

          if (response.data.success) {
            localStorage.setItem('linkedin_token', response.data.access_token);
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error during LinkedIn callback:', error);
          if (error.response) {
            console.error('Error details:', error.response.data);
          }
          navigate('/login');
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
