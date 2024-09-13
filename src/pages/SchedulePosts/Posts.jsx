import React from "react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import "./post.css";
import { Link } from "react-router-dom";
const Posts = () => {
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
              <div className="account-item mb-3">
                <img
                  src="/images/profile.jpg"
                  alt="profile"
                  className="rounded-circle me-2"
                />
                <FaFacebook size={24} className="me-2 social-account-icon" />
                <span>Hassan Shafiq</span>
              </div>
              <div className="account-item">
                <img
                  src="/images/profile.jpg"
                  alt="profile"
                  className="rounded-circle me-2"
                />
                <FaLinkedin size={24} className="me-2 social-account-icon" />
                <span>Hassan Shafiq</span>
              </div>
              <div className="add_account text-center account-list-footer w-100 m-0">
               <Link to="/admin/SchedulePosts/SocialAccounts"> <button className="btn btn-light mt-3">+ Add Account</button>
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
              <select className="form-select w-25 mx-2">
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
              </select>
              <select className="form-select w-25">
                <option value="All">All</option>
                <option value="Facebook">Facebook</option>
                <option value="LinkedIn">LinkedIn</option>
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

            {/* Post Card */}
            <div className="card bg-main text-white border-main soical_post_editable mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <img
                    src="/images/profile.jpg"
                    width={40}
                    height={40}
                    alt="profile"
                    style={{ objectPosition: "top" }}
                    className="rounded-circle me-2 object-fit-cover "
                  />
                  <div>
                    <h5 className="card-title mb-0">Hassan Shafiq</h5>
                    <small className="text-secondary">By Hassan Shafiq</small>
                  </div>
                </div>
                <p className="card-text">Hello this is for testing</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary">Wed, 18 Sep at 22:22</span>
                  <div className="d-flex">
                    <button className="btn btn-outline-danger me-2">
                      Delete
                    </button>
                    <button className="btn btn-outline-light me-2">Edit</button>
                    <button className="btn btn-primary">Publish</button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-muted">That's all folks</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Posts;
