import React, { useRef, useState, useEffect } from 'react';
import EmailEditor from 'react-email-editor';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { emailTemplateApi } from '../../Services/api';
import './TemplateEditor.css';

const TemplateEditor = () => {
    const emailEditorRef = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [templateData, setTemplateData] = useState({
        name: '',
        subject: '',
        category: '',
        design_json: null,
        html_content: ''
    });
    const location = useLocation();
    const templateFromLocation = location.state?.template;

    useEffect(() => {
        if (templateFromLocation) {
            // Update the templateData state with the location data
            setTemplateData({
                name: templateFromLocation.name,
                subject: templateFromLocation.subject,
                category: templateFromLocation.category,
                design_json: templateFromLocation.design_json,
                html_content: templateFromLocation.html_content
            });
        }
    }, [templateFromLocation]);

    // Load existing template if editing
    React.useEffect(() => {
        if (id) {
            loadTemplate();
        }
    }, [id]);

    const loadTemplate = async () => {
        try {
            setIsLoading(true);
            const response = await emailTemplateApi.getTemplate(id);
            const template = response.data;
            
            setTemplateData({
                name: template.name,
                subject: template.subject,
                category: template.category,
                design_json: template.design_json,
                html_content: template.html_content
            });

            // Load design into editor
            if (template.design_json) {
                emailEditorRef.current?.editor?.loadDesign(JSON.parse(template.design_json));
            }
        } catch (error) {
            console.error('Error loading template:', error);
            alert('Failed to load template');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTemplateData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBack = () => {
        if (window.confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
            navigate('/admin/templates');
        }
    };

    const handleSave = async () => {
        if (!templateData.name.trim()) {
            alert('Please enter a template name');
            return;
        }

        try {
            setIsLoading(true);
            
            // Export the design and HTML
            emailEditorRef.current.editor.exportHtml(async (data) => {
                const { design, html } = data;
                
                const updatedTemplateData = {
                    ...templateData,
                    design_json: JSON.stringify(design),
                    html_content: html
                };

                if (id) {
                    // Update existing template
                    await emailTemplateApi.updateTemplate(id, updatedTemplateData);
                } else {
                    // Create new template
                    await emailTemplateApi.createTemplate(updatedTemplateData);
                }

                alert('Template saved successfully!');
                navigate('/templates');
            });
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="template-editor-container">
            <div className="editor-header">
                <button 
                    className="btn btn-secondary" 
                    onClick={handleBack}
                >
                    <i className="fas fa-arrow-left me-2"></i>Back
                </button>

                <div className="template-info">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Template Name *"
                        name="name"
                        value={templateData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Email Subject"
                        name="subject"
                        value={templateData.subject}
                        onChange={handleInputChange}
                    />
                    <select
                        className="form-control"
                        name="category"
                        value={templateData.category}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Category</option>
                        <option value="marketing">Marketing</option>
                        <option value="notification">Notification</option>
                        <option value="newsletter">Newsletter</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <button 
                    className="btn btn-primary" 
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    <i className="fas fa-save me-2"></i>
                    {isLoading ? 'Saving...' : 'Save Template'}
                </button>
            </div>
            
            <div className="editor-content">
                <EmailEditor
                    ref={emailEditorRef}
                    onLoad={() => console.log("Editor Loaded")}
                    minHeight="700px"
                    options={{
                        features: {
                            textEditor: {
                                tables: true,
                                images: true
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default TemplateEditor; 