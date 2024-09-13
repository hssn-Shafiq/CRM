import React, { useState, useEffect } from "react";
// import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreatePosts.css";
import SocialMediaPostSelector from "../../components/SocialMediaPostSelector";
import PostForm from "../../components/PostForm";

const CreatePosts = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  return (
    <>
      <main>
        <div className="create-post mb-5">
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-start gap-4 mb-3">
                      <SocialMediaPostSelector
                        selectedPlatforms={selectedPlatforms}
                        setSelectedPlatforms={setSelectedPlatforms}
                      />
                    </div>
                    <PostForm selectedPlatforms={selectedPlatforms} />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">Post Preview</div>
                  <div className="card-body text-light" id="postPreview">
                    <p>Select a social account and a post to preview</p>
                  </div>
                </div>
                <div className="post-card">
                  <div className="post-header">
                    <img
                      src="/images/profile.jpg"
                      alt="Profile Picture"
                      className="profile-pic"
                    />
                    <div>
                      <strong className="mb-0 text-dark">Hassan Shafiq</strong>
                      <br />
                      <small className="text-muted">Just now</small>
                    </div>
                  </div>
                  <div
                    className="post-content mt-3"
                  >
                    <p>This is an dummy post for scheduling!</p>
                    <img
                      src="/images/profile.jpg"
                      className="w-100 object-fit-cover"
                      style={{ objectPosition: "top" }}
                      alt="profile image"
                    />
                  </div>
                  <div className="post-actions">
                    <a href="#">
                      <i className="far fa-thumbs-up"></i> Like
                    </a>
                    <a href="#">
                      <i className="far fa-comment"></i> Comment
                    </a>
                    <a href="#">
                      <i className="fas fa-share"></i> Share
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </>
  );
};

export default CreatePosts;
