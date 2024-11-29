import axios from 'axios';
import api from './axiosConfig';

export const emailTemplateApi = {
    getAllTemplates: () => api.get('/email-templates'),
    createTemplate: (templateData) => api.post('/email-templates', templateData),
    getTemplate: (id) => api.get(`/email-templates/${id}`),
    updateTemplate: (id, templateData) => api.put(`/email-templates/${id}`, templateData),
    deleteTemplate: (id) => api.delete(`/email-templates/${id}`)
}; 