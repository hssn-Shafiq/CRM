import React, { useRef, useState, useEffect } from 'react';
import EmailEditor from 'react-email-editor';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { emailTemplateApi } from '../../Services/api';
import './TemplateEditor.css';
import { Modal } from 'react-bootstrap';

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
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [folders, setFolders] = useState([]);

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

    // Add this useEffect to load folders from localStorage
    useEffect(() => {
        const storedFolders = localStorage.getItem("folders");
        if (storedFolders) {
            setFolders(JSON.parse(storedFolders));
        }
    }, []);

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

    const handleSave = () => {
        if (!templateData.name.trim()) {
            alert('Please enter a template name');
            return;
        }
        setShowSaveModal(true);
    };

    const handleSaveToFolder = async () => {
        setShowSaveModal(false);
        setShowFolderModal(true);
    };

    const handleCreateNewFolder = async () => {
        if (!newFolderName.trim()) {
            alert('Please enter a folder name');
            return;
        }

        const newFolder = { id: Date.now(), name: newFolderName, templates: [] };
        const updatedFolders = [...folders, newFolder];
        setFolders(updatedFolders);
        localStorage.setItem("folders", JSON.stringify(updatedFolders));
        
        await saveTemplateToFolder(newFolder.id);
    };

    const handleSelectExistingFolder = async () => {
        if (!selectedFolder) {
            alert('Please select a folder');
            return;
        }
        await saveTemplateToFolder(selectedFolder);
    };

    const saveTemplateToFolder = async (folderId) => {
        try {
            setIsLoading(true);
            
            emailEditorRef.current.editor.exportHtml(async (data) => {
                const { design, html } = data;
                
                const updatedTemplateData = {
                    ...templateData,
                    design_json: JSON.stringify(design),
                    html_content: html,
                    folderId: folderId // Add folder reference
                };

                if (id) {
                    await emailTemplateApi.updateTemplate(id, updatedTemplateData);
                } else {
                    await emailTemplateApi.createTemplate(updatedTemplateData);
                }

                // Update folder's templates in localStorage
                const updatedFolders = folders.map(folder => {
                    if (folder.id === folderId) {
                        return {
                            ...folder,
                            templates: [...(folder.templates || []), updatedTemplateData]
                        };
                    }
                    return folder;
                });
                
                localStorage.setItem("folders", JSON.stringify(updatedFolders));
                alert('Template saved successfully!');
                navigate('/admin/templates');
            });
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template. Please try again.');
        } finally {
            setIsLoading(false);
            setShowFolderModal(false);
        }
    };

    if (isLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <>
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

            {/* Save Options Modal */}
            <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Save Template</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary" onClick={handleSaveToFolder}>
                            Save to Folder
                        </button>
                        <button className="btn btn-secondary" onClick={() => {
                            setShowSaveModal(false);
                            handleSave();
                        }}>
                            Save Without Folder
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Folder Selection Modal */}
            <Modal show={showFolderModal} onHide={() => setShowFolderModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select or Create Folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <h6>Create New Folder</h6>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="New Folder Name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                            />
                            <button 
                                className="btn btn-primary" 
                                onClick={handleCreateNewFolder}
                            >
                                Create & Save
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h6>Or Select Existing Folder</h6>
                        <select 
                            className="form-select mb-2"
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                        >
                            <option value="">Select a folder</option>
                            {folders.map(folder => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                        <button 
                            className="btn btn-primary w-100"
                            onClick={handleSelectExistingFolder}
                        >
                            Save to Selected Folder
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TemplateEditor; 