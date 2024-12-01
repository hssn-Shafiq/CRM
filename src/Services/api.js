import api from './axiosConfig';

export const emailTemplateApi = {
    // Template APIs
    getAllTemplates: () => api.get('/email-templates'),
    createTemplate: (templateData) => {
        console.log('Creating template with data:', templateData);
        return api.post('/email-templates', templateData);
    },
    getTemplate: (id) => api.get(`/email-templates/${id}`),
    updateTemplate: (id, templateData) => {
        console.log('Updating template with data:', templateData);
        return api.put(`/email-templates/${id}`, templateData);
    },
    deleteTemplate: (id) => api.delete(`/email-templates/${id}`),
    getTemplatesByFolderId: (folderId) => api.get(`/folders/${folderId}/templates`),
    updateTemplateFolder: (templateId, folderId) => api.patch(`/templates/${templateId}/folder`, { folder_id: folderId }),
};

export const folderApi = {
    getFolders: () => api.get('/folders'),
    createFolder: (data) => api.post('/folders', data),
    updateFolder: (id, data) => api.put(`/folders/${id}`, data),
    deleteFolder: (id) => api.delete(`/folders/${id}`),
    addTemplateToFolder: (folderId, templateId) =>
        api.post(`/folders/${folderId}/templates`, { template_id: templateId }),
    removeTemplateFromFolder: (folderId, templateId) =>
        api.delete(`/folders/${folderId}/templates/${templateId}`)
};
