import React from "react";

const ClientAppointments = () => {

    return (
        <>
            <div className="container mt-5">
                <h2 className="mb-4">Client Appointments</h2>
                {/* Filters */}
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="clientNameFilter" className="form-label">
                            Filter by Client Name
                        </label>
                        <input
                            type="text"
                            id="clientNameFilter"
                            className="form-control"
                            placeholder="Search by Client Name"
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="dateFilter" className="form-label">
                            Filter by Appointment Date
                        </label>
                        <input type="date" id="dateFilter" className="form-control" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="meetingMediumFilter" className="form-label">
                            Filter by Meeting Medium
                        </label>
                        <select id="meetingMediumFilter" className="form-select">
                            <option value="">All</option>
                            <option value="Zoom">Zoom</option>
                            <option value="Google Meet">Google Meet</option>
                            <option value="In-Person">In-Person</option>
                        </select>
                    </div>
                </div>
                {/* Table */}
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">Client Name</th>
                            <th scope="col">Appointment Date</th>
                            <th scope="col">Appointment Time</th>
                            <th scope="col">Meeting Medium</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Doe</td>
                            <td>2024-09-12</td>
                            <td>10:00 AM</td>
                            <td>Zoom</td>
                            <td className="d-flex gap-2">
                                <button className="btn btn-primary btn-sm" title="View Details">
                                    <i className="fas fa-eye" />
                                </button>
                                <button className="btn btn-warning btn-sm" title="Edit">
                                    <i className="fas fa-edit" />
                                </button>
                                <button className="btn btn-danger btn-sm" title="Delete">
                                    <i className="fas fa-trash-alt" />
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>Jane Smith</td>
                            <td>2024-09-13</td>
                            <td>2:00 PM</td>
                            <td>In-Person</td>
                            <td className="d-flex gap-2">
                                <button className="btn btn-primary btn-sm" title="View Details">
                                    <i className="fas fa-eye" />
                                </button>
                                <button className="btn btn-warning btn-sm" title="Edit">
                                    <i className="fas fa-edit" />
                                </button>
                                <button className="btn btn-danger btn-sm" title="Delete">
                                    <i className="fas fa-trash-alt" />
                                </button>
                            </td>
                        </tr>
                        {/* Add more rows as needed */}
                    </tbody>
                </table>
            </div>

        </>
    );


}
export default ClientAppointments;