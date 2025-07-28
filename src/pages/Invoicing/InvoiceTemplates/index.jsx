import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCopy, FaFileAlt, FaSearch, FaFilter, FaPalette } from 'react-icons/fa';
import invoiceTemplateService from '../../../Services/invoiceTemplateService';
import './InvoiceTemplates.css';

const InvoiceTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deletingTemplate, setDeletingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    isDefault: false,
    headerContent: '',
    footerContent: '',
    styling: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px'
    },
    fields: {
      showLogo: true,
      showCompanyInfo: true,
      showCustomerInfo: true,
      showItemDetails: true,
      showTaxBreakdown: true,
      showNotes: true,
      showTerms: true
    }
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const templatesData = await invoiceTemplateService.getAllTemplates();
      setTemplates(templatesData);
    } catch (err) {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      isDefault: false,
      headerContent: '',
      footerContent: '',
      styling: {
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px'
      },
      fields: {
        showLogo: true,
        showCompanyInfo: true,
        showCustomerInfo: true,
        showItemDetails: true,
        showTaxBreakdown: true,
        showNotes: true,
        showTerms: true
      }
    });
    setFormErrors({});
  };

  const handleShowModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        description: template.description || '',
        category: template.category || 'general',
        isDefault: template.isDefault || false,
        headerContent: template.headerContent || '',
        footerContent: template.footerContent || '',
        styling: template.styling || {
          primaryColor: '#007bff',
          secondaryColor: '#6c757d',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px'
        },
        fields: template.fields || {
          showLogo: true,
          showCompanyInfo: true,
          showCustomerInfo: true,
          showItemDetails: true,
          showTaxBreakdown: true,
          showNotes: true,
          showTerms: true
        }
      });
    } else {
      setEditingTemplate(null);
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Template name is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingTemplate) {
        await invoiceTemplateService.updateTemplate(editingTemplate.id, formData);
      } else {
        await invoiceTemplateService.createTemplate(formData);
      }
      handleCloseModal();
      loadTemplates(); // Reload templates
    } catch (error) {
      console.error('Error saving template:', error);
      setError('Failed to save template');
    }
  };

  const handleDelete = async () => {
    if (deletingTemplate) {
      try {
        await invoiceTemplateService.deleteTemplate(deletingTemplate.id);
        setShowDeleteModal(false);
        setDeletingTemplate(null);
        loadTemplates(); // Reload templates
      } catch (error) {
        console.error('Error deleting template:', error);
        setError('Failed to delete template');
      }
    }
  };

  const handleDuplicate = async (template) => {
    try {
      await invoiceTemplateService.duplicateTemplate(template.id);
      loadTemplates(); // Reload templates
    } catch (error) {
      console.error('Error duplicating template:', error);
      setError('Failed to duplicate template');
    }
  };

  const handleSetActive = async (template) => {
    try {
      await invoiceTemplateService.setActiveTemplate(template.id);
      loadTemplates(); // Reload templates
    } catch (error) {
      console.error('Error setting active template:', error);
      setError('Failed to set active template');
    }
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
  };

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'service', label: 'Service' },
    { value: 'product', label: 'Product' },
    { value: 'recurring', label: 'Recurring' },
    { value: 'custom', label: 'Custom' }
  ];

  if (loading && !templates?.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="invoice-templates-container">
      <div className="container-fluid">
        {/* Header */}
        <div className="templates-header bg-primary text-white p-4 mb-4">
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="page-title mb-0">
                <FaFileAlt className="me-2" />
                Invoice Templates
              </h2>
              <p className="mb-0 opacity-75">Manage and customize your invoice templates</p>
            </Col>
            <Col md={6} className="text-end">
              <Button
                variant="outline-light"
                onClick={() => handleShowModal()}
                className="me-2"
              >
                <FaPlus className="me-1" />
                New Template
              </Button>
            </Col>
          </Row>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={6}>
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ps-5"
                  />
                </div>
              </Col>
              <Col md={3}>
                <div className="filter-box">
                  <FaFilter className="filter-icon" />
                  <Form.Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="ps-5"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>
              <Col md={3} className="text-end">
                <span className="text-muted">
                  {filteredTemplates?.length || 0} template(s) found
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Templates Grid */}
        {filteredTemplates?.length > 0 ? (
          <Row>
            {filteredTemplates.map((template) => (
              <Col lg={4} md={6} key={template.id} className="mb-4">
                <Card className={`template-card h-100 ${template.isActive ? 'active-template' : ''}`}>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <FaPalette 
                        className="me-2" 
                        style={{ color: template.styling?.primaryColor || '#007bff' }}
                      />
                      <div>
                        <h6 className="mb-0">{template.name}</h6>
                        <Badge bg={template.isActive ? 'success' : 'secondary'} className="mt-1">
                          {template.isActive ? 'Active' : template.category}
                        </Badge>
                      </div>
                    </div>
                    {template.isDefault && (
                      <Badge bg="warning" text="dark">Default</Badge>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted small mb-3">
                      {template.description || 'No description provided'}
                    </p>
                    
                    <div className="template-preview">
                      <div 
                        className="preview-header"
                        style={{ 
                          backgroundColor: template.styling?.primaryColor || '#007bff',
                          color: 'white'
                        }}
                      >
                        <small>Invoice Preview</small>
                      </div>
                      <div className="preview-content">
                        <div className="preview-line"></div>
                        <div className="preview-line short"></div>
                        <div className="preview-line medium"></div>
                      </div>
                    </div>

                    <div className="template-features mt-3">
                      <small className="text-muted">Features:</small>
                      <div className="feature-tags">
                        {template.fields?.showLogo && <span className="feature-tag">Logo</span>}
                        {template.fields?.showTaxBreakdown && <span className="feature-tag">Tax</span>}
                        {template.fields?.showNotes && <span className="feature-tag">Notes</span>}
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent">
                    <div className="btn-group w-100" role="group">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handlePreview(template)}
                        title="Preview"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleShowModal(template)}
                        title="Edit"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleDuplicate(template)}
                        title="Duplicate"
                      >
                        <FaCopy />
                      </Button>
                      {!template.isActive && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleSetActive(template)}
                          title="Set as Active"
                        >
                          ✓
                        </Button>
                      )}
                      {!template.isDefault && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setDeletingTemplate(template);
                            setShowDeleteModal(true);
                          }}
                          title="Delete"
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="text-center py-5">
            <Card.Body>
              <FaFileAlt size={48} className="text-muted mb-3" />
              <h5>No Templates Found</h5>
              <p className="text-muted mb-3">
                {searchTerm || filterCategory !== 'all' 
                  ? 'No templates match your current filters.' 
                  : 'You haven\'t created any invoice templates yet.'
                }
              </p>
              <Button variant="primary" onClick={() => handleShowModal()}>
                <FaPlus className="me-1" />
                Create Your First Template
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Create/Edit Template Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Template Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    isInvalid={!!formErrors.name}
                    placeholder="e.g., Professional Invoice"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    isInvalid={!!formErrors.category}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of this template..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Set as default template"
                checked={formData.isDefault}
                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
              />
            </Form.Group>

            {/* Styling Section */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Styling Options</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Primary Color</Form.Label>
                      <Form.Control
                        type="color"
                        value={formData.styling.primaryColor}
                        onChange={(e) => setFormData({
                          ...formData,
                          styling: {...formData.styling, primaryColor: e.target.value}
                        })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Secondary Color</Form.Label>
                      <Form.Control
                        type="color"
                        value={formData.styling.secondaryColor}
                        onChange={(e) => setFormData({
                          ...formData,
                          styling: {...formData.styling, secondaryColor: e.target.value}
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Font Family</Form.Label>
                      <Form.Select
                        value={formData.styling.fontFamily}
                        onChange={(e) => setFormData({
                          ...formData,
                          styling: {...formData.styling, fontFamily: e.target.value}
                        })}
                      >
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Times New Roman, serif">Times New Roman</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Font Size</Form.Label>
                      <Form.Select
                        value={formData.styling.fontSize}
                        onChange={(e) => setFormData({
                          ...formData,
                          styling: {...formData.styling, fontSize: e.target.value}
                        })}
                      >
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                        <option value="16px">16px</option>
                        <option value="18px">18px</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Fields Section */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Template Fields</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    {Object.entries(formData.fields).slice(0, 4).map(([key, value]) => (
                      <Form.Group key={key} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          checked={value}
                          onChange={(e) => setFormData({
                            ...formData,
                            fields: {...formData.fields, [key]: e.target.checked}
                          })}
                        />
                      </Form.Group>
                    ))}
                  </Col>
                  <Col md={6}>
                    {Object.entries(formData.fields).slice(4).map(([key, value]) => (
                      <Form.Group key={key} className="mb-2">
                        <Form.Check
                          type="checkbox"
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          checked={value}
                          onChange={(e) => setFormData({
                            ...formData,
                            fields: {...formData.fields, [key]: e.target.checked}
                          })}
                        />
                      </Form.Group>
                    ))}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Header/Footer Content */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Header Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.headerContent}
                    onChange={(e) => setFormData({...formData, headerContent: e.target.value})}
                    placeholder="Custom header content..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Footer Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.footerContent}
                    onChange={(e) => setFormData({...formData, footerContent: e.target.value})}
                    placeholder="Custom footer content..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" className="me-2" /> : null}
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the template "{deletingTemplate?.name}"?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner size="sm" className="me-2" /> : null}
            Delete Template
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Modal */}
      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Template Preview: {previewTemplate?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="template-preview-full">
            <div 
              className="preview-invoice"
              style={{
                fontFamily: previewTemplate?.styling?.fontFamily,
                fontSize: previewTemplate?.styling?.fontSize,
                color: '#333'
              }}
            >
              <div 
                className="preview-header p-3"
                style={{ backgroundColor: previewTemplate?.styling?.primaryColor, color: 'white' }}
              >
                <h4>INVOICE</h4>
                <p className="mb-0">#{Math.floor(Math.random() * 10000)}</p>
              </div>
              <div className="preview-body p-3">
                <div className="row">
                  <div className="col-6">
                    <h6>Bill To:</h6>
                    <p className="mb-1">John Doe</p>
                    <p className="mb-1">123 Main St</p>
                    <p className="mb-1">City, State 12345</p>
                  </div>
                  <div className="col-6 text-end">
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong> {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
                  </div>
                </div>
                <table className="table table-sm mt-3">
                  <thead style={{ backgroundColor: previewTemplate?.styling?.secondaryColor, color: 'white' }}>
                    <tr>
                      <th>Description</th>
                      <th className="text-end">Qty</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sample Product</td>
                      <td className="text-end">2</td>
                      <td className="text-end">$50.00</td>
                      <td className="text-end">$100.00</td>
                    </tr>
                  </tbody>
                </table>
                <div className="row">
                  <div className="col-6"></div>
                  <div className="col-6">
                    <div className="d-flex justify-content-between">
                      <span>Subtotal:</span>
                      <span>$100.00</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Tax:</span>
                      <span>$10.00</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>$110.00</span>
                    </div>
                  </div>
                </div>
              </div>
              {previewTemplate?.footerContent && (
                <div className="preview-footer p-3 text-center bg-light">
                  <small>{previewTemplate.footerContent}</small>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSetActive(previewTemplate)}>
            Use This Template
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvoiceTemplates;
