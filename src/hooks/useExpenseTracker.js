import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Make sure to npm install uuid if not installed

export const useExpenseTracker = () => {
  const [state, setState] = useState({
    walletBalance: 5000, // Default starting balance
    expenses: [],
    totalExpenses: 0,
    chartData: { food: 0, entertainment: 0, travel: 0 },
    maxCategoryAmount: 0
  });
  
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Load data from localStorage on initial load
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBalance = localStorage.getItem('walletBalance');
    
    if (savedExpenses) {
      try {
        const expenses = JSON.parse(savedExpenses);
        if (Array.isArray(expenses)) {
          const chartData = calculateChartData(expenses);
          const totalExpenses = calculateTotalExpenses(expenses);
          const maxAmount = calculateMaxCategoryAmount(chartData);
          
          setState(prev => ({
            ...prev,
            expenses,
            totalExpenses,
            chartData,
            maxCategoryAmount: maxAmount,
            walletBalance: savedBalance ? parseFloat(savedBalance) : 5000, // Ensure we fall back to 5000
          }));
        }
      } catch (e) {
        console.error("Error parsing saved expenses:", e);
        // If there's an error, reset to defaults
        localStorage.removeItem('expenses');
        localStorage.removeItem('walletBalance');
      }
    }
  }, []);
  
  // Save to localStorage whenever expenses or balance changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(state.expenses));
    localStorage.setItem('walletBalance', state.walletBalance.toString());
  }, [state.expenses, state.walletBalance]);
  
  const calculateChartData = (expenses) => {
    const chartData = { food: 0, entertainment: 0, travel: 0 };
    
    expenses.forEach(expense => {
      const category = expense.category.toLowerCase();
      if (chartData[category] !== undefined) {
        chartData[category] += expense.price;
      }
    });
    
    return chartData;
  };
  
  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.price, 0);
  };
  
  const calculateMaxCategoryAmount = (chartData) => {
    return Math.max(...Object.values(chartData), 1000); // Minimum of 1000 for visualization
  };
  
  const addIncome = (amount) => {
    // Ensure amount is a number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return false;
    }
    
    setState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + numAmount
    }));
    
    setIncomeModalOpen(false); // Close the modal after successful addition
    return true;
  };
  
  const addExpense = (expenseData) => {
    const expense = {
      ...expenseData,
      id: expenseData.id || uuidv4()  // Generate unique ID if not provided
    };
    
    // Check if we have enough balance
    if (state.walletBalance < expense.price) {
      return false; // Not enough balance
    }
    
    const updatedExpenses = [expense, ...state.expenses];
    const chartData = calculateChartData(updatedExpenses);
    const totalExpenses = calculateTotalExpenses(updatedExpenses);
    const maxAmount = calculateMaxCategoryAmount(chartData);
    
    setState(prev => ({
      ...prev,
      expenses: updatedExpenses,
      totalExpenses,
      chartData,
      maxCategoryAmount: maxAmount,
      walletBalance: prev.walletBalance - expense.price
    }));
    
    return true;
  };
  
  const updateExpense = (updatedExpense) => {
    const existingExpense = state.expenses.find(exp => exp.id === updatedExpense.id);
    
    if (!existingExpense) {
      return false;
    }
    
    // Calculate price difference
    const priceDifference = updatedExpense.price - existingExpense.price;
    
    // Check if we have enough balance for the price difference
    if (priceDifference > 0 && state.walletBalance < priceDifference) {
      return false; // Not enough balance for the increase in price
    }
    
    const updatedExpenses = state.expenses.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    );
    
    const chartData = calculateChartData(updatedExpenses);
    const totalExpenses = calculateTotalExpenses(updatedExpenses);
    const maxAmount = calculateMaxCategoryAmount(chartData);
    
    setState(prev => ({
      ...prev,
      expenses: updatedExpenses,
      totalExpenses,
      chartData,
      maxCategoryAmount: maxAmount,
      walletBalance: prev.walletBalance - priceDifference
    }));
    
    return true;
  };
  
  const deleteExpense = (id) => {
    const expenseToDelete = state.expenses.find(exp => exp.id === id);
    
    if (!expenseToDelete) {
      return;
    }
    
    const updatedExpenses = state.expenses.filter(exp => exp.id !== id);
    const chartData = calculateChartData(updatedExpenses);
    const totalExpenses = calculateTotalExpenses(updatedExpenses);
    const maxAmount = calculateMaxCategoryAmount(chartData);
    
    setState(prev => ({
      ...prev,
      expenses: updatedExpenses,
      totalExpenses,
      chartData,
      maxCategoryAmount: maxAmount,
      walletBalance: prev.walletBalance + expenseToDelete.price
    }));
  };
  
  const editExpense = (id) => {
    const expenseToEdit = state.expenses.find(exp => exp.id === id);
    if (expenseToEdit) {
      setEditingExpense(expenseToEdit);
      setExpenseModalOpen(true);
    }
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