// src/components/ForgotPassword.js
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/Config";
import "./forget_pasasword.css"
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Attempt to send the password reset email
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
      setError(""); // Clear any previous error messages
    } catch (err) {
      setError(err.message); // Set error message if sending email fails
      setMessage(""); // Clear any previous success message
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log("Current Email: ", e.target.value); // Debugging: Ensure email is updating correctly
  };

  return (
    <div className="forget_pasasword bg-main ">
      <div className="forget">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="bg-main border-main rounded-2 w-100 p-2"
            required
            
          />
          <button type="submit">
            Send Reset Email
          </button>
        </form>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
