import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto'; // This automatically registers all controllers
import { CHART_COLORS, CATEGORIES } from '../utils/chartColors';

function PieChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Only create chart if there's data and the ref is available
    if (chartRef.current && Object.values(data).some(value => value > 0)) {
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: CATEGORIES,
          datasets: [{
            data: Object.values(data),
            backgroundColor: Object.values(CHART_COLORS),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    // Cleanup chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!Object.values(data).some(value => value > 0)) {
    return (
      <div style={{ 
        width: '150px', 
        height: '150px', 
        borderRadius: '50%', 
        background: '#6b21a8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px'
      }}>
        No data
      </div>
    );
  }

  return (
    <div style={{ width: '150px', height: '150px' }}>
      <canvas ref={chartRef} />
    </div>
  );
}

function BarChart({ data, maxAmount }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Only create chart if there's data and the ref is available
    if (chartRef.current && Object.values(data).some(value => value > 0)) {
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: CATEGORIES,
          datasets: [{
            label: 'Expense Amount',
            data: Object.values(data),
            backgroundColor: Object.values(CHART_COLORS),
            borderWidth: 0,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    // Cleanup chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, maxAmount]);

  if (!Object.values(data).some(value => value > 0)) {
    return (
      <div style={{ 
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#777'
      }}>
        No data to display
      </div>
    );
  }

  return (
    <div style={{ height: '200px' }}>
      <canvas ref={chartRef} />
    </div>
  );
}

export const ExpenseCharts = {
  PieChart,
  BarChart
};