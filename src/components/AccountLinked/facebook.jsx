import React, { useEffect, useState } from "react";

const FacebookConnection = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load the Facebook SDK asynchronously
    loadFacebookSDK();
    
    // Check if user is already logged in
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v16.0'
      });
      
      checkLoginStatus();
    };
  }, []);
  
  const loadFacebookSDK = () => {
    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  };
  
  const checkLoginStatus = () => {
    window.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        // User is logged in and has authorized your app
        fetchUserData();
      }
    });
  };

  const handleFacebookAuth = () => {
    setIsLoading(true);
    window.FB.login(response => {
      if (response.authResponse) {
        fetchUserData();
      } else {
        console.log('User cancelled login or did not fully authorize.');
        setIsLoading(false);
      }
    }, { scope: 'email,public_profile,publish_to_groups,pages_manage_posts' });
  };
  
  const fetchUserData = () => {
    window.FB.api('/me', { fields: 'name,email,picture' }, response => {
      setUser(response);
      setIsLoading(false);
      console.log('User data:', response);
    });
  };
  
  const handlePostToFacebook = () => {
    if (!user) return;
    
    setIsLoading(true);
    window.FB.api('/me/feed', 'POST', 
      { message: 'Hello from my React app!' }, 
      response => {
        if (response.error) {
          console.error('Error posting to Facebook:', response.error);
        } else {
          console.log('Successfully posted to Facebook:', response);
          alert('Posted to Facebook successfully!');
        }
        setIsLoading(false);
      }
    );
  };
  
  const handleLogout = () => {
    window.FB.logout(response => {
      setUser(null);
      console.log('User logged out');
    });
  };
  
  return (
    <div className="facebook-connection">
      <h1>Connect with Facebook</h1>
      
      {isLoading && <p>Loading...</p>}
      
      {!user ? (
        <button 
          onClick={handleFacebookAuth}
          disabled={isLoading}
          className="facebook-login-btn"
        >
          Login with Facebook
        </button>
      ) : (
        <div className="user-info">
          <div className="profile-header">
            {user.picture && (
              <img 
                src={user.picture.data.url} 
                alt={user.name} 
                className="profile-image"
              />
            )}
            <h2>Welcome, {user.name}!</h2>
            <p>Email: {user.email || 'Not provided'}</p>
          </div>
          
          <div className="actions">
            <button 
              onClick={handlePostToFacebook}
              disabled={isLoading}
              className="post-btn"
            >
              Post to Facebook
            </button>
            
            <button 
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacebookConnection;
