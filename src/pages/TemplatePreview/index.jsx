import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { emailTemplateApi } from '../../Services/api';
import { toast } from 'react-toastify';
import './TemplatePreview.css';

const TemplatePreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTemplate();
    }, [id]);

    const fetchTemplate = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await emailTemplateApi.getTemplate(id);

            if (response.data.data) {
                setTemplate(response.data.data);
            } else {
                setTemplate(response.data);
            }
        } catch (error) {
            console.error('Error fetching template:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch template';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="template-preview-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="template-preview-error">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/templates')}
                >
                    Back to Templates
                </button>
            </div>
        );
    }

    if (!template) {
        toast.warning('Template not found');
        return (
            <div className="template-preview-error">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/templates')}
                >
                    Back to Templates
                </button>
            </div>
        );
    }

    return (
        <div className="template-preview-container">
            <div className="template-preview-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h2>Template Design Preview</h2>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin/templates')}
                    >
                        Back to Templates
                    </button>
                </div>
            </div>
            <div className="template-meta">
                <div className="preview-section">
                    <table className="table" style={{ color: 'black' }}>
                        <tbody>
                            <h4>Template</h4>
                            <tr>
                                <td><strong>Name:</strong></td>
                                <td>{template.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Subject:</strong></td>
                                <td>{template.subject}</td>
                            </tr>
                            <tr>
                                <td><strong>Category:</strong></td>
                                <td>{template.category}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>

            <div className="template-preview-content">
                <div className="preview-section">
                  
                    <div
                        className="html-preview"
                        dangerouslySetInnerHTML={{ __html: template.html_content }}
                    />
                </div>

               
            </div>
        </div>
    );
};

export default TemplatePreview; 