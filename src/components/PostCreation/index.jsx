import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import SocialMediaPostSelector from "../SocialMediaPostSelector";
import PostForm from "../PostForm";
import ReviewPost from "../ReviewPost";

const PostCreation = ({ post, setShowModal }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [editorContent, setEditorContent] = useState(""); // State for post content
  const [uploadedMedia, setUploadedMedia] = useState({ images: [], videos: [] }); // State for uploaded media

  // Pre-populate the post data when editing
  useEffect(() => {
    if (post) {
      setEditorContent(post.caption || "");
      setSelectedPlatforms(post.platform || []);
      setUploadedMedia({
        images: post.media.filter((url) => url.endsWith(".jpg") || url.endsWith(".png")),
        videos: post.media.filter((url) => url.endsWith(".mp4")),
      });
    }
  }, [post]);

  // Handle form submission (update the post)
  const handleSubmit = async () => {
    const token = "Bearer 1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";
    const formData = new FormData();

    formData.append("caption", editorContent);
    formData.append("platform", selectedPlatforms.join(","));
    uploadedMedia.images.forEach((image, idx) => {
      formData.append(`media[${idx}]`, image);
    });
    uploadedMedia.videos.forEach((video, idx) => {
      formData.append(`media[${idx + uploadedMedia.images.length}]`, video);
    });

    try {
      const response = await axios.put(
        `https://crmapi.alayaarts.com/api/posts/${post.id}`, // Update post API
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Post updated successfully!");
      setShowModal(false); // Close the modal after updating
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

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
                <ReviewPost
                  selectedPlatforms={selectedPlatforms}
                  editorContent={editorContent}
                  uploadedMedia={uploadedMedia}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
      <div className="d-flex justify-content-end">
        <button className="btn btn-outline-primary" onClick={handleSubmit}>
          Update Post
        </button>
      </div>
    </>
  );
};

export default PostCreation;
