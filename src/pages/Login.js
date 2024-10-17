import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Vortex } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase/Config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { storeUserToLocalStorage } from "../utils/localstorage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loginForm = document.getElementById("login");

    try {
      // Sign in the user
      const userCredentails = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentails.user;
      console.log("user id is ", user.uid);
      // Query Firestore where the uid field matches user.uid
      const userQuery = query(
        collection(db, "Users"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data(); // Get the first matching document

        // Store user details in localStorage
        storeUserToLocalStorage({ email: user.email, userName: userData.userName, uid: userData.uid });
        
        // Check if the user is an admin
        if (userData.Role !== "User") {
          toast.success("Welcome admin");
          loginForm.reset();
          setTimeout(() => {
            navigate("/admin");
          }, 1000);
        } else {
          toast.error("You are not authorized as admin.");
        }
      } else {
        toast.error("User not found.");
      }
    } catch (err) {
      const errorMessage = err.message;
      console.error("Error is ", errorMessage);
      toast.error("Invalid Credentials: " + errorMessage);
    } finally {
      setLoading(false); // Stop loading after login completes
    }
  };

  return (
    <>
      <div className="container-fluid admin-login-container d-flex align-items-center justify-content-center m-0">
        <div className="content">
          <div className="text-center">
            <img src="/images/logo.png" width={260} alt="Bus Mate Logo" />
          </div>
          <form
            className="content__form d-flex flex-column gap-3 "
            id="login"
            onSubmit={handleLogin}
          >
            <div className="content__inputs ">
              <input
                required
                type="text"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-100 rounded-3 border-1 p-2 my-2"
              />

              <input
                required
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-100 rounded-3 border-1 p-2 my-2"
              />
            </div>
            {loading ? (
              <button
                type="submit"
                disabled={loading}
                className="p-2 rounded-3 text-light d-flex align-items-center justify-content-center"
              >
                Log In
                <Vortex
                  visible={true}
                  height="30"
                  width="30"
                  ariaLabel="vortex-loading"
                  radius="4"
                  wrapperStyle={{}}
                  wrapperClass="vortex-wrapper"
                  colors={[
                    "black",
                    "white",
                    "black",
                    "white",
                    "white",
                    "black",
                  ]}
                />
              </button>
            ) : (
              <button type="submit" className="p-2 rounded-3 text-light ">
                Log In
              </button>
            )}
          </form>
          <div className="content__or-text text-center my-2">
            <span />
            <span>OR</span>
            <span />
          </div>
          <div className="content__forgot-buttons text-center">
            <Link>Forget Password</Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
