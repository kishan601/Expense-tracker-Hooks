import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { FaUtensils, FaFilm, FaPlane } from 'react-icons/fa';

export function TransactionsList({ expenses, onEditExpense, onDeleteExpense }) {
  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'food':
        return <FaUtensils />;
      case 'entertainment':
        return <FaFilm />;
      case 'travel':
        return <FaPlane />;
      default:
        return <FaUtensils />;
    }
  };
  
  if (!expenses || expenses.length === 0) {
    return <div className="empty-state">No transactions yet</div>;
  }
  
  return (
    <ul className="transaction-list">
      {expenses.map(expense => (
        <li key={expense.id} className="transaction-item">
          <div className="transaction-details">
            <div className="transaction-icon">
              {getCategoryIcon(expense.category)}
            </div>
            <div className="transaction-info">
              <h3>{expense.title}</h3>
              <p>{expense.date}</p>
            </div>
          </div>
          
          <div className="transaction-actions-wrapper">
            <span className="transaction-amount">
              {formatCurrency(expense.price)}
            </span>
            <div className="transaction-actions">
              <button 
                className="action-btn edit-btn" 
                onClick={() => onEditExpense(expense.id)}
              >
                ✎
              </button>
              <button 
                className="action-btn delete-btn" 
                onClick={() => onDeleteExpense(expense.id)}
              >
                ✕
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}