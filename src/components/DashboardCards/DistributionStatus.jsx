import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import "./dashboardcard.css";

// Global configuration for Chart.js animation
Chart.defaults.animation.duration = 500;
Chart.defaults.animation.easing = 'easeOutQuart';

// Register centerText plugin once outside the component
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: function(chart) {
    const width = chart.width;
    const height = chart.height;
    const ctx = chart.ctx;
    
    ctx.restore();
    
    // Responsive font size based on container width
    const fontSize = Math.min(Math.max(width / 6, 16), 24);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#212529';
    
    const displayText = chart.options.centerText || '';
    ctx.fillText(displayText, width / 2, height / 2);
    ctx.save();
  }
};
Chart.register(centerTextPlugin);

const StageDistributionCard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const contentRef = useRef(null);
  const verticalThumbRef = useRef(null);
  const horizontalThumbRef = useRef(null);
  const dropdownRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Customers and Job Value');
  
  // Data for the chart with a visibility property added
  const [chartData, setChartData] = useState({
    total: 3,
    percentChange: -25,
    segments: [
      { name: 'All Customers', value: 3, color: '#42A5F5', hidden: false, price: '$0', percentage: '100.00%' },
      { name: 'Customer from...', value: 0, color: '#36D6E7', hidden: false, price: '$0', percentage: '0.00%' },
      { name: 'Won', value: 0, color: '#8AA6FF', hidden: false, price: '$0', percentage: '0.00%' },
      { name: 'Lost/Abandoned', value: 0, color: '#B67AFF', hidden: false, price: '$0', percentage: '0.00%' }
    ]
  });

  // Calculate visible total
  const visibleTotal = chartData.segments
    .filter(segment => !segment.hidden)
    .reduce((acc, segment) => acc + segment.value, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    // Only add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Function to handle legend item clicks
  const handleLegendClick = (index) => {
    // Create a new data object with the toggled segment
    const newChartData = {
      ...chartData,
      segments: chartData.segments.map((segment, i) => 
        i === index ? { ...segment, hidden: !segment.hidden } : segment
      )
    };
    
    setChartData(newChartData);
  };

  // Handle dropdown item selection
  const handleDropdownSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
    
    // You can add additional logic here to update the chart based on the selected option
    // For example, change the data visualization based on the selected metric
  };

  // Handle vertical scroll
  const handleVerticalScroll = (direction) => {
    if (contentRef.current) {
      const scrollAmount = 100;
      if (direction === "up") {
        contentRef.current.scrollTop -= scrollAmount;
      } else {
        contentRef.current.scrollTop += scrollAmount;
      }
    }
  };

  // Handle horizontal scroll
  const handleHorizontalScroll = (direction) => {
    if (contentRef.current) {
      const scrollAmount = 150;
      if (direction === "left") {
        contentRef.current.scrollLeft -= scrollAmount;
      } else {
        contentRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update scrollbar thumbs position on scroll
  useEffect(() => {
    const contentContainer = contentRef.current;
    const verticalThumb = verticalThumbRef.current;
    const horizontalThumb = horizontalThumbRef.current;
    
    if (!contentContainer || !verticalThumb || !horizontalThumb) return;
    
    const handleScroll = () => {
      // Update vertical thumb position
      const verticalScrollRatio = contentContainer.scrollTop / (contentContainer.scrollHeight - contentContainer.clientHeight);
      const verticalTrackHeight = verticalThumb.parentElement.clientHeight;
      const verticalThumbHeight = verticalThumb.clientHeight;
      const verticalThumbTop = verticalScrollRatio * (verticalTrackHeight - verticalThumbHeight);
      verticalThumb.style.top = `${verticalThumbTop}px`;
      
      // Update horizontal thumb position
      const horizontalScrollRatio = contentContainer.scrollLeft / (contentContainer.scrollWidth - contentContainer.clientWidth);
      const horizontalTrackWidth = horizontalThumb.parentElement.clientWidth;
      const horizontalThumbWidth = horizontalThumb.clientWidth;
      const horizontalThumbLeft = horizontalScrollRatio * (horizontalTrackWidth - horizontalThumbWidth);
      horizontalThumb.style.left = `${horizontalThumbLeft}px`;
    };
    
    contentContainer.addEventListener('scroll', handleScroll);
    return () => contentContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Create or update chart
  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    
    // Calculate the visible total
    const currentVisibleTotal = chartData.segments
      .filter(segment => !segment.hidden)
      .reduce((acc, segment) => acc + segment.value, 0);
    
    // Configuration for the chart
    const config = {
      type: 'doughnut',
      data: {
        labels: chartData.segments.map(segment => segment.name),
        datasets: [{
          data: chartData.segments.map(segment => segment.hidden ? 0 : segment.value),
          backgroundColor: chartData.segments.map(segment => segment.color),
          borderWidth: 0,
          borderRadius: 0,
          spacing: 1,
          cutout: '80%',
          hoverOffset: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const totalVisible = chartData.segments
                  .filter(segment => !segment.hidden)
                  .reduce((acc, segment) => acc + segment.value, 0);
                const percentage = totalVisible === 0 ? 0 : Math.round((value / totalVisible) * 100);
                return `${label} (${percentage}%)`;
              }
            }
          }
        },
        layout: {
          padding: 0
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 800
        },
        centerText: currentVisibleTotal.toString(),
        hover: {
          mode: null
        }
      }
    };
    
    // Create or update chart
    if (chartInstance.current) {
      chartInstance.current.data = config.data;
      chartInstance.current.options = config.options;
      chartInstance.current.update();
    } else {
      chartInstance.current = new Chart(ctx, config);
    }
  }, [chartData, windowWidth]);
  
  // Define dropdown options based on component context
  const dropdownOptions = [
    { id: 'customers', label: 'Customers and Job Value' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'conversions', label: 'Conversions' },
    { id: 'stages', label: 'Stage Progression' }
  ];
  
  return (
    <div className="distribution-status-container">
      {/* Card header */}
      <div className="funnel-header-section">
        <h5 className="funnel-dashboard-title">Stage Distribution</h5>
        <div className="funnel-dropdown-container" ref={dropdownRef}>
          <button className="funnel-dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span>{selectedOption}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="funnel-dropdown-menu">
              {dropdownOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`funnel-dropdown-item ${selectedOption === option.label ? 'active' : ''}`}
                  onClick={() => handleDropdownSelect(option.label)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main container with vertical scrollbar */}
      <div className="distribution-status-content-wrapper">
        {/* Vertical Scrollbar */}
        <div className="distribution-vertical-scrollbar">
          <button className="distribution-scroll-arrow" onClick={() => handleVerticalScroll("up")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <div className="distribution-scrollbar-track">
            <div className="distribution-scrollbar-thumb" ref={verticalThumbRef}></div>
          </div>
          <button className="distribution-scroll-arrow" onClick={() => handleVerticalScroll("down")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        {/* Main content with scrollbars */}
        <div className="distribution-status-content" ref={contentRef}>
          {/* Card content */}
          <div className="distribution-status-body">
            {/* Main number with percentage change */}
            <div className="distribution-status-number-container">
              <div className="distribution-status-number">
                {visibleTotal}
              </div>
              <div className="distribution-status-change-container">
                <div className="distribution-status-change-badge">
                  <svg className="distribution-status-change-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  <span>25%</span>
                </div>
              </div>
            </div>

            {/* Chart and legend container */}
            <div className="distribution-status-chart-container">
              {/* Chart.js donut chart */}
              <div className="distribution-status-chart">
                <canvas ref={chartRef} width="170" height="170"></canvas>
              </div>

              {/* Legend */}
              <div className="distribution-status-legend">
                {chartData.segments.map((segment, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleLegendClick(index)}
                    className={`distribution-status-legend-item ${segment.hidden ? 'hidden' : ''}`}
                  >
                    <div className={`distribution-status-legend-color distribution-status-color-${index === 0 ? 'all' : index === 1 ? 'customer' : index === 2 ? 'won' : 'lost'}`}></div>
                    <div className="d-flex flex-column">
                      <div className="distribution-status-legend-name">
                        {segment.name}
                      </div>
                      <div className="distribution-status-legend-values">
                        <div>{segment.price} ({segment.percentage})</div>
                        <div>- {segment.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bottom horizontal scrollbar */}
            <div className="distribution-bottom-scroll">
              <button className="distribution-scroll-arrow" onClick={() => handleHorizontalScroll("left")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div className="distribution-horizontal-scrollbar">
                <div className="distribution-scrollbar-thumb" ref={horizontalThumbRef}></div>
              </div>
              <button className="distribution-scroll-arrow" onClick={() => handleHorizontalScroll("right")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageDistributionCard;