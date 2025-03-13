import React from 'react';
import './dashboardcard.css';

const GoogleAnalyticsReport = () => {
  return (
    <div className="GoogleAnalyticsContainer">
      <div className="GoogleAnalyticsCard">
        <div className="GoogleAnalyticsHeader">
          <h2 className="GoogleAnalyticsTitle">Google Analytics Report</h2>
          <p className="GoogleAnalyticsSubtitle">(Last 12 months)</p>
        </div>
        
       
        
        <div className="GoogleAnalyticsStats">
          <div className="GoogleAnalyticsStatItem">
            <p className="GoogleAnalyticsStatLabel">Total Visitors</p>
            <p className="GoogleAnalyticsStatValue">14.84K</p>
          </div>
          
          <div className="GoogleAnalyticsStatItem">
            <p className="GoogleAnalyticsStatLabel">Total Page Views</p>
            <p className="GoogleAnalyticsStatValue">29.29K</p>
          </div>
          
          <div className="GoogleAnalyticsStatItem">
            <p className="GoogleAnalyticsStatLabel">Direct Views</p>
            <p className="GoogleAnalyticsStatValue">5.53K</p>
          </div>
          
          <div className="GoogleAnalyticsStatItem">
            <p className="GoogleAnalyticsStatLabel">Paid Views</p>
            <p className="GoogleAnalyticsStatValue">6.26K</p>
          </div>
          
          <div className="GoogleAnalyticsStatItem">
            <p className="GoogleAnalyticsStatLabel">Social Views</p>
            <p className="GoogleAnalyticsStatValue">621</p>
          </div>
          
          <div className="GoogleAnalyticsStatItem">
            <p className="GoogleAnalyticsStatLabel">Organic Views</p>
            <p className="GoogleAnalyticsStatValue">3.68K</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsReport;