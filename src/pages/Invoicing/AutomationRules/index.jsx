import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Table, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaPlay, FaPause, FaCog, FaRobot, FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { 
  getAllAutomationRules,
  createAutomationRule, 
  updateAutomationRule, 
  deleteAutomationRule,
  toggleAutomationRuleStatus 
} from '../../../features/invoice/automationSlice';
import { formatDate } from '../../../utils/invoiceHelpers';
import './AutomationRules.css';

const AutomationRules = () => {
  const dispatch = useDispatch();
  const { rules, loading, error } = useSelector(state => state.automation);
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'order_created',
    isActive: true,
    conditions: {
      orderStatus: [],
      customerTags: [],
      minimumAmount: '',
      maximumAmount: '',
      paymentMethod: [],
      shippingMethod: []
    },
    actions: {
      templateId: '',
      sendEmail: true,
      emailDelay: 0,
      emailDelayUnit: 'hours',
      generatePdf: true,
      notifyAdmin: false,
      markAsPaid: false
    },
    schedule: {
      frequency: 'immediate',
      dayOfWeek: 1,
      dayOfMonth: 1,
      time: '09:00'
    }
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(getAllAutomationRules());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      triggerType: 'order_created',
      isActive: true,
      conditions: {
        orderStatus: [],
        customerTags: [],
        minimumAmount: '',
        maximumAmount: '',
        paymentMethod: [],
        shippingMethod: []
      },
      actions: {
        templateId: '',
        sendEmail: true,
        emailDelay: 0,
        emailDelayUnit: 'hours',
        generatePdf: true,
        notifyAdmin: false,
        markAsPaid: false
      },
      schedule: {
        frequency: 'immediate',
        dayOfWeek: 1,
        dayOfMonth: 1,
        time: '09:00'
      }
    });
    setFormErrors({});
  };

  const handleShowModal = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        description: rule.description || '',
        triggerType: rule.triggerType || 'order_created',
        isActive: rule.isActive,
        conditions: rule.conditions || {
          orderStatus: [],
          customerTags: [],
          minimumAmount: '',
          maximumAmount: '',
          paymentMethod: [],
          shippingMethod: []
        },
        actions: rule.actions || {
          templateId: '',
          sendEmail: true,
          emailDelay: 0,
          emailDelayUnit: 'hours',
          generatePdf: true,
          notifyAdmin: false,
          markAsPaid: false
        },
        schedule: rule.schedule || {
          frequency: 'immediate',
          dayOfWeek: 1,
          dayOfMonth: 1,
          time: '09:00'
        }
      });
    } else {
      setEditingRule(null);
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRule(null);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Rule name is required';
    }
    
    if (!formData.triggerType) {
      errors.triggerType = 'Trigger type is required';
    }

    if (formData.conditions.minimumAmount && formData.conditions.maximumAmount) {
      if (parseFloat(formData.conditions.minimumAmount) >= parseFloat(formData.conditions.maximumAmount)) {
        errors.amount = 'Minimum amount must be less than maximum amount';
      }
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
      if (editingRule) {
        await dispatch(updateAutomationRule({
          id: editingRule.id,
          ruleData: formData
        }));
      } else {
        await dispatch(createAutomationRule(formData));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving automation rule:', error);
    }
  };

  const handleDelete = async () => {
    if (deletingRule) {
      try {
        await dispatch(deleteAutomationRule(deletingRule.id));
        setShowDeleteModal(false);
        setDeletingRule(null);
      } catch (error) {
        console.error('Error deleting automation rule:', error);
      }
    }
  };

  const handleToggleRule = async (rule) => {
    try {
      await dispatch(toggleAutomationRuleStatus(rule.id));
    } catch (error) {
      console.error('Error toggling automation rule:', error);
    }
  };

  const filteredRules = rules?.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && rule.isActive) ||
                         (filterStatus === 'inactive' && !rule.isActive);
    return matchesSearch && matchesStatus;
  });

  const triggerTypes = [
    { value: 'order_created', label: 'Order Created' },
    { value: 'order_fulfilled', label: 'Order Fulfilled' },
    { value: 'order_paid', label: 'Order Paid' },
    { value: 'order_cancelled', label: 'Order Cancelled' },
    { value: 'customer_created', label: 'Customer Created' },
    { value: 'scheduled', label: 'Scheduled' }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const delayUnits = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' }
  ];

  if (loading && !rules?.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="automation-rules-container">
      <div className="container-fluid">
        {/* Header */}
        <div className="automation-header bg-primary text-white p-4 mb-4">
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="page-title mb-0">
                <FaRobot className="me-2" />
                Automation Rules
              </h2>
              <p className="mb-0 opacity-75">Automate invoice generation and delivery</p>
            </Col>
            <Col md={6} className="text-end">
              <Button
                variant="outline-light"
                onClick={() => handleShowModal()}
                className="me-2"
              >
                <FaPlus className="me-1" />
                New Rule
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
                    placeholder="Search automation rules..."
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
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="ps-5"
                  >
                    <option value="all">All Rules</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </div>
              </Col>
              <Col md={3} className="text-end">
                <span className="text-muted">
                  {filteredRules?.length || 0} rule(s) found
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Rules Table */}
        {filteredRules?.length > 0 ? (
          <Card>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="automation-rules-table mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Rule Name</th>
                      <th>Trigger</th>
                      <th>Status</th>
                      <th>Last Run</th>
                      <th>Total Runs</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRules.map((rule) => (
                      <tr key={rule.id}>
                        <td>
                          <div>
                            <div className="fw-bold">{rule.name}</div>
                            {rule.description && (
                              <small className="text-muted">{rule.description}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge bg="info" className="me-1">
                            {triggerTypes.find(t => t.value === rule.triggerType)?.label || rule.triggerType}
                          </Badge>
                          {rule.schedule?.frequency !== 'immediate' && (
                            <small className="d-block text-muted">
                              <FaCalendarAlt className="me-1" />
                              {rule.schedule.frequency}
                            </small>
                          )}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Badge 
                              bg={rule.isActive ? 'success' : 'secondary'} 
                              className="me-2"
                            >
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button
                              variant={rule.isActive ? 'outline-warning' : 'outline-success'}
                              size="sm"
                              onClick={() => handleToggleRule(rule)}
                              title={rule.isActive ? 'Pause Rule' : 'Activate Rule'}
                            >
                              {rule.isActive ? <FaPause /> : <FaPlay />}
                            </Button>
                          </div>
                        </td>
                        <td>
                          {rule.lastRun ? (
                            <div>
                              <div>{formatDate(rule.lastRun)}</div>
                              <small className="text-muted">
                                {rule.lastRunStatus || 'Success'}
                              </small>
                            </div>
                          ) : (
                            <span className="text-muted">Never run</span>
                          )}
                        </td>
                        <td>
                          <div className="text-center">
                            <div className="fw-bold">{rule.totalRuns || 0}</div>
                            <small className="text-muted">executions</small>
                          </div>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleShowModal(rule)}
                              title="Edit Rule"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Rule Settings"
                            >
                              <FaCog />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setDeletingRule(rule);
                                setShowDeleteModal(true);
                              }}
                              title="Delete Rule"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <Card className="text-center py-5">
            <Card.Body>
              <FaRobot size={48} className="text-muted mb-3" />
              <h5>No Automation Rules Found</h5>
              <p className="text-muted mb-3">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No rules match your current filters.' 
                  : 'You haven\'t created any automation rules yet.'
                }
              </p>
              <Button variant="primary" onClick={() => handleShowModal()}>
                <FaPlus className="me-1" />
                Create Your First Rule
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Create/Edit Rule Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRule ? 'Edit Automation Rule' : 'Create New Automation Rule'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* Basic Information */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Basic Information</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rule Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        isInvalid={!!formErrors.name}
                        placeholder="e.g., Auto Invoice for New Orders"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Trigger Type *</Form.Label>
                      <Form.Select
                        value={formData.triggerType}
                        onChange={(e) => setFormData({...formData, triggerType: e.target.value})}
                        isInvalid={!!formErrors.triggerType}
                      >
                        {triggerTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.triggerType}
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
                    placeholder="Brief description of this automation rule..."
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Active (rule will run automatically)"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Conditions */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Conditions (Optional)</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Minimum Order Amount</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={formData.conditions.minimumAmount}
                        onChange={(e) => setFormData({
                          ...formData,
                          conditions: {...formData.conditions, minimumAmount: e.target.value}
                        })}
                        placeholder="0.00"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Maximum Order Amount</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={formData.conditions.maximumAmount}
                        onChange={(e) => setFormData({
                          ...formData,
                          conditions: {...formData.conditions, maximumAmount: e.target.value}
                        })}
                        placeholder="999999.99"
                      />
                      {formErrors.amount && (
                        <div className="invalid-feedback d-block">{formErrors.amount}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Order Status</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.conditions.orderStatus.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData,
                          conditions: {
                            ...formData.conditions, 
                            orderStatus: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          }
                        })}
                        placeholder="pending, fulfilled, etc."
                      />
                      <Form.Text className="text-muted">
                        Comma-separated list of order statuses
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Customer Tags</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.conditions.customerTags.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData,
                          conditions: {
                            ...formData.conditions, 
                            customerTags: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          }
                        })}
                        placeholder="vip, wholesale, etc."
                      />
                      <Form.Text className="text-muted">
                        Comma-separated list of customer tags
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Actions */}
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Actions</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Invoice Template</Form.Label>
                      <Form.Select
                        value={formData.actions.templateId}
                        onChange={(e) => setFormData({
                          ...formData,
                          actions: {...formData.actions, templateId: e.target.value}
                        })}
                      >
                        <option value="">Select template...</option>
                        <option value="default">Default Template</option>
                        <option value="professional">Professional Template</option>
                        <option value="minimal">Minimal Template</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Delay</Form.Label>
                      <Row>
                        <Col md={6}>
                          <Form.Control
                            type="number"
                            min="0"
                            value={formData.actions.emailDelay}
                            onChange={(e) => setFormData({
                              ...formData,
                              actions: {...formData.actions, emailDelay: parseInt(e.target.value) || 0}
                            })}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Select
                            value={formData.actions.emailDelayUnit}
                            onChange={(e) => setFormData({
                              ...formData,
                              actions: {...formData.actions, emailDelayUnit: e.target.value}
                            })}
                          >
                            {delayUnits.map(unit => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Send email to customer"
                        checked={formData.actions.sendEmail}
                        onChange={(e) => setFormData({
                          ...formData,
                          actions: {...formData.actions, sendEmail: e.target.checked}
                        })}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Generate PDF attachment"
                        checked={formData.actions.generatePdf}
                        onChange={(e) => setFormData({
                          ...formData,
                          actions: {...formData.actions, generatePdf: e.target.checked}
                        })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Notify admin"
                        checked={formData.actions.notifyAdmin}
                        onChange={(e) => setFormData({
                          ...formData,
                          actions: {...formData.actions, notifyAdmin: e.target.checked}
                        })}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Mark invoice as paid (for paid orders)"
                        checked={formData.actions.markAsPaid}
                        onChange={(e) => setFormData({
                          ...formData,
                          actions: {...formData.actions, markAsPaid: e.target.checked}
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Schedule (for scheduled triggers) */}
            {formData.triggerType === 'scheduled' && (
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Schedule Settings</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Frequency</Form.Label>
                        <Form.Select
                          value={formData.schedule.frequency}
                          onChange={(e) => setFormData({
                            ...formData,
                            schedule: {...formData.schedule, frequency: e.target.value}
                          })}
                        >
                          {frequencyOptions.map(freq => (
                            <option key={freq.value} value={freq.value}>
                              {freq.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    {formData.schedule.frequency === 'weekly' && (
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Day of Week</Form.Label>
                          <Form.Select
                            value={formData.schedule.dayOfWeek}
                            onChange={(e) => setFormData({
                              ...formData,
                              schedule: {...formData.schedule, dayOfWeek: parseInt(e.target.value)}
                            })}
                          >
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                            <option value={0}>Sunday</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    )}
                    {formData.schedule.frequency === 'monthly' && (
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Day of Month</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            max="31"
                            value={formData.schedule.dayOfMonth}
                            onChange={(e) => setFormData({
                              ...formData,
                              schedule: {...formData.schedule, dayOfMonth: parseInt(e.target.value) || 1}
                            })}
                          />
                        </Form.Group>
                      </Col>
                    )}
                    {['daily', 'weekly', 'monthly'].includes(formData.schedule.frequency) && (
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={formData.schedule.time}
                            onChange={(e) => setFormData({
                              ...formData,
                              schedule: {...formData.schedule, time: e.target.value}
                            })}
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" className="me-2" /> : null}
              {editingRule ? 'Update Rule' : 'Create Rule'}
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
          <p>Are you sure you want to delete the automation rule "{deletingRule?.name}"?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner size="sm" className="me-2" /> : null}
            Delete Rule
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AutomationRules;
