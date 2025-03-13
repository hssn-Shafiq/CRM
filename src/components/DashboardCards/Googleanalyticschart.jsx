import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboardcard.css';

Chart.register(...registerables);

const GoogleAnalyticsChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Sample data matching the image
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const visitors = [300, 400, 200, 1700, 800, 1800, 1100, 2000, 5200, 12000, 1500, 2400];

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            data: visitors,
            borderColor: '#60bdf3',
            backgroundColor: 'rgba(96, 189, 243, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#60bdf3',
            pointBorderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#333',
            bodyColor: '#333',
            borderColor: '#ddd',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function(context) {
                return context.parsed.y.toLocaleString();
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              drawBorder: false,
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              color: '#808080',
              font: {
                size: 12,
              },
            },
          },
          y: {
            grid: {
              display: true,
              drawBorder: false,
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              color: '#808080',
              font: {
                size: 12,
              },
              callback: function(value) {
                if (value === 0) return '0';
                if (value >= 1000) return value/1000 + 'K';
                return value;
              },
              stepSize: 2000,
            },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="ga-report-container">
      <div className="ga-report-card">
        <div className="ga-report-header">
          <h2 className="ga-report-title">Google Analytics Report</h2>
          <p className="ga-report-subtitle">(Last 12 months)</p>
        </div>
        <div className="ga-chart-container">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsChart;