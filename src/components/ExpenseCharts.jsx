import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { chartColors } from '../utils/chartColors';

export const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const createPieChart = (isDarkMode) => {
    if (chartRef && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Process the data to ensure we're using the correct colors
      const processedData = {
        labels: [],
        values: [],
        colors: []
      };
      
      // Only include categories with values > 0
      Object.entries(data).forEach(([category, value]) => {
        if (value > 0) {
          processedData.labels.push(category);
          processedData.values.push(value);
          processedData.colors.push(chartColors[category.toLowerCase()]);
        }
      });
      
      // If no data, add placeholder
      if (processedData.labels.length === 0) {
        processedData.labels = ['No data'];
        processedData.values = [1];
        processedData.colors = ['#e2e8f0'];
      }
      
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: processedData.labels,
          datasets: [{
            data: processedData.values,
            backgroundColor: processedData.colors,
            borderColor: 'var(--card-bg)',
            borderWidth: 2,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              },
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              titleColor: isDarkMode ? '#f1f5f9' : '#1e293b',
              bodyColor: isDarkMode ? '#f1f5f9' : '#1e293b',
              borderColor: isDarkMode ? '#334155' : '#e2e8f0',
              borderWidth: 1
            },
            legend: {
              display: false // Hide default legend since we have a custom one
            }
          }
        }
      });
    }
  };

  // Initial render
  useEffect(() => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    createPieChart(isDarkMode);
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const isDarkMode = document.body.classList.contains('dark-mode');
      createPieChart(isDarkMode);
    };
    
    // Listen for the theme change event
    document.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export const BarChart = ({ data, maxAmount }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const createBarChart = (isDarkMode) => {
    if (chartRef && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Process the data to ensure we're using the correct colors
      const processedData = {
        labels: [],
        values: [],
        colors: []
      };
      
      // Sort categories by value (highest first) and filter out zeros
      const sortedEntries = Object.entries(data)
        .filter(([_, value]) => value > 0)
        .sort(([_, a], [__, b]) => b - a);
      
      sortedEntries.forEach(([category, value]) => {
        processedData.labels.push(category);
        processedData.values.push(value);
        processedData.colors.push(chartColors[category.toLowerCase()]);
      });
      
      // If no data, show placeholder
      if (processedData.labels.length === 0) {
        processedData.labels = ['No data'];
        processedData.values = [0];
        processedData.colors = ['#e2e8f0'];
      }
      
      const max = maxAmount || Math.max(...processedData.values, 1000) * 1.1;
      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: processedData.labels,
          datasets: [{
            data: processedData.values,
            backgroundColor: processedData.colors,
            borderColor: processedData.colors,
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 15,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.raw}`;
                }
              },
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              titleColor: isDarkMode ? '#f1f5f9' : '#1e293b',
              bodyColor: isDarkMode ? '#f1f5f9' : '#1e293b',
              borderColor: isDarkMode ? '#334155' : '#e2e8f0',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: max,
              grid: {
                display: true, // Show grid lines
                color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)', // More visible in dark mode
                lineWidth: isDarkMode ? 0.5 : 0.5, // Slightly thicker in dark mode
                borderDash: isDarkMode ? [] : [], // Solid line in dark mode
                drawBorder: true,
                drawOnChartArea: true,
                drawTicks: true,
              },
              border: {
                display: true,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)', // More visible border
              },
              ticks: {
                color: isDarkMode ? '#ffffff' : 'var(--text-light)',
                font: {
                  size: 10
                }
              }
            },
            y: {
              grid: {
                display: true, // Show grid lines
                color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)', // More visible in dark mode
                lineWidth: isDarkMode ? 0.5 : 0.5, // Slightly thicker in dark mode
                borderDash: isDarkMode ? [] : [], // Solid line in dark mode
                drawBorder: true,
                drawOnChartArea: true,
                drawTicks: true,
              },
              border: {
                display: true,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.1)', // More visible border
              },
              ticks: {
                color: isDarkMode ? '#ffffff' : 'var(--text-secondary)',
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }
  };

  // Initial render
  useEffect(() => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    createBarChart(isDarkMode);
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, maxAmount]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const isDarkMode = document.body.classList.contains('dark-mode');
      createBarChart(isDarkMode);
    };
    
    // Listen for the theme change event
    document.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, maxAmount]);

  return (
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

// Export as an object to match how it's used in App.js
export const ExpenseCharts = {
  PieChart,
  BarChart
};