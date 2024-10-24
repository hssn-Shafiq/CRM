import React, { useState } from "react";
import "./Templates.css";
import { Dropdown } from "react-bootstrap"; // Add Bootstrap for easy dropdown

// Reusable Modal Component for Templates and Folder
const TemplateModal = ({ show, onClose, title, content }) => {
    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>{content}</form> {/* Dynamic form content */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Templates = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [folders, setFolders] = useState([
        { id: 1, name: "Marketing Campaigns" },
        { id: 2, name: "Promotional Emails" },
        { id: 3, name: "Client Communication" },
    ]); // Dummy folder names
    const [templates, setTemplates] = useState([
        {
            id: 1,
            name: "Newsletter Template",
            type: "Newsletter",
            subject: "Weekly Newsletter",
            recipients: 500,
            status: "Published",
            createdAt: "2024-10-01",
        },
        {
            id: 2,
            name: "Promotional Campaign",
            type: "Promotional",
            subject: "Special Discount for Eid",
            recipients: 1000,
            status: "Draft",
            createdAt: "2024-10-03",
        },
        {
            id: 3,
            name: "Reminder Email",
            type: "Reminder",
            subject: "Don't Miss Our Upcoming Webinar",
            recipients: 150,
            status: "Scheduled",
            createdAt: "2024-10-05",
        },
    ]); // Dummy template data

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent("");
        setModalTitle("");
    };

    const handleSelectOption = (option) => {
        let title = "";
        let content = "";

        switch (option) {
            case "existingCampaign":
                title = "Create Template from Existing Campaign";
                content = (
                    <>
                        <div className="mb-3">
                            <label htmlFor="campaign" className="form-label">Select Campaign</label>
                            <select className="form-select" id="campaign">
                                <option>Select existing campaign</option>
                                <option>Campaign 1</option>
                                <option>Campaign 2</option>
                            </select>
                        </div>
                    </>
                );
                break;

            case "emailMarketing":
                title = "Email Marketing Templates";
                content = (
                    <>
                        <div className="mb-3">
                            <label htmlFor="templateName" className="form-label">Template Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="templateName"
                                placeholder="Enter template name"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="emailSubject" className="form-label">Subject</label>
                            <input
                                type="text"
                                className="form-control"
                                id="emailSubject"
                                placeholder="Enter subject"
                            />
                        </div>
                    </>
                );
                break;

            case "blankTemplate":
                title = "Blank Template";
                content = (
                    <>
                        <div className="mb-3">
                            <label htmlFor="templateTitle" className="form-label">Template Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="templateTitle"
                                placeholder="Enter template title"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="templateContent" className="form-label">Content</label>
                            <textarea
                                className="form-control"
                                id="templateContent"
                                rows={6}
                                placeholder="Enter your content"
                            ></textarea>
                        </div>
                    </>
                );
                break;

            case "importEmail":
                title = "Import Email";
                content = (
                    <>
                        <div className="mb-3">
                            <label htmlFor="importFile" className="form-label">Import Email File</label>
                            <input type="file" className="form-control" id="importFile" />
                        </div>
                    </>
                );
                break;

            default:
                break;
        }

        setModalTitle(title);
        setModalContent(content);
        setShowModal(true);
    };

    const handleCreateFolder = () => {
        setModalTitle("Create New Folder");
        setModalContent(
            <>
                <div className="mb-3">
                    <label htmlFor="folderName" className="form-label">Folder Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="folderName"
                        placeholder="Enter folder name"
                    />
                </div>
                <button className="btn btn-outline-light">Create Folder</button>
            </>
        );
        setShowModal(true);
    };

    return (
        <>
            <div className="Compagnie d-flex">


                {/* Main content */}
                <div className="main-content flex-grow-1">
                    <div className="text-center">
                        <h2 className="text-uppercase p-2 page-title">Template Automation</h2>
                    </div>

                    {/* Sidebar for folders */}
                    <div className="row">

                        <div className="d-flex align-items-center justify-content-center">
                            {/* Create Folder and New Button like the image */}
                            <button className="btn btn-secondary me-3" onClick={handleCreateFolder}>
                                Create Folder
                            </button>

                            <Dropdown>
                                <Dropdown.Toggle className="btn btn-primary">+ New</Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleSelectOption("existingCampaign")}>
                                        <i className="fa fa-download me-2"></i> Create Template from Existing Campaign
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSelectOption("emailMarketing")}>
                                        <i className="fa fa-envelope me-2"></i> Email Marketing Templates
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSelectOption("blankTemplate")}>
                                        <i className="fa fa-plus me-2"></i> Blank Template
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleSelectOption("importEmail")}>
                                        <i className="fa fa-download me-2"></i> Import Email
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                    </div>
                    {/* Table displaying dummy data */}
                    <div className="folder-list ">
                        <h4>Folders</h4>
                        <ul className="list-group">
                            {folders.map((folder) => (
                                <li key={folder.id} className="list-group-item">
                                    {folder.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="table-responsive mt-4">

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Template Name</th>
                                    <th>Template Type</th>
                                    <th>Subject</th>
                                    <th>Recipients</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map((template) => (
                                    <tr key={template.id}>
                                        <td>{template.name}</td>
                                        <td>{template.type}</td>
                                        <td>{template.subject}</td>
                                        <td>{template.recipients}</td>
                                        <td>{template.status}</td>
                                        <td>{template.createdAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <TemplateModal
                show={showModal}
                onClose={handleCloseModal}
                title={modalTitle}
                content={modalContent}
            />
        </>
    );
};

export default Templates;
