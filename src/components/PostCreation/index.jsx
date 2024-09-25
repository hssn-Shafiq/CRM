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
  const [uploadedMedia, setUploadedMedia] = useState({
    images: [],
    videos: [],
  }); // State for uploaded media
  const [initialMedia, setInitialMedia] = useState([]); // Track initial media for comparison


  useEffect(() => {
    if (post) {
      setEditorContent(post.caption || "");
      setSelectedPlatforms(post.platform || []);
      const media = {
        images: post.media.filter(
          (url) => url.endsWith(".jpg") || url.endsWith(".png")
        ),
        videos: post.media.filter((url) => url.endsWith(".mp4")),
      };
      setUploadedMedia(media);
      setInitialMedia(media); // Track original media
    }
  }, [post]);

  // Handle form submission (update the post)
  const handleSubmit = async () => {
    const token = "Bearer 1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";
    const formData = new FormData();

    // Append caption and platforms
    const plainTextCaption = editorContent.replace(/(<([^>]+)>)/gi, "");
    console.log("the caption is", plainTextCaption);
    formData.append("caption", plainTextCaption);

    for (const pltf of selectedPlatforms) {
      formData.append("platform[]", pltf);
    }

    // selectedPlatforms.forEach((platform) => formData.append("platform[]", platform));

    // Append new or existing media
    // if (uploadedMedia.images.length > 0 || uploadedMedia.videos.length > 0) {
    //   uploadedMedia.images.forEach((image, idx) => {
    //     if (!initialMedia.images.includes(image)) {
    //       formData.append(`media[]`, image);
    //     }
    //   });
    //   uploadedMedia.videos.forEach((video, idx) => {
    //     if (!initialMedia.videos.includes(video)) {
    //       formData.append(`media[]`, video);
    //     }
    //   });
    // } else { 
    //   initialMedia.images.forEach((image) => formData.append(`media[]`, image));
    //   initialMedia.videos.forEach((video) => formData.append(`media[]`, video));
    // }
    for (let pair of formData.entries()) {
      console.log("date which is submitting is ", pair[0] + ": " + pair[1]);
    }

    try {
      // console.log("date which is submitting is ", formData);
      const response = await axios.put(
        `https://crmapi.alayaarts.com/api/posts/${post.id}`, // Update post API
        {
          caption: plainTextCaption,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Post updated successfully!");
      setShowModal(false);
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
