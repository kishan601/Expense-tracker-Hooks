import React, { useEffect } from 'react';
import { useExpenseTracker } from './hooks/useExpenseTracker';
import { TransactionsList } from './components/TransactionsList';
import { ExpenseCharts } from './components/ExpenseCharts';
import { AddIncomeModal } from './components/AddIncomeModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { ThemeToggle } from './components/ThemeToggle';
import { FaWallet, FaChartPie, FaPlusCircle, FaUndo } from 'react-icons/fa';
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

  return (
    <div className="app">
      <div className="app-container">
        <header>
          <h1>Expense Tracker</h1>
        </header>
        
        <div className="main-dashboard">
          <div className="top-section">
            <div className="balance-card">
              <h2><FaWallet style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Wallet Balance</h2>
              <p className="balance-amount">{state.walletBalance}</p>
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
              <p className="expense-amount">{state.totalExpenses}</p>
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
                <div className="legend-item"><span className="legend-color food"></span>Food</div>
                <div className="legend-item"><span className="legend-color entertainment"></span>Entertainment</div>
                <div className="legend-item"><span className="legend-color travel"></span>Travel</div>
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