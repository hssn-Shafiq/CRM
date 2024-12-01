import React, { useState, useEffect } from "react";
import "./Templates.css";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { emailTemplateApi } from "../../Services/api";
import { folderApi } from '../../Services/api';

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
    const [folders, setFolders] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFoldersAndTemplates();
    }, []);

    const fetchFoldersAndTemplates = async () => {
        try {
            // First fetch folders
            const foldersResponse = await folderApi.getFolders();
            const foldersData = foldersResponse.data;
            
            // Fetch all templates
            const allTemplatesResponse = await emailTemplateApi.getAllTemplates();
            const allTemplates = allTemplatesResponse.data;
            
            // Group templates by folder_id
            const foldersWithTemplates = foldersData.map(folder => ({
                ...folder,
                templates: allTemplates.filter(template => template.folder_id === folder.id)
            }));
            
            // Add templates without folder (folder_id is null)
            const unfolderedTemplates = allTemplates.filter(template => !template.folder_id);
            if (unfolderedTemplates.length > 0) {
                foldersWithTemplates.push({
                    id: 'unfoldered',
                    name: 'Unorganized Templates',
                    templates: unfolderedTemplates
                });
            }
            
            setFolders(foldersWithTemplates);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalTitle("");
        setNewFolderName("");
        setSelectedTemplate(null);
    };

    const handleSelectOption = (option, folder) => {
        switch (option) {
            case "blankTemplate":
                navigate("/admin/template-editor", {
                    state: { 
                        folderId: selectedFolder?.id,
                        isNewTemplate: true
                    }
                });
                return;
            case "createFolder":
                setModalTitle("Create New Folder");
                setShowModal(true);
                break;
            case "renameFolder":
                setSelectedFolder(folder);
                setModalTitle("Rename Folder");
                setNewFolderName(folder.name);
                setShowModal(true);
                break;
            default:
                break;
        }
    };

    const handleCreateFolder = async () => {
        if (newFolderName.trim()) {
            try {
                const response = await folderApi.createFolder({ name: newFolderName });
                const newFolderId = response.data.id;

                if (templates.length > 0) {
                    const updatePromises = templates.map(template => 
                        emailTemplateApi.updateTemplate(template.id, {
                            ...template,
                            folder_id: newFolderId
                        })
                    );
                    await Promise.all(updatePromises);
                }

                await fetchFoldersAndTemplates();
                setNewFolderName("");
                setShowModal(false);
            } catch (error) {
                console.error("Error creating folder:", error);
            }
        }
    };

    const handleRenameFolder = async () => {
        if (selectedFolder && newFolderName.trim()) {
            try {
                await folderApi.updateFolder(selectedFolder.id, { name: newFolderName });
                await fetchFoldersAndTemplates();
                handleCloseModal();
            } catch (error) {
                console.error("Error renaming folder:", error);
            }
        }
    };

    const handleDeleteFolder = async (folderId) => {
        if (window.confirm("Are you sure you want to delete this folder?")) {
            try {
                await folderApi.deleteFolder(folderId);
                const templatesInFolder = folders
                    .find(f => f.id === folderId)
                    ?.templates || [];
                
                const updatePromises = templatesInFolder.map(template =>
                    emailTemplateApi.updateTemplate(template.id, {
                        ...template,
                        folder_id: null
                    })
                );
                
                await Promise.all(updatePromises);
                await fetchFoldersAndTemplates();
                setSelectedFolder(null);
            } catch (error) {
                console.error("Error deleting folder:", error);
            }
        }
    };

    const handleEditTemplate = (template) => {
        navigate(`/admin/template-editor/${template.id}`, { 
            state: { 
                template: {
                    ...template,
                    folder_id: template.folder_id || selectedFolder?.id
                },
                folderId: template.folder_id || selectedFolder?.id
            } 
        });
    };

    const handleDeleteTemplate = async (templateId) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            try {
                await emailTemplateApi.deleteTemplate(templateId);
                await fetchFoldersAndTemplates();
            } catch (error) {
                console.error("Error deleting template:", error);
            }
        }
    };

    const handleFolderClick = (folder) => {
        setSelectedFolder(selectedFolder?.id === folder.id ? null : folder);
    };

    const handleShowTemplate = (template) => {
        navigate(`/admin/template-preview/${template.id}`);
    };

    return (
        <div className="templates-container">
            <div className="main-content">
                <div className="text-center">
                    <h2 className="text-uppercase p-2 page-title text-light">Template Automation</h2>
                </div>

                <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
                    <button className="btn btn-secondary" onClick={() => handleSelectOption("createFolder")}>
                        Create Folder
                    </button>

                    <Dropdown>
                        <Dropdown.Toggle className="btn btn-primary">+ New</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSelectOption("blankTemplate")}>
                                <i className="fa fa-plus me-2"></i> Blank Template
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className="folder-list">
                    <h4>Folders</h4>
                    <ul className="list-group">
                        {folders.filter(f => f.id !== 'unfoldered').map((folder) => (
                            <li key={folder.id} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div
                                        className={`folder-name ${selectedFolder?.id === folder.id ? "selected-folder" : ""}`}
                                        onClick={() => handleFolderClick(folder)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {selectedFolder?.id === folder.id ? (
                                            <i className="fas fa-folder-open me-2"></i>
                                        ) : (
                                            <i className="fas fa-folder me-2"></i>
                                        )}
                                        {folder.name}
                                    </div>
                                    <div className="d-flex flex-row">
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleSelectOption("renameFolder", folder)}
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
                                </div>
                                {selectedFolder?.id === folder.id && (
                                    <div className="folder-templates mt-2">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Category</th>
                                                    <th>Subject</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {folder.templates?.map((template) => (
                                                    <tr key={template.id}>
                                                        <td>{template.name}</td>
                                                        <td>{template.category}</td>
                                                        <td>{template.subject}</td>
                                                        <td className="d-flex flex-row">
                                                            <button
                                                                className="btn btn-info btn-sm me-2"
                                                                onClick={() => handleShowTemplate(template)}
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-primary btn-sm me-2"
                                                                onClick={() => handleEditTemplate(template)}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleDeleteTemplate(template.id)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4">
                        <h4> Templates</h4>
                        <div className="list-group-item">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Subject</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {folders
                                        .find(f => f.id === 'unfoldered')
                                        ?.templates.map((template) => (
                                            <tr key={template.id}>
                                                <td>{template.name}</td>
                                                <td>{template.category}</td>
                                                <td>{template.subject}</td>
                                                <td className="d-flex flex-row">
                                                    <button
                                                        className="btn btn-info btn-sm me-2"
                                                        onClick={() => handleShowTemplate(template)}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-primary btn-sm me-2"
                                                        onClick={() => handleEditTemplate(template)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeleteTemplate(template.id)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <TemplateModal show={showModal} onClose={handleCloseModal} title={modalTitle}>
                {modalTitle === "Create New Folder" && (
                    <>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                        />
                        <button className="btn btn-primary mt-2" onClick={handleCreateFolder}>
                            Create Folder
                        </button>
                    </>
                )}
                {modalTitle === "Rename Folder" && (
                    <>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter new folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                        />
                        <button className="btn btn-primary mt-2" onClick={handleRenameFolder}>
                            Rename Folder
                        </button>
                    </>
                )}
            </TemplateModal>
        </div>
    );
};

export default Templates;
