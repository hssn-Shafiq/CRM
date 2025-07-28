import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Table, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaDownload, FaEnvelope, FaPrint, FaArrowLeft, FaCalendarAlt, FaUser, FaFileInvoiceDollar, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { getInvoiceById, deleteInvoice, sendInvoiceByEmail } from '../../../features/invoice/invoiceSlice';
import { pdfService } from '../../../Services/pdfService';
import { formatCurrency, getStatusBadgeClass, formatDate } from '../../../utils/invoiceHelpers';
import './InvoiceDetail.css';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentInvoice, isLoading, isError, message } = useSelector(state => state.invoice);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getInvoiceById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentInvoice?.customer) {
      setEmailForm(prev => ({
        ...prev,
        to: currentInvoice.customer.email || '',
        subject: `Invoice #${currentInvoice.invoiceNumber}`,
        message: `Dear ${currentInvoice.customer.firstName} ${currentInvoice.customer.lastName},\n\nPlease find attached your invoice #${currentInvoice.invoiceNumber}.\n\nThank you for your business!\n\nBest regards,\nYour Company Name`
      }));
    }
  }, [currentInvoice]);

  const handleEdit = () => {
    navigate(`/admin/invoicing/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteInvoice(id));
      setShowDeleteModal(false);
      navigate('/admin/invoicing/list');
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await dispatch(sendInvoiceByEmail({ 
        invoiceId: id, 
        emailData: emailForm 
      }));
      setShowEmailModal(false);
      // Show success message
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadLoading(true);
    try {
      const result = await pdfService.generateInvoicePDF(currentInvoice.id);
      if (result.success) {
        pdfService.downloadPDF(result.pdf, result.fileName);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FaCheckCircle className="text-success" />;
      case 'pending':
        return <FaClock className="text-warning" />;
      case 'overdue':
        return <FaExclamationTriangle className="text-danger" />;
      default:
        return <FaClock className="text-secondary" />;
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Invoice</Alert.Heading>
          <p>{message}</p>
          <Button variant="outline-danger" onClick={() => navigate('/admin/invoicing/list')}>
            Back to Invoices
          </Button>
        </Alert>
      </div>
    );
  }

  if (!currentInvoice) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          <Alert.Heading>Invoice Not Found</Alert.Heading>
          <p>The requested invoice could not be found.</p>
          <Button variant="outline-warning" onClick={() => navigate('/admin/invoicing/list')}>
            Back to Invoices
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="invoice-detail-container">
      <div className="container-fluid">
        {/* Header */}
        <div className="invoice-header bg-primary text-white p-4 mb-4">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => navigate('/admin/invoicing/list')}
                  className="me-3"
                >
                  <FaArrowLeft /> Back
                </Button>
                <div>
                  <h2 className="page-title mb-1">
                    <FaFileInvoiceDollar className="me-2" />
                    Invoice #{currentInvoice.invoiceNumber}
                  </h2>
                  <div className="d-flex align-items-center">
                    {getStatusIcon(currentInvoice.status)}
                    <span className={`badge ${getStatusBadgeClass(currentInvoice.status)} ms-2`}>
                      {currentInvoice.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <div className="btn-group" role="group">
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleEdit}
                  className="me-2"
                >
                  <FaEdit /> Edit
                </Button>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => setShowEmailModal(true)}
                  className="me-2"
                >
                  <FaEnvelope /> Email
                </Button>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleDownloadPdf}
                  disabled={downloadLoading}
                  className="me-2"
                >
                  {downloadLoading ? <Spinner size="sm" /> : <FaDownload />} PDF
                </Button>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handlePrint}
                  className="me-2"
                >
                  <FaPrint /> Print
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FaTrash /> Delete
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Invoice Content */}
        <div className="invoice-content print-area">
          <Row>
            <Col lg={8}>
              {/* Invoice Info */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    <FaFileInvoiceDollar className="me-2" />
                    Invoice Information
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="info-item">
                        <strong>Invoice Number:</strong>
                        <span className="ms-2">{currentInvoice.invoiceNumber}</span>
                      </div>
                      <div className="info-item">
                        <strong>Issue Date:</strong>
                        <span className="ms-2">
                          <FaCalendarAlt className="me-1" />
                          {formatDate(currentInvoice.issueDate)}
                        </span>
                      </div>
                      <div className="info-item">
                        <strong>Due Date:</strong>
                        <span className="ms-2">
                          <FaCalendarAlt className="me-1" />
                          {formatDate(currentInvoice.dueDate)}
                        </span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <strong>Status:</strong>
                        <span className={`badge ${getStatusBadgeClass(currentInvoice.status)} ms-2`}>
                          {currentInvoice.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="info-item">
                        <strong>Payment Terms:</strong>
                        <span className="ms-2">{currentInvoice.paymentTerms || 'Net 30'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Total Amount:</strong>
                        <span className="ms-2 fw-bold text-primary">
                          {formatCurrency(currentInvoice.total)}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Customer Info */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">
                    <FaUser className="me-2" />
                    Customer Information
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6 className="text-primary">Bill To:</h6>
                      <div className="customer-info">
                        <div className="fw-bold">
                          {currentInvoice.customer?.firstName} {currentInvoice.customer?.lastName}
                        </div>
                        <div>{currentInvoice.customer?.email}</div>
                        <div>{currentInvoice.customer?.phone}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary">Billing Address:</h6>
                      <div className="address-info">
                        <div>{currentInvoice.customer?.address?.address1}</div>
                        {currentInvoice.customer?.address?.address2 && (
                          <div>{currentInvoice.customer.address.address2}</div>
                        )}
                        <div>
                          {currentInvoice.customer?.address?.city}, {currentInvoice.customer?.address?.province} {currentInvoice.customer?.address?.zip}
                        </div>
                        <div>{currentInvoice.customer?.address?.country}</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Line Items */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Invoice Items</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="mb-0 invoice-items-table">
                      <thead className="table-dark">
                        <tr>
                          <th>Description</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-end">Unit Price</th>
                          <th className="text-end">Tax Rate</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInvoice.items?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="fw-bold">{item.description}</div>
                              {item.details && (
                                <small className="text-muted">{item.details}</small>
                              )}
                            </td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                            <td className="text-end">{item.taxRate || 0}%</td>
                            <td className="text-end fw-bold">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>

              {/* Notes */}
              {currentInvoice.notes && (
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Notes</h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-0">{currentInvoice.notes}</p>
                  </Card.Body>
                </Card>
              )}
            </Col>

            {/* Summary Sidebar */}
            <Col lg={4}>
              <Card className="invoice-summary-card sticky-top">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Invoice Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="summary-line">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(currentInvoice.subtotal)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Discount:</span>
                    <span>-{formatCurrency(currentInvoice.discount || 0)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Tax:</span>
                    <span>{formatCurrency(currentInvoice.tax)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Shipping:</span>
                    <span>{formatCurrency(currentInvoice.shipping || 0)}</span>
                  </div>
                  <hr />
                  <div className="summary-line total-line">
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold text-primary fs-4">
                      {formatCurrency(currentInvoice.total)}
                    </span>
                  </div>
                  
                  {currentInvoice.status === 'paid' && (
                    <div className="mt-3 p-3 bg-success bg-opacity-10 rounded">
                      <div className="text-success fw-bold d-flex align-items-center">
                        <FaCheckCircle className="me-2" />
                        Paid in Full
                      </div>
                      {currentInvoice.paidDate && (
                        <small className="text-muted">
                          Paid on {formatDate(currentInvoice.paidDate)}
                        </small>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete invoice #{currentInvoice.invoiceNumber}?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Invoice
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Email Modal */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Send Invoice Email</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSendEmail}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>To:</Form.Label>
                  <Form.Control
                    type="email"
                    value={emailForm.to}
                    onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject:</Form.Label>
                  <Form.Control
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Message:</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={emailForm.message}
                onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={emailLoading}>
              {emailLoading ? <Spinner size="sm" className="me-2" /> : <FaEnvelope className="me-2" />}
              Send Email
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default InvoiceDetail;
