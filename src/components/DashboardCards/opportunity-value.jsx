import React, { useState, useEffect } from "react";
import "./dashboardcard.css";

const OpportunityValueDashboard = ({ className, data }) => {
  const defaultData = {
    currentValue: 0,
    percentageChange: 0,
    maxValue: 1,
    openValue: 0,
    wonValue: 0,
  };

  const [chartData, setChartData] = useState(defaultData);
  const [hoverRow, setHoverRow] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, value: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setLoading(true);
      // Simulate data fetching delay
      const timer = setTimeout(() => {
        setChartData({ ...defaultData, ...data });
        setLoading(false);
      }, 1000); // Adjust the delay as needed

      return () => clearTimeout(timer); // Cleanup the timer
    } else {
      setLoading(false);
    }
  }, [data]);

  const formatCurrency = (value) => {
    return value >= 1000 ? `$${(value / 1000).toFixed(1)}K` : `$${value}`;
  };

  const getBarWidth = (value) => {
    return `${(value / chartData.maxValue) * 100 || 0}%`;
  };

  const handleMouseEnter = (value, event) => {
    setTooltip({
      visible: true,
      value: formatCurrency(value),
      x: event.clientX,
      y: event.clientY - 30,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, value: "" });
  };

  if (loading) {
    return <div className="loading">Loading...</div>; // Loading indicator
  }

  return (
    <div className="parent-Opportunity-Value">
      <div className="card shadow-sm">
        {/* Card header - aligned with OpportunityStatusCard */}
        <div className="card-header border-bottom">
          <p className="card-title mb-0 px-2">Opportunity Value</p>
        </div>

        {/* Card body - aligned with OpportunityStatusCard */}
        <div className="card-body">
          {/* Main number with percentage change - aligned with stats-container */}
          <div className="stats-container">
            <div className="display-6">{formatCurrency(chartData.currentValue)}</div>
            <div className="stats-comparison">
              <div className="percentage-badge-container">
                <div className="percentage-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                <path d="M8 3.33334V12.6667M8 3.33334L4 7.33334M8 3.33334L12 7.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
                  <span>{chartData.percentageChange}%</span>
                </div>
              </div>
              <div className="text-muted">vs Last 31 Days</div>
            </div>
          </div>

          {/* Chart area */}
          <div className="opportunity-value-chart mt-4">
            <div
              className={`opportunity-value-chart-row opportunity-value-open-row ${hoverRow === "open" ? "hover" : ""}`}
              onMouseEnter={() => setHoverRow("open")}
              onMouseLeave={() => setHoverRow(null)}
            >
              <div className="opportunity-value-label-container">
                <span className="opportunity-value-label">Open</span>
              </div>
              <div
                className="opportunity-value-dot"
                style={{ marginLeft: getBarWidth(chartData.openValue) }}
                onMouseEnter={(e) => handleMouseEnter(chartData.openValue, e)}
                onMouseLeave={handleMouseLeave}
              ></div>
              <div className="opportunity-value-line"></div>
            </div>

            <div
              className={`opportunity-value-chart-row opportunity-value-won-row ${hoverRow === "won" ? "hover" : ""}`}
              onMouseEnter={() => setHoverRow("won")}
              onMouseLeave={() => setHoverRow(null)}
            >
              <div className="opportunity-value-label-container">
                <span className="opportunity-value-label">Won</span>
              </div>
              <div
                className="opportunity-value-bar"
                style={{ width: getBarWidth(chartData.wonValue), transition: "width 0.5s ease-in-out" }}
                onMouseEnter={(e) => handleMouseEnter(chartData.wonValue, e)}
                onMouseLeave={handleMouseLeave}
              ></div>
            </div>

            <div className="opportunity-value-grid">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="opportunity-value-grid-line"></div>
              ))}
            </div>

            <div className="opportunity-value-x-axis">
              {["$0", "$20K", "$60K", "$100K"].map((label, i) => (
                <div key={i} className="opportunity-value-x-axis-label">
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Footer - now inside card-body for consistency */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-1  flex-column">
            <div className="text-muted">Total revenue</div>
            <div className=" format-currency">{formatCurrency(chartData.currentValue)}</div>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="tooltip"
            style={{
              position: "absolute",
              top: tooltip.y,
              left: tooltip.x,
              backgroundColor: "#333",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "5px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              zIndex: 1000,
            }}
          >
            {tooltip.value}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityValueDashboard;