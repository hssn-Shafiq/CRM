import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaDownload, 
  FaEnvelope,
  FaFilter,
  FaSearch,
  FaSort,
  FaFileExport
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { debugFirebaseData } from '../../../utils/debugFirebase';
import { 
  getAllInvoices, 
  deleteInvoice, 
  sendInvoiceByEmail,
  getInvoiceStats,
  resetState
} from '../../../features/invoice/invoiceSlice';
import { 
  formatCurrency, 
  getStatusBadgeClass, 
  searchInvoices,
  filterInvoicesByStatus,
  sortInvoices,
  createEmailTemplateVariables,
  exportInvoiceData,
  getInvoiceStatus,
  getDaysOverdue
} from '../../../utils/invoiceHelpers';
import Loader from '../../../components/Loader';
import './InvoiceList.css';

const InvoiceList = () => {
  const dispatch = useDispatch();
  
  const { 
    invoices, 
    stats, 
    isLoading, 
    isError, 
    isSuccess, 
    message 
  } = useSelector((state) => state.invoice);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });

  useEffect(() => {
    dispatch(getAllInvoices());
    dispatch(getInvoiceStats());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
    }
    dispatch(resetState());
  }, [isError, isSuccess, message, dispatch]);

  // Filter and search invoices
  const filteredInvoices = React.useMemo(() => {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      filtered = searchInvoices(filtered, searchTerm);
    }

    // Status filter
    filtered = filterInvoicesByStatus(filtered, statusFilter);

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.invoice_date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    }

    // Amount range filter
    if (amountRange.min || amountRange.max) {
      filtered = filtered.filter(invoice => {
        const amount = parseFloat(invoice.total_amount || 0);
        const min = parseFloat(amountRange.min || 0);
        const max = parseFloat(amountRange.max || Infinity);
        return amount >= min && amount <= max;
      });
    }

    // Sort
    return sortInvoices(filtered, sortBy, sortOrder);
  }, [invoices, searchTerm, statusFilter, sortBy, sortOrder, dateRange, amountRange]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch(deleteInvoice(invoiceId));
    }
  };

  const handleSendEmail = async (invoice) => {
    const emailData = {
      to: invoice.customer.email,
      subject: `Invoice ${invoice.invoice_number}`,
      template_variables: createEmailTemplateVariables(invoice)
    };
    dispatch(sendInvoiceByEmail({ invoiceId: invoice.id, emailData }));
  };

  const handleBulkAction = (action) => {
    if (selectedInvoices.length === 0) {
      toast.warning('Please select invoices first');
      return;
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedInvoices.length} invoices?`)) {
          selectedInvoices.forEach(id => dispatch(deleteInvoice(id)));
          setSelectedInvoices([]);
        }
        break;
      case 'export':
        handleExportInvoices();
        break;
      default:
        break;
    }
  };

  const handleExportInvoices = () => {
    const selectedData = filteredInvoices.filter(invoice => 
      selectedInvoices.length === 0 || selectedInvoices.includes(invoice.id)
    );
    const exportData = exportInvoiceData(selectedData);
    
    // Convert to CSV
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const toggleInvoiceSelection = (invoiceId) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedInvoices(
      selectedInvoices.length === currentInvoices.length 
        ? [] 
        : currentInvoices.map(invoice => invoice.id)
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container-fluid px-3 pt-4">
      <div className="text-center mb-4">
        <h2 className="text-uppercase page-title">Invoice Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-main border-main text-light">
            <div className="card-body text-center">
              <h5 className="card-title">Total Invoices</h5>
              <h3 className="text-primary">{stats.total || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-main border-main text-light">
            <div className="card-body text-center">
              <h5 className="card-title">Paid</h5>
              <h3 className="text-success">{stats.paid || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-main border-main text-light">
            <div className="card-body text-center">
              <h5 className="card-title">Pending</h5>
              <h3 className="text-warning">{stats.pending || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-main border-main text-light">
            <div className="card-body text-center">
              <h5 className="card-title">Overdue</h5>
              <h3 className="text-danger">{stats.overdue || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card bg-main border-main text-light mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-main border-main">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control bg-main border-main text-light"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select bg-main border-main text-light"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-6 text-end">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filters
              </button>
              <button
                className="btn btn-outline-info me-2"
                onClick={() => handleBulkAction('export')}
              >
                <FaFileExport /> Export
              </button>
              <button
                className="btn btn-warning me-2"
                onClick={() => debugFirebaseData()}
              >
                🔍 Debug DB
              </button>
              <Link to="/admin/invoicing/create" className="btn btn-primary">
                <FaPlus /> Create Invoice
              </Link>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="row mt-3 pt-3 border-top border-secondary">
              <div className="col-md-3">
                <label className="form-label">Date From</label>
                <input
                  type="date"
                  className="form-control bg-main border-main text-light"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Date To</label>
                <input
                  type="date"
                  className="form-control bg-main border-main text-light"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Min Amount</label>
                <input
                  type="number"
                  className="form-control bg-main border-main text-light"
                  placeholder="0.00"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Max Amount</label>
                <input
                  type="number"
                  className="form-control bg-main border-main text-light"
                  placeholder="999999"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setDateRange({ start: '', end: '' });
                    setAmountRange({ min: '', max: '' });
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <span>{selectedInvoices.length} invoice(s) selected</span>
          <div>
            <button
              className="btn btn-outline-danger btn-sm me-2"
              onClick={() => handleBulkAction('delete')}
            >
              <FaTrash /> Delete Selected
            </button>
            <button
              className="btn btn-outline-info btn-sm"
              onClick={() => handleBulkAction('export')}
            >
              <FaFileExport /> Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Invoice Table */}
      <div className="card bg-main border-main">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === currentInvoices.length && currentInvoices.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('invoice_number')}
                  >
                    Invoice # <FaSort />
                  </th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('date')}
                  >
                    Date <FaSort />
                  </th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('customer')}
                  >
                    Customer <FaSort />
                  </th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('amount')}
                  >
                    Amount <FaSort />
                  </th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('dueDate')}
                  >
                    Due Date <FaSort />
                  </th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('status')}
                  >
                    Status <FaSort />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice) => {
                    const status = getInvoiceStatus(invoice);
                    const badgeClass = getStatusBadgeClass(status);
                    
                    return (
                      <tr key={invoice.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => toggleInvoiceSelection(invoice.id)}
                          />
                        </td>
                        <td>
                          <Link 
                            to={`/admin/invoicing/detail/${invoice.id}`}
                            className="text-decoration-none"
                          >
                            {invoice.invoice_number}
                          </Link>
                        </td>
                        <td>{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                        <td>{invoice.customer?.name || 'N/A'}</td>
                        <td>{formatCurrency(invoice.total_amount, invoice.currency)}</td>
                        <td>
                          {new Date(invoice.due_date).toLocaleDateString()}
                          {status === 'overdue' && (
                            <small className="text-danger d-block">
                              {getDaysOverdue(invoice.due_date)} days overdue
                            </small>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${badgeClass}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/admin/invoicing/detail/${invoice.id}`}
                              className="btn btn-outline-info"
                              title="View"
                            >
                              <FaEye />
                            </Link>
                            <Link
                              to={`/admin/invoicing/edit/${invoice.id}`}
                              className="btn btn-outline-warning"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleSendEmail(invoice)}
                              title="Send Email"
                              disabled={!invoice.customer?.email}
                            >
                              <FaEnvelope />
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              title="Download PDF"
                            >
                              <FaDownload />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      {searchTerm || statusFilter !== 'all' ? 'No invoices match your criteria' : 'No invoices found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link bg-main border-main text-light"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button
                          className="page-link bg-main border-main text-light"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <li key={page} className="page-item disabled">
                        <span className="page-link bg-main border-main text-light">...</span>
                      </li>
                    );
                  }
                  return null;
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link bg-main border-main text-light"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
