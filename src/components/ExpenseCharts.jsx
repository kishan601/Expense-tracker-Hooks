import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { chartColors } from '../utils/chartColors';

export const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const isDarkMode = document.body.classList.contains('dark-mode');
      
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
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (chartRef && chartRef.current) {
        // Force chart redraw when theme changes
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        
        // Re-render the chart with the same data
        const ctx = chartRef.current.getContext('2d');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Process the data again (same as in the first useEffect)
        const processedData = {
          labels: [],
          values: [],
          colors: []
        };
        
        Object.entries(data).forEach(([category, value]) => {
          if (value > 0) {
            processedData.labels.push(category);
            processedData.values.push(value);
            processedData.colors.push(chartColors[category.toLowerCase()]);
          }
        });
        
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
                display: false
              }
            }
          }
        });
      }
    };
    
    // Listen for the theme change event
    document.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
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

  const renderChart = () => {
    if (chartRef && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Check if dark mode is active
      const isDarkMode = document.body.classList.contains('dark-mode');
      
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
                display: false,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: isDarkMode ? '#f1f5f9' : 'var(--text-light)', // Light color in dark mode
                font: {
                  size: 10
                }
              }
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                color: isDarkMode ? '#f1f5f9' : 'var(--text-secondary)', // Light color in dark mode
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
    renderChart();
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, maxAmount]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      renderChart();
    };
    
    // Listen for the theme change event
    document.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
  }, [data, maxAmount]);

  return (
    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export const ExpenseCharts = {
  PieChart,
  BarChart
};