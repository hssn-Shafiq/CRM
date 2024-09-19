import React, { useState, useEffect } from "react";

import "./lead.css";
import { Link } from "react-router-dom";

const CustomLeadForm = () => {
  return (
    <>
     
      <main className=" mb-5  parent-lead-data-form" id="custom_lead_top_bar">
      <div className="text-center">
        <h2 className="text-uppercase p-2 page-title">Leads Management </h2>
      </div>
        <div className="container mt-5">
          {/* Button group with Font Awesome icons */}
          <div className="d-flex justify-content-start">
            {/* Plus Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalPlus"
            >
              <i className="fas fa-plus" />
            </button>
            {/* Filter Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalFilter"
            >
              <i className="fas fa-filter" />
            </button>
            {/* Robot Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalRobot"
            >
              <i className="fas fa-robot" />
            </button>
            {/* Comment Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalComment"
            >
              <i className="fas fa-comment" />
            </button>
            {/* Mail Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalMail"
            >
              <i className="fas fa-envelope" />
            </button>
            {/* Tags Icons */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalTagAdd"
            >
              <i className="fas fa-tag" />
              <i className="fas fa-plus" />
            </button>
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalTagRemove"
            >
              <i className="fas fa-tag" />
              <i className="fas fa-minus" />
            </button>
            {/* Delete Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalDelete"
            >
              <i className="fas fa-trash" />
            </button>
            {/* Star Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalStar"
            >
              <i className="fas fa-star" />
            </button>
            {/* Upload Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalUpload"
            >
              <i className="fas fa-upload" />
            </button>
            {/* Download Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalDownload"
            >
              <i className="fas fa-download" />
            </button>
            {/* Building Icon */}
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalBuilding"
            >
              <i className="fas fa-building" />
            </button>
          </div>
        </div>
        <div className="container mt-4">
          <div className="row">
            <div className="col-lg-7">
              <div className="row align-items-center">
                {/* Columns Dropdown */}
                <div className="col-auto">
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-light dropdown-toggle"
                      type="button"
                      id="columnsDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-columns" /> Columns
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="columnsDropdown">
                      <li>
                        <a className="dropdown-item" href="#">
                          Column 1
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Column 2
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Column 3
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Search Bar */}
                <div className="col">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Quick search"
                    />
                  </div>
                </div>
                {/* More Filters Button */}
                <div className="col-auto">
                  <button className="btn btn-outline-light">
                    <i className="fas fa-filter" /> More Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modals */}
        {/* Plus Modal */}
        <div
          className="modal fade"
          id="modalPlus"
          tabIndex={-1}
          aria-labelledby="modalPlusLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalPlusLabel">
                  Add Data{" "}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="container custom-container bg-light rounded shadow">
                  <h2 className="text-lg font-semibold mb-4">
                    <i className="fas fa-address-book" /> Contact
                  </h2>
                  {/* Image and buttons */}
                  <div className="row align-items-center mb-4">
                    <div className="col-4 col-md-3">
                      {/* File input with custom label */}
                      <input
                        type="file"
                        className="custom-file-input"
                        id="fileInput"
                      />
                      <label
                        htmlFor="fileInput"
                        className="btn btn-outline-dark custom-file-label"
                      >
                        <i className="fas fa-upload" /> Upload Logo
                      </label>
                    </div>
                    <div className="col">
                      <button className="btn btn-outline-info me-2">
                        <i className="fas fa-edit" /> Change
                      </button>
                      <button className="btn btn-outline-danger">
                        <i className="fas fa-trash" /> Remove
                      </button>
                      <p className="text-muted mt-2">
                        The proposed size is 512x512px, no bigger than 2.5mb
                      </p>
                    </div>
                  </div>
                  {/* First Name and Last Name */}
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-user" />
                        </span>
                        <input
                          type="text"
                          placeholder="First Name"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-user" />
                        </span>
                        <input
                          type="text"
                          placeholder="Last Name"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Email Section */}
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="fas fa-envelope" /> Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope" />
                      </span>
                      <input
                        type="email"
                        placeholder="Email 1"
                        className="form-control"
                      />
                    </div>
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="addEmail"
                      />
                      <label className="form-check-label" htmlFor="addEmail">
                        Add email
                      </label>
                    </div>
                  </div>
                  {/* Phone Section */}
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="fas fa-phone" /> Phone
                    </label>
                    <select className="form-select">
                      <option>Select</option>
                      <option>Phone 1</option>
                    </select>
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="addPhoneNumbers"
                      />
                      <label className="form-check-label" htmlFor="addPhoneNumbers">
                        Add Phone Numbers
                      </label>
                    </div>
                  </div>
                  {/* Contact Type */}
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="fas fa-id-badge" /> Contact Type
                    </label>
                    <select className="form-select">
                      <option>Lead</option>
                    </select>
                  </div>
                  {/* Time Zone */}
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="fas fa-globe" /> Time Zone
                    </label>
                    <select className="form-select">
                      <option>Choose one...</option>
                    </select>
                  </div>
                  {/* DND Section */}
                  <div className="mb-4">
                    <p className="font-weight-bold">
                      <i className="fas fa-ban" /> DND all channels
                    </p>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dndAll"
                      />
                      <label className="form-check-label" htmlFor="dndAll">
                        DND all channels
                      </label>
                    </div>
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="emails"
                      />
                      <label className="form-check-label" htmlFor="emails">
                        Emails
                      </label>
                    </div>
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="textMessages"
                      />
                      <label className="form-check-label" htmlFor="textMessages">
                        Text Messages
                      </label>
                    </div>
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="calls"
                      />
                      <label className="form-check-label" htmlFor="calls">
                        Calls &amp; Voicemails
                      </label>
                    </div>
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dndInbound"
                      />
                      <label className="form-check-label" htmlFor="dndInbound">
                        DND Inbound Calls and SMS
                      </label>
                    </div>
                  </div>
                  <div className="d-flex flex-row justify-content-between">
                    {/* Save Button */}
                    <div className="d-flex ">
                      <button className="btn btn-outline-info ">
                        <i className="fas fa-save" /> Save
                      </button>
                    </div>
                    {/* Close Button */}
                    <div className="d-flex  ">
                      <button className="btn btn-outline-danger">
                        <i className="fas fa-times" /> Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Filter Modal */}
        <div
          className="modal fade"
          id="modalFilter"
          tabIndex={-1}
          aria-labelledby="modalFilterLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalFilterLabel">
                  Add/Update Opportunity
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div>
                  <div className="bg-light rounded p-2 ">
                    <h2 className="text-lg font-semibold mb-4">
                      <i className="fas fa-tasks" /> Add/Update Opportunity
                    </h2>
                    <p className="text-muted mb-4">
                      <i className="fas fa-info-circle" /> Apply opportunity to
                      following contacts
                    </p>
                    {/* Select Pipeline */}
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-sitemap" /> Select pipeline
                        <select className="form-select mt-1">
                          <option>Select pipeline</option>
                        </select>
                        <small className="text-danger">* Pipeline required</small>
                      </label>
                    </div>
                    {/* Select Stage */}
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-layer-group" /> Select stage
                        <select className="form-select mt-1">
                          <option>Select stage</option>
                        </select>
                        <small className="text-danger">* Stage required</small>
                      </label>
                    </div>
                    {/* Opportunity Name */}
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-briefcase" /> Opportunity Name
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Opportunity Name"
                        />
                      </label>
                    </div>
                    {/* Opportunity Source */}
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-share-alt" /> Opportunity Source
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Opportunity Source"
                        />
                      </label>
                    </div>
                    {/* Lead Value */}
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-dollar-sign" /> Lead Value
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Lead value"
                        />
                      </label>
                    </div>
                    {/* Opportunity Status */}
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-flag" /> Opportunity Status
                        <select className="form-select mt-1">
                          <option>Select status</option>
                        </select>
                      </label>
                    </div>
                    {/* Action Description */}
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-tasks" /> Action
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Enter a description for the action"
                        />
                      </label>
                    </div>
                    {/* Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                      <button className="btn btn-outline-danger">
                        <i className="fas fa-times" /> Cancel
                      </button>
                      <button className="btn btn-outline-info">
                        <i className="fas fa-plus" /> Add/Update Opportunity
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Robot Modal */}
        <div
          className="modal fade"
          id="modalRobot"
          tabIndex={-1}
          aria-labelledby="modalRobotLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalRobotLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                This is the modal for the robot button.
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalComment"
          tabIndex={-1}
          aria-labelledby="modalCommentLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalCommentLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                This is the modal for the Comment button.
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalMail"
          tabIndex={-1}
          aria-labelledby="modalMailLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalMailLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">This is the modal for the Mail button.</div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalTagAdd"
          tabIndex={-1}
          aria-labelledby="modalTagAddLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalTagAddLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                This is the modal for the TagAdd button.
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalTagRemove"
          tabIndex={-1}
          aria-labelledby="modalTagRemoveLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalTagRemoveLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                This is the modal for the Remove Tags button.
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalDelete"
          tabIndex={-1}
          aria-labelledby="modalDeleteLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalDeleteLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                This is the modal for the Delete button.
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalDownload"
          tabIndex={-1}
          aria-labelledby="modalDownloadLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalDownloadLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                This is the modal for the Download button.
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalUpload"
          tabIndex={-1}
          aria-labelledby="modalUploadLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalUploadLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                This is the modal for the Upload button.
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalUpload"
          tabIndex={-1}
          aria-labelledby="modalUploadLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalUploadLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                This is the modal for the Upload button.
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="modalBuilding"
          tabIndex={-1}
          aria-labelledby="modalBuildingLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalBuildingLabel">
                  Robot Icon Modal
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                This is the modal for the Building button.
              </div>
            </div>
          </div>
        </div>
      {/* </main> */}

      {/* <main className="parent-lead-data-form mt-5"> */}

        <div className="container-fluid lead-table-container  mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* <div class="row lead-row-heading-btn d-flex justifly-content-space-between align-items-center"> */}
            <div className="col-lg-6">
              <div className="dropdown">
                <button
                  className="btn btn bg-light text-dark border-dark dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  All
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 add-lead-data-btn">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#orderFormModal"
              >
                Add Lead +
              </button>
            </div>
          </div>
          {/* Responsive Table */}
          <div className="table-responsive">
            <table className="table  table-hover align-middle leads-table">
              <thead>
                <tr className="border-main">
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Organization Name</th>
                  <th>Your State</th>
                  <th>Choose Custom Leads</th>
                  <th>Enter Quantity</th>
                  <th>Required Color</th>
                  <th>Expected Delivery Date</th>
                  <th>Lead Mock-up Details</th>
                  <th>Upload Logo</th>
                  <th>Additional Requests</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John</td>
                  <td>Doe</td>
                  <td>123 Main St</td>
                  <td>john.doe@example.com</td>
                  <td>555-1234</td>
                  <td>Team Alpha</td>
                  <td>California</td>
                  <td>Lead Type A</td>
                  <td>50</td>
                  <td>Blue</td>
                  <td>2024-09-20</td>
                  <td>Mockup A</td>
                  <td>
                    <img
                      src="/images/Huawei-Logo.png"
                      width={60}
                      alt="Huawei Logo"
                    />
                  </td>
                  <td>No requests</td>
                  <td>
                    <a href="#">
                      <i className="fa-regular fa-user text-light" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash text-danger" />
                    </a>{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex={-1}>
                  Previous
                </a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link btn btn-secondary" href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
        {/* Modal Structure */}
        <div
          className="modal fade"
          id="orderFormModal"
          tabIndex={-1}
          aria-labelledby="orderFormModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title text-dark text-center"
                  id="orderFormModalLabel"
                >
                  Lead Generation
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                {/* Order Form */}
                <div className="container max-w-lg mx-auto px-5 bg-white rounded shadow">
                  <h2 className="text-center fw-bol text-dark">Lead Form</h2>
                  <p className="text-center text-dark text-muted mb-4">
                    Complete Below Details for Custom Order.
                  </p>
                  <form>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label text-dark">
                            First Name: *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="..john"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label text-dark">
                            Last Name: *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="..deo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label text-dark">
                            Address: *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Street No ..."
                            required=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label text-dark">
                            Email: *
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            required=""
                            placeholder="name@domain.com"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label text-dark">
                            Phone: *
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            required=""
                            placeholder="123456.."
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label text-dark">
                              Team/Organization Name: *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              required=""
                              placeholder="Athletic Force"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label text-dark">
                              Your State: *
                            </label>
                            <select className="form-select" required="">
                              <option>Please select</option>
                            </select>
                          </div>
                        </div>
                        <div className="row"></div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label text-dark">
                              Choose Custom Product: *
                            </label>
                            <select className="form-select" required="">
                              <option>Please select</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label me-3 text-dark">
                              Enter Quantity: *
                            </label>
                            <div className="quantity-wrapper btn btn">
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="form-control mx-2"
                                defaultValue={1}
                                min={1}
                                required=""
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label text-dark">
                              Your Required Color: *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              required=""
                              placeholder="red, green, #292929"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label text-dark">
                              Expected Delivery Date: *
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              required=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">
                        Product Mockup details: *
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        required=""
                        defaultValue={""}
                        placeholder="the product have a logo on the top right..."
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">
                        Upload high quality Logo: *
                      </label>
                      <div
                        className="border rounded p-3 text-center"
                        style={{ borderStyle: "dashed" }}
                      >
                        <p className="text-muted text-dark">
                          Choose file or drag here
                        </p>
                        <p className="text-muted small text-dark">
                          Supported format: JPG, JPEG, PNG, GIF, SVG.
                        </p>
                        {/* <input  class="btn btn-secondary"> */}
                        <input type="file" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark">
                        Additional Requests:
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        defaultValue={""}
                        placeholder="please make it looks better..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary justify-content-center text-light"
                    >
                      Add Lead
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CustomLeadForm;
