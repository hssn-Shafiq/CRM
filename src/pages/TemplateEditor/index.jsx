import React, { useRef, useState, useEffect } from 'react';
import EmailEditor from 'react-email-editor';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { emailTemplateApi, folderApi } from '../../Services/api';
import './TemplateEditor.css';
import { Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    useEffect(() => {
        if (templateFromLocation) {
            
            setTemplateData({
                name: templateFromLocation.name,
                subject: templateFromLocation.subject,
                category: templateFromLocation.category,
                design_json: templateFromLocation.design_json,
                html_content: templateFromLocation.html_content
            });
        }
    }, [templateFromLocation]);

    useEffect(() => {
        if (location.state?.folderId) {
            setSelectedFolderId(location.state.folderId);
        }
    }, [location]);

    
    React.useEffect(() => {
        if (id) {
            loadTemplate();
        }
    }, [id]);

    
    useEffect(() => {
        loadFolders();
    }, []);

    const loadFolders = async () => {
        try {
            const response = await folderApi.getFolders();
            setFolders(response.data);
        } catch (error) {
            console.error('Error loading folders:', error);
            toast.error('Failed to load folders');
        }
    };

    
    useEffect(() => {
        
        console.log('Initial folder ID from location:', location.state?.folderId);
    }, [location]);

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

            
            if (template.design_json) {
                emailEditorRef.current?.editor?.loadDesign(JSON.parse(template.design_json));
            }
        } catch (error) {
            console.error('Error loading template:', error);
            toast.error('Failed to load template');
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
            toast.warning('Please enter a template name');
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
            toast.warning('Please enter a folder name');
            return;
        }

        try {
            setIsLoading(true);
            
            const folderResponse = await folderApi.createFolder({
                name: newFolderName,
                is_active: true,
                created_by: "2" 
            });

            console.log('New folder created:', folderResponse.data);

            
            await loadFolders();

            
            const newFolderId = folderResponse.data.id;

            
            await saveTemplateToFolder(newFolderId);

            
            setNewFolderName('');

        } catch (error) {
            console.error('Error creating folder:', error);
            toast.error('Failed to create folder: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectExistingFolder = async () => {
        if (!selectedFolder) {
            toast.warning('Please select a folder');
            return;
        }

        
        console.log('Selected folder value:', selectedFolder);

        
        const folderId = parseInt(selectedFolder);
        if (isNaN(folderId)) {
            console.error('Invalid folder ID:', selectedFolder);
            toast.error('Invalid folder selection');
            return;
        }

        try {
            await saveTemplateToFolder(folderId);
        } catch (error) {
            console.error('Error saving to folder:', error);
            toast.error('Failed to save template to folder');
        }
    };

    const saveTemplateToFolder = async (folderId) => {
        try {
            setIsLoading(true);

            emailEditorRef.current.editor.exportHtml(async (data) => {
                const { design, html } = data;

                
                const templatePayload = {
                    name: templateData.name,
                    subject: templateData.subject,
                    category: templateData.category,
                    design_json: JSON.stringify(design),
                    html_content: html,
                    folder_id: folderId,  
                    is_active: true,
                    created_by: "2"  
                };

                console.log('Saving template with payload:', templatePayload);

                try {
                    if (id) {
                        await emailTemplateApi.updateTemplate(id, templatePayload);
                    } else {
                        await emailTemplateApi.createTemplate(templatePayload);
                    }

                    toast.success('Template saved successfully!');
                    navigate('/admin/templates');
                } catch (apiError) {
                    console.error('API Error:', apiError.response?.data);
                    throw apiError;
                }
            });
        } catch (error) {
            console.error('Error saving template:', error);
            toast.error('Failed to save template');
        } finally {
            setIsLoading(false);
            setShowFolderModal(false);
        }
    };

    const handleSaveWithoutFolder = async () => {
        try {
            setIsLoading(true);

            emailEditorRef.current.editor.exportHtml(async (data) => {
                const { design, html } = data;

                const templatePayload = {
                    name: templateData.name,
                    subject: templateData.subject,
                    category: templateData.category,
                    design_json: JSON.stringify(design),
                    html_content: html,
                    folder_id: null,  
                    is_active: true,
                    created_by: "2"  
                };

                try {
                    if (id) {
                        await emailTemplateApi.updateTemplate(id, templatePayload);
                    } else {
                        await emailTemplateApi.createTemplate(templatePayload);
                    }

                    toast.success('Template saved successfully!');
                    navigate('/admin/templates');
                } catch (apiError) {
                    console.error('API Error:', apiError.response?.data);
                    throw apiError;
                }
            });
        } catch (error) {
            console.error('Error saving template:', error);
            toast.error('Failed to save template');
        } finally {
            setIsLoading(false);
            setShowSaveModal(false);
        }
    };

    if (isLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
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
                        {/* <button className="btn btn-primary" onClick={handleSaveToFolder}>
                            Save to Folder
                        </button> */}

                        <select
                            className="form-select mb-2"
                            value={selectedFolder}
                            onChange={(e) => {
                                console.log('Selected folder changed to:', e.target.value);
                                setSelectedFolder(e.target.value);
                            }}
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
                        <button className="btn btn-secondary" onClick={handleSaveWithoutFolder}>
                            Save Without Folder
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Folder Selection Modal */}
            {/* <Modal show={showFolderModal} onHide={() => setShowFolderModal(false)}>
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
                                Create 
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h6>Or Select Existing Folder</h6>
                      
                    </div>
                </Modal.Body>
            </Modal> */}
        </>
    );
};

export default TemplateEditor; 