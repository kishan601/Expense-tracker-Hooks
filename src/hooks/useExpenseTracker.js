import { useState, useEffect } from 'react';

const DEFAULT_WALLET_BALANCE = 5000;

export const useExpenseTracker = () => {
  const [state, setState] = useState({
    walletBalance: DEFAULT_WALLET_BALANCE,
    expenses: [],
    totalExpenses: 0,
    chartData: { food: 0, entertainment: 0, travel: 0 },
    maxCategoryAmount: 0,
  });

  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedWallet = localStorage.getItem('wallet');

    const expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
    const walletBalance = savedWallet ? parseFloat(savedWallet) : DEFAULT_WALLET_BALANCE;

    updateState(expenses, walletBalance);
  }, []);

  // Recalculate derived state whenever expenses or wallet changes
  const updateState = (expenses, walletBalance) => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.price, 0);
    
    // Calculate category totals
    const chartData = { food: 0, entertainment: 0, travel: 0 };
    
    expenses.forEach(expense => {
      const category = expense.category.toLowerCase();
      if (category in chartData) {
        chartData[category] += expense.price;
      }
    });
    
    // Find max category amount for bar chart scaling
    const maxCategoryAmount = Math.max(...Object.values(chartData));
    
    setState({
      walletBalance,
      expenses,
      totalExpenses,
      chartData,
      maxCategoryAmount
    });
  };

  // Save current state to localStorage
  const saveState = (expenses, walletBalance) => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('wallet', walletBalance.toString());
    updateState(expenses, walletBalance);
  };

  // Add income to wallet
  const addIncome = (amount) => {
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid income amount.');
      return false;
    }
    
    const newBalance = state.walletBalance + amount;
    saveState(state.expenses, newBalance);
    setIncomeModalOpen(false);
    return true;
  };

  // Add a new expense
  const addExpense = (expense) => {
    const { title, price, category, date } = expense;
    
    if (!title || isNaN(price) || price <= 0 || !category || !date) {
      alert('Please fill all fields with valid values.');
      return false;
    }
    
    if (state.walletBalance < price) {
      alert('Not enough wallet balance.');
      return false;
    }
    
    const newExpense = {
      id: Date.now().toString(),
      title,
      price,
      category,
      date
    };
    
    const newExpenses = [...state.expenses, newExpense];
    const newBalance = state.walletBalance - price;
    
    saveState(newExpenses, newBalance);
    setExpenseModalOpen(false);
    return true;
  };

  // Update an existing expense
  const updateExpense = (updatedExpense) => {
    if (!editingExpense) return false;
    
    const originalPrice = editingExpense.price;
    const priceDifference = originalPrice - updatedExpense.price;
    
    if (priceDifference < 0 && Math.abs(priceDifference) > state.walletBalance) {
      alert('Not enough wallet balance for this update.');
      return false;
    }
    
    const newExpenses = state.expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    
    const newBalance = state.walletBalance + priceDifference;
    
    saveState(newExpenses, newBalance);
    setEditingExpense(null);
    setExpenseModalOpen(false);
    return true;
  };

  // Delete an expense
  const deleteExpense = (id) => {
    const expenseToDelete = state.expenses.find(e => e.id === id);
    if (!expenseToDelete) return false;
    
    const newExpenses = state.expenses.filter(e => e.id !== id);
    const newBalance = state.walletBalance + expenseToDelete.price;
    
    saveState(newExpenses, newBalance);
    return true;
  };

  // Open the edit expense modal with the selected expense
  const editExpense = (id) => {
    const expense = state.expenses.find(e => e.id === id);
    if (expense) {
      setEditingExpense(expense);
      setExpenseModalOpen(true);
      return true;
    }
    return false;
  };

  return {
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
  };
};