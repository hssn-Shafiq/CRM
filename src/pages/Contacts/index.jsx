import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import "./Contacts.css";
import { Link } from "react-router-dom";
import CustomerData from "../../components/CustomersData";

const Contacts = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>

      <main className=" mb-5  parent-lead-data-form" id="custom_lead_top_bar">
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">Leads Management </h2>
        </div>
        <div className="container mt-5">
          
          <div className="d-flex justify-content-start">
            
            <button
              className="btn btn-light mx-1"
            >
              <i className="fas fa-plus" />
            </button>
            
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalFilter"
            >
              <i className="fas fa-filter" />
            </button>
            
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalRobot"
            >
              <i className="fas fa-robot" />
            </button>
            
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalComment"
            >
              <i className="fas fa-comment" />
            </button>
            
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalMail"
            >
              <i className="fas fa-envelope" />
            </button>
            
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
            
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalDelete"
            >
              <i className="fas fa-trash" />
            </button>
            
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalStar"
            >
              <i className="fas fa-star" />
            </button>
            
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalUpload"
            >
              <i className="fas fa-upload" />
            </button>
            
            <button
              className="btn btn-light mx-1"
              data-bs-toggle="modal"
              data-bs-target="#modalDownload"
            >
              <i className="fas fa-download" />
            </button>
            
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
                          Name
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Company
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Address
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Country
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          State
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          City
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Email
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Phone
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Social Media
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Lead Source
                        </a>
                      </li>
                    </ul>
                  </div>

                </div>
                
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
                
                <div className="col-auto">
                  <button className="btn btn-outline-light" onClick={handleShow}>
                    <i className="fas fa-filter" /> More Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* <div
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
                  
                  <div className="row align-items-center mb-4">
                    <div className="col-4 col-md-3">
                      
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
                  
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="fas fa-id-badge" /> Contact Type
                    </label>
                    <select className="form-select">
                      <option>Lead</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="fas fa-globe" /> Time Zone
                    </label>
                    <select className="form-select">
                      <option>Choose one...</option>
                    </select>
                  </div>
                  
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
                    
                    <div className="d-flex ">
                      <button className="btn btn-outline-info ">
                        <i className="fas fa-save" /> Save
                      </button>
                    </div>
                    
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
        </div> */}
        
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
                    
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-sitemap" /> Select pipeline
                        <select className="form-select mt-1">
                          <option>Select pipeline</option>
                        </select>
                        <small className="text-danger">* Pipeline required</small>
                      </label>
                    </div>
                    
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-layer-group" /> Select stage
                        <select className="form-select mt-1">
                          <option>Select stage</option>
                        </select>
                        <small className="text-danger">* Stage required</small>
                      </label>
                    </div>
                    
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
                    
                    <div className="col-sm-12">
                      <label className="form-label mb-2">
                        <i className="fas fa-flag" /> Opportunity Status
                        <select className="form-select mt-1">
                          <option>Select status</option>
                        </select>
                      </label>
                    </div>
                    
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
        


        
        <CustomerData />



        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Filter Leads</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="filterName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>

              <Form.Group controlId="filterCompany" className="mt-3">
                <Form.Label>Company</Form.Label>
                <Form.Control type="text" placeholder="Enter company" />
              </Form.Group>

              <Form.Group controlId="filterCountry" className="mt-3">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" placeholder="Enter country" />
              </Form.Group>

              <Form.Group controlId="filterCity" className="mt-3">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="Enter city" />
              </Form.Group>

              
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Apply Filters
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default Contacts;
