import React from 'react';
import { useExpenseTracker } from './hooks/useExpenseTracker';
import { TransactionsList } from './components/TransactionsList';
import { ExpenseCharts } from './components/ExpenseCharts';
import { AddIncomeModal } from './components/AddIncomeModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { ThemeToggle } from './components/ThemeToggle';
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
    addIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    editExpense
  } = useExpenseTracker();

  return (
    <div className="app">
      <div className="app-container">
        <header>
          <h1>Expense Tracker</h1>
        </header>
        
        <div className="main-dashboard">
          <div className="top-section">
            <div className="balance-card">
              <h2>Wallet Balance: <span className="balance-amount">{formatCurrency(state.walletBalance)}</span></h2>
              <button 
                className="add-btn income-btn" 
                onClick={() => setIncomeModalOpen(true)}
              >
                + Add Income
              </button>
            </div>
            
            <div className="expense-card">
              <h2>Expenses: <span className="expense-amount">{formatCurrency(state.totalExpenses)}</span></h2>
              <button 
                className="add-btn expense-btn" 
                onClick={() => setExpenseModalOpen(true)}
              >
                + Add Expense
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
          onClose={() => setIncomeModalOpen(false)} 
          onAddIncome={addIncome} 
        />
        
        <AddExpenseModal 
          isOpen={expenseModalOpen} 
          onClose={() => setExpenseModalOpen(false)} 
          onSubmit={editingExpense ? updateExpense : addExpense} 
          expenseToEdit={editingExpense}
        />
        
        <ThemeToggle />
      </div>
    </div>
  );
}

export default App;