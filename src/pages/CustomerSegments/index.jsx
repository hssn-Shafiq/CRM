import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Form, Modal, Button, Alert } from "react-bootstrap";
import { fetchShopifyCustomers, prefetchAllSegments, clearCache } from "../../Services/shopifyService";
import img1 from "../../assets/images/shopify.png";
import "./CustomerSegments.css";

const CustomerSegments = () => {
    const [filterText, setFilterText] = useState("");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [prefetching, setPrefetching] = useState(true);
    const [selectedSegment, setSelectedSegment] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [prefetchComplete, setPrefetchComplete] = useState(false);

    // Segment definitions
    const segments = [
        { id: 1, name: "Customers who have purchased at least once", filter: "purchased_once", lastActivity: "Created on Jul 11, 2023", author: img1 },
        { id: 2, name: "Email subscribers", filter: "email_subscribers", lastActivity: "Edited on May 12, 2023", author: img1 },
        { id: 3, name: "Customers who have purchased more than once", filter: "purchased_more_than_once", lastActivity: "Edited on May 12, 2023", author: img1 },
        { id: 4, name: "Customers who haven't purchased", filter: "not_purchased", lastActivity: "Edited on May 12, 2023", author: img1 },
        { id: 5, name: "Filed checkout (Abandoned checkouts)", filter: "orders_count", lastActivity: "Edited on May 12, 2023", author: img1 },
        { id: 6, name: "Customers not subscribed", filter: "not_subscribed", lastActivity: "Edited on Oct 10, 2023", author: img1 },
    ];

    // Prefetch all segment data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                await prefetchAllSegments();
                setPrefetchComplete(true);
            } catch (err) {
                console.error("Error prefetching data:", err);
            } finally {
                setPrefetching(false);
            }
        };

        fetchData();
    }, []);

    // Filter segments based on search input
    const filteredSegments = segments.filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    // Get appropriate columns based on selected segment
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
                    { name: "Email", selector: (row) => row.email || "Not Found", sortable: true },
                ];
            default:
                return [];
        }
    };

    // Handle segment selection
    const handleRowClick = async (row) => {
        setError(null);
        setSelectedSegment(row.name);
        setLoading(true);
        setShowModal(true);

        try {
            // Fetch the data (will use cache if available)
            const data = await fetchShopifyCustomers(row.filter);
            setCustomers(data);
        } catch (error) {
            console.error("Error fetching customer data", error);
            setError("Failed to load customer data. Please try again.");
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle cache clearing
    const handleClearCache = () => {
        clearCache();
        alert("Cache cleared successfully. Next data fetch will be from the API.");
    };

    return (
        <div className="container mt-4">
            <div className="text-center mb-4">
                <h2 className="text-uppercase text-light bg-dark p-2 page-title">Customer Segments</h2>
            </div>

            {prefetching && (
                <Alert variant="info">
                    Prefetching segment data to improve performance... This may take a moment.
                </Alert>
            )}

            {prefetchComplete && (
                <Alert variant="success" className="d-flex justify-content-between align-items-center">
                    <span>All segment data prefetched and cached for faster access!</span>
                    <Button variant="outline-dark" size="sm" onClick={handleClearCache}>
                        Clear Cache
                    </Button>
                </Alert>
            )}

            <Form.Control
                type="text"
                placeholder="Search segments..."
                className="mb-3 text-light bg-dark search-input"
                onChange={(e) => setFilterText(e.target.value)}
            />

            <DataTable
                columns={[
                    {
                        name: "Segment Name",
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
                progressPending={prefetching}
                progressComponent={<div className="p-4">Loading segment data...</div>}
            />

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Customer Data for: {selectedSegment}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="text-center p-4">
                            <p>Loading customer data...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <>
                            {customers.length === 0 ? (
                                <Alert variant="info">No customers found in this segment.</Alert>
                            ) : (
                                <>
                                    <p className="mb-3">Showing {customers.length} customers</p>
                                    <DataTable
                                        columns={getCustomerColumns()}
                                        data={customers}
                                        pagination
                                        paginationPerPage={10}
                                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
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
                                </>
                            )}
                        </>
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