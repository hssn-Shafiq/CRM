/* eslint-disable no-undef */
// src/Components/CustomerData.jsx
import React, { useState, useEffect, useMemo } from "react";
import RequestFromLeads from "../Leads/RequestFromLeads";
import OrderPaddingLeads from "../Leads/OrderPaddingLeads";
import OrderDeliverLeads from "../Leads/OrderDeliverLeads";
import SendEmailLeads from "../Leads/SendEmailLeads";
import { fetchCustomers } from "../../Services/shopifyService";
import { fetchCustomLeads, deleteCustomLead } from "../../Services/firebaseService";
import { exportToExcel } from "../../utils/excelExport";
import Loader from "../Loader";
import CustomerTable from "./CustomerTable";
import EditCustomerModal from "./EditCustomerModal";
import ViewCustomerModal from "./ViewCustomerModal";
import FilterHeader from "./FilterHeader";
import AddCustomLeadModal from "./CustomData/AddCustomLeadModal";
import ExcelImportModal from "./CustomData/ExcelImportModal";
import BulkDeleteModal from "./BulkDeleteModal";
import ExportModal from "./ExportModal";
import "./CustomerStyles.css";

const CustomerData = () => {
  // Shopify leads state
  const [allCustomers, setAllCustomers] = useState([]);
  // Custom leads state
  const [customLeads, setCustomLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLead, setSelectedLead] = useState("All Leads");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    country: '',
    leadType: '',
    hasEmail: false,
    hasPhone: false,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const customersPerPage = 10;

  // New state for tabs
  const [activeTab, setActiveTab] = useState('shopify'); // 'shopify' or 'custom'
  const [importingExcel, setImportingExcel] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Shopify customers
  useEffect(() => {
    const getCustomers = async () => {
      setLoading(true);
      try {
        const customerData = await fetchCustomers();
        setAllCustomers(Array.isArray(customerData) ? customerData.map(c => ({...c, source: 'shopify'})) : []);
      } catch (err) {
        console.error("Error fetching Shopify customers:", err);
        setError(err.message || "Failed to fetch Shopify customers");
      } finally {
        setLoading(false);
      }
    };
    getCustomers();
  }, []);

  // Fetch custom leads
  useEffect(() => {
    const getCustomLeads = async () => {
      if (activeTab === 'custom') {
        setLoading(true);
        try {
          const leadsData = await fetchCustomLeads();
          setCustomLeads(Array.isArray(leadsData) ? leadsData : []);
        } catch (err) {
          console.error("Error fetching custom leads:", err);
          setError(err.message || "Failed to fetch custom leads");
        } finally {
          setLoading(false);
        }
      }
    };
    getCustomLeads();
  }, [activeTab]);

  // Function to handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Function to handle filter changes
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Function to handle new leads added
  const handleLeadAdded = (newLead) => {
    setCustomLeads(prev => [newLead, ...prev]);
  };

  // Function to handle Excel import completion
  const handleImportComplete = (importedLeads) => {
    setCustomLeads(prev => [...importedLeads, ...prev]);
  };

  // Apply filters and search to the appropriate data source based on active tab
  const filteredCustomers = useMemo(() => {
    // Determine which data source to use based on active tab
    const dataSource = activeTab === 'shopify' ? allCustomers : customLeads;

    // Start with all customers from the selected source
    let result = [...dataSource];

    // Apply lead type filter from the main dropdown
    if (selectedLead !== "All Leads") {
      result = result.filter(customer => customer.leadType === selectedLead);
    }

    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(customer => {
        // Get the address data for this customer
        const address = customer.default_address || {};

        // Fields to search in
        const firstName = (address.first_name || customer.first_name || '').toLowerCase();
        const lastName = (address.last_name || customer.last_name || '').toLowerCase();
        const email = (customer.email || '').toLowerCase();
        const phone = (address.phone || customer.phone || '').toLowerCase();
        const company = (address.company || customer.company || '').toLowerCase();

        // Combined name for searching
        const fullName = `${firstName} ${lastName}`;

        // Check if the search term appears in any of the fields
        return (
          fullName.includes(lowerSearchTerm) ||
          email.includes(lowerSearchTerm) ||
          phone.includes(lowerSearchTerm) ||
          company.includes(lowerSearchTerm)
        );
      });
    }

    // Apply additional filters from the filter panel
    if (activeFilters.country) {
      result = result.filter(customer => {
        const address = customer.default_address || {};
        const country = (address.country || customer.country || '');
        return country === activeFilters.country;
      });
    }

    if (activeFilters.leadType) {
      result = result.filter(customer => customer.leadType === activeFilters.leadType);
    }

    if (activeFilters.hasEmail) {
      result = result.filter(customer => customer.email && customer.email.trim() !== '');
    }

    if (activeFilters.hasPhone) {
      result = result.filter(customer => {
        const address = customer.default_address || {};
        const phone = address.phone || customer.phone;
        return phone && phone.trim() !== '';
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      const addressA = a.default_address || {};
      const addressB = b.default_address || {};

      let valueA, valueB;

      if (activeFilters.sortBy === 'name') {
        valueA = `${addressA.first_name || a.first_name || ''} ${addressA.last_name || a.last_name || ''}`.toLowerCase();
        valueB = `${addressB.first_name || b.first_name || ''} ${addressB.last_name || b.last_name || ''}`.toLowerCase();
      } else if (activeFilters.sortBy === 'country') {
        valueA = (addressA.country || a.country || '').toLowerCase();
        valueB = (addressB.country || b.country || '').toLowerCase();
      } else if (activeFilters.sortBy === 'email') {
        valueA = (a.email || '').toLowerCase();
        valueB = (b.email || '').toLowerCase();
      }

      if (activeFilters.sortOrder === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    return result;
  }, [allCustomers, customLeads, selectedLead, searchTerm, activeFilters, activeTab]);

  // Calculate pagination
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / customersPerPage);

  // Get current page data
  const currentCustomers = useMemo(() => {
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    return filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  }, [filteredCustomers, currentPage, customersPerPage]);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Function to handle delete
  const handleDelete = async (id, source) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        if (source === 'custom') {
          // Delete from Firebase for custom leads
          await deleteCustomLead(id);
          setCustomLeads(prev => prev.filter(lead => lead.id !== id));
        } else {
          // Handle Shopify customers as before
          const updatedCustomers = allCustomers.filter((customer) => customer.id !== id);
          setAllCustomers(updatedCustomers);
        }

        const newTotalPages = Math.ceil((filteredCustomers.length - 1) / customersPerPage);
        if (currentPage > newTotalPages && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Error deleting customer:", err);
        setError(err.message || "Failed to delete customer");
      }
    }
  };

  // Function to handle view customer details
  const handleView = (customer) => {
    // Get complete customer data
    const fullCustomer = customer.source === 'custom' 
      ? customLeads.find(c => c.id === customer.id)
      : allCustomers.find(c => c.id === customer.id);
      
    setSelectedCustomer(fullCustomer);
    
    // Open the modal
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('viewCustomerModal'));
      modal.show();
    }
  };

  // Function to handle edit
  const handleEdit = (customer) => {
    // Get complete customer data
    const fullCustomer = customer.source === 'custom' 
      ? customLeads.find(c => c.id === customer.id)
      : allCustomers.find(c => c.id === customer.id);
    
    // Create an enriched customer object with data from default_address
    const address = fullCustomer?.default_address || {};
    const enrichedCustomer = {
      id: fullCustomer.id,
      first_name: address.first_name || fullCustomer.first_name || '',
      last_name: address.last_name || fullCustomer.last_name || '',
      email: fullCustomer.email || '',
      phone: address.phone || fullCustomer.phone || '',
      company: address.company || fullCustomer.company || '',
      address1: address.address1 || fullCustomer.address1 || '',
      address2: address.address2 || fullCustomer.address2 || '',
      city: address.city || fullCustomer.city || '',
      country: address.country || fullCustomer.country || '',
      country_code: address.country_code || fullCustomer.country_code || '',
      province: address.province || fullCustomer.province || '',
      province_code: address.province_code || fullCustomer.province_code || '',
      zip: address.zip || fullCustomer.zip || '',
      original: fullCustomer, // Store the original for reference
      source: customer.source // Keep track of the source
    };
    
    setEditCustomer(enrichedCustomer);
    setIsEditing(true);
    
    // Open the modal
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
      modal.show();
    }
  };

  // Function to add a new customer
  const handleAdd = () => {
    // Different handling based on the active tab
    if (activeTab === 'custom') {
      // For custom leads, open the custom lead modal
      if (typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(document.getElementById('addCustomLeadModal'));
        modal.show();
      }
    } else {
      // For Shopify, use the existing edit modal but in "add" mode
      setEditCustomer({
        id: null,
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        country: '',
        country_code: '',
        province: '',
        province_code: '',
        zip: '',
        source: 'shopify'
      });
      setIsEditing(false);
      
      // Open the modal
      if (typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
        modal.show();
      }
    }
  };

  // Open Excel import modal
  const handleOpenExcelImport = () => {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('excelImportModal'));
      modal.show();
    }
  };

  // Open bulk delete modal
  const handleOpenBulkDeleteModal = () => {
    if (selectedCustomers.length === 0) return;
    
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('bulkDeleteModal'));
      modal.show();
    }
  };

  // Function to handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) return;
    
    setIsDeleting(true);
    try {
      // Create an array of promises to delete each selected customer
      const deletePromises = selectedCustomers.map(customer => 
        deleteCustomLead(customer.id)
      );
      
      // Execute all delete operations
      await Promise.all(deletePromises);
      
      // Update the customLeads state by filtering out deleted leads
      setCustomLeads(prev => 
        prev.filter(lead => !selectedCustomers.some(selected => selected.id === lead.id))
      );
      
      // Clear selection
      setSelectedCustomers([]);
      
      // Close the modal
      if (typeof bootstrap !== 'undefined') {
        const modalElement = document.getElementById('bulkDeleteModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
      
      // Show success message (optional)
      // You could add a toast notification here
    } catch (err) {
      console.error("Error during bulk delete:", err);
      setError(err.message || "Failed to delete leads");
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to handle save (for both Shopify and custom leads)
  const handleSave = async (updatedCustomer) => {
    try {
      if (updatedCustomer.source === 'custom') {
        // Handle save for custom leads - we'll use the Firebase service
        if (isEditing) {
          // Update existing lead
          const originalCustomer = updatedCustomer.original || customLeads.find(c => c.id === updatedCustomer.id);
          
          const customerToSave = {
            ...originalCustomer,
            email: updatedCustomer.email,
            first_name: updatedCustomer.first_name,
            last_name: updatedCustomer.last_name,
            default_address: {
              ...(originalCustomer?.default_address || {}),
              first_name: updatedCustomer.first_name,
              last_name: updatedCustomer.last_name,
              company: updatedCustomer.company,
              address1: updatedCustomer.address1,
              address2: updatedCustomer.address2,
              city: updatedCustomer.city,
              country: updatedCustomer.country,
              province: updatedCustomer.province,
              zip: updatedCustomer.zip,
              phone: updatedCustomer.phone
            }
          };
          
          // Update in Firebase would go here
          // For now, just update the state
          setCustomLeads(prev => 
            prev.map(lead => lead.id === updatedCustomer.id ? customerToSave : lead)
          );
        }
      } else {
        // Handle save for Shopify customers (same as before)
        if (isEditing) {
          const originalCustomer = updatedCustomer.original || allCustomers.find(c => c.id === updatedCustomer.id);
          
          const customerToSave = {
            ...originalCustomer,
            email: updatedCustomer.email,
            first_name: updatedCustomer.first_name,
            last_name: updatedCustomer.last_name,
            default_address: {
              ...(originalCustomer?.default_address || {}),
              first_name: updatedCustomer.first_name,
              last_name: updatedCustomer.last_name,
              company: updatedCustomer.company,
              address1: updatedCustomer.address1,
              address2: updatedCustomer.address2,
              city: updatedCustomer.city,
              country: updatedCustomer.country,
              country_code: updatedCustomer.country_code,
              province: updatedCustomer.province,
              province_code: updatedCustomer.province_code,
              zip: updatedCustomer.zip,
              phone: updatedCustomer.phone
            }
          };
          
          const updatedCustomers = allCustomers.map(c => 
            c.id === updatedCustomer.id ? customerToSave : c
          );
          setAllCustomers(updatedCustomers);
        } else {
          // Add new customer with proper structure including default_address
          const newCustomerId = Date.now();
          const newCustomer = { 
            id: newCustomerId,
            email: updatedCustomer.email,
            first_name: updatedCustomer.first_name,
            last_name: updatedCustomer.last_name,
            leadType: selectedLead !== "All Leads" ? selectedLead : "Request From Leads",
            source: 'shopify',
            default_address: {
              id: newCustomerId + 1,
              customer_id: newCustomerId,
              first_name: updatedCustomer.first_name,
              last_name: updatedCustomer.last_name,
              company: updatedCustomer.company,
              address1: updatedCustomer.address1,
              address2: updatedCustomer.address2,
              city: updatedCustomer.city,
              country: updatedCustomer.country,
              country_code: updatedCustomer.country_code,
              province: updatedCustomer.province,
              province_code: updatedCustomer.province_code,
              zip: updatedCustomer.zip,
              phone: updatedCustomer.phone,
              default: true
            }
          };
          setAllCustomers([...allCustomers, newCustomer]);
        }
      }
    } catch (err) {
      console.error("Error saving customer:", err);
      setError(err.message || "Failed to save customer");
    }
  };

  // Function to handle export
  const handleExport = () => {
    // Decide which data to export based on active tab and filters
    const dataToExport = activeTab === 'shopify' ? 
      filteredCustomers.filter(c => c.source === 'shopify') : 
      filteredCustomers.filter(c => c.source !== 'shopify');
    
    // Generate appropriate filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const tabName = activeTab === 'shopify' ? 'Shopify' : 'Custom';
    const leadFilter = selectedLead !== 'All Leads' ? `-${selectedLead.replace(/\s+/g, '-')}` : '';
    const filename = `${tabName}-Leads${leadFilter}-${timestamp}`;
    
    // Export the data
    exportToExcel(dataToExport, filename);
  };

  const handleAdvancedExport = () => {
    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('exportModal'));
      modal.show();
    }
  };

  // Function to render the selected component
  const renderLeadComponent = () => {
    switch (selectedLead) {
      case "Request From Leads":
        return <RequestFromLeads leads={currentCustomers} />;
      case "Order Padding Leads":
        return <OrderPaddingLeads leads={currentCustomers} />;
      case "Order Deliver Leads":
        return <OrderDeliverLeads leads={currentCustomers} />;
      case "Send Email Leads":
        return <SendEmailLeads leads={currentCustomers} />;
      case "All Leads":
        return (
          <CustomerTable 
            customers={currentCustomers} 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            enableBulkActions={activeTab === 'custom'} // Only enable bulk actions for custom tab
            onBulkSelectChange={setSelectedCustomers}
            selectedCustomers={selectedCustomers}
          />
        );
      default:
        return <div>Please select a lead type from the dropdown.</div>;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <div className="container-fluid lead-table-container mt-5">
        {/* Tabs for Shopify vs Custom Leads */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'shopify' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('shopify');
                setSelectedCustomers([]);  // Clear selection when switching tabs
              }}
            >
              Shopify Leads
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('custom');
                setSelectedCustomers([]);  // Clear selection when switching tabs
              }}
            >
              Custom Leads
            </button>
          </li>
          
          {/* Action buttons on the right */}
          <li className="ms-auto d-flex align-items-center mb-2">
            {/* Export button - always visible */}
            <div className="dropdown me-2">
              <button 
                className="btn btn-success dropdown-toggle" 
                type="button" 
                id="exportDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                disabled={filteredCustomers.length === 0}
              >
                <i className="fa fa-download me-1"></i> Export
              </button>
              <ul className="dropdown-menu" aria-labelledby="exportDropdown">
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={handleExport}
                  >
                    Quick Export
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={handleAdvancedExport}
                  >
                    Advanced Export...
                  </button>
                </li>
              </ul>
            </div>
            
            {activeTab === 'custom' && (
              <>
                <button 
                  className="btn bg-dark text-light me-2" 
                  onClick={handleOpenExcelImport}
                >
                  <i className="fa fa-file-excel me-1"></i> Import Excel
                </button>
                
                {/* Bulk actions - only show when items are selected */}
                {selectedCustomers.length > 0 && (
                  <button 
                    className="btn btn-danger me-2" 
                    onClick={handleOpenBulkDeleteModal}
                  >
                    <i className="fa fa-trash me-1"></i> Delete Selected ({selectedCustomers.length})
                  </button>
                )}
              </>
            )}
            <button 
              className="btn btn-primary" 
              onClick={handleAdd}
            >
              <i className="fa-solid fa-plus-circle me-1"></i> Add New Lead
            </button>
          </li>
        </ul>

        {/* Header with filters */}
        <FilterHeader 
          selectedLead={selectedLead}
          onLeadChange={setSelectedLead}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {/* Render the selected lead component */}
        <div className="lead-content">
          {selectedLead === "All Leads" ? (
            <CustomerTable 
              customers={currentCustomers} 
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              enableBulkActions={activeTab === 'custom'} // Only enable bulk actions for custom tab
              onBulkSelectChange={setSelectedCustomers}
              selectedCustomers={selectedCustomers}
            />
          ) : (
            renderLeadComponent()
          )}
        </div>

        {/* Pagination - only show if we have more than 1 page */}
        {totalPages > 1 && (
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              
              {(() => {
                let pages = [];
                
                // Always show first page
                if (totalPages > 0) {
                  pages.push(
                    <li key={1} className={`page-item ${currentPage === 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                    </li>
                  );
                }
                
                // Add ellipsis if needed
                if (currentPage > 3) {
                  pages.push(
                    <li key="ellipsis1" className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                
                // Add pages around current page
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                  if (i <= totalPages - 1 && i >= 2) {
                    pages.push(
                      <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
                      </li>
                    );
                  }
                }
                
                // Add ellipsis if needed
                if (currentPage < totalPages - 2) {
                  pages.push(
                    <li key="ellipsis2" className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  );
                }
                
                // Always show last page
                if (totalPages > 1) {
                  pages.push(
                    <li key={totalPages} className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                    </li>
                  );
                }
                
                return pages;
              })()}
              
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Modals */}
      <EditCustomerModal
        customer={editCustomer}
        isEditing={isEditing}
        onSave={handleSave}
      />
      
      <ViewCustomerModal
        customer={selectedCustomer}
      />
      
      <AddCustomLeadModal
        onLeadAdded={handleLeadAdded}
      />
      
      <ExcelImportModal
        onImportComplete={handleImportComplete}
      />
      
      {/* Add the new BulkDeleteModal */}
      <BulkDeleteModal
        selectedCount={selectedCustomers.length}
        onConfirm={handleBulkDelete}
        isDeleting={isDeleting}
      />

      <ExportModal 
        data={filteredCustomers} 
        activeTab={activeTab} 
      />
    </>
  );
};

export default CustomerData;