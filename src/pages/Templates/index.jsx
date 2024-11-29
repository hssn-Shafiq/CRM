import React, { useState, useEffect } from "react";
import "./Templates.css";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { emailTemplateApi } from '../../Services/api';

// Reusable Modal Component
const TemplateModal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );
};

const Templates = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState("");
    const [editingFolder, setEditingFolder] = useState(null);
    const [templates, setTemplates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedFolders = localStorage.getItem("folders");
        if (storedFolders) {
            setFolders(JSON.parse(storedFolders));
        }
    }, []);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await emailTemplateApi.getAllTemplates();
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const saveFoldersToLocalStorage = (folders) => {
        localStorage.setItem("folders", JSON.stringify(folders));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalTitle("");
        setNewFolderName("");
        setEditingFolder(null);
    };

    const handleSelectOption = (option) => {
        switch (option) {
            case "blankTemplate":
                navigate('/admin/template-editor');
                return;
            case "importTemplate":
                console.log("Import template");
                break;
            case "duplicateTemplate":
                console.log("Duplicate template");
                break;
            case "fromLibrary":
                console.log("From template library");
                break;
            case "createFolder":
                setModalTitle("Create New Folder");
                setShowModal(true);
                break;
            case "renameFolder":
                setModalTitle("Rename Folder");
                setNewFolderName(editingFolder ? editingFolder.name : "");
                setShowModal(true);
                break;
            default:
                break;
        }
    };

    const handleCreateFolder = () => {
        if (newFolderName.trim() !== "") {
            const newFolder = { id: Date.now(), name: newFolderName };
            const updatedFolders = [...folders, newFolder];
            setFolders(updatedFolders);
            saveFoldersToLocalStorage(updatedFolders);
            handleCloseModal();
        }
    };

    const handleRenameFolder = () => {
        if (editingFolder && newFolderName.trim() !== "") {
            const updatedFolders = folders.map((folder) =>
                folder.id === editingFolder.id ? { ...folder, name: newFolderName } : folder
            );
            setFolders(updatedFolders);
            saveFoldersToLocalStorage(updatedFolders);
            handleCloseModal();
        }
    };

    const handleDeleteFolder = (id) => {
        const updatedFolders = folders.filter((folder) => folder.id !== id);
        setFolders(updatedFolders);
        saveFoldersToLocalStorage(updatedFolders);
    };

    const startRenameFolder = (folder) => {
        setEditingFolder(folder);
        handleSelectOption("renameFolder");
    };

    const handleEditTemplate = (template) => {
        const formattedTemplate = {
            ...template,
            design_json: typeof template.design_json === 'string' 
                ? template.design_json  
                : JSON.stringify(template.design_json) 
        };

        navigate(`/admin/template-editor/${template.id}`, {
            state: {
                template: formattedTemplate
            }
        });
    };

    return (
        <div className="templates-container">
            <div className="main-content">
                <div className="text-center">
                    <h2 className="text-uppercase p-2 page-title">Template Automation</h2>
                </div>

                <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleSelectOption("createFolder")}
                    >
                        Create Folder
                    </button>

                    <Dropdown>
                        <Dropdown.Toggle className="btn btn-primary">+ New</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSelectOption("blankTemplate")}>
                                <i className="fa fa-plus me-2"></i> Blank Template
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelectOption("importTemplate")}>
                                <i className="fa fa-upload me-2"></i> Import Template
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelectOption("duplicateTemplate")}>
                                <i className="fa fa-copy me-2"></i> Duplicate Existing
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => handleSelectOption("fromLibrary")}>
                                <i className="fa fa-book me-2"></i> From Template Library
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="folder-list">
                    <h4>Folders</h4>
                    <ul className="list-group">
                        {folders.length > 0 ? (
                            folders.map((folder) => (
                                <li key={folder.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {folder.name}
                                    <div>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => startRenameFolder(folder)}
                                        >
                                            Rename
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteFolder(folder.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-muted">No folders created yet.</p>
                        )}
                    </ul>
                </div>
                <div className="templates-list mt-4">
                    <h4>Email Templates</h4>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Subject</th>
                                    <th>Category</th>
                                    {/* <th>Created At</th>
                                    <th>Updated At</th> */}
                                    <th>Status</th>
                                    {/* <th>Created By</th> */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map((template) => (
                                    <tr key={template.id}>
                                        <td>{template.id}</td>
                                        <td>{template.name}</td>
                                        <td>{template.subject || 'No subject'}</td>
                                      
                                        <td>
                                            <span className="badge bg-info">
                                                {template.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        {/* <td>{new Date(template.created_at).toLocaleDateString()}</td>
                                        <td>{new Date(template.updated_at).toLocaleDateString()}</td> */}
                                        <td>
                                            <span className={`badge ${template.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                                                {template.status || 'Draft'}
                                            </span>
                                        </td>
                                        {/* <td>{template.created_by || 'System'}</td> */}
                                        <td>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleEditTemplate(template)}
                                                    title="Edit Template"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-info"
                                                    onClick={() => navigate(`/admin/template-preview/${template.id}`)}
                                                    title="Preview Template"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={async () => {
                                                        if (window.confirm('Are you sure you want to delete this template?')) {
                                                            await emailTemplateApi.deleteTemplate(template.id);
                                                            fetchTemplates();
                                                        }
                                                    }}
                                                    title="Delete Template"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <TemplateModal
                show={showModal}
                onClose={handleCloseModal}
                title={modalTitle}
            >
                {modalTitle === "Create New Folder" && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="folderName" className="form-label">Folder Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="folderName"
                                placeholder="Enter folder name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleCreateFolder}
                        >
                            Create Folder
                        </button>
                    </>
                )}
                {modalTitle === "Rename Folder" && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="renameFolderName" className="form-label">Rename Folder</label>
                            <input
                                type="text"
                                className="form-control"
                                id="renameFolderName"
                                placeholder="Enter new folder name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleRenameFolder}
                        >
                            Rename Folder
                        </button>
                    </>
                )}
            </TemplateModal>
        </div>
    );
};

export default Templates;
