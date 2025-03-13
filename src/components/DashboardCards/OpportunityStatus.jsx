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

const OpportunityStatusCard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Data for the chart with a visibility property added
  const [chartData, setChartData] = useState({
    total: 113,
    percentChange: 145.65,
    segments: [
      { name: 'Won', value: 46, color: '#3DA5F5', hidden: false },
      { name: 'Abandoned', value: 36, color: '#36D6E7', hidden: false },
      { name: 'Open', value: 31, color: '#8AA6FF', hidden: false }
    ]
  });

  // Calculate visible total
  const visibleTotal = chartData.segments
    .filter(segment => !segment.hidden)
    .reduce((acc, segment) => acc + segment.value, 0);

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

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create or update chart
  const createOrUpdateChart = () => {
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
        labels: chartData.segments.map(segment => `${segment.name} - ${segment.value}`),
        datasets: [{
          data: chartData.segments.map(segment => segment.hidden ? 0 : segment.value),
          backgroundColor: chartData.segments.map(segment => segment.color),
          borderWidth: 0,
          borderRadius: 2,
          spacing: 2,
          cutout: '80%',
          hoverOffset: 0 // Removed hover animation by setting to 0
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
          mode: null // Disable hover mode
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
  
  // Determine layout based on screen size
  const isSmallScreen = windowWidth < 576;
  const isMediumScreen = windowWidth >= 576 && windowWidth < 768;
  
  // Dynamic chart size based on screen width
  const getChartSize = () => {
    if (isSmallScreen) return 120;
    if (isMediumScreen) return 140;
    return 150;
  };
  
  const chartSize = getChartSize();
  
  return (
    <div className='parent-Opportunity-Status'>
      <div className="card status-card shadow-sm">
        {/* Card header */}
        <div className="card-header status-card-card-header border-bottom">
          <p className="card-title status-card-card-title  mb-0 px-2">Opportunity Status</p>
        </div>

        {/* Card content */}
        <div className="card-body status-card-body">
          {/* Main number with percentage change */}
          <div className="stats-container">
            <div className="display-6 status-card-display-6">{visibleTotal}</div>
            <div className="stats-comparison">
              <div className="percentage-badge-container">
                <div className="percentage-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                <path d="M8 3.33334V12.6667M8 3.33334L4 7.33334M8 3.33334L12 7.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
                  <span>{chartData.percentChange}%</span>
                </div>
              </div>
              <div className="text-muted status-card-text-muted">vs Last 31 Days</div>
            </div>
          </div>

          {/* Donut chart with legend */}
          <div className={`chart-legend-container ${isSmallScreen ? 'mobile-view' : ''}`}>
            {/* Chart.js donut chart */}
            <div className="chart-container" style={{ width: `${chartSize}px`, height: `${chartSize}px` }}>
              <canvas ref={chartRef} width={chartSize} height={chartSize}></canvas>
            </div>

            {/* Custom legend with click events */}
            <div className="legend-container my-5">
              {chartData.segments.map((segment, index) => (
                <div 
                  key={index} 
                  className="legend-item" 
                  onClick={() => handleLegendClick(index)}
                  style={{ 
                    cursor: 'pointer',
                    opacity: segment.hidden ? 0.5 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <div 
                    className="legend-color" 
                    style={{ 
                      backgroundColor: segment.color, 
                      transition: 'all 0.3s ease',
                      transform: segment.hidden ? 'scale(0.9)' : 'scale(1)'
                    }}
                  ></div>
                  <div className="legend-text" style={{ 
                    color: segment.hidden ? '#9da6b2' : '#495057', 
                    transition: 'color 0.3s ease'
                  }}>
                    {isSmallScreen ? segment.name : `${segment.name} - ${segment.value}`}
                  </div>
                </div>
              ))}
              {isSmallScreen && (
                <div className="mobile-values">
                  {chartData.segments.map((segment, index) => (
                    <div key={`value-${index}`} className="mobile-value" style={{ 
                      color: segment.hidden ? '#9da6b2' : '#495057'
                    }}>
                      {segment.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityStatusCard;