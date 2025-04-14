import React, { useEffect, useState } from 'react';
import { useExpenseTracker } from './hooks/useExpenseTracker';
import { TransactionsList } from './components/TransactionsList';
import { ExpenseCharts } from './components/ExpenseCharts';
import { AddIncomeModal } from './components/AddIncomeModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { ThemeToggle } from './components/ThemeToggle';
import { 
  FaWallet, 
  FaChartPie, 
  FaPlusCircle, 
  FaUndo, 
  FaArrowUp, 
  FaArrowDown,
  FaCalendarAlt,
  FaFire,
  FaChartLine,
  FaHistory,
  FaChartBar,
  FaClock,
  FaCheckCircle,
  FaBullseye,
  FaCoins,
  FaPiggyBank,
  FaCreditCard
} from 'react-icons/fa';
import { chartColors } from './utils/chartColors';
import { formatCurrency } from './utils/formatters';
import './App.css';

function App() {
  const {
    state,
    incomeModalOpen,
    expenseModalOpen,
    editingExpense,
    setIncomeModalOpen,
    setExpenseModalOpen,
    setEditingExpense,
    addIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    editExpense,
    resetWalletBalance
  } = useExpenseTracker();
  
  // Date/time state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Update date/time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format date/time
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(currentDate);
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(currentDate);

  // Add method for Cypress tests to reset state
  useEffect(() => {
    if (window.Cypress) {
      window.resetApp = () => {
        localStorage.removeItem('expenses');
        localStorage.removeItem('walletBalance');
        window.location.reload();
      };
    }
  }, []);

  // Combined handler for expense submission
  const handleExpenseSubmit = (expenseData) => {
    if (expenseData.id) {
      return updateExpense(expenseData);
    } else {
      return addExpense(expenseData);
    }
  };

  // Handler to close income modal
  const handleCloseIncomeModal = () => {
    setIncomeModalOpen(false);
  };

  // Handler to close expense modal and clear editing state
  const handleCloseExpenseModal = () => {
    setExpenseModalOpen(false);
    if (editingExpense) {
      setEditingExpense(null);
    }
  };

  // Calculate wallet percentage for progress bar
  const walletPercentage = Math.min((state.walletBalance / 10000) * 100, 100);
  const expensePercentage = Math.min((state.totalExpenses / 10000) * 100, 100);

  // Sample trend data (we're basing this on actual wallet balance)
  // In a real app, you'd use historical data from your state
  const getRandomTrendPoints = (baseValue, count) => {
    const points = [];
    let value = baseValue;
    for (let i = 0; i < count; i++) {
      // Small random variation
      value = value + (Math.random() * 20 - 10);
      points.push(Math.max(0, Math.min(100, value)));
    }
    return points;
  };

  const walletTrend = getRandomTrendPoints(walletPercentage / 2, 10);
  const expenseTrend = getRandomTrendPoints(expensePercentage / 2, 10);
  
  // Calculate stats
  const availableToSpend = state.walletBalance - state.totalExpenses;
  const spentPercentage = state.walletBalance > 0 
    ? Math.round((state.totalExpenses / (state.walletBalance + state.totalExpenses)) * 100) 
    : 0;
    
  // Get savings goal data
  const savingsGoal = 15000;
  const savingsProgress = Math.min((state.walletBalance / savingsGoal) * 100, 100);
  
  // Get recent activity
  const latestExpense = state.expenses.length > 0 ? state.expenses[0] : null;
  
  // Calculate last expense time
  const getLastExpenseTime = () => {
    if (!latestExpense) return "No expenses yet";
    
    const now = new Date();
    const expenseDate = new Date(latestExpense.date);
    const diffMs = now - expenseDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="app">
      <div className="app-container">
        <header>
          <h1>Expense Tracker</h1>
          
          {/* Date/Time Display */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginTop: '0.5rem'
            }}
          >
            <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
        </header>
        
        <div className="main-dashboard">
          <div className="top-section">
            <div className="balance-card">
              <h2><FaWallet style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Wallet Balance</h2>
              <p className="balance-amount">{formatCurrency(state.walletBalance)}</p>
              
              {/* Progress indicator for wallet */}
              <div className="progress-indicator" style={{ 
                height: '4px', 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '2px', 
                marginTop: '15px',
                marginBottom: '10px'
              }}>
                <div style={{ 
                  width: `${walletPercentage}%`, 
                  height: '100%', 
                  background: 'var(--success-color)', 
                  borderRadius: '2px' 
                }}></div>
              </div>
              
              {/* Mini trend chart for wallet */}
              <div style={{ 
                marginTop: '15px', 
                height: '30px',
                display: 'flex',
                alignItems: 'flex-end'
              }}>
                {walletTrend.map((height, i) => (
                  <div key={i} style={{
                    height: `${height}%`,
                    width: '8px',
                    marginRight: '3px',
                    backgroundColor: 'var(--success-color)',
                    borderTopLeftRadius: '2px',
                    borderTopRightRadius: '2px',
                    opacity: 0.7 + (i/30)
                  }}></div>
                ))}
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--text-light)', 
                  marginLeft: '5px',
                  alignSelf: 'center',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FaArrowUp style={{ color: 'var(--success-color)', marginRight: '2px' }} />
                  12%
                </div>
              </div>
              
              {/* Quick wallet stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '15px',
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius)',
                fontSize: '0.8rem'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Available</div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: availableToSpend > 0 ? 'var(--success-color)' : 'var(--secondary-color)' 
                  }}>
                    {formatCurrency(availableToSpend)}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Spent</div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold', 
                    color: 'var(--text-light)' 
                  }}>
                    <FaFire style={{ 
                      marginRight: '3px', 
                      color: spentPercentage > 75 ? 'var(--secondary-color)' : 'var(--warning-color)'
                    }} />
                    {spentPercentage}%
                  </div>
                </div>
              </div>
              
              {/* Savings Goal Card */}
              <div style={{
                marginTop: '15px',
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius)',
                fontSize: '0.8rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <FaPiggyBank style={{ 
                      marginRight: '5px',
                      color: 'var(--primary-color)'
                    }} />
                    <span style={{ color: 'var(--text-light)' }}>Savings Goal</span>
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>
                    {formatCurrency(savingsGoal)}
                  </div>
                </div>
                
                <div className="progress-indicator" style={{ 
                  height: '6px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '3px', 
                  marginBottom: '5px'
                }}>
                  <div style={{ 
                    width: `${savingsProgress}%`, 
                    height: '100%', 
                    background: 'var(--primary-color)', 
                    borderRadius: '3px' 
                  }}></div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-light)'
                }}>
                  <div>{Math.round(savingsProgress)}% completed</div>
                  <div>{formatCurrency(state.walletBalance)} / {formatCurrency(savingsGoal)}</div>
                </div>
              </div>
              
              <div className="button-group">
                <button 
                  className="add-btn income-btn" 
                  onClick={() => setIncomeModalOpen(true)}
                >
                  <FaPlusCircle style={{ marginRight: '0.5rem' }} /> Add Income
                </button>
                <button 
                  className="reset-btn" 
                  onClick={resetWalletBalance}
                  title="Reset balance to default"
                >
                  <FaUndo />
                </button>
              </div>
            </div>
            
            <div className="expense-card">
              <h2><FaChartPie style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Expenses</h2>
              <p className="expense-amount">{formatCurrency(state.totalExpenses)}</p>
              
              {/* Progress indicator for expenses */}
              <div className="progress-indicator" style={{ 
                height: '4px', 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '2px', 
                marginTop: '15px',
                marginBottom: '10px'
              }}>
                <div style={{ 
                  width: `${expensePercentage}%`, 
                  height: '100%', 
                  background: 'var(--secondary-color)', 
                  borderRadius: '2px' 
                }}></div>
              </div>
              
              {/* Mini trend chart for expenses */}
              <div style={{ 
                marginTop: '15px', 
                height: '30px',
                display: 'flex',
                alignItems: 'flex-end'
              }}>
                {expenseTrend.map((height, i) => (
                  <div key={i} style={{
                    height: `${height}%`,
                    width: '8px',
                    marginRight: '3px',
                    backgroundColor: 'var(--secondary-color)',
                    borderTopLeftRadius: '2px',
                    borderTopRightRadius: '2px',
                    opacity: 0.7 + (i/30)
                  }}></div>
                ))}
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--text-light)', 
                  marginLeft: '5px',
                  alignSelf: 'center',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FaArrowDown style={{ color: 'var(--secondary-color)', marginRight: '2px' }} />
                  8%
                </div>
              </div>
              
              {/* Quick expense stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '15px',
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius)',
                fontSize: '0.8rem'
              }}>
                {/* Get highest expense category */}
                {(() => {
                  const entries = Object.entries(state.chartData);
                  if (entries.length === 0 || entries.every(([_, val]) => val === 0)) {
                    return (
                      <>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <div style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Top Category</div>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>None</div>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <div style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Avg. Expense</div>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>{formatCurrency(0)}</div>
                        </div>
                      </>
                    );
                  }
                  
                  const sortedEntries = [...entries].sort((a, b) => b[1] - a[1]);
                  const [topCategory] = sortedEntries[0];
                  const avgExpense = state.expenses.length > 0 
                    ? state.totalExpenses / state.expenses.length 
                    : 0;
                    
                  return (
                    <>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <div style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Top Category</div>
                        <div style={{ 
                          fontWeight: 'bold', 
                          color: chartColors[topCategory.toLowerCase()] || 'var(--text-light)',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <FaChartLine style={{ marginRight: '3px' }} />
                          {topCategory}
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <div style={{ color: 'var(--text-light)', marginBottom: '5px' }}>Avg. Expense</div>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>
                          {formatCurrency(avgExpense)}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              {/* Last Expense Activity */}
              <div style={{
                marginTop: '15px',
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius)',
                fontSize: '0.8rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <FaHistory style={{ 
                    marginRight: '5px',
                    color: 'var(--secondary-color)'
                  }} />
                  <span style={{ color: 'var(--text-light)' }}>Last Expense</span>
                </div>
                
                {latestExpense ? (
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px',
                      alignItems: 'center'
                    }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center' 
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: chartColors[latestExpense.category.toLowerCase()] || 'var(--text-light)',
                          marginRight: '5px'
                        }}></div>
                        {latestExpense.category}
                      </div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: 'var(--secondary-color)'
                      }}>
                        {formatCurrency(latestExpense.amount)}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: 'var(--text-light)'
                    }}>
                      <div>{latestExpense.note}</div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaClock style={{ marginRight: '3px', fontSize: '0.7rem' }} />
                        {getLastExpenseTime()}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'var(--text-light)', textAlign: 'center' }}>
                    No expenses recorded yet
                  </div>
                )}
              </div>
              
              <button 
                className="add-btn expense-btn" 
                onClick={() => setExpenseModalOpen(true)}
              >
                <FaPlusCircle style={{ marginRight: '0.5rem' }} /> Add Expense
              </button>
            </div>
            
            <div className="pie-chart-container">
              <ExpenseCharts.PieChart data={state.chartData} />
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: chartColors.food }}></span>Food
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: chartColors.entertainment }}></span>Entertainment
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: chartColors.travel }}></span>Travel
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: chartColors.study }}></span>Study
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: chartColors.utensils }}></span>Utensils
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: chartColors.electronics }}></span>Electronics
                </div>
              </div>
              
              {/* Budget Status */}
              <div style={{
                marginTop: '15px',
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius)',
                fontSize: '0.85rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <FaBullseye style={{ 
                      color: 'var(--primary-color)', 
                      marginRight: '5px'
                    }} />
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: 'var(--text-light)'
                    }}>
                      Monthly Budget
                    </span>
                  </div>
                  <div style={{ 
                    color: state.totalExpenses < 8000 ? 'var(--success-color)' : 'var(--secondary-color)', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {state.totalExpenses < 8000 ? (
                      <FaCheckCircle style={{ marginRight: '5px' }} />
                    ) : (
                      <FaFire style={{ marginRight: '5px' }} />
                    )}
                    {formatCurrency(state.totalExpenses)} / {formatCurrency(8000)}
                  </div>
                </div>
                
                <div className="progress-indicator" style={{ 
                  height: '6px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '3px', 
                  marginBottom: '8px'
                }}>
                  <div style={{ 
                    width: `${Math.min((state.totalExpenses / 8000) * 100, 100)}%`, 
                    height: '100%', 
                    background: state.totalExpenses < 8000 ? 'var(--success-color)' : 'var(--secondary-color)', 
                    borderRadius: '3px' 
                  }}></div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-light)'
                }}>
                  <div>
                    {state.totalExpenses < 8000 ? (
                      <span>You're under budget. Good job!</span>
                    ) : (
                      <span>You've exceeded your monthly budget.</span>
                    )}
                  </div>
                  <div>
                    {formatCurrency(Math.max(0, 8000 - state.totalExpenses))} remaining
                  </div>
                </div>
              </div>
              
              {/* Financial Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px',
                justifyContent: 'center'
              }}>
                <button style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  border: 'none', 
                  borderRadius: 'var(--radius)', 
                  padding: '8px 12px',
                  color: 'var(--text-light)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FaChartBar style={{ marginRight: '5px' }} />
                  Reports
                </button>
                <button style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  border: 'none', 
                  borderRadius: 'var(--radius)', 
                  padding: '8px 12px',
                  color: 'var(--text-light)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FaCoins style={{ marginRight: '5px' }} />
                  Budgets
                </button>
                <button style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  border: 'none', 
                  borderRadius: 'var(--radius)', 
                  padding: '8px 12px',
                  color: 'var(--text-light)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FaCreditCard style={{ marginRight: '5px' }} />
                  Bills
                </button>
              </div>
            </div>
          </div>
          
          <div className="bottom-section">
            <div className="transactions-section">
              <h2>Recent Transactions</h2>
              <TransactionsList 
                expenses={state.expenses} 
                onEditExpense={editExpense} 
                onDeleteExpense={deleteExpense} 
              />
            </div>
            
            <div className="top-expenses-section">
              <h2>Top Expenses</h2>
              <ExpenseCharts.BarChart data={state.chartData} maxAmount={state.maxCategoryAmount} />
            </div>
          </div>
        </div>
        
        <AddIncomeModal 
          isOpen={incomeModalOpen} 
          onClose={handleCloseIncomeModal} 
          onAddIncome={addIncome} 
        />
        
        <AddExpenseModal 
          isOpen={expenseModalOpen} 
          onClose={handleCloseExpenseModal} 
          onSubmit={handleExpenseSubmit} 
          expenseToEdit={editingExpense}
        />
        
        <ThemeToggle />
      </div>
    </div>
  );
}

export default App;