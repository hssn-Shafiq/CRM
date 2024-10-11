import React, { useState } from "react";
import "./Templates.css";

const Templates = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templateName, setTemplateName] = useState("");
    const [templateSubject, setTemplateSubject] = useState("");
    const [emailContent, setEmailContent] = useState("");

    const handleEditClick = (template) => {
        setSelectedTemplate(template);
        setTemplateName(template.templateName);
        setTemplateSubject(template.subject);
        setEmailContent(template.content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTemplate(null);
        setTemplateName("");
        setTemplateSubject("");
        setEmailContent("");
    };

    const handleSaveChanges = () => {
        console.log("Saving changes:", {
            templateName,
            templateSubject,
            emailContent,
        });
        handleCloseModal();
    };

    const emailTemplates = [
        {
            id: 1,
            companionName: "Email Companion 1",
            templateName: "Newsletter",
            templateType: "Newsletter",
            subject: "Special Offer: Eid Mubarak",
            recipients: 500,
            status: "Published",
            dateTime: "Sep 17, 2024 12:03 PM",
            content: "This is a special offer email content for Eid Mubarak.",
        },
        {
            id: 2,
            companionName: "Email Companion 2",
            templateName: "Promotional",
            templateType: "Promotional",
            subject: "New Product Launch",
            recipients: 1200,
            status: "Published",
            dateTime: "Sep 18, 2024 10:30 AM",
            content: "We are excited to launch our new product.",
        },
    ];

    return (
        <>
            <>
                <div className="Compagnie">
                    <div className="text-center">
                        <h2 className="text-uppercase p-2 page-title">Template  Automation</h2>
                    </div>
                    <div className="header">
                        <div>
                            <h1>Email Companion</h1>
                        </div>
                        <div>
                            <button className="btn bg-light text-dark border-dark" type="button">
                                <i className="fas fa-folder"></i> Create Folder
                            </button>
                            <button
                                className="btn btn-new-post ms-2"
                                onClick={() => setShowModal(true)}
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
                                    {emailTemplates.map((template) => (
                                        <tr key={template.id}>
                                            <td>{template.companionName}</td>
                                            <td>
                                                <img src="https://via.placeholder.com/60" alt="media" />
                                            </td>
                                            <td>{template.templateType}</td>
                                            <td>{template.subject}</td>
                                            <td>{template.recipients} Recipients</td>
                                            <td>
                                                <span className="status-published">
                                                    {template.status}
                                                </span>
                                            </td>
                                            <td>{template.dateTime}</td>
                                            <td>
                                                <i
                                                    className="fa fa-edit fa-lg action-icon"
                                                    title="Edit"
                                                    onClick={() => handleEditClick(template)}
                                                />
                                                <i className="fa fa-trash fa-lg action-icon" title="Delete" />
                                            </td>
                                        </tr>
                                    ))}
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


                {showModal && (
                    <div
                        className="modal fade show"
                        style={{ display: "block" }}
                        id="emailTemplateModal"
                        tabIndex={-1}
                        aria-labelledby="emailTemplateModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title text-dark" id="emailTemplateModalLabel">
                                        {selectedTemplate ? "Edit Email Template" : "Create Email Template"}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
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
                                                value={templateName}
                                                onChange={(e) => setTemplateName(e.target.value)}
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
                                                value={templateSubject}
                                                onChange={(e) => setTemplateSubject(e.target.value)}
                                                placeholder="Enter email subject"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="emailContent" className="form-label">
                                                Email Content
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="emailContent"
                                                rows={6}
                                                value={emailContent}
                                                onChange={(e) => setEmailContent(e.target.value)}
                                                placeholder="Write your email content here..."
                                            />
                                        </div>
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleSaveChanges}
                                            >
                                                {selectedTemplate ? "Save Changes" : "Create Template"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </>
    );
}
export default Templates;