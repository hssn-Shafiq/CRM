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

const ConversionRateCard = ({ cardHeight }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Data for the conversion rate card
  const [chartData, setChartData] = useState({
    total: '$116.71K',
    percentChange: 1379.82,
    conversionRate: 40.71,
    wonRevenue: '$116.71K'
  });

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (chartInstance.current) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          chartInstance.current.resize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create or update chart
  const createOrUpdateChart = () => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    
    // Configuration for the chart
    const config = {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [chartData.conversionRate, 100 - chartData.conversionRate],
          backgroundColor: ['#3d9bfb', '#edf2f7'],
          borderWidth: 0,
          borderRadius: 2,
          spacing: 0,
          cutout: '80%',
          hoverOffset: 0 // Set to 0 to remove hover animation
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
            enabled: true, // Keep tooltips enabled
            callbacks: {
              label: function(context) {
                const label = context.dataIndex === 0 ? 'Conversion Rate' : 'Non-converted';
                const value = context.dataIndex === 0 ? 
                  `${chartData.conversionRate}%` : 
                  `${(100 - chartData.conversionRate).toFixed(2)}%`;
                return `${label}: ${value}`;
              }
            },
            backgroundColor: '#212529',
            titleFont: {
              size: 14
            },
            bodyFont: {
              size: 12
            },
            padding: 10,
            displayColors: false
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
        centerText: `${chartData.conversionRate}%`,
        hover: {
          mode: 'nearest' // Keep hover mode for tooltips
        },
        elements: {
          arc: {
            hoverBackgroundColor: (context) => context.dataset.backgroundColor[context.dataIndex] // Keep same color on hover
          }
        }
      }
    };
    
    // Create or update chart
    if (chartInstance.current) {
      // Update existing chart data and options
      chartInstance.current.data = config.data;
      chartInstance.current.options = config.options;
      chartInstance.current.update();
    } else {
      // Create new chart instance
      chartInstance.current = new Chart(ctx, config);
    }
  };

  // Initialize chart on component mount and update when chartData changes
  useEffect(() => {
    createOrUpdateChart();
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartData, windowWidth]); // Re-create chart on window width change
  
  // Determine chart size based on screen width
  const getChartSize = () => {
    if (windowWidth < 576) return 140;
    if (windowWidth < 768) return 160;
    if (windowWidth < 992) return 130;
    if (windowWidth < 1224) return 110;
    return 120; // Default for larger screens
  };
  
  const chartSize = getChartSize();
  
  return (
    <div className="parent-conversion-rate">
      <div 
        className="card conversion-card shadow-sm" 
        style={cardHeight ? { height: cardHeight } : {}}
      >
        {/* Card header */}
        <div className="card-header conversion-card-header border-0">
          <p className="card-title conversion-card-title mb-0">Conversion Rate</p>
        </div>

        {/* Card content */}
        <div className="card-body conversion-card-body d-flex flex-column">
          {/* Main number with percentage change */}
          <div className="stats-container mb-3">
            <div className="conversion-display-6">{chartData.total}</div>
            <div className="stats-comparison">
              <div className="percentage-badge-container">
                <div className="percentage-badge positive">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                    <path d="M8 3.33334V12.6667M8 3.33334L4 7.33334M8 3.33334L12 7.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{chartData.percentChange}%</span>
                </div>
              </div>
              <div className="conversion-text-muted">vs Last 31 Day</div>
            </div>
          </div>

          {/* Donut chart - centered with flexbox */}
          <div className="chart-container-wrapper flex-grow-1 d-flex justify-content-center align-items-center">
            <div className="chart-container" style={{ width: `${chartSize}px`, height: `${chartSize}px` }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
          
          {/* Won revenue */}
          <div className="won-revenue-container mt-3">
            <p className="won-revenue-label mb-1">Won revenue</p>
            <p className="won-revenue-amount">{chartData.wonRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionRateCard;