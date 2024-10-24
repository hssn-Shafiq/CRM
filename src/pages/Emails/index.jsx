import { useState } from "react";
import "./Emails.css"; // Import the CSS file for styling
import { Modal, Button } from "react-bootstrap";

const Emails = () => {
  // State for "New Data" modal
  const [show, setShow] = useState(false);

  // State for "Create Folder" modal
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseCreateFolder = () => setShowCreateFolder(false);
  const handleShowCreateFolder = () => setShowCreateFolder(true);

  return (
    <>
      <main>
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">Email Automation</h2>
        </div>
        <div className="Compagnie">
          <div className="header">
            <div>
              <h1>All Compaigns</h1>
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
                  <tr>
                    <td>Seans Greencard</td>
                    <td><span>Published</span></td>
                    <td>Dec 25, 2024 12:03 PM</td>
                    <td>Sep 17, 2024 12:03 PM</td>
                    <td>Send</td>
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
                <label htmlFor="lastUpdated" className="form-label">
                  Last Updated
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="lastUpdated"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="executionDate" className="form-label">
                  Execution Date
                </label>
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
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for creating a folder */}
        <Modal show={showCreateFolder} onHide={handleCloseCreateFolder}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Folder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="folderName" className="form-label">Folder Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="folderName"
                  placeholder="Enter folder name"
                />
              </div>
              {/* <div className="mb-3">
                <label htmlFor="folderDescription" className="form-label">
                  Folder Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="folderDescription"
                  placeholder="Enter folder description"
                />
              </div> */}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCreateFolder}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCloseCreateFolder}>
              Create Folder
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default Emails;
