import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "https://crmapi.alayaarts.com/api";
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN || "1|nq8njnFmxYLoda5ImMgwwwdxXGb7ONugJLpCCYsYff4264dcc";

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

// Invoice Template Service
export const invoiceTemplateService = {
  // Get all invoice templates
  getAllTemplates: async () => {
    return await apiRequest('GET', '/invoice-templates');
  },

  // Get template by ID
  getTemplateById: async (id) => {
    return await apiRequest('GET', `/invoice-templates/${id}`);
  },

  // Create new template
  createTemplate: async (templateData) => {
    return await apiRequest('POST', '/invoice-templates', templateData);
  },

  // Update template
  updateTemplate: async (id, templateData) => {
    return await apiRequest('PUT', `/invoice-templates/${id}`, templateData);
  },

  // Delete template
  deleteTemplate: async (id) => {
    return await apiRequest('DELETE', `/invoice-templates/${id}`);
  },

  // Duplicate template
  duplicateTemplate: async (id, newName) => {
    return await apiRequest('POST', `/invoice-templates/${id}/duplicate`, { name: newName });
  },

  // Get template preview
  getTemplatePreview: async (id, sampleData) => {
    return await apiRequest('POST', `/invoice-templates/${id}/preview`, { sample_data: sampleData });
  },

  // Get default templates
  getDefaultTemplates: async () => {
    return await apiRequest('GET', '/invoice-templates/defaults');
  },

  // Set template as default
  setAsDefault: async (id) => {
    return await apiRequest('POST', `/invoice-templates/${id}/set-default`);
  },

  // Get template usage statistics
  getTemplateStats: async (id) => {
    return await apiRequest('GET', `/invoice-templates/${id}/statistics`);
  }
};

export default invoiceTemplateService;
