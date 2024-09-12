import React, { useState, useEffect } from "react";

import "./lead.css";

const CustomLeadForm = () => {
  return (
    <>
     <main className="parent-lead-data-form">
     <div className="text-center">
        <h2 className="text-uppercase p-2 page-title">Leads Management </h2>
      </div>
    <div className="container-fluid lead-table-container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* <div class="row lead-row-heading-btn d-flex justifly-content-space-between align-items-center"> */}
        <div className="col-lg-6">
          <div className="dropdown">
            <button
              className="btn btn bg-light text-dark border-dark dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              All
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-6 add-lead-data-btn">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#orderFormModal"
          >
            Add Lead +
          </button>
        </div>
      </div>
      {/* Responsive Table */}
      <div className="table-responsive">
        <table className="table  table-hover align-middle leads-table">
          <thead >
            <tr className="border-main">
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Organization Name</th>
              <th>Your State</th>
              <th>Choose Custom Leads</th>
              <th>Enter Quantity</th>
              <th>Required Color</th>
              <th>Expected Delivery Date</th>
              <th>Lead Mock-up Details</th>
              <th>Upload Logo</th>
              <th>Additional Requests</th>
              <th>Appointment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>123 Main St</td>
              <td>john.doe@example.com</td>
              <td>555-1234</td>
              <td>Team Alpha</td>
              <td>California</td>
              <td>Lead Type A</td>
              <td>50</td>
              <td>Blue</td>
              <td>2024-09-20</td>
              <td>Mockup A</td>
              <td>
              <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>No requests</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Jane</td>
              <td>Smith</td>
              <td>456 Oak Ave</td>
              <td>jane.smith@example.com</td>
              <td>555-5678</td>
              <td>Team Beta</td>
              <td>Texas</td>
              <td>Lead Type B</td>
              <td>75</td>
              <td>Red</td>
              <td>2024-09-25</td>
              <td>Mockup B</td>
              <td>
                             <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>Fast delivery</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Alice</td>
              <td>Johnson</td>
              <td>789 Pine Rd</td>
              <td>alice.johnson@example.com</td>
              <td>555-8901</td>
              <td>Team Gamma</td>
              <td>New York</td>
              <td>Lead Type C</td>
              <td>100</td>
              <td>Green</td>
              <td>2024-09-30</td>
              <td>Mockup C</td>
              <td>
                             <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>Urgent delivery</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Alice</td>
              <td>Johnson</td>
              <td>789 Pine Rd</td>
              <td>alice.johnson@example.com</td>
              <td>555-8901</td>
              <td>Team Gamma</td>
              <td>New York</td>
              <td>Lead Type C</td>
              <td>100</td>
              <td>Green</td>
              <td>2024-09-30</td>
              <td>Mockup C</td>
              <td>
                             <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>Urgent delivery</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Alice</td>
              <td>Johnson</td>
              <td>789 Pine Rd</td>
              <td>alice.johnson@example.com</td>
              <td>555-8901</td>
              <td>Team Gamma</td>
              <td>New York</td>
              <td>Lead Type C</td>
              <td>100</td>
              <td>Green</td>
              <td>2024-09-30</td>
              <td>Mockup C</td>
              <td>
                             <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>Urgent delivery</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Alice</td>
              <td>Johnson</td>
              <td>789 Pine Rd</td>
              <td>alice.johnson@example.com</td>
              <td>555-8901</td>
              <td>Team Gamma</td>
              <td>New York</td>
              <td>Lead Type C</td>
              <td>100</td>
              <td>Green</td>
              <td>2024-09-30</td>
              <td>Mockup C</td>
              <td>
                             <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>Urgent delivery</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Alice</td>
              <td>Johnson</td>
              <td>789 Pine Rd</td>
              <td>alice.johnson@example.com</td>
              <td>555-8901</td>
              <td>Team Gamma</td>
              <td>New York</td>
              <td>Lead Type C</td>
              <td>100</td>
              <td>Green</td>
              <td>2024-09-30</td>
              <td>Mockup C</td>
              <td>
                             <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>Urgent delivery</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Alice</td>
              <td>Johnson</td>
              <td>789 Pine Rd</td>
              <td>alice.johnson@example.com</td>
              <td>555-8901</td>
              <td>Team Gamma</td>
              <td>New York</td>
              <td>Lead Type C</td>
              <td>100</td>
              <td>Green</td>
              <td>2024-09-30</td>
              <td>Mockup C</td>
              <td>
                             <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>Urgent delivery</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Alice</td>
              <td>Johnson</td>
              <td>789 Pine Rd</td>
              <td>alice.johnson@example.com</td>
              <td>555-8901</td>
              <td>Team Gamma</td>
              <td>New York</td>
              <td>Lead Type C</td>
              <td>100</td>
              <td>Green</td>
              <td>2024-09-30</td>
              <td>Mockup C</td>
              <td>
                             <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>Urgent delivery</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Alice</td>
              <td>Johnson</td>
              <td>789 Pine Rd</td>
              <td>alice.johnson@example.com</td>
              <td>555-8901</td>
              <td>Team Gamma</td>
              <td>New York</td>
              <td>Lead Type C</td>
              <td>100</td>
              <td>Green</td>
              <td>2024-09-30</td>
              <td>Mockup C</td>
              <td>
                             <img src="/images/Huawei-Logo.png" width={60} alt="Huawei Logo" />

              </td>
              <td>Urgent delivery</td>
              <td>
                <a href="#" className="btn btn-primary">
                  Book Now
                </a>{" "}
              </td>
              <td>
                <a href="#">
                  <i className="fa-regular fa-user" />
                </a>
                <a href="#">
                  <i className="fa-solid fa-trash" />
                </a>{" "}
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item disabled">
            <a className="page-link" href="#" tabIndex={-1}>
              Previous
            </a>
          </li>
          <li className="page-item active">
            <a className="page-link" href="#">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link btn btn-secondary" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
    {/* Modal Structure */}
    <div
      className="modal fade"
      id="orderFormModal"
      tabIndex={-1}
      aria-labelledby="orderFormModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-dark text-center" id="orderFormModalLabel">
              Lead Generation
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            {/* Order Form */}
            <div className="container max-w-lg mx-auto px-5 bg-white rounded shadow">
              <h2 className="text-center fw-bol text-dark">Lead Form</h2>
              <p className="text-center text-dark text-muted mb-4">
                Complete Below Details for Custom Order.
              </p>
              <form>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label text-dark">First Name: *</label>
                      <input type="text" className="form-control" placeholder="..john" required="" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label text-dark">Last Name: *</label>
                      <input type="text" className="form-control" required="" placeholder="..deo" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label text-dark">Address: *</label>
                      <input type="text" className="form-control" placeholder="Street No ..." required="" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label text-dark">Email: *</label>
                      <input
                        type="email"
                        className="form-control"
                        required=""
                        placeholder="name@domain.com"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label text-dark">Phone: *</label>
                      <input type="tel" className="form-control" required="" placeholder="123456.." />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label text-dark">
                          Team/Organization Name: *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          required=""
                          placeholder="Athletic Force"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label text-dark">Your State: *</label>
                        <select className="form-select" required="">
                          <option>Please select</option>
                        </select>
                      </div>
                    </div>
                    <div className="row"></div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label text-dark">
                          Choose Custom Product: *
                        </label>
                        <select className="form-select" required="">
                          <option>Please select</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label me-3 text-dark">
                          Enter Quantity: *
                        </label>
                        <div className="quantity-wrapper btn btn">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-control mx-2"
                            defaultValue={1}
                            min={1}
                            required=""
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label text-dark">
                          Your Required Color: *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          required=""
                          placeholder="red, green, #292929"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label text-dark">
                          Expected Delivery Date: *
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          required=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-dark">
                    Product Mockup details: *
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    required=""
                    defaultValue={""}
                    placeholder="the product have a logo on the top right..."
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-dark">
                    Upload high quality Logo: *
                  </label>
                  <div
                    className="border rounded p-3 text-center"
                    style={{ borderStyle: "dashed" }}
                  >
                    <p className="text-muted text-dark">Choose file or drag here</p>
                    <p className="text-muted small text-dark">
                      Supported format: JPG, JPEG, PNG, GIF, SVG.
                    </p>
                    {/* <input  class="btn btn-secondary"> */}
                    <input type="file" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-dark">Additional Requests:</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    defaultValue={""}
                    placeholder="please make it looks better..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary justify-content-center text-light"
                >
                  Add Lead
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

</main>

    </>
  );
};

export default CustomLeadForm;
