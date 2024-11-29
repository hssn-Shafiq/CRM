import React, { useState, useEffect } from "react";
import "./Templates.css";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Reusable Modal Component for Templates and Folder
const TemplateModal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex={-1}
      role="dialog"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
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
  const [folders, setFolders] = useState([]); // State for list of folders
  const [newFolderName, setNewFolderName] = useState(""); // State for new folder name
  const [editingFolder, setEditingFolder] = useState(null); // State for folder being edited
  const navigate = useNavigate(); // Hook for navigation

  // Load folders from localStorage when the component mounts
  useEffect(() => {
    const storedFolders = localStorage.getItem("folders");
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    }
  }, []);

  // Function to save folders to localStorage
  const saveFoldersToLocalStorage = (folders) => {
    localStorage.setItem("folders", JSON.stringify(folders));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalTitle("");
    setNewFolderName("");
    setEditingFolder(null); // Reset editing state
  };

  const handleSelectOption = (option) => {
    switch (option) {
      case "blankTemplate":
        navigate("/admin/EmailEditors");
        return;

      case "createFolder":
        setModalTitle("Create New Folder");
        setShowModal(true);
        break;

      case "renameFolder":
        setModalTitle("Rename Folder");
        setNewFolderName(editingFolder ? editingFolder.name : "");
        setShowModal(true);
        break;

      case "existingCampaign":
      case "emailMarketing":
      case "importEmail":
        setModalTitle("Template Operation");
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
      setFolders(updatedFolders); // Add the new folder to the state
      saveFoldersToLocalStorage(updatedFolders); // Save to localStorage
      handleCloseModal(); // Close the modal
    }
  };

  const handleRenameFolder = () => {
    if (editingFolder && newFolderName.trim() !== "") {
      const updatedFolders = folders.map((folder) =>
        folder.id === editingFolder.id
          ? { ...folder, name: newFolderName }
          : folder
      );
      setFolders(updatedFolders);
      saveFoldersToLocalStorage(updatedFolders); // Save to localStorage
      handleCloseModal(); // Close the modal
    }
  };

  const handleDeleteFolder = (id) => {
    const updatedFolders = folders.filter((folder) => folder.id !== id);
    setFolders(updatedFolders);
    saveFoldersToLocalStorage(updatedFolders); // Save to localStorage
  };

  const startRenameFolder = (folder) => {
    setEditingFolder(folder);
    handleSelectOption("renameFolder");
  };

  return (
    <>
      <div className="Compagnie d-flex">
        {/* Main content */}
        <div className="main-content flex-grow-1">
          <div className="text-center">
            <h2 className="text-uppercase p-2 page-title">
              Template Automation
            </h2>
          </div>

          {/* Sidebar for folders */}
          <div className="row">
            <div className="d-flex align-items-center justify-content-center">
              {/* Create Folder and New Button */}
              <button
                className="btn btn-secondary me-3"
                onClick={() => handleSelectOption("createFolder")}
              >
                Create Folder
              </button>

              <Dropdown>
                <Dropdown.Toggle className="btn btn-primary">
                  + New
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleSelectOption("existingCampaign")}
                  >
                    <i className="fa fa-download me-2"></i> Create Template from
                    Existing Campaign
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleSelectOption("emailMarketing")}
                  >
                    <i className="fa fa-envelope me-2"></i> Email Marketing
                    Templates
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleSelectOption("blankTemplate")}
                  >
                    <i className="fa fa-plus me-2"></i> Blank Template
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleSelectOption("importEmail")}
                  >
                    <i className="fa fa-download me-2"></i> Import Email
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Table displaying folders */}
          <div className="folder-list m-3">
            <h4>Folders</h4>
            <ul className="list-group">
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <li
                    key={folder.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
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
                <p className="text-secondary">No folders created yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TemplateModal
        show={showModal}
        onClose={handleCloseModal}
        title={modalTitle}
      >
        {modalTitle === "Create New Folder" && (
          <>
            <div className="mb-3">
              <label htmlFor="folderName" className="form-label">
                Folder Name
              </label>
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
              <label htmlFor="renameFolderName" className="form-label">
                Rename Folder
              </label>
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
    </>
  );
};

export default Templates;
