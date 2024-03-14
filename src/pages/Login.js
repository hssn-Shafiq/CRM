import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // For demonstration, check if email and password match predefined values
    if (email === "Admin@circulardashbord.com" && password === "Admin12") {
      toast.success("Login successful!");
      // Redirect or perform further actions here
      window.location.href = "/admin"; // Redirect example
    } else {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <div className="container-fluid admin-login-container d-flex align-items-center justify-content-center m-0">
        <div className="content">
          <div className="text-center">
          <img src="/images/CC TM Logo.png" width={320} alt="CC TM Logo" />
          </div>
          <form className="content__form d-flex flex-column gap-3 " onSubmit={handleLogin}>
            <div className="content__inputs ">
                <input
                  required
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-100 rounded-3 border-1 p-2 my-2"
                />
                
                <input
                  required
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-100 rounded-3 border-1 p-2 my-2"
                />
            </div>
            <button type="submit" className="p-2 rounded-3 text-light">
              Log In
            </button>
          </form>
          <div className="content__or-text text-center my-2">
            <span />
            <span>
              OR
            </span>
            <span />
          </div>
          <div className="content__forgot-buttons text-center">
            <Link>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
