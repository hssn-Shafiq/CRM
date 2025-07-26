// Invoice Helper Utilities

// Generate unique invoice number
export const generateInvoiceNumber = (prefix = 'INV', date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${year}${month}${day}-${timestamp}`;
};

// Calculate invoice totals
export const calculateInvoiceTotals = (lineItems, taxRate = 0, discountAmount = 0) => {
  const subtotal = lineItems.reduce((sum, item) => {
    return sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1));
  }, 0);

  const taxAmount = (subtotal * parseFloat(taxRate)) / 100;
  const discount = parseFloat(discountAmount || 0);
  const total = subtotal + taxAmount - discount;

  return {
    subtotal: subtotal.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    discountAmount: discount.toFixed(2),
    total: Math.max(0, total).toFixed(2)
  };
};

// Format currency
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(parseFloat(amount || 0));
};

// Calculate due date
export const calculateDueDate = (daysFromNow = 30) => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysFromNow);
  return dueDate.toISOString().split('T')[0];
};

// Format date
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format invoice status
export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    'draft': 'bg-secondary',
    'pending': 'bg-warning',
    'sent': 'bg-info',
    'paid': 'bg-success',
    'overdue': 'bg-danger',
    'cancelled': 'bg-dark'
  };
  return statusClasses[status] || 'bg-secondary';
};

// Calculate days overdue
export const getDaysOverdue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = today - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Get invoice status based on dates and payment
export const getInvoiceStatus = (invoice) => {
  if (invoice.payment_status === 'paid' || invoice.status === 'paid') {
    return 'paid';
  }

  if (invoice.status === 'draft') {
    return 'draft';
  }

  if (invoice.status === 'cancelled') {
    return 'cancelled';
  }

  const today = new Date();
  const dueDate = new Date(invoice.due_date || invoice.dueDate);

  if (today > dueDate) {
    return 'overdue';
  }

  if (invoice.sent_at || invoice.sentAt) {
    return 'sent';
  }

  return 'pending';
};

// Validate invoice data
export const validateInvoiceData = (invoiceData) => {
  const errors = [];

  if (!invoiceData.customer?.email) {
    errors.push('Customer email is required');
  }

  if (!invoiceData.line_items || invoiceData.line_items.length === 0) {
    errors.push('At least one line item is required');
  }

  if (!invoiceData.invoice_number && !invoiceData.invoiceNumber) {
    errors.push('Invoice number is required');
  }

  if (!invoiceData.invoice_date && !invoiceData.issueDate) {
    errors.push('Invoice date is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Filter invoices by status
export const filterInvoicesByStatus = (invoices, status) => {
  if (status === 'all') {
    return invoices;
  }

  return invoices.filter(invoice => {
    const currentStatus = getInvoiceStatus(invoice);
    return currentStatus === status;
  });
};

// Search invoices
export const searchInvoices = (invoices, searchTerm) => {
  if (!searchTerm) {
    return invoices;
  }

  const term = searchTerm.toLowerCase();
  return invoices.filter(invoice => 
    invoice.invoice_number?.toLowerCase().includes(term) ||
    invoice.invoiceNumber?.toLowerCase().includes(term) ||
    invoice.customer?.name?.toLowerCase().includes(term) ||
    invoice.customer?.firstName?.toLowerCase().includes(term) ||
    invoice.customer?.lastName?.toLowerCase().includes(term) ||
    invoice.customer?.email?.toLowerCase().includes(term) ||
    invoice.order_number?.toLowerCase().includes(term) ||
    invoice.orderNumber?.toLowerCase().includes(term)
  );
};

// Sort invoices
export const sortInvoices = (invoices, sortBy, sortOrder = 'desc') => {
  return [...invoices].sort((a, b) => {
    let valueA, valueB;

    switch (sortBy) {
      case 'date':
        valueA = new Date(a.invoice_date || a.issueDate);
        valueB = new Date(b.invoice_date || b.issueDate);
        break;
      case 'dueDate':
        valueA = new Date(a.due_date || a.dueDate);
        valueB = new Date(b.due_date || b.dueDate);
        break;
      case 'amount':
        valueA = parseFloat(a.total_amount || a.total || 0);
        valueB = parseFloat(b.total_amount || b.total || 0);
        break;
      case 'customer':
        valueA = (a.customer?.name || `${a.customer?.firstName} ${a.customer?.lastName}`)?.toLowerCase() || '';
        valueB = (b.customer?.name || `${b.customer?.firstName} ${b.customer?.lastName}`)?.toLowerCase() || '';
        break;
      case 'status':
        valueA = getInvoiceStatus(a);
        valueB = getInvoiceStatus(b);
        break;
      default:
        valueA = a[sortBy];
        valueB = b[sortBy];
    }

    if (valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Export invoice data for Excel/CSV
export const exportInvoiceData = (invoices) => {
  return invoices.map(invoice => ({
    'Invoice Number': invoice.invoice_number || invoice.invoiceNumber,
    'Invoice Date': invoice.invoice_date || invoice.issueDate,
    'Due Date': invoice.due_date || invoice.dueDate,
    'Customer Name': invoice.customer?.name || `${invoice.customer?.firstName} ${invoice.customer?.lastName}`,
    'Customer Email': invoice.customer?.email || '',
    'Order Number': invoice.order_number || invoice.orderNumber || '',
    'Subtotal': invoice.subtotal,
    'Tax Amount': invoice.tax_amount || invoice.tax,
    'Discount Amount': invoice.discount_amount || invoice.discount,
    'Total Amount': invoice.total_amount || invoice.total,
    'Currency': invoice.currency || 'USD',
    'Status': getInvoiceStatus(invoice),
    'Payment Status': invoice.payment_status || invoice.paymentStatus,
    'Days Overdue': getDaysOverdue(invoice.due_date || invoice.dueDate)
  }));
};

// Create email template variables for invoice
export const createEmailTemplateVariables = (invoice) => {
  return {
    '{{customer_name}}': invoice.customer?.name || `${invoice.customer?.firstName} ${invoice.customer?.lastName}`,
    '{{customer_first_name}}': invoice.customer?.first_name || invoice.customer?.firstName || '',
    '{{invoice_number}}': invoice.invoice_number || invoice.invoiceNumber || '',
    '{{invoice_date}}': invoice.invoice_date || invoice.issueDate || '',
    '{{due_date}}': invoice.due_date || invoice.dueDate || '',
    '{{total_amount}}': formatCurrency(invoice.total_amount || invoice.total, invoice.currency),
    '{{company_name}}': invoice.company?.name || '',
    '{{order_number}}': invoice.order_number || invoice.orderNumber || '',
    '{{subtotal}}': formatCurrency(invoice.subtotal, invoice.currency),
    '{{tax_amount}}': formatCurrency(invoice.tax_amount || invoice.tax, invoice.currency),
    '{{discount_amount}}': formatCurrency(invoice.discount_amount || invoice.discount, invoice.currency)
  };
};

// Parse Shopify order to invoice data
export const parseShopifyOrderToInvoice = (order, companyInfo = {}) => {
  const lineItems = order.line_items?.map(item => ({
    id: item.id,
    name: item.name || item.title,
    description: item.variant_title || '',
    quantity: item.quantity || 1,
    price: item.price || '0.00',
    total: (parseFloat(item.price || 0) * parseInt(item.quantity || 1)).toFixed(2)
  })) || [];

  const totals = calculateInvoiceTotals(
    lineItems,
    0, // Tax rate - can be configured
    parseFloat(order.total_discounts || 0)
  );

  return {
    invoice_number: generateInvoiceNumber(),
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: calculateDueDate(30), // 30 days from now
    order_id: order.id,
    order_number: order.order_number,
    
    // Customer information
    customer: {
      id: order.customer?.id,
      name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim(),
      first_name: order.customer?.first_name || '',
      last_name: order.customer?.last_name || '',
      email: order.customer?.email || order.contact_email,
      phone: order.customer?.phone || order.shipping_address?.phone || '',
      address: order.shipping_address?.address1 || '',
      address2: order.shipping_address?.address2 || '',
      city: order.shipping_address?.city || '',
      state: order.shipping_address?.province || '',
      zip: order.shipping_address?.zip || '',
      country: order.shipping_address?.country || ''
    },

    // Company information
    company: {
      name: companyInfo.name || 'Your Company',
      address: companyInfo.address || '',
      phone: companyInfo.phone || '',
      email: companyInfo.email || '',
      logo: companyInfo.logo || '',
      website: companyInfo.website || ''
    },

    // Line items
    line_items: lineItems,

    // Totals
    subtotal: totals.subtotal,
    tax_rate: 0,
    tax_amount: totals.taxAmount,
    discount_amount: totals.discountAmount,
    total_amount: totals.total,
    currency: order.currency || 'USD',

    // Additional info
    notes: `Invoice for Order #${order.order_number}`,
    terms: 'Payment is due within 30 days of invoice date.',
    status: 'pending',
    payment_status: order.financial_status || 'pending'
  };
};

// Default export for backward compatibility
const invoiceHelpers = {
  generateInvoiceNumber,
  calculateInvoiceTotals,
  formatCurrency,
  calculateDueDate,
  formatDate,
  getStatusBadgeClass,
  getDaysOverdue,
  getInvoiceStatus,
  validateInvoiceData,
  filterInvoicesByStatus,
  searchInvoices,
  sortInvoices,
  exportInvoiceData,
  createEmailTemplateVariables,
  parseShopifyOrderToInvoice
};

export default invoiceHelpers;
