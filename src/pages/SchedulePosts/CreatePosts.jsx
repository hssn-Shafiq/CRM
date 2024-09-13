import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreatePosts.css";
import SocialMediaPostSelector from "../../components/SocialMediaPostSelector";
import PostForm from "../../components/PostForm";
import ReviewPost from "../../components/ReviewPost";

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
                <ReviewPost />
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
