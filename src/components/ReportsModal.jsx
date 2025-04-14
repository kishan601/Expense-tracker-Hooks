import React from 'react';
import { FaFileAlt, FaDownload, FaChartBar, FaChartPie, FaCalendarAlt } from 'react-icons/fa';
import { chartColors } from '../utils/chartColors';
import { formatCurrency } from '../utils/formatters';

export const ReportsModal = ({ isOpen, onClose, expenses, walletBalance }) => {
  // Add debugging logs
  console.log("ReportsModal received expenses:", expenses);
  if (expenses && expenses.length > 0) {
    console.log("First expense:", expenses[0]);
  }
  
  if (!isOpen) return null;
  
  // Force calculation of amounts by directly extracting them from expenses
  // and adding them up - using 'price' instead of 'amount'
  const calculateTotalAmount = () => {
    let total = 0;
    if (expenses && expenses.length > 0) {
      for (let i = 0; i < expenses.length; i++) {
        if (expenses[i] && typeof expenses[i].price === 'number') {
          total += expenses[i].price;
        }
      }
    }
    return total;
  };
  
  // Directly calculate category totals - using 'price' instead of 'amount'
  const calculateCategoryTotals = () => {
    const result = {};
    if (expenses && expenses.length > 0) {
      for (let i = 0; i < expenses.length; i++) {
        const expense = expenses[i];
        if (expense && expense.category && typeof expense.price === 'number') {
          if (!result[expense.category]) {
            result[expense.category] = 0;
          }
          result[expense.category] += expense.price;
        }
      }
    }
    return result;
  };
  
  // Calculate and store the values
  const totalAmount = calculateTotalAmount();
  const categoryTotals = calculateCategoryTotals();
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);
  
  // Log the values to verify calculations
  console.log("Total amount calculated:", totalAmount);
  console.log("Category totals calculated:", categoryTotals);
  console.log("Sorted categories:", sortedCategories);
  
  const downloadMonthlyReport = () => {
    // Create a simple summary report
    let reportText = "Expense Report\n\n";
    reportText += `Total Expenses: ${formatCurrency(totalAmount)}\n`;
    reportText += `Total Income: ${formatCurrency(walletBalance)}\n`;
    reportText += `Balance: ${formatCurrency(walletBalance - totalAmount)}\n\n`;
    
    reportText += "Category Breakdown:\n";
    sortedCategories.forEach(([category, amount]) => {
      reportText += `${category}: ${formatCurrency(amount)}\n`;
    });
    
    reportText += "\nTransaction List:\n";
    if (expenses && expenses.length) {
      expenses.forEach((expense, index) => {
        const date = expense.date ? new Date(expense.date).toLocaleDateString() : 'Unknown date';
        reportText += `${index + 1}. ${date} - ${expense.category} - ${formatCurrency(expense.price)} - ${expense.note || 'No note'}\n`;
      });
    } else {
      reportText += "No transactions recorded.\n";
    }
    
    // Generate the download
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_report.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2><FaFileAlt style={{ marginRight: '0.5rem' }} /> Expense Reports</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            flexWrap: 'wrap' 
          }}>
            <div style={{ 
              padding: '15px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: 'var(--radius)',
              flex: '1',
              marginRight: '10px',
              minWidth: '280px',
              marginBottom: '10px' 
            }}>
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
                <FaCalendarAlt style={{ marginRight: '8px' }} /> 
                Monthly Summary
              </h3>
              <div style={{ margin: '15px 0' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '10px', 
                  alignItems: 'center' 
                }}>
                  <span>Total Expenses:</span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: 'var(--secondary-color)',
                    fontSize: '1.1rem' 
                  }}>
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '10px',
                  alignItems: 'center'  
                }}>
                  <span>Total Income:</span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: 'var(--success-color)',
                    fontSize: '1.1rem'  
                  }}>
                    {formatCurrency(walletBalance)}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'  
                }}>
                  <span>Balance:</span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: (walletBalance - totalAmount) > 0 ? 'var(--success-color)' : 'var(--secondary-color)',
                    fontSize: '1.1rem'  
                  }}>
                    {formatCurrency(walletBalance - totalAmount)}
                  </span>
                </div>
              </div>
              <button 
                onClick={downloadMonthlyReport}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '10px'
                }}
              >
                <FaDownload style={{ marginRight: '8px' }} /> Download Monthly Report
              </button>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: 'var(--radius)',
              flex: '1',
              minWidth: '280px',
              marginBottom: '10px'
            }}>
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
                <FaChartBar style={{ marginRight: '8px' }} /> 
                Category Analysis
              </h3>
              
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                marginTop: '10px',
                padding: '5px 0' 
              }}>
                {sortedCategories.length > 0 ? (
                  sortedCategories.map(([category, amount], index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: index < sortedCategories.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: chartColors[category.toLowerCase()] || '#ccc',
                          marginRight: '8px'
                        }}></div>
                        <span>{category}</span>
                      </div>
                      <span style={{ 
                        fontWeight: 'bold',
                        fontSize: '1.1rem' 
                      }}>
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px 0',
                    color: 'var(--text-light)' 
                  }}>
                    No expense data available
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '15px', 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            borderRadius: 'var(--radius)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
              <FaChartPie style={{ marginRight: '8px' }} /> 
              Expense Insights
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', margin: '15px 0' }}>
              {/* Insight Cards - Use expense.price instead of expense.amount */}
              <div style={{ 
                flex: '1 0 calc(33% - 15px)', 
                padding: '12px', 
                borderRadius: 'var(--radius)', 
                backgroundColor: 'rgba(255,255,255,0.05)',
                minWidth: '170px'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '5px' }}>
                  Highest Expense
                </div>
                {expenses && expenses.length > 0 ? (
                  <div style={{ fontWeight: 'bold' }}>
                    {formatCurrency(Math.max(...expenses.map(e => e && typeof e.price === 'number' ? e.price : 0)))}
                  </div>
                ) : (
                  <div>No expenses</div>
                )}
              </div>
              
              <div style={{ 
                flex: '1 0 calc(33% - 15px)', 
                padding: '12px', 
                borderRadius: 'var(--radius)', 
                backgroundColor: 'rgba(255,255,255,0.05)',
                minWidth: '170px'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '5px' }}>
                  Average Expense
                </div>
                {expenses && expenses.length > 0 ? (
                  <div style={{ fontWeight: 'bold' }}>
                    {formatCurrency(totalAmount / expenses.length)}
                  </div>
                ) : (
                  <div>No expenses</div>
                )}
              </div>
              
              <div style={{ 
                flex: '1 0 calc(33% - 15px)', 
                padding: '12px', 
                borderRadius: 'var(--radius)', 
                backgroundColor: 'rgba(255,255,255,0.05)',
                minWidth: '170px'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '5px' }}>
                  Total Transactions
                </div>
                <div style={{ fontWeight: 'bold' }}>
                  {expenses ? expenses.length : 0}
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <button 
              onClick={onClose}
              className="btn-secondary" 
              style={{ width: '180px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};