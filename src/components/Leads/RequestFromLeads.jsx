// src/Components/Leads/RequestFromLeads.jsx
import React from 'react';

const RequestFromLeads = ({ leads }) => {
    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle leads-table">
                <thead>
                    <tr className="border-main">
                        <th>Name</th>
                        <th>Company</th>
                        <th>Address</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.length > 0 ? (
                        leads.map(({ id, first_name, last_name, company, address1, country, province, city, email, phone }) => (
                            <tr key={id}>
                                <td>{`${first_name} ${last_name}`}</td>
                                <td>{company || "No company"}</td>
                                <td>{address1 || "No address"}</td>
                                <td>{country || "No country"}</td>
                                <td>{province || "No state"}</td>
                                <td>{city || "No city"}</td>
                                <td>{email}</td>
                                <td>{phone || "No phone"}</td>
                                <td>
                                    {/* Edit and Delete Icons */}
                                    <button className="btn btn-warning btn-sm me-2">
                                        <i className="fa fa-pencil" />
                                    </button>
                                    <button className="btn btn-danger btn-sm">
                                        <i className="fa fa-trash" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">
                                No leads available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RequestFromLeads;
