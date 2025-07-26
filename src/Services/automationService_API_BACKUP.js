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

// Automation Service
export const automationService = {
  // Get all automation rules
  getAllRules: async () => {
    return await apiRequest('GET', '/invoice-automation');
  },

  // Get rule by ID
  getRuleById: async (id) => {
    return await apiRequest('GET', `/invoice-automation/${id}`);
  },

  // Create new automation rule
  createRule: async (ruleData) => {
    return await apiRequest('POST', '/invoice-automation', ruleData);
  },

  // Update automation rule
  updateRule: async (id, ruleData) => {
    return await apiRequest('PUT', `/invoice-automation/${id}`, ruleData);
  },

  // Delete automation rule
  deleteRule: async (id) => {
    return await apiRequest('DELETE', `/invoice-automation/${id}`);
  },

  // Toggle rule active status
  toggleRuleStatus: async (id, isActive) => {
    return await apiRequest('POST', `/invoice-automation/${id}/toggle`, { is_active: isActive });
  },

  // Test automation rule
  testRule: async (id, testData) => {
    return await apiRequest('POST', `/invoice-automation/${id}/test`, testData);
  },

  // Get rule execution history
  getRuleHistory: async (id, limit = 50) => {
    return await apiRequest('GET', `/invoice-automation/${id}/history?limit=${limit}`);
  },

  // Execute rule manually
  executeRule: async (id, orderData) => {
    return await apiRequest('POST', `/invoice-automation/${id}/execute`, orderData);
  },

  // Get automation statistics
  getAutomationStats: async () => {
    return await apiRequest('GET', '/invoice-automation/statistics');
  },

  // Get triggered automations for an order
  getTriggeredAutomations: async (orderId) => {
    return await apiRequest('GET', `/invoice-automation/triggered/${orderId}`);
  },

  // Get rule conditions templates
  getConditionTemplates: async () => {
    return await apiRequest('GET', '/invoice-automation/condition-templates');
  },

  // Validate rule conditions
  validateRuleConditions: async (conditions) => {
    return await apiRequest('POST', '/invoice-automation/validate-conditions', { conditions });
  },

  // Bulk rule operations
  bulkUpdateRules: async (ruleIds, updateData) => {
    return await apiRequest('POST', '/invoice-automation/bulk-update', {
      rule_ids: ruleIds,
      update_data: updateData
    });
  }
};

export default automationService;
