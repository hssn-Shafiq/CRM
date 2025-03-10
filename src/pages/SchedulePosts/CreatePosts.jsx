import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreatePosts.css";
import SocialMediaPostSelector from "../../components/SocialMediaPostSelector";
import PostForm from "../../components/PostForm";
import ReviewPost from "../../components/ReviewPost";

const CreatePosts = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [editorContent, setEditorContent] = useState(""); // State for post content
  const [uploadedMedia, setUploadedMedia] = useState(null); // State for uploaded media
  const [availableMediaType, setAvailableMediaType] = useState(["Post"]);

  return (
    <>
      <main>
        <div className="create-post mb-5">
          <div className="container mt-4">
            <div className="row create-post-row d-flex flex-row ">
              <div className="w-600 create-post-editor">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-start gap-2 mb-3">
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
                      availablemediaType={availableMediaType}
                      setAvailableMediaType={setAvailableMediaType} // Pass
                    />
                  </div>
                </div>
              </div>
              <div className=" w-500 ps-0 create-post-preview">
                <ReviewPost selectedPlatforms={selectedPlatforms}   editorContent={editorContent}
                  uploadedMedia={uploadedMedia} 
                  availablemediaType={availableMediaType}
                   />
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
