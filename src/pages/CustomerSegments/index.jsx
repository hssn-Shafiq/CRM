import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Form } from "react-bootstrap";
import axios from "axios";
import img1 from "../../assets/images/shopify.png";

const CustomerSegments = () => {
    const [filterText, setFilterText] = useState("");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSegment, setSelectedSegment] = useState("");

    // Function to fetch data from Shopify API
    const fetchShopifyCustomers = async (filterType) => {
        setLoading(true);

        try {
            let url = `${process.env.REACT_APP_API_URL}/customers`;

            // Modify URL for specific customer filters
            if (filterType === "purchased_once") {
                url += "?orders_count_min=1";
            } else if (filterType === "email_subscribers") {
                url += "?email_marketing_consent[state]=subscribed";
            } else if (filterType === "purchased_more_than_once") {
                url += "?orders_count_min=2";
            } else if (filterType === "not_purchased") {
                url += "?orders_count_max=0";
            } else if (filterType === "abandoned_checkout") {
                url += "?state=abandoned";
            }

            // Make the API call with the Bearer token from the .env
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
                },
            });

            setCustomers(response.data.data); // Assuming `data` holds customer data
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };

    // Sample data for the table (segments)
    const segments = [
        {
            id: 1,
            name: "Customers who have purchased at least once",
            filter: "purchased_once",
            lastActivity: "Created on Jul 11, 2023",
            author: img1,
        },
        {
            id: 2,
            name: "Email subscribers",
            filter: "email_subscribers",
            lastActivity: "Edited on May 12, 2023",
            author: img1,
        },
        {
            id: 3,
            name: "Customers who have purchased more than once",
            filter: "purchased_more_than_once",
            lastActivity: "Edited on May 12, 2023",
            author: img1,
        },
        {
            id: 4,
            name: "Customers who haven't purchased",
            filter: "not_purchased",
            lastActivity: "Edited on May 12, 2023",
            author: img1,
        },
        {
            id: 5,
            name: "Filed checkout (Abandoned checkouts)",
            filter: "abandoned_checkout",
            lastActivity: "Edited on May 12, 2023",
            author: img1,
        },
    ];

    // Filter segments based on search input
    const filteredSegments = segments.filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    // Define columns for the customer data table
    const customerColumns = [
        { name: "First Name", selector: (row) => row.first_name || "N/A" },
        { name: "Last Name", selector: (row) => row.last_name || "N/A" },
        { name: "Email", selector: (row) => row.email || "N/A" },
        { name: "Orders Count", selector: (row) => row.orders_count || "N/A" },
        { name: "Total Spent", selector: (row) => `$${row.total_spent || "0.00"}` },
        { name: "Verified Email", selector: (row) => (row.verified_email ? "Yes" : "No") },
        {
            name: "Email Subscribed",
            selector: (row) =>
                row.email_marketing_consent?.state === "subscribed" ? "Yes" : "No",
        },
        {
            name: "Last Order",
            selector: (row) => (row.last_order_name ? row.last_order_name : "No Orders"),
        },
        {
            name: "Address",
            cell: (row) =>
                row.addresses && row.addresses.length > 0
                    ? `${row.addresses[0].address1}, ${row.addresses[0].city}, ${row.addresses[0].country}`
                    : "No Address",
        },
    ];

    // Define columns for the segments table
    const columns = [
        {
            name: <Form.Check type="checkbox" />,
            cell: () => <Form.Check type="checkbox" />,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Last activity",
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
    ];

    // Handle row click to fetch data based on selected segment
    const handleRowClick = (row) => {
        setSelectedSegment(row.filter);
        fetchShopifyCustomers(row.filter);
    };

    return (
        <div className="container mt-4">
            <div className="text-center">
                <h2 className="text-uppercase p-2 page-title">Segments</h2>
            </div>
            <Form.Control
                type="text"
                placeholder="Search segments"
                className="mb-3"
                onChange={(e) => setFilterText(e.target.value)}
            />
            <DataTable
                columns={columns}
                data={filteredSegments}
                pagination
                sortable
                highlightOnHover
                selectableRows
                noDataComponent={<div>No records found</div>}
                onRowClicked={handleRowClick} // Automatically fetch data on row click
            />
            <div className="mt-4">
                <h3>Selected Segment: {selectedSegment}</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <DataTable
                        columns={customerColumns}
                        data={customers}
                        pagination
                    />
                )}
            </div>
        </div>
    );
};

export default CustomerSegments;
