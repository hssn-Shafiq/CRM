import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaCalculator,
  FaUser,
  FaBuilding
} from 'react-icons/fa';
import {
  createInvoice,
  updateInvoice,
  getInvoiceById,
  resetState
} from '../../../features/invoice/invoiceSlice';
import { fetchCustomers } from '../../../Services/shopifyService';
import { formatCurrency, generateInvoiceNumber, calculateInvoiceTotals, calculateDueDate, validateInvoiceData } from '../../../utils/invoiceHelpers';
import Loader from '../../../components/Loader';
import './InvoiceForm.css';

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const {
    currentInvoice,
    isLoading,
    isError,
    isSuccess,
    message
  } = useSelector((state) => state.invoice);

  // Form state
  const [formData, setFormData] = useState({
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: calculateDueDate(30),
    customer: {
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    company: {
      name: 'Your Company',
      address: '',
      phone: '',
      email: '',
      website: ''
    },
    line_items: [
      {
        id: Date.now(),
        name: '',
        description: '',
        quantity: 1,
        price: '0.00',
        total: '0.00'
      }
    ],
    subtotal: '0.00',
    tax_rate: 0,
    tax_amount: '0.00',
    discount_amount: '0.00',
    total_amount: '0.00',
    currency: 'USD',
    notes: '',
    terms: 'Payment is due within 30 days of invoice date.',
    status: 'draft'
  });

  const [customers, setCustomers] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Generate invoice number for new invoices
    if (!isEditMode) {
      setFormData(prev => ({
        ...prev,
        invoice_number: generateInvoiceNumber()
      }));
    }

    // Load customers
    loadCustomers();

    // Load invoice for editing
    if (isEditMode) {
      dispatch(getInvoiceById(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    // Populate form with invoice data for editing
    if (isEditMode && currentInvoice) {
      setFormData({
        ...currentInvoice,
        invoice_date: currentInvoice.invoice_date?.split('T')[0] || '',
        due_date: currentInvoice.due_date?.split('T')[0] || ''
      });
    }
  }, [currentInvoice, isEditMode]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
      if (!isEditMode) {
        navigate('/admin/invoicing/list');
      }
    }
    dispatch(resetState());
  }, [isError, isSuccess, message, dispatch, navigate, isEditMode]);

  const loadCustomers = async () => {
    try {
      const customerData = await fetchCustomers();
      setCustomers(customerData || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedItems = [...formData.line_items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Calculate total for this line item
    if (field === 'quantity' || field === 'price') {
      const quantity = parseInt(updatedItems[index].quantity || 0);
      const price = parseFloat(updatedItems[index].price || 0);
      updatedItems[index].total = (quantity * price).toFixed(2);
    }

    setFormData(prev => ({
      ...prev,
      line_items: updatedItems
    }));

    // Recalculate totals
    calculateTotals(updatedItems);
  };

  const addLineItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      description: '',
      quantity: 1,
      price: '0.00',
      total: '0.00'
    };

    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, newItem]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.line_items.length > 1) {
      const updatedItems = formData.line_items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        line_items: updatedItems
      }));
      calculateTotals(updatedItems);
    }
  };

  const calculateTotals = (lineItems = formData.line_items) => {
    const totals = calculateInvoiceTotals(
      lineItems,
      formData.tax_rate,
      formData.discount_amount
    );

    setFormData(prev => ({
      ...prev,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total_amount: totals.total
    }));
  };

  const selectCustomer = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        id: customer.id,
        name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
        email: customer.email || '',
        phone: customer.phone || customer.default_address?.phone || '',
        address: customer.default_address?.address1 || '',
        city: customer.default_address?.city || '',
        state: customer.default_address?.province || '',
        zip: customer.default_address?.zip || '',
        country: customer.default_address?.country || ''
      }
    }));
    setShowCustomerModal(false);
    setSearchCustomer('');
  };

  const validateForm = () => {
    const validation = validateInvoiceData(formData);
    setValidationErrors(
      validation.errors.reduce((acc, error) => {
        const field = error.toLowerCase().includes('email') ? 'customer.email' :
                     error.toLowerCase().includes('line item') ? 'line_items' :
                     error.toLowerCase().includes('invoice number') ? 'invoice_number' :
                     error.toLowerCase().includes('invoice date') ? 'invoice_date' : 'general';
        acc[field] = error;
        return acc;
      }, {})
    );
    return validation.isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    const invoiceData = {
      ...formData,
      line_items: formData.line_items.filter(item => item.name.trim() !== '')
    };

    if (isEditMode) {
      dispatch(updateInvoice({ id, invoiceData }));
    } else {
      dispatch(createInvoice(invoiceData));
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const name = `${customer.first_name || ''} ${customer.last_name || ''}`.toLowerCase();
    const email = customer.email?.toLowerCase() || '';
    const searchTerm = searchCustomer.toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container-fluid px-3 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            className="btn btn-outline-secondary me-3"
            onClick={() => navigate('/admin/invoicing/list')}
          >
            <FaArrowLeft /> Back to Invoices
          </button>
          <h2 className="text-uppercase page-title d-inline">
            {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
        </div>
        <div>
          <button
            type="submit"
            form="invoice-form"
            className="btn btn-primary"
            disabled={isLoading}
          >
            <FaSave /> {isEditMode ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </div>

      <form id="invoice-form" onSubmit={handleSubmit}>
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Invoice Details */}
            <div className="card bg-main border-main text-light mb-4">
              <div className="card-header">
                <h5 className="mb-0">Invoice Details</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Invoice Number *</label>
                    <input
                      type="text"
                      className={`form-control bg-main border-main text-light ${validationErrors['invoice_number'] ? 'is-invalid' : ''}`}
                      name="invoice_number"
                      value={formData.invoice_number}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors['invoice_number'] && (
                      <div className="invalid-feedback">{validationErrors['invoice_number']}</div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Invoice Date *</label>
                    <input
                      type="date"
                      className={`form-control bg-main border-main text-light ${validationErrors['invoice_date'] ? 'is-invalid' : ''}`}
                      name="invoice_date"
                      value={formData.invoice_date}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors['invoice_date'] && (
                      <div className="invalid-feedback">{validationErrors['invoice_date']}</div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control bg-main border-main text-light"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="form-label">Currency</label>
                    <select
                      className="form-select bg-main border-main text-light"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select bg-main border-main text-light"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="sent">Sent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="card bg-main border-main text-light mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><FaUser /> Customer Information</h5>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setShowCustomerModal(true)}
                >
                  Select Customer
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Customer Name *</label>
                    <input
                      type="text"
                      className={`form-control bg-main border-main text-light ${validationErrors['customer.name'] ? 'is-invalid' : ''}`}
                      name="customer.name"
                      value={formData.customer.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control bg-main border-main text-light ${validationErrors['customer.email'] ? 'is-invalid' : ''}`}
                      name="customer.email"
                      value={formData.customer.email}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors['customer.email'] && (
                      <div className="invalid-feedback">{validationErrors['customer.email']}</div>
                    )}
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control bg-main border-main text-light"
                      name="customer.phone"
                      value={formData.customer.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control bg-main border-main text-light"
                      name="customer.address"
                      value={formData.customer.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control bg-main border-main text-light"
                      name="customer.city"
                      value={formData.customer.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control bg-main border-main text-light"
                      name="customer.state"
                      value={formData.customer.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      className="form-control bg-main border-main text-light"
                      name="customer.zip"
                      value={formData.customer.zip}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control bg-main border-main text-light"
                      name="customer.country"
                      value={formData.customer.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="card bg-main border-main text-light mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Line Items</h5>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={addLineItem}
                >
                  <FaPlus /> Add Item
                </button>
              </div>
              <div className="card-body">
                {validationErrors['line_items'] && (
                  <div className="alert alert-danger">{validationErrors['line_items']}</div>
                )}
                <div className="table-responsive">
                  <table className="table table-dark">
                    <thead>
                      <tr>
                        <th>Item/Service</th>
                        <th>Description</th>
                        <th width="100px">Qty</th>
                        <th width="120px">Price</th>
                        <th width="120px">Total</th>
                        <th width="50px">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.line_items.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <input
                              type="text"
                              className="form-control bg-main border-main text-light"
                              value={item.name}
                              onChange={(e) => handleLineItemChange(index, 'name', e.target.value)}
                              placeholder="Item name"
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control bg-main border-main text-light"
                              value={item.description}
                              onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                              placeholder="Description"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control bg-main border-main text-light"
                              value={item.quantity}
                              onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                              min="1"
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control bg-main border-main text-light"
                              value={item.price}
                              onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                              step="0.01"
                              min="0"
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control bg-main border-main text-light"
                              value={formatCurrency(item.total, formData.currency)}
                              readOnly
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeLineItem(index)}
                              disabled={formData.line_items.length === 1}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            <div className="card bg-main border-main text-light mb-4">
              <div className="card-header">
                <h5 className="mb-0">Additional Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control bg-main border-main text-light"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Additional notes for the invoice"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Terms & Conditions</label>
                  <textarea
                    className="form-control bg-main border-main text-light"
                    name="terms"
                    value={formData.terms}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Payment terms and conditions"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="col-lg-4">
            {/* Company Information */}
            <div className="card bg-main border-main text-light mb-4">
              <div className="card-header">
                <h5 className="mb-0"><FaBuilding /> Company Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control bg-main border-main text-light"
                    name="company.name"
                    value={formData.company.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control bg-main border-main text-light"
                    name="company.address"
                    value={formData.company.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control bg-main border-main text-light"
                    name="company.phone"
                    value={formData.company.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control bg-main border-main text-light"
                    name="company.email"
                    value={formData.company.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="card bg-main border-main text-light">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><FaCalculator /> Invoice Summary</h5>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => calculateTotals()}
                >
                  Recalculate
                </button>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label">Tax Rate (%)</label>
                    <input
                      type="number"
                      className="form-control bg-main border-main text-light"
                      name="tax_rate"
                      value={formData.tax_rate}
                      onChange={(e) => {
                        handleInputChange(e);
                        setTimeout(() => calculateTotals(), 100);
                      }}
                      step="0.01"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Discount Amount</label>
                    <input
                      type="number"
                      className="form-control bg-main border-main text-light"
                      name="discount_amount"
                      value={formData.discount_amount}
                      onChange={(e) => {
                        handleInputChange(e);
                        setTimeout(() => calculateTotals(), 100);
                      }}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <hr className="border-secondary" />

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(formData.subtotal, formData.currency)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax ({formData.tax_rate}%):</span>
                  <span>{formatCurrency(formData.tax_amount, formData.currency)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Discount:</span>
                  <span>-{formatCurrency(formData.discount_amount, formData.currency)}</span>
                </div>

                <hr className="border-secondary" />

                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-primary">
                    {formatCurrency(formData.total_amount, formData.currency)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Select Customer</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCustomerModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control bg-main border-main text-light"
                    placeholder="Search customers..."
                    value={searchCustomer}
                    onChange={(e) => setSearchCustomer(e.target.value)}
                  />
                </div>
                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map(customer => (
                        <tr key={customer.id}>
                          <td>{`${customer.first_name || ''} ${customer.last_name || ''}`.trim()}</td>
                          <td>{customer.email}</td>
                          <td>
                            {customer.default_address?.city}, {customer.default_address?.country}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => selectCustomer(customer)}
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCustomers.length === 0 && (
                    <div className="text-center py-3">
                      <p>No customers found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
