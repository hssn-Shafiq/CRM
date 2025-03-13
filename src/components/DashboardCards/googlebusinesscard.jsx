import React, { useState } from 'react';
import './dashboardcard.css';
import { ChevronDown } from 'lucide-react';

const GoogleBusinessProfile = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <div className="gbp-card">
      {/* Header */}
      {/* Header section */}
      <div className="ga-report-header">
          <h2 className="ga-report-title">Google Business Profile</h2>
          <p className="ga-report-subtitle">(Last 12 months)</p>
        </div>
      {/* Divider */}
      
      {/* Metrics Grid */}
      <div className="gbp-metrics-grid">
        {/* Left Column */}
        <div className="gbp-col-left">
          <div className="gbp-metric-block">
            <p className="gbp-metric-label">Total views</p>
            <p className="gbp-metric-value">355</p>
          </div>
        </div>
        {/* Middle Column */}
        <div className="gbp-col-middle">
          <div className="gbp-metric-block">
            <p className="gbp-metric-label">Search (Desktop & Mobile)</p>
            <p className="gbp-metric-value">189</p>
          </div>
          <div className="gbp-metric-block">
            <p className="gbp-metric-label">Maps (Desktop & Mobile)</p>
            <p className="gbp-metric-value">166</p>
          </div>
        </div>
        {/* Right Column */}
        <div className="gbp-col-right">
          <div className="gbp-metrics-row">
            <div className="gbp-metrics-half">
              <p className="gbp-metric-label">Conversations</p>
              <p className="gbp-metric-value">0</p>
            </div>
            <div className="gbp-metrics-half">
              <p className="gbp-metric-label">Website visits</p>
              <p className="gbp-metric-value">37</p>
            </div>
          </div>
          <div className="gbp-metrics-row">
            <div className="gbp-metrics-half">
              <p className="gbp-metric-label">Bookings</p>
              <p className="gbp-metric-value">0</p>
            </div>
            <div className="gbp-metrics-half">
              <p className="gbp-metric-label">Calls</p>
              <p className="gbp-metric-value">18</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleBusinessProfile;