import React from 'react';
import { Dashboard } from './components/Dashboard';
import { AddIncomeModal } from './components/AddIncomeModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { useExpenseTracker } from './hooks/useExpenseTracker';
import { ThemeToggle } from './components/ThemeToggle';
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
    editExpense
  } = useExpenseTracker();

  const handleAddIncome = (amount) => {
    try {
      addIncome(amount);
      alert(`Added $${amount} to your wallet.`);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddExpense = (expenseData) => {
    try {
      addExpense(expenseData);
      alert("Expense added successfully.");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdateExpense = (expenseData) => {
    try {
      updateExpense(expenseData);
      alert("Expense updated successfully.");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteExpense = (id) => {
    deleteExpense(id);
    alert("Expense deleted successfully.");
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <ThemeToggle />
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Expense Tracker</h1>
      
      <Dashboard 
        walletBalance={state.walletBalance}
        totalExpenses={state.totalExpenses}
        expenses={state.expenses}
        chartData={state.chartData}
        maxCategoryAmount={state.maxCategoryAmount}
        onAddIncome={() => setIncomeModalOpen(true)}
        onAddExpense={() => {
          setEditingExpense(null);
          setExpenseModalOpen(true);
        }}
        onEditExpense={editExpense}
        onDeleteExpense={handleDeleteExpense}
      />
      
      <AddIncomeModal 
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onAddIncome={handleAddIncome}
      />
      
      <AddExpenseModal 
        isOpen={expenseModalOpen}
        onClose={() => {
          setExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
        expenseToEdit={editingExpense}
      />
    </div>
  );
}

export default App;