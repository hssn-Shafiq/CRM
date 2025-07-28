import React, { useState, useEffect } from "react";
import axios from "axios";
import FacebookLogin from "react-facebook-login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./post.css";
// import img01 from '../../../public/images/facebook-circle.svg'
import LinkedInConnection from "../../components/AccountLinked/linkedin";
import PinterestConnection from "../../components/AccountLinked/pinterest";
import Header from "./Components/Header";
const SocialAccounts = () => {
  const CLIENT_ID = process.env.REACT_APP_LINKEDIN_REDIRECT_URI;
  console.log("linkedin client id is ", CLIENT_ID);
  console.log("facebook id: ", process.env.REACT_APP_FACEBOOK_ID);
  console.log("pinterest id: ", process.env.REACT_APP_PINTEREST_CLIENT_ID);
  const [fbData, setFbData] = useState({
    isLoggedIn: false,
    name: "",
    picture: "",
  });

  const responseFacebook = (response) => {
    console.log(response);
    if (response.status !== "unknown") {
      setFbData({
        isLoggedIn: true,
        name: response.name,
        picture: response.picture.data.url,
      });
      toast.success("Logged in successfully!");
    } else {
      toast.error("Failed to log in with Facebook!");
    }
  };

  return (
    <>
      <main className="SocialAccount_main_section">
        <div className="parent-add-social-accounts">
         <Header />
          {/* Main Container */}
          <div className="container-fluid mt-4">
            <div className="row">
              {/* Facebook Section */}
              <div className="col-12">
                <div className="account-connect-custom d-flex  align-items-center">
                  <div className="d-flex align-items-center text-light">
                    <img
                      width={25}
                      src="/images/facebook-circle.svg"
                      alt="Facebook"
                    />
                    <h5>Facebook</h5>
                  </div>
                  <span className="bar-span-custom" />
                  {/* Facebook Login Button */}
                  {fbData.isLoggedIn ? (
                    <div className="d-flex align-items-center">
                      <img
                        src={fbData.picture}
                        alt={fbData.name}
                        width="40"
                        height="40"
                      />
                      <h6 className="ms-3">Welcome, {fbData.name}!</h6>
                    </div>
                  ) : (
                    <FacebookLogin
                      appId={process.env.REACT_APP_FACEBOOK_ID}
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={responseFacebook}
                      icon="fa-facebook"
                      textButton="Connect"
                      cssClass="btn btn-primary btn-connect-custom"
                    />
                  )}
                </div>
              </div>
              {/* Instgram */}
              <div className="col-12">
                <div className="account-connect-custom d-flex  align-items-center">
                  <div className="d-flex align-items-center text-light">
                    <img
                      src="/images/instagram-circle.svg "
                      width={25}
                      alt=""
                    />
                    <h5>Instagram</h5>
                  </div>{" "}
                  <span className="bar-span-custom" />
                  <button
                    type="button"
                    className="btn btn-primary btn btn-connect-custom"
                    data-bs-toggle="modal"
                    data-bs-target="#instagram-model"
                  >
                    Connect
                  </button>
                  <div
                    className="modal fade"
                    id="instagram-model"
                    tabIndex={-1}
                    aria-labelledby="fbFacebookModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content fb-modal-content">
                        <div className="fb-modal-header modal-header">
                          <img
                            src="/images/insta.svg"
                            width={30}
                            alt="Facebook logo"
                          />
                          <h5
                            className="modal-title d-flex flex-column"
                            id="fbFacebookModalLabel"
                          >
                            Instagram <br />
                            <a href="#" className="btn btn icon-ins-follow">
                              <i className="fa-solid fa-thumbs-up" /> Follow Us
                              On Instagram{" "}
                            </a>
                          </h5>
                          <button
                            type="button"
                            className="btn-close fb-btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="fb-modal-body modal-body">
                          <div className="row text-center">
                            <div className="col-md-3 col-6">
                              <div className="fb-icon-box">
                                <div className="fb-icon">
                                  <i className="bi bi-person-circle" />
                                </div>
                                <img
                                  width={30}
                                  src="/images/insta.svg"
                                  alt=""
                                />
                                <div className="fb-title">Professionals</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* linkedin */}
              <div className="col-12">
                <div className="account-connect-custom d-flex  align-items-center">
                  <div className="d-flex align-items-center text-light">
                    <img src="/images/linkedin-circle.svg" width={25} alt="" />
                    <h5>Linkedin</h5>
                  </div>{" "}
                  <span className="bar-span-custom" />
                  <LinkedInConnection />
                </div>
              </div>

              <div className="col-12">
                <div className="account-connect-custom d-flex align-items-center">
                  <div className="d-flex align-items-center text-light">
                    <img src="/images/pinterest-circle.svg" width={25} alt="Pinterest" />
                    <h5>Pinterest</h5>
                  </div>
                  <span className="bar-span-custom" />
                  <PinterestConnection />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SocialAccounts;
