import React from 'react';
import './dashboardcard.css';

const GoogleAdsReport = () => {
  return (
    <div className="adsreport-card">
      <div className="adsreport-header">
        <h2 className="adsreport-title">Google Ads Report</h2>
      </div>
      <div className="adsreport-divider"></div>
      <div className="adsreport-metrics-container">
        <div className="adsreport-metric">
          <p className="adsreport-metric-label">Total Clicks</p>
          <p className="adsreport-metric-value">12.7k</p>
        </div>
        <div className="adsreport-metric">
          <p className="adsreport-metric-label">Total Spent</p>
          <p className="adsreport-metric-value">$1000</p>
        </div>
        <div className="adsreport-metric">
          <p className="adsreport-metric-label">CPC</p>
          <p className="adsreport-metric-value">$500</p>
        </div>
        <div className="adsreport-metric">
          <p className="adsreport-metric-label">CTR</p>
          <p className="adsreport-metric-value">12%</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleAdsReport;