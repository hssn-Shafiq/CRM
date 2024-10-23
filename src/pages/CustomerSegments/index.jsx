// src/components/CustomerSegments.js
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Form, Modal, Button } from "react-bootstrap";
import { fetchShopifyCustomers } from "../../Services/shopifyService";
import img1 from "../../assets/images/shopify.png";
import "./CustomerSegments.css";

const CustomerSegments = () => {
    const [filterText, setFilterText] = useState("");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSegment, setSelectedSegment] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Sample data for the table (segments)
    const segments = [
        { id: 1, name: "Customers who have purchased at least once", filter: "purchased_once", lastActivity: "Created on Jul 11, 2023", author: img1 },
        { id: 2, name: "Email subscribers", filter: "email_subscribers", lastActivity: "Edited on May 12, 2023", author: img1 },
        { id: 3, name: "Customers who have purchased more than once", filter: "purchased_more_than_once", lastActivity: "Edited on May 12, 2023", author: img1 },
        { id: 4, name: "Customers who haven't purchased", filter: "not_purchased", lastActivity: "Edited on May 12, 2023", author: img1 },
        { id: 5, name: "Filed checkout (Abandoned checkouts)", filter: "abandoned_checkout", lastActivity: "Edited on May 12, 2023", author: img1 },
        { id: 6, name: "Customers not subscribed", filter: "not_subscribed", lastActivity: "Edited on Oct 10, 2023", author: img1 },
    ];

    // Filter segments based on search input
    const filteredSegments = segments.filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    // Define conditional columns based on the selected segment
    const getCustomerColumns = () => {
        switch (selectedSegment) {
            case "Customers who have purchased at least once":
            case "Customers who have purchased more than once":
                return [
                    { name: "Name", selector: (row) => `${row.first_name || ""} ${row.last_name || ""}`, sortable: true },
                    { name: "Orders Count", selector: (row) => row.orders_count || "Not Found", sortable: true },
                    { name: "Total Spent", selector: (row) => `$${row.total_spent || "0.00"}`, sortable: true },
                ];
            case "Email subscribers":
                return [
                    { name: "Name", selector: (row) => `${row.first_name || ""} ${row.last_name || ""}`, sortable: true },
                    { name: "Email", selector: (row) => row.email || "Not Found", sortable: true },
                    { name: "Subscribed", selector: (row) => row.email_marketing_consent?.state === "subscribed" ? "Yes" : "No", sortable: true },
                ];
            case "Customers not subscribed":
                return [
                    { name: "Name", selector: (row) => `${row.first_name || ""} ${row.last_name || ""}`, sortable: true },
                    { name: "Email", selector: (row) => row.email || "Not Found", sortable: true },
                    { name: "Subscribed", selector: (row) => row.email_marketing_consent?.state === "not_subscribed" ? "No" : "Yes", sortable: true },
                ];
            case "Customers who haven't purchased":
                return [
                    { name: "Name", selector: (row) => `${row.first_name || ""} ${row.last_name || ""}`, sortable: true },
                    { name: "Orders Count", selector: (row) => row.orders_count || "Not Found", sortable: true },
                    { name: "Total Spent", selector: (row) => `$${row.total_spent || "0.00"}`, sortable: true },
                ];
            case "Filed checkout (Abandoned checkouts)":
                return [
                    { name: "Name", selector: (row) => `${row.first_name || ""} ${row.last_name || ""}`, sortable: true },
                    { name: "Checkout State", selector: (row) => row.state || "No State", sortable: true },
                    { name: "Total Spent", selector: (row) => `$${row.total_spent || "0.00"}`, sortable: true },
                ];
            default:
                return [];
        }
    };

    // Handle row click to fetch data based on selected segment and show modal
    const handleRowClick = async (row) => {
        setSelectedSegment(row.name);
        setLoading(true);
        setShowModal(true);

        try {
            const data = await fetchShopifyCustomers(row.filter);
            setCustomers(data);
        } catch (error) {
            console.error("Error fetching customer data", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="text-center mb-4">
                <h2 className="text-uppercase text-light bg-dark p-2 page-title">Customer Segments</h2>
            </div>
           
            <DataTable
                columns={[
                    {
                        name: "Segment Name :",
                        selector: (row) => row.name,
                        sortable: true,
                        style: { fontWeight: 'bold', fontSize: '16px' },
                    },
                    {
                        name: "Last Activity",
                        selector: (row) => row.lastActivity,
                        sortable: true,
                    },
                    {
                        name: "Author",
                        cell: (row) => (
                            <img
                                src={row.author}
                                alt="Shopify"
                                style={{ width: "65px", height: "20px" }}
                            />
                        ),
                        ignoreRowClick: true,
                        allowOverflow: true,
                        button: true,
                    },
                ]}
                data={filteredSegments}
                pagination
                sortable
                highlightOnHover
                noDataComponent={<div>No segments found</div>}
                onRowClicked={handleRowClick}
                className="text-light bg-dark segment-table"
                customStyles={{
                    rows: {
                        style: {
                            minHeight: '60px',
                        },
                    },
                    headCells: {
                        style: {
                            fontSize: '15px',
                            fontWeight: 'bold',
                            color: 'black',
                        },
                    },
                    cells: {
                        style: {
                            fontSize: '14px',
                            color: 'black',
                        },
                    },
                }}
            />

            {/* Modal to display customer data */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Customer Data for: {selectedSegment}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <DataTable
                            columns={getCustomerColumns()}
                            data={customers}
                            pagination
                            className="text-light bg-dark"
                            customStyles={{
                                rows: {
                                    style: {
                                        minHeight: '60px',
                                    },
                                },
                                headCells: {
                                    style: {
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        color: 'black',
                                    },
                                },
                                cells: {
                                    style: {
                                        fontSize: '14px',
                                        color: 'black',
                                    },
                                },
                            }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomerSegments;
