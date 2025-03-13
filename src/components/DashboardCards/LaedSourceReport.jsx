import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboardcard.css';

const LeadSourceReport = () => {
  // Sample data for the table
  const reportData = [
    { source: '-', totalLeads: 63, totalValues: '$101,130.12', open: 15, won: 38, lost: 0, abandoned: 10, winPercentage: '60.32%' },
    { source: 'estimator', totalLeads: 1, totalValues: '$19,746', open: 0, won: 1, lost: 0, abandoned: 0, winPercentage: '100.00%' },
    { source: 'website', totalLeads: 15, totalValues: '$27,450.00', open: 5, won: 8, lost: 1, abandoned: 1, winPercentage: '57.14%' },
    { source: 'referral', totalLeads: 20, totalValues: '$35,780.50', open: 6, won: 12, lost: 0, abandoned: 2, winPercentage: '60.00%' },
    { source: 'social', totalLeads: 8, totalValues: '$12,600.00', open: 2, won: 5, lost: 1, abandoned: 0, winPercentage: '62.50%' },
    { source: 'email', totalLeads: 6, totalValues: '$9,850.75', open: 2, won: 3, lost: 0, abandoned: 1, winPercentage: '50.00%' }
  ];

  return (
   
      <div className="LeadSourceCard  shadow-sm " >
        {/* Header */}
        <div className="LeadSourceCardHeader  ">
          <h1 className="LeadSourceTitle mb-0">Lead Source Report</h1>
        </div>
        
        {/* Stats Section */}
        <div className="LeadSourceCardBody py-4 px-4 border-bottom">
          <div className="LeadSourceMainStat mb-2">113</div>
          <div>
            <span className="LeadSourceBadge LeadSourceBadgeSuccess rounded-pill px-3 py-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                <path d="M8 3.33334V12.6667M8 3.33334L4 7.33334M8 3.33334L12 7.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              145.65%
            </span>
            <span className="LeadSourceCompareText ms-2">vs Last 31 Days</span>
          </div>
        </div>
        
        {/* Table Section */}
        <div className="LeadSourceTableContainer" style={{ maxHeight: '200px' }}>
          <table className="LeadSourceTable mb-0">
            <thead className="LeadSourceTableHeader position-sticky top-0">
              <tr>
                <th className="LeadSourceTableHeaderCell px-4 py-3">Source</th>
                <th className="LeadSourceTableHeaderCell px-4 py-3">Total Leads</th>
                <th className="LeadSourceTableHeaderCell px-4 py-3">Total Values</th>
                <th className="LeadSourceTableHeaderCell px-4 py-3">Open</th>
                <th className="LeadSourceTableHeaderCell px-4 py-3">Won</th>
                <th className="LeadSourceTableHeaderCell px-4 py-3">Lost</th>
                <th className="LeadSourceTableHeaderCell px-4 py-3">Abandoned</th>
                <th className="LeadSourceTableHeaderCell px-4 py-3">Win%</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="LeadSourceTableRow">
                  <td className="LeadSourceTableCell px-4 py-3">{row.source}</td>
                  <td className="LeadSourceTableCell px-4 py-3">{row.totalLeads}</td>
                  <td className="LeadSourceTableCell px-4 py-3">{row.totalValues}</td>
                  <td className="LeadSourceTableCell px-4 py-3">{row.open}</td>
                  <td className="LeadSourceTableCell px-4 py-3">{row.won}</td>
                  <td className="LeadSourceTableCell px-4 py-3">{row.lost}</td>
                  <td className="LeadSourceTableCell px-4 py-3">{row.abandoned}</td>
                  <td className="LeadSourceTableCell px-4 py-3">{row.winPercentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Section */}
        <div className="LeadSourceCardFooter border-top py-3 px-4">
          <div className="LeadSourcePagination d-flex justify-content-end gap-2">
            <button className="LeadSourcePaginationButton LeadSourcePaginationButtonPrev px-3 py-2">Previous</button>
            <button className="LeadSourcePaginationButton LeadSourcePaginationButtonActive px-3 py-2">1</button>
            <button className="LeadSourcePaginationButton LeadSourcePaginationButtonNext px-3 py-2">Next</button>
          </div>
        </div>
      </div>
    
  );
};

export default LeadSourceReport;