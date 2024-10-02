import React from "react";
import "./ClientAppointments.css";

const ClientAppointments = () => {

    return (
        <>
            <>
                <div className="Compagnie">
                    <div className="header">
                        <div>
                            <h1>Email Companion</h1>
                        </div>
                        <div>
                            <button
                                className="btn btn-new-post ms-2"
                                data-bs-toggle="modal"
                                data-bs-target="#emailTemplateModal"
                            >
                                <i className="fa fa-envelope" /> Create Template
                            </button>
                        </div>
                    </div>
                    <div className="planner-content">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="icons-container d-flex">
                                <h4 className="fw-bold">All Emails</h4>
                            </div>
                            <div className="date-picker">
                                <i className="fa fa-calendar-days" />
                                <input
                                    type="date"
                                    className="form-control"
                                    defaultValue="2024-04-22"
                                />
                                <span className="mx-2">to</span>
                                <input
                                    type="date"
                                    className="form-control"
                                    defaultValue="2024-10-22"
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Companion Name</th>
                                        <th>Template Name</th>
                                        <th>Template Type</th>
                                        <th>Subject</th>
                                        <th>Recipients</th>
                                        <th>Status</th>
                                        <th>Date &amp; Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Email Companion 1</td>
                                        <td>
                                            <img src="https://via.placeholder.com/60" alt="media" />
                                        </td>
                                        <td>Newsletter</td>
                                        <td>Special Offer: Eid Mubarak</td>
                                        <td>500 Recipients</td>
                                        <td>
                                            <span className="status-published">Published</span>
                                        </td>
                                        <td>Sep 17, 2024 12:03 PM</td>
                                        <td>
                                            <i className="fa fa-edit fa-lg action-icon" title="Edit" />
                                            <i className="fa fa-trash fa-lg action-icon" title="Delete" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Email Companion 2</td>
                                        <td>
                                            <img src="https://via.placeholder.com/60" alt="media" />
                                        </td>
                                        <td>Promotional</td>
                                        <td>New Product Launch</td>
                                        <td>1,200 Recipients</td>
                                        <td>
                                            <span className="status-published">Published</span>
                                        </td>
                                        <td>Sep 18, 2024 10:30 AM</td>
                                        <td>
                                            <i className="fa fa-edit fa-lg action-icon" title="Edit" />
                                            <i className="fa fa-trash fa-lg action-icon" title="Delete" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Modal for Email Template */}
                <div
                    className="modal fade"
                    id="emailTemplateModal"
                    tabIndex={-1}
                    aria-labelledby="emailTemplateModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="emailTemplateModalLabel">
                                    Create Email Template
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="templateName" className="form-label">
                                            Template Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="templateName"
                                            placeholder="Enter template name"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="templateSubject" className="form-label">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="templateSubject"
                                            placeholder="Enter email subject"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="emailContent" className="form-label">
                                            Email Content
                                        </label>
                                        {/* Icons for Email Editing */}
                                        <div className="d-flex mb-2">
                                            <button
                                                type="button"
                                                className="btn btn-light me-1"
                                                title="Bold"
                                            >
                                                <i className="fa-solid fa-bold" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-light me-1"
                                                title="Italic"
                                            >
                                                <i className="fa-solid fa-italic" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-light me-1"
                                                title="Underline"
                                            >
                                                <i className="fa-solid fa-underline" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-light me-1"
                                                title="Strikethrough"
                                            >
                                                <i className="fa-solid fa-strikethrough" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-light me-1"
                                                title="Code"
                                            >
                                                <i className="fa-solid fa-code" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-light me-1"
                                                title="Emoji"
                                            >
                                                <i className="fa-solid fa-face-smile" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-light me-1"
                                                title="List"
                                            >
                                                <i className="fa-solid fa-list" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-light me-1"
                                                title="Link"
                                            >
                                                <i className="fa-solid fa-link" />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-light me-1"
                                                title="Quote"
                                            >
                                                <i className="fa-solid fa-quote-right" />
                                            </button>
                                        </div>
                                        {/* Textarea for Email Content */}
                                        <textarea
                                            className="form-control"
                                            id="emailContent"
                                            rows={6}
                                            placeholder="Write your email content here..."
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="companionSelect" className="form-label">
                                            Select Companion
                                        </label>
                                        <select className="form-select" id="companionSelect">
                                            <option selected="">Select Companion</option>
                                            <option value={1}>Companion 1</option>
                                            <option value={2}>Companion 2</option>
                                            <option value={3}>Companion 3</option>
                                        </select>
                                    </div>
                                    <div className="text-end">
                                        <button type="button" className="btn btn-primary">
                                            Save Template
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>


        </>
    );


}
export default ClientAppointments;