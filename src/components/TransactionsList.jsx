import React from 'react';
import { FaUtensils, FaFilm, FaPlane, FaPencilAlt, FaTrash, FaBook, FaShoppingBasket, FaLaptop } from 'react-icons/fa';

export function TransactionsList({ expenses, onEditExpense, onDeleteExpense }) {
  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'food':
        return <FaUtensils />;
      case 'entertainment':
        return <FaFilm />;
      case 'travel':
        return <FaPlane />;
      case 'study':
        return <FaBook />;
      case 'utensils':
        return <FaShoppingBasket />;
      case 'electronics':
        return <FaLaptop />;
      default:
        return <FaUtensils />;
    }
  };
  
  const getCategoryColor = (category) => {
    switch(category.toLowerCase()) {
      case 'food':
        return '#6b21a8'; // Purple
      case 'entertainment':
        return '#fbbf24'; // Yellow
      case 'travel':
        return '#22c55e'; // Green
      case 'study':
        return '#3b82f6'; // Blue
      case 'utensils':
        return '#ec4899'; // Pink
      case 'electronics':
        return '#14b8a6'; // Teal
      default:
        return '#6b21a8'; // Default to purple
    }
  };
  
  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet!</p>
        <p>Add your first expense to get started tracking your spending.</p>
      </div>
    );
  }
  
  return (
    <ul className="transaction-list">
      {expenses.map(expense => (
        <li key={expense.id} className="transaction-item">
          <div className="transaction-details">
            <div className="transaction-icon" style={{ backgroundColor: `${getCategoryColor(expense.category)}20`, color: getCategoryColor(expense.category) }}>
              {getCategoryIcon(expense.category)}
            </div>
            <div className="transaction-info">
              <h3>{expense.title}</h3>
              <p>{expense.date}</p>
            </div>
          </div>
          
          <div className="transaction-actions-wrapper">
            <span className="transaction-amount">
              {expense.price}
            </span>
            <div className="transaction-actions">
              <button 
                className="action-btn edit-btn" 
                onClick={() => onEditExpense(expense.id)}
                aria-label="Edit expense"
              >
                <FaPencilAlt size={12} />
              </button>
              <button 
                className="action-btn delete-btn" 
                onClick={() => onDeleteExpense(expense.id)}
                aria-label="Delete expense"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}