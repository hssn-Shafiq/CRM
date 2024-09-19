import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./CreatePosts.css";
import SocialMediaPostSelector from "../SocialMediaPostSelector";
import PostForm from "../PostForm";
import ReviewPost from "../ReviewPost";

const PostCreation = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [editorContent, setEditorContent] = useState(""); // State for post content
  const [uploadedMedia, setUploadedMedia] = useState(null); // State for uploaded media

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
                    <PostForm
                      selectedPlatforms={selectedPlatforms}
                      editorContent={editorContent}
                      setEditorContent={setEditorContent}
                      setUploadedMedia={setUploadedMedia} // Pass media handler
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <ReviewPost selectedPlatforms={selectedPlatforms}   editorContent={editorContent}
                  uploadedMedia={uploadedMedia} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </>
  );
};

export default PostCreation;
