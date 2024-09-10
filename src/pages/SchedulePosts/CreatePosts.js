import React, { useState, useEffect } from "react";
// import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './CreatePosts.css'


const CreatePosts = () => {

  return (
    <>
      <main>
        <div className="create-post">
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="dropdown me-auto ">
                        <button
                          aria-expanded="false"
                          className="btn top-button rounded-5"
                          data-bs-toggle="dropdown"
                          id="dropdownMenuButton"
                          type="button"
                        >
                          <i className="fa fa-chevron-down" />
                        </button>
                        <ul
                          aria-labelledby="dropdownMenuButton"
                          className="dropdown-menu p-2"
                        >
                          <div className="input-group">
                            <i className="search-icon text-secondary fa-solid fa-search"></i>
                            <input
                              className="rounded-3 border-1 ps-4"
                              placeholder="search....."
                              type="search"
                            />
                          </div>
                          <li>
                            <a className="dropdown-item" href="#">
                              Select All
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              Add Account
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              Group Accounts
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="d-flex align-items-center" />
                    </div>
                    <button
                      className="btn btn-labels rounded-5 my-3"
                      data-bs-target="#addLabelModal"
                      data-bs-toggle="modal"
                      type="button"
                    >
                      <i className="fa-solid fa-tags me-2" /> 
                      Add labels
                    </button>
                    <form id="postForm">
                      <div className="form-group mb-3">
                        <textarea
                          className="form-control"
                          id="postText"
                          placeholder="Write something or use shortcodes, spintax ..."
                          rows={9}
                          defaultValue={"                                    "}
                        />
                      </div>
                      <div className="button-section-text-area d-flex justify-content-between align-content-center">
                        <div className="ai-button">
                          <div className="btn fw-semibold responsive-buttons">
                            <i className="fa-solid fa-hashtag text-secondary me-2"></i>
                            Hashtag
                          </div>
                          <div className="btn responsive-buttons fw-semibold">
                            <i className="fa-solid fa-ear-listen text-secondary me-2"></i>
                            AI Assist
                          </div>
                        </div>
                        <div className="blod-itallic-imoji d-flex justify-content-center align-items-center">
                          <div className="btn responsive-buttons me-1 fw-bold btn-outline-secondary">
                            B
                          </div>
                          <div className="btn responsive-buttons me-1 fw-bold btn-outline-secondary">
                            I
                          </div>
                          <div className="btn responsive-buttons me-1 btn-outline-success me-3">
                            <i className="fa-regular fa-face-smile"></i>
                          </div>
                        </div>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          className="form-control"
                          id="inputGroupFile02"
                          type="file"
                        />
                        <label className="input-group-text" htmlFor="inputGroupFile02">
                          Upload
                        </label>
                      </div>
                      <div className="dropup-center dropup">
                        <button
                          aria-expanded="false"
                          className="btn fw-bold text-light"
                          data-bs-toggle="dropdown"
                          type="button"
                        >
                          <i className="fa-solid fa-layer-group" />
                          Bulk Options
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              <i className="fa-solid fa-plus me-2 text-secondary"></i>
                              Add Post
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              <i className="fa-solid fa-cloud-arrow-up me-2 text-secondary"></i>
                              Upload Media
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              <i className="fa-solid fa-file-csv me-2 text-secondary"></i>
                              Import CSV
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-outline-secondary responsive-buttons fw-semibold me-3"
                          type="button"
                        >
                          Draft
                        </button>
                        <button
                          className="btn btn-publish responsive-buttons fw-semibold me-3"
                          type="submit"
                        >
                          Publish
                        </button>
                        <button
                          className="btn btn-schedule responsive-buttons fw-semibold me-3"
                          type="submit"
                        >
                          Schedule
                        </button>
                        <div className="dropup-center dropup">
                          <button
                            aria-expanded="false"
                            className="btn btn-schedule text-light"
                            data-bs-toggle="dropdown"
                            type="button"
                          >
                            <i className="fa-solid fa-square-caret-up"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="fa-solid fa-calendar-days text-secondary me-2"></i>
                                Schedule
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="fa-solid fa-calendar-check text-secondary me-2"></i>
                                AutoSchedule
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="fa-solid fa-recycle text-secondary me-2"></i>
                                Recycle
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="fa-regular fa-window-restore text-secondary me-2"></i>
                                Recurring
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </form>
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
              </div>
            </div>
            {/* Modal */}
            <div
              aria-hidden="true"
              aria-labelledby="addLabelModalLabel"
              className="modal fade"
              id="addLabelModal"
              tabIndex={-1}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addLabelModalLabel">
                      Add labels
                    </h5>
                    <button
                      aria-label="Close"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      type="button"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <select className="form-select" id="labelDropdown">
                        <option selected="">Choose label</option>
                        <option value={1}>Label 1</option>
                        <option value={2}>Label 2</option>
                        <option value={3}>Label 3</option>
                      </select>
                    </div>
                    <a
                      className="text-decoration-none fw-semibold manage"
                      data-bs-target="#modalInmodal"
                      data-bs-toggle="modal"
                      href="#"
                    >
                      <i className="fa-solid fa-tags me-2" />
                      Manage Label
                    </a>
                    <div className="color-picker">
                      <span style={{ backgroundColor: "#6af5b3" }} />
                      <span style={{ backgroundColor: "#f78db7" }} />
                      <span style={{ backgroundColor: "#f7d54c" }} />
                      <span style={{ backgroundColor: "#c2c2c2" }} />
                      <span style={{ backgroundColor: "#7de7d1" }} />
                      <span style={{ backgroundColor: "#f7e78b" }} />
                      <span style={{ backgroundColor: "#cac7f7" }} />
                      <span style={{ backgroundColor: "#c2e5f7" }} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button className="btn btn-success" type="button">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal second */}
            <div
              aria-hidden="true"
              aria-labelledby="modalInmodalLabel"
              className="modal fade"
              id="modalInmodal"
              tabIndex={-1}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="modalInmodalLabel">
                      Manage labels
                    </h5>
                    <button
                      aria-label="Close"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      type="button"
                    ></button>
                  </div>
                  <div className="modal-body text-center">
                    <div className="input-group mb-3">
                      <span className="input-group-text">
                        <i className="fas fa-search" />
                        {/* FontAwesome search icon */}
                      </span>
                      <input
                        className="form-control"
                        placeholder="Search labels"
                        type="text"
                      />
                    </div>
                    <p>Nothing to see here</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      type="button"
                    >
                      Go back
                    </button>
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
