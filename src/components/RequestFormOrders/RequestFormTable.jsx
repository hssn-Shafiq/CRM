import React from 'react';
import { FaEye, FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const RequestFormTable = ({
    orders,
    selectedOrders,
    onSelectOrder,
    onSelectAll,
    onSort,
    sortConfig,
    onView,
    onEdit,
    onDelete
}) => {
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <FaSort className="sort-icon" />;
        }
        return sortConfig.direction === 'asc' ?
            <FaSortUp className="sort-icon active" /> :
            <FaSortDown className="sort-icon active" />;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            return dateString;
        }
    };

    const allSelected = orders.length > 0 && orders.every(order => selectedOrders.includes(order.id));
    const someSelected = orders.some(order => selectedOrders.includes(order.id));

    return (
        <div className="table-container">
            <div className='table-responsive'>
                <table className=" table-dark table table-hover leads-table">
                    <thead>
                        <tr className='border-main text-center'>
                            <th className="checkbox-column">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={input => {
                                        if (input) input.indeterminate = someSelected && !allSelected;
                                    }}
                                    onChange={onSelectAll}
                                />
                            </th>
                            <th onClick={() => onSort('full_name')} className="sortable">
                                Full Name {getSortIcon('full_name')}
                            </th>
                            <th onClick={() => onSort('custom_product')} className="sortable">
                                Custom Product {getSortIcon('custom_product')}
                            </th>
                            <th onClick={() => onSort('required_color')} className="sortable">
                                Required Color {getSortIcon('required_color')}
                            </th>
                            <th onClick={() => onSort('quantity')} className="sortable">
                                Quantity {getSortIcon('quantity')}
                            </th>
                            <th onClick={() => onSort('expected_delivery_date')} className="sortable">
                                Delivery Date {getSortIcon('expected_delivery_date')}
                            </th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className={selectedOrders.includes(order.id) ? 'selected' : ''}>
                                <td className="checkbox-column">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={() => onSelectOrder(order.id)}
                                    />
                                </td>
                                <td className="customer-name">
                                    <div>
                                        <div className="name">{order.full_name || '-'}</div>
                                        <div className="organization">{order.team_organization}</div>
                                    </div>
                                </td>

                                <td>
                                    <span className={`product-badge ${order.custom_product?.toLowerCase().replace(/[^a-z]/g, '_')}`}>
                                        {order.custom_product || '-'}
                                    </span>
                                </td>
                                <td>{order.required_color || '-'}</td>
                                <td className="quantity-cell">
                                    <span className="quantity-badge">
                                        {order.quantity || '0'}
                                    </span>
                                </td>
                                <td>{formatDate(order.expected_delivery_date)}</td>
                                <td className="actions-column">
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => onView(order)}
                                            className="action-btn view-btn"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => onEdit(order)}
                                            className="action-btn edit-btn"
                                            title="Edit Order"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => onDelete(order.id)}
                                            className="action-btn delete-btn"
                                            title="Delete Order"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {orders.length === 0 && (
                <div className="no-data">
                    <p>No request form orders found.</p>
                </div>
            )}
        </div>
    );
};

export default RequestFormTable;