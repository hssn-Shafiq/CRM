import { useState, useEffect } from "react";
import "./Emails.css"; // Import the CSS file for styling
import { Modal, Button } from "react-bootstrap";

const Emails = () => {
  // State for "New Data" modal
  const [show, setShow] = useState(false);

  // State for "Create Folder" modal
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  // State for folders and folder name
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null);

  // Load folders from localStorage on component mount
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseCreateFolder = () => {
    setShowCreateFolder(false);
    setNewFolderName("");
    setEditingFolder(null);
  };

  const handleShowCreateFolder = () => {
    setShowCreateFolder(true);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() !== "") {
      const newFolder = { id: Date.now(), name: newFolderName };
      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
      saveFoldersToLocalStorage(updatedFolders);
      handleCloseCreateFolder();
    }
  };

  const handleRenameFolder = () => {
    if (editingFolder && newFolderName.trim() !== "") {
      const updatedFolders = folders.map((folder) =>
        folder.id === editingFolder.id ? { ...folder, name: newFolderName } : folder
      );
      setFolders(updatedFolders);
      saveFoldersToLocalStorage(updatedFolders);
      handleCloseCreateFolder();
    }
  };

  const handleDeleteFolder = (id) => {
    const updatedFolders = folders.filter((folder) => folder.id !== id);
    setFolders(updatedFolders);
    saveFoldersToLocalStorage(updatedFolders);
  };

  const startRenameFolder = (folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    handleShowCreateFolder();
  };

  return (
    <>
      <main>
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">Email Automation</h2>
        </div>
        <div className="Compagnie">
          <div className="header">
            <div>
              <h1>All Campaigns</h1>
            </div>
            <div>
              <button
                className="btn bg-light text-dark border-dark"
                type="button"
                onClick={handleShowCreateFolder}
              >
                <i className="fas fa-folder"></i> Create Folder
              </button>
              <button className="btn btn-new-post ms-2" onClick={handleShow}>
                <i className="fa fa-plus" /> New Data
              </button>
            </div>
          </div>
          <div className="planner-content">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="icons-container d-flex"></div>
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
              <h4>Folders</h4>
              <ul className="list-group mb-3">
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
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Last Updated</th>
                    <th>Execution Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample data rows */}
                  <tr>
                    <td>Master Email</td>
                    <td><span>Published</span></td>
                    <td>Sep 20, 2024 12:03 PM</td>
                    <td>Sep 17, 2024 12:03 PM</td>
                    <td>Draft</td>
                    <td>
                      <i className="fa fa-edit fa-lg" style={{ marginRight: '10px', cursor: 'pointer' }}></i>
                      <i className="fa fa-trash fa-lg" style={{ cursor: 'pointer' }}></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for adding new data */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter title"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="type" className="form-label">Type</label>
                <input
                  type="text"
                  className="form-control"
                  id="type"
                  placeholder="Enter type"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastUpdated" className="form-label">Last Updated</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="lastUpdated"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="executionDate" className="form-label">Execution Date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="executionDate"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select className="form-select" id="status">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="send">Send</option>
                </select>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={handleClose}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for creating/renaming a folder */}
        <Modal show={showCreateFolder} onHide={handleCloseCreateFolder}>
          <Modal.Header closeButton>
            <Modal.Title>{editingFolder ? "Rename Folder" : "Create New Folder"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="folderName" className="form-label">{editingFolder ? "New Folder Name" : "Folder Name"}</label>
                <input
                  type="text"
                  className="form-control"
                  id="folderName"
                  placeholder={editingFolder ? "Enter new folder name" : "Enter folder name"}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCreateFolder}>Close</Button>
            <Button variant="primary" onClick={editingFolder ? handleRenameFolder : handleCreateFolder}>
              {editingFolder ? "Rename Folder" : "Create Folder"}
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default Emails;
