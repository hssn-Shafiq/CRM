// File: Posts.js
import React, { useState, useEffect } from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaCheckCircle,
  FaInstagram,
  FaCalendar,
} from "react-icons/fa"; // Import FaCheckCircle for the tick mark
import "./post.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import a spinner loader from react-spinners
import PostCreation from "../../components/PostCreation"; // Import PostCreation for editing post
import { Modal } from "react-bootstrap";
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [filterStatus, setFilterStatus] = useState(""); // Start with no status selected
  const [loading, setLoading] = useState(false); // State to manage the loading indicator
  const [selectedPost, setSelectedPost] = useState(null); // Track post to be edited
  const [showEditModal, setShowEditModal] = useState(false); // Manage modal visibility

  // Fetch data from API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Show loader when fetching data
      try {
        const token =
          "Bearer 1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";

        const response = await axios.get(
          "https://crmapi.alayaarts.com/api/posts",
          {
            headers: {
              Authorization: `${token}`, // Include the token in the request headers
              "Content-Type": "multipart/form-data", // Set content type to FormData
            },
          }
        );
        const postsData = response.data?.fb_posts || [];
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Hide loader after fetching
      }
    };
    fetchPosts();
  }, []);

  // Handle status filter change
  useEffect(() => {
    // Show loader on status change
    setLoading(true);
    let filtered = [];

    // Show posts only when "Scheduled" is selected
    if (filterStatus === "Scheduled") {
      filtered = posts.filter((post) => post.scheduled_for);
    }

    // Filter posts based on selected platforms if any platforms are selected
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter((post) =>
        post.platform.some((platform) =>
          selectedPlatforms.includes(platform.toLowerCase())
        )
      );
    }

    // Simulate a delay for the loader effect
    setTimeout(() => {
      setFilteredPosts(filtered);
      setLoading(false); // Hide loader after processing
    }, 500);
  }, [filterStatus, posts, selectedPlatforms]);

  // Handle platform selection
  const handlePlatformSelect = (platform) => {
    setLoading(true); // Show loader when platform is selected
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // Handle Edit Post (open modal)
  const handleEdit = (post) => {
    setSelectedPost(post); // Set the selected post for editing
    setShowEditModal(true); // Show the edit modal
  };

  // Handle Delete Post
  const handleDelete = async (postId) => {
    const token = "Bearer 1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";

    try {
      setLoading(true); // Show loader during deletion
      await axios.delete(`https://crmapi.alayaarts.com/api/posts/${postId}`, {
        headers: {
          Authorization: `${token}`, // Include the token in the request headers
          "Content-Type": "multipart/form-data", // Set content type to FormData
        },
      });

      // Update state after successful deletion
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.filter((post) => post.id !== postId)
      );

      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    } finally {
      setLoading(false); // Hide loader after deletion
    }
  };

  return (
    <main>
      <div className="text-center">
        <h2 className="text-uppercase p-2 page-title">Posts </h2>
      </div>
      <div className="container-fluid p-3 text-white">
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-md-3">
            <div className="account-list">
              <div
                className={`account-item ${
                  selectedPlatforms.includes("facebook") && "selected"
                }`}
                onClick={() => handlePlatformSelect("facebook")}
              >
                <img
                  src="/images/profile.jpg"
                  alt="profile"
                  className="rounded-circle me-2"
                />
                <FaFacebook
                  size={selectedPlatforms.includes("facebook") ? 20 : 24}
                  className="me-2 social-account-icon"
                  style={{
                    transform: selectedPlatforms.includes("facebook")
                      ? "scale(0.9)"
                      : "scale(1)",
                  }}
                />
                <span>Facebook</span>
                {selectedPlatforms.includes("facebook") && (
                  <FaCheckCircle className="selected-tick" />
                )}
              </div>
              <div
                className={`account-item ${
                  selectedPlatforms.includes("linkedin") && "selected"
                }`}
                onClick={() => handlePlatformSelect("linkedin")}
              >
                <img
                  src="/images/profile.jpg"
                  alt="profile"
                  className="rounded-circle me-2"
                />
                <FaLinkedin
                  size={selectedPlatforms.includes("linkedin") ? 20 : 24}
                  className="me-2 social-account-icon"
                  style={{
                    transform: selectedPlatforms.includes("linkedin")
                      ? "scale(0.9)"
                      : "scale(1)",
                  }}
                />
                <span>LinkedIn</span>
                {selectedPlatforms.includes("linkedin") && (
                  <FaCheckCircle className="selected-tick" />
                )}
              </div>
              <div
                className={`account-item ${
                  selectedPlatforms.includes("instagram") && "selected"
                }`}
                onClick={() => handlePlatformSelect("instagram")}
              >
                <img
                  src="/images/profile.jpg"
                  alt="profile"
                  className="rounded-circle me-2"
                />
                <FaInstagram
                  size={selectedPlatforms.includes("instagram") ? 20 : 24}
                  className="me-2 social-account-icon"
                  style={{
                    transform: selectedPlatforms.includes("instagram")
                      ? "scale(0.9)"
                      : "scale(1)",
                  }}
                />
                <span>Instagram</span>
                {selectedPlatforms.includes("instagram") && (
                  <FaCheckCircle className="selected-tick" />
                )}
              </div>
              <div className="add_account text-center account-list-footer w-100 m-0">
                <Link to="/admin/SchedulePosts/SocialAccounts">
                  <button className="btn btn-light mt-3">+ Add Account</button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 posts_updates_main">
            <div className="d-flex posts_updates_header justify-content-between align-items-center mb-3">
              <input
                type="search"
                placeholder="Search posts"
                className="form-control w-30"
              />
              <select
                className="form-select w-25 mx-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
              </select>
              <div className="form-check form-switch w-30 ms-3">
                <label className="form-check-label" htmlFor="gridViewSwitch">
                  Grid view
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gridViewSwitch"
                />
              </div>
            </div>

            {/* Loader */}
            {loading ? (
              <div className="d-flex justify-content-center my-4">
                <ClipLoader color="#fff" loading={loading} size={50} />
              </div>
            ) : (
              <>
                {/* Post Cards */}
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="card bg-main text-white border-main soical_post_editable mb-3"
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <img
                          src="/images/profile.jpg"
                          width={40}
                          height={40}
                          alt="profile"
                          style={{ objectPosition: "top" }}
                          className="rounded-circle me-2 object-fit-cover"
                        />
                        <div>
                          <h5 className="card-title mb-0">Hassan Shafiq</h5>
                          <small className="text-secondary">
                            {post.user_id ? `By User ID ${post.user_id}` : ""}
                          </small>
                        </div>
                      </div>
                      <p className="card-text">{post.caption}</p>
                      <div className="media-preview-main d-flex gap-2 mb-3">
                        {post.media.length > 0 &&
                          post.media.map((mediaItem, index) => (
                            <img
                              key={index}
                              src={mediaItem || "/images/profile.jpg"}
                              width={120}
                              // src="/images/profile.jpg"
                              className="img-thumbnail"
                              alt="thubnails"
                            />
                          ))}
                      </div>
                      <p className="text-secondary">
                        Platforms: {post.platform.join(", ")}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-secondary">
                          Scheduled for{" "}
                          <span
                            className="border-main p-1 px-2 rounded-3"
                            style={{ cursor: "pointer" }}
                          >
                            <FaCalendar />{" "}
                            {new Date(post.scheduled_for).toLocaleString()}
                          </span>
                        </span>
                        <div className="d-flex">
                          <button
                            className="btn btn-outline-danger me-2"
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-outline-light me-2"
                            onClick={() => handleEdit(post)}
                          >
                            Edit
                          </button>
                          <button className="btn btn-primary">Publish</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPosts.length === 0 && !loading && (
                  <p className="text-center text-danger">No posts available.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="xl"
        backdrop='static'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body 
        className="bg-main"
        
        >
          {selectedPost && (
            <PostCreation
              post={selectedPost} // Pass selected post data
              setShowModal={setShowEditModal}
            />
          )}
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default Posts;
