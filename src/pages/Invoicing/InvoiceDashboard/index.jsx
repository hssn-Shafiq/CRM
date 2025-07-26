import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { 
  FaFileInvoiceDollar, 
  FaMoneyBillWave, 
  FaClock, 
  FaExclamationTriangle,
  FaPlus,
  FaEye,
  FaRobot,
  FaPalette,
  FaChartLine,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { getAllInvoices } from '../../../features/invoice/invoiceSlice';
import { getAllAutomationRules } from '../../../features/invoice/automationSlice';
import { formatCurrency, getStatusBadgeClass, formatDate } from '../../../utils/invoiceHelpers';
import './InvoiceDashboard.css';

const InvoiceDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { invoices, loading: invoicesLoading } = useSelector(state => state.invoice);
  const { rules } = useSelector(state => state.automation);
  
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    dispatch(getAllInvoices({ limit: 100 })); // Get more invoices for dashboard stats
    dispatch(getAllAutomationRules());
  }, [dispatch]);

  // Calculate dashboard statistics
  const calculateStats = () => {
    if (!invoices?.length) {
      return {
        totalInvoices: 0,
        totalRevenue: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        paidAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        recentInvoices: [],
        monthlyGrowth: 0,
        revenueGrowth: 0
      };
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (parseInt(dateRange) * 24 * 60 * 60 * 1000));
    const filteredInvoices = invoices.filter(invoice => 
      new Date(invoice.issueDate) >= thirtyDaysAgo
    );

    const stats = {
      totalInvoices: filteredInvoices.length,
      totalRevenue: filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
      paidInvoices: filteredInvoices.filter(inv => inv.status === 'paid').length,
      pendingInvoices: filteredInvoices.filter(inv => inv.status === 'pending').length,
      overdueInvoices: filteredInvoices.filter(inv => inv.status === 'overdue').length,
      paidAmount: filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0),
      pendingAmount: filteredInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + (inv.total || 0), 0),
      overdueAmount: filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total || 0), 0),
      recentInvoices: filteredInvoices.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)).slice(0, 5)
    };

    // Calculate growth (comparing with previous period)
    const previousPeriodStart = new Date(thirtyDaysAgo.getTime() - (parseInt(dateRange) * 24 * 60 * 60 * 1000));
    const previousInvoices = invoices.filter(invoice => {
      const issueDate = new Date(invoice.issueDate);
      return issueDate >= previousPeriodStart && issueDate < thirtyDaysAgo;
    });

    const previousRevenue = previousInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const previousCount = previousInvoices.length;

    stats.monthlyGrowth = previousCount > 0 
      ? ((stats.totalInvoices - previousCount) / previousCount * 100)
      : 0;
    
    stats.revenueGrowth = previousRevenue > 0 
      ? ((stats.totalRevenue - previousRevenue) / previousRevenue * 100)
      : 0;

    return stats;
  };

  const stats = calculateStats();

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice',
      icon: <FaPlus />,
      color: 'primary',
      action: () => navigate('/admin/invoicing/create')
    },
    {
      title: 'View All Invoices',
      description: 'Browse invoice list',
      icon: <FaEye />,
      color: 'info',
      action: () => navigate('/admin/invoicing/list')
    },
    {
      title: 'Manage Templates',
      description: 'Customize invoice templates',
      icon: <FaPalette />,
      color: 'warning',
      action: () => navigate('/admin/invoicing/templates')
    },
    {
      title: 'Automation Rules',
      description: 'Configure auto-invoicing',
      icon: <FaRobot />,
      color: 'success',
      action: () => navigate('/admin/invoicing/automation')
    }
  ];

  if (invoicesLoading && !invoices?.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="invoice-dashboard-container">
      <div className="container-fluid">
        {/* Header */}
        <div className="dashboard-header bg-primary text-white p-4 mb-4">
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="page-title mb-1">
                <FaFileInvoiceDollar className="me-2" />
                Invoicing Dashboard
              </h2>
              <p className="mb-0 opacity-75">
                Complete overview of your invoicing system and automation
              </p>
            </Col>
            <Col md={4} className="text-end">
              <div className="d-flex align-items-center justify-content-end">
                <label className="text-white me-2">Period:</label>
                <select 
                  className="form-select form-select-sm"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </Col>
          </Row>
        </div>

        {/* Key Metrics */}
        <Row className="mb-4">
          <Col xl={3} md={6} className="mb-3">
            <Card className="metric-card h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="metric-icon bg-primary">
                  <FaFileInvoiceDollar />
                </div>
                <div className="metric-info">
                  <div className="metric-value">{stats.totalInvoices}</div>
                  <div className="metric-label">Total Invoices</div>
                  <div className="metric-change">
                    {stats.monthlyGrowth >= 0 ? (
                      <span className="text-success">
                        <FaArrowUp className="me-1" />
                        {stats.monthlyGrowth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-danger">
                        <FaArrowDown className="me-1" />
                        {Math.abs(stats.monthlyGrowth).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xl={3} md={6} className="mb-3">
            <Card className="metric-card h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="metric-icon bg-success">
                  <FaMoneyBillWave />
                </div>
                <div className="metric-info">
                  <div className="metric-value">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="metric-label">Total Revenue</div>
                  <div className="metric-change">
                    {stats.revenueGrowth >= 0 ? (
                      <span className="text-success">
                        <FaArrowUp className="me-1" />
                        {stats.revenueGrowth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-danger">
                        <FaArrowDown className="me-1" />
                        {Math.abs(stats.revenueGrowth).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xl={3} md={6} className="mb-3">
            <Card className="metric-card h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="metric-icon bg-warning">
                  <FaClock />
                </div>
                <div className="metric-info">
                  <div className="metric-value">{formatCurrency(stats.pendingAmount)}</div>
                  <div className="metric-label">Pending Amount</div>
                  <div className="metric-sub">{stats.pendingInvoices} invoices</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xl={3} md={6} className="mb-3">
            <Card className="metric-card h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="metric-icon bg-danger">
                  <FaExclamationTriangle />
                </div>
                <div className="metric-info">
                  <div className="metric-value">{formatCurrency(stats.overdueAmount)}</div>
                  <div className="metric-label">Overdue Amount</div>
                  <div className="metric-sub">{stats.overdueInvoices} invoices</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Status Overview */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">
                  <FaChartLine className="me-2" />
                  Invoice Status Overview
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="text-center mb-3">
                    <div className="status-circle paid">
                      <div className="status-percentage">
                        {stats.totalInvoices > 0 ? Math.round((stats.paidInvoices / stats.totalInvoices) * 100) : 0}%
                      </div>
                    </div>
                    <div className="status-label">Paid</div>
                    <div className="status-count">{stats.paidInvoices} invoices</div>
                    <div className="status-amount">{formatCurrency(stats.paidAmount)}</div>
                  </Col>
                  <Col md={4} className="text-center mb-3">
                    <div className="status-circle pending">
                      <div className="status-percentage">
                        {stats.totalInvoices > 0 ? Math.round((stats.pendingInvoices / stats.totalInvoices) * 100) : 0}%
                      </div>
                    </div>
                    <div className="status-label">Pending</div>
                    <div className="status-count">{stats.pendingInvoices} invoices</div>
                    <div className="status-amount">{formatCurrency(stats.pendingAmount)}</div>
                  </Col>
                  <Col md={4} className="text-center mb-3">
                    <div className="status-circle overdue">
                      <div className="status-percentage">
                        {stats.totalInvoices > 0 ? Math.round((stats.overdueInvoices / stats.totalInvoices) * 100) : 0}%
                      </div>
                    </div>
                    <div className="status-label">Overdue</div>
                    <div className="status-count">{stats.overdueInvoices} invoices</div>
                    <div className="status-amount">{formatCurrency(stats.overdueAmount)}</div>
                  </Col>
                </Row>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Payment Progress</span>
                    <span>{stats.totalInvoices > 0 ? Math.round((stats.paidInvoices / stats.totalInvoices) * 100) : 0}% Paid</span>
                  </div>
                  <ProgressBar>
                    <ProgressBar 
                      variant="success" 
                      now={stats.totalInvoices > 0 ? (stats.paidInvoices / stats.totalInvoices) * 100 : 0} 
                      key={1} 
                    />
                    <ProgressBar 
                      variant="warning" 
                      now={stats.totalInvoices > 0 ? (stats.pendingInvoices / stats.totalInvoices) * 100 : 0} 
                      key={2} 
                    />
                    <ProgressBar 
                      variant="danger" 
                      now={stats.totalInvoices > 0 ? (stats.overdueInvoices / stats.totalInvoices) * 100 : 0} 
                      key={3} 
                    />
                  </ProgressBar>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">
                  <FaRobot className="me-2" />
                  Automation Status
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="automation-stats">
                  <div className="stat-item">
                    <div className="stat-value">{rules?.length || 0}</div>
                    <div className="stat-label">Total Rules</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value text-success">
                      {rules?.filter(rule => rule.isActive).length || 0}
                    </div>
                    <div className="stat-label">Active Rules</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value text-warning">
                      {rules?.filter(rule => !rule.isActive).length || 0}
                    </div>
                    <div className="stat-label">Inactive Rules</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100"
                    onClick={() => navigate('/admin/invoicing/automation')}
                  >
                    Manage Automation
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions & Recent Invoices */}
        <Row className="mb-4">
          <Col lg={4}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="quick-actions">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={`outline-${action.color}`}
                      className="quick-action-btn mb-2 w-100"
                      onClick={action.action}
                    >
                      <div className="d-flex align-items-center">
                        <div className="action-icon me-3">
                          {action.icon}
                        </div>
                        <div className="text-start">
                          <div className="action-title">{action.title}</div>
                          <small className="action-desc">{action.description}</small>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Recent Invoices
                </h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate('/admin/invoicing/list')}
                >
                  View All
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                {stats.recentInvoices.length > 0 ? (
                  <div className="table-responsive">
                    <Table className="recent-invoices-table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Invoice #</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentInvoices.map((invoice) => (
                          <tr 
                            key={invoice.id}
                            className="cursor-pointer"
                            onClick={() => navigate(`/admin/invoicing/detail/${invoice.id}`)}
                          >
                            <td className="fw-bold">#{invoice.invoiceNumber}</td>
                            <td>
                              {invoice.customer?.firstName} {invoice.customer?.lastName}
                            </td>
                            <td className="fw-bold">{formatCurrency(invoice.total)}</td>
                            <td>
                              <Badge className={getStatusBadgeClass(invoice.status)}>
                                {invoice.status?.toUpperCase()}
                              </Badge>
                            </td>
                            <td>{formatDate(invoice.issueDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FaFileInvoiceDollar size={32} className="text-muted mb-2" />
                    <p className="text-muted mb-0">No recent invoices found</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
