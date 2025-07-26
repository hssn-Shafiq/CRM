import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InvoiceList from './InvoiceList';
import InvoiceForm from './InvoiceForm';
import InvoiceDetail from './InvoiceDetail';
import InvoiceTemplates from './InvoiceTemplates';
import AutomationRules from './AutomationRules';
import InvoiceDashboard from './InvoiceDashboard';

const Invoicing = () => {
  return (
    <div className="invoicing-system">
      <Routes>
        {/* Dashboard - Overview of invoicing system */}
        <Route path="/" element={<InvoiceDashboard />} />
        <Route path="/dashboard" element={<InvoiceDashboard />} />
        
        {/* Invoice Management */}
        <Route path="/list" element={<InvoiceList />} />
        <Route path="/create" element={<InvoiceForm />} />
        <Route path="/detail/:id" element={<InvoiceDetail />} />
        <Route path="/edit/:id" element={<InvoiceForm />} />

        {/* Templates */}
        <Route path="/templates" element={<InvoiceTemplates />} />
        
        {/* Automation */}
        <Route path="/automation" element={<AutomationRules />} />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/admin/invoicing" replace />} />
      </Routes>
    </div>
  );
};

export default Invoicing;
