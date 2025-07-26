import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "https://crmapi.alayaarts.com/api";
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN || "1|nq8njnFmxYLoda5ImMgwwdxXGb7ONugJLpCCYsYff4264dcc";

// Helper function for API requests
const apiRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`API Request Error (${method} ${endpoint}):`, error);
    throw new Error(error.response?.data?.message || 'API request failed');
  }
};

// Invoice Service
export const invoiceService = {
  // Get all invoices
  getAllInvoices: async () => {
    return await apiRequest('GET', '/invoices');
  },

  // Get invoice by ID
  getInvoiceById: async (id) => {
    return await apiRequest('GET', `/invoices/${id}`);
  },

  // Create new invoice
  createInvoice: async (invoiceData) => {
    return await apiRequest('POST', '/invoices', invoiceData);
  },

  // Update invoice
  updateInvoice: async (id, invoiceData) => {
    return await apiRequest('PUT', `/invoices/${id}`, invoiceData);
  },

  // Delete invoice
  deleteInvoice: async (id) => {
    return await apiRequest('DELETE', `/invoices/${id}`);
  },

  // Generate invoice from order
  generateInvoiceFromOrder: async (orderId, templateId) => {
    return await apiRequest('POST', '/invoices/generate-from-order', {
      order_id: orderId,
      template_id: templateId
    });
  },

  // Send invoice by email
  sendInvoiceByEmail: async (invoiceId, emailData) => {
    return await apiRequest('POST', `/invoices/${invoiceId}/send-email`, emailData);
  },

  // Get invoices by customer
  getInvoicesByCustomer: async (customerId) => {
    return await apiRequest('GET', `/invoices/customer/${customerId}`);
  },

  // Get invoice statistics
  getInvoiceStats: async () => {
    return await apiRequest('GET', '/invoices/statistics');
  },

  // Mark invoice as paid
  markInvoiceAsPaid: async (invoiceId, paymentData) => {
    return await apiRequest('POST', `/invoices/${invoiceId}/mark-paid`, paymentData);
  },

  // Download invoice PDF
  downloadInvoicePDF: async (invoiceId) => {
    try {
      const response = await axios.get(`${API_URL}/invoices/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
        },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading invoice PDF:', error);
      throw error;
    }
  },

  // Bulk invoice operations
  bulkUpdateInvoices: async (invoiceIds, updateData) => {
    return await apiRequest('POST', '/invoices/bulk-update', {
      invoice_ids: invoiceIds,
      update_data: updateData
    });
  }
};

export default invoiceService;
