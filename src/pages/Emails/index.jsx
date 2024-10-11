import { useState } from "react";
import "./Emails.css";
import { Modal, Button } from "react-bootstrap";

const Emails = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <main>
        <div className="text-center">
          <h2 className="text-uppercase p-2 page-title">Email Automation</h2>
        </div>
        <div className="Compagnie">
          <div className="header">
            <div>
              <h1>All Compagnie</h1>
            </div>
            <div>
              <button className="btn bg-light text-dark border-dark" type="button">
                <i className="fas fa-folder"></i> Create Folder
              </button>
              <button className="btn btn-new-post ms-2" onClick={handleShow}>
                <i className="fa fa-plus" /> New Data
              </button>
            </div>
          </div>
          <div className="planner-content">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="icons-container d-flex">
                <h4 className="fw-bold">Home</h4>
              </div>
              <div className="date-picker">
                <i className="fa fa-calendar-days" />
                <input type="date" className="form-control" defaultValue="2024-04-22" />
                <span className="mx-2">to</span>
                <input type="date" className="form-control" defaultValue="2024-10-22" />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Compagnie name</th>
                    <th>Template name</th>
                    <th>Status</th>
                    <th>Deliver to</th>
                    <th>Date &amp; Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Eid Milad Ul Nabi Mubarak!</td>
                    <td>
                      <img src="https://via.placeholder.com/60" alt="media" />
                    </td>
                    <td>
                      <span className="status-published">Published</span>
                    </td>
                    <td>Post composer</td>
                    <td>Sep 17, 2024 12:03 PM</td>
                    <td>
                      <i className="fa fa-edit fa-lg" style={{ marginRight: '10px', cursor: 'pointer' }}></i>
                      <i className="fa fa-trash fa-lg" style={{ cursor: 'pointer' }}></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Eid Milad Ul Nabi Mubarak!</td>
                    <td>
                      <img src="https://via.placeholder.com/60" alt="media" />
                    </td>
                    <td>
                      <span className="status-published">Published</span>
                    </td>
                    <td>Post composer</td>
                    <td>Sep 17, 2024 12:03 PM</td>
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
                <label htmlFor="compagnieName" className="form-label">Compagnie Name</label>
                <input type="text" className="form-control" id="compagnieName" placeholder="Enter compagnie name" />
              </div>
              <div className="mb-3">
                <label htmlFor="templateName" className="form-label">Template Name</label>
                <input type="text" className="form-control" id="templateName" placeholder="Enter template name" />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select className="form-select" id="status">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="deliverTo" className="form-label">Deliver To</label>
                <input type="text" className="form-control" id="deliverTo" placeholder="Enter delivery method" />
              </div>
              <div className="mb-3">
                <label htmlFor="dateTime" className="form-label">Date & Time</label>
                <input type="datetime-local" className="form-control" id="dateTime" />
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
      </main>
    </>
  );
};

export default Emails;
