import React, { useState, useEffect } from 'react';
import { fetchRequestOrders, postRequestOrders } from '../../Services/shopifyService';
import RequestFormTable from './RequestFormTable';
import RequestFormSearchBar from './RequestFormSearchBar';
import RequestFormFilters from './RequestFormFilters';
import RequestFormExportModal from './RequestFormExportModal';
import BulkDeleteModal from './BulkDeleteModal';
import ViewRequestFormModal from './ViewRequestFormModal';
import EditRequestFormModal from './EditRequestFormModal';
import ImportModal from './ImportModal';
import './requestorder.css';

const RequestFormOrders = () => {
  const [requestOrders, setRequestOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  
  // Modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Import states
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadRequestOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [requestOrders, searchTerm, filterType, sortConfig]);

  // Add effect to handle modal backdrop
  useEffect(() => {
    if (showViewModal || showEditModal || showBulkDeleteModal || showImportModal || showExportModal) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'unset';
    };
  }, [showViewModal, showEditModal, showBulkDeleteModal, showImportModal, showExportModal]);

  const loadRequestOrders = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Fetch all data with pagination handled in the service
      const data = await fetchRequestOrders();
      setRequestOrders(data);
      
      // Reset selections when data refreshes
      setSelectedOrders([]);
      
    } catch (err) {
      setError('Failed to load request form orders');
      console.error('Error loading request orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh function for manual refresh
  const handleRefresh = async () => {
    await loadRequestOrders(true);
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...requestOrders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.custom_product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.team_organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.required_color?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterType !== 'all') {
      filtered = filtered.filter(order => {
        switch (filterType) {
          case 'uniform':
            return order.custom_product?.toLowerCase() === 'uniform';
          case 'apparel_accessories':
            return order.custom_product?.toLowerCase() === 'appreal/accessories';
          case 'recent':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return new Date(order.created_at) >= oneWeekAgo;
          case 'high_quantity':
            return parseInt(order.quantity) >= 20;
          case 'pending_delivery':
            const today = new Date();
            const deliveryDate = new Date(order.expected_delivery_date);
            return deliveryDate > today;
          case 'urgent':
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            const urgentDeliveryDate = new Date(order.expected_delivery_date);
            return urgentDeliveryDate <= sevenDaysFromNow && urgentDeliveryDate > new Date();
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'quantity') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sortConfig.key === 'created_at' || sortConfig.key === 'expected_delivery_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    const currentPageOrders = getCurrentPageOrders();
    const allSelected = currentPageOrders.every(order => selectedOrders.includes(order.id));
    
    if (allSelected) {
      setSelectedOrders(prev => prev.filter(id => !currentPageOrders.map(o => o.id).includes(id)));
    } else {
      setSelectedOrders(prev => [...new Set([...prev, ...currentPageOrders.map(o => o.id)])]);
    }
  };

  const getCurrentPageOrders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleDelete = async (orderId) => {
    // Implement delete functionality
    console.log('Delete order:', orderId);
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteModal(true);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleImport = async (importData, batchNumber, totalBatches) => {
    try {
      // Process each item in the batch individually
      const results = [];
      
      for (let i = 0; i < importData.length; i++) {
        const orderData = importData[i];
        
        try {
          console.log(`Processing item ${i + 1} of batch ${batchNumber}:`, orderData);
          
          // Validate required fields before sending
          if (!orderData.first_name || !orderData.last_name || !orderData.email) {
            throw new Error(`Missing required fields: first_name, last_name, or email`);
          }

          // Ensure delivery date is in the future
          const deliveryDate = new Date(orderData.expected_delivery_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (deliveryDate <= today) {
            // Automatically adjust the date
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);
            orderData.expected_delivery_date = futureDate.toISOString().split('T')[0];
            console.log(`Adjusted delivery date for item ${i + 1} to: ${orderData.expected_delivery_date}`);
          }
          
          // Call your API to post the individual order data
          const result = await postRequestOrders(orderData);
          results.push({ success: true, data: result });
          
        } catch (error) {
          console.error(`Failed to import item ${i + 1} in batch ${batchNumber}:`, error);
          
          // Check if it's a date validation error and provide helpful message
          let errorMessage = error.message;
          if (error.message.includes('expected_delivery_date') && error.message.includes('after today')) {
            errorMessage = `Date validation error: Expected delivery date must be in the future. Original date: ${orderData.expected_delivery_date}`;
          }
          
          results.push({ 
            success: false, 
            error: errorMessage,
            data: orderData 
          });
        }
      }

      // Check if this is the last batch and refresh data
      if (batchNumber === totalBatches) {
        await handleRefresh(); // Use handleRefresh instead of loadRequestOrders
      }

      // Check if any items failed
      const failedItems = results.filter(r => !r.success);
      if (failedItems.length === importData.length) {
        // All items failed
        throw new Error(`All items failed in batch ${batchNumber}. First error: ${failedItems[0]?.error}`);
      } else if (failedItems.length > 0) {
        // Some items failed but not all
        console.warn(`${failedItems.length} out of ${importData.length} items failed in batch ${batchNumber}`);
      }

      return { success: true, batch: batchNumber, results };
      
    } catch (error) {
      console.error(`Batch ${batchNumber} import failed:`, error);
      throw error;
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
            disabled={refreshing}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show limited pages with ellipsis
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust start page if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // First page
      if (startPage > 1) {
        pageNumbers.push(
          <button
            key={1}
            onClick={() => setCurrentPage(1)}
            className="pagination-btn"
            disabled={refreshing}
          >
            1
          </button>
        );
        
        if (startPage > 2) {
          pageNumbers.push(
            <span key="ellipsis1" className="pagination-ellipsis">
              ...
            </span>
          );
        }
      }
      
      // Middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
            disabled={refreshing}
          >
            {i}
          </button>
        );
      }
      
      // Last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push(
            <span key="ellipsis2" className="pagination-ellipsis">
              ...
            </span>
          );
        }
        
        pageNumbers.push(
          <button
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="pagination-btn"
            disabled={refreshing}
          >
            {totalPages}
          </button>
        );
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading request form orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button 
          onClick={handleRefresh} 
          className="btn btn-primary"
          disabled={refreshing}
        >
          <i className={`fas ${refreshing ? 'fa-spinner fa-spin' : 'fa-redo'} me-1`}></i>
          {refreshing ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="customers-container">
        <div className="customers-header">
          <div className="header-title">
            <h1>RequestForm Orders Customers</h1>
            <div className="data-info">
              <span className="total-count">
                <i className="fas fa-database me-1"></i>
                Total: {requestOrders.length} orders
              </span>
              {requestOrders.length > 0 && (
                <span className="last-updated text-muted">
                  <i className="fas fa-clock me-1"></i>
                  Last updated: {new Date().toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="header-actions">
            <button 
              onClick={handleRefresh} 
              className="refresh-btn"
              disabled={refreshing}
              title="Refresh data from server"
            >
              <i className={`fas ${refreshing ? 'fa-spinner fa-spin' : 'fa-sync-alt'} me-1`}></i>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button 
              onClick={() => setShowImportModal(true)} 
              className="import-btn"
              disabled={importing || refreshing}
            >
              <i className="fas fa-file-import me-1"></i>
              {importing ? 'Importing...' : 'Import Data'}
            </button>
            <button 
              onClick={handleExport} 
              className="export-btn"
              disabled={refreshing}
            >
              <i className="fas fa-download me-1"></i>
              Export Data
            </button>
            {selectedOrders.length > 0 && (
              <button 
                onClick={handleBulkDelete} 
                className="bulk-delete-btn"
                disabled={refreshing}
              >
                <i className="fas fa-trash me-1"></i>
                Delete Selected ({selectedOrders.length})
              </button>
            )}
          </div>
        </div>

        {/* Refresh indicator */}
        {refreshing && (
          <div className="refresh-indicator">
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Refreshing data from server...
            </div>
          </div>
        )}

        {/* Search and Filter Row */}
        <div className="search-filter-row">
          <RequestFormSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search by name, email, product, organization, phone, state, or color..."
          />
          <RequestFormFilters
            filterType={filterType}
            setFilterType={setFilterType}
            filteredCount={filteredOrders.length}
            totalCount={requestOrders.length}
          />
        </div>

        <RequestFormTable
          orders={getCurrentPageOrders()}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
          onSort={handleSort}
          sortConfig={sortConfig}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          refreshing={refreshing}
        />

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="items-per-page-select"
              disabled={refreshing}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
            <span className="entries-count">
              {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
            </span>
          </div>
          
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || refreshing}
              className="pagination-btn pagination-prev"
              title="Previous page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {renderPageNumbers()}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || refreshing}
              className="pagination-btn pagination-next"
              title="Next page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showExportModal && (
        <RequestFormExportModal
          data={filteredOrders}
          onClose={() => setShowExportModal(false)}
          filename="request-form-orders"
        />
      )}

      {showBulkDeleteModal && (
        <BulkDeleteModal
          selectedCount={selectedOrders.length}
          onConfirm={() => {
            // Implement bulk delete
            console.log('Bulk delete:', selectedOrders);
            setShowBulkDeleteModal(false);
            setSelectedOrders([]);
          }}
          onCancel={() => setShowBulkDeleteModal(false)}
        />
      )}

      {showViewModal && selectedOrder && (
        <ViewRequestFormModal
          order={selectedOrder}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showEditModal && selectedOrder && (
        <EditRequestFormModal
          order={selectedOrder}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            handleRefresh(); // Use handleRefresh instead of loadRequestOrders
            setShowEditModal(false);
          }}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}
    </>
  );
};

export default RequestFormOrders;