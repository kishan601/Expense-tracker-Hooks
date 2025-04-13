import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { FaShoppingCart, FaFilm, FaMapMarkedAlt, FaPen, FaTrash } from 'react-icons/fa';

export function TransactionsList({ expenses, onEditExpense, onDeleteExpense }) {
  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory === 'food') return <FaShoppingCart color="#6b21a8" />;
    if (lowerCategory === 'entertainment') return <FaFilm color="#fbbf24" />;
    if (lowerCategory === 'travel') return <FaMapMarkedAlt color="#22c55e" />;
    return null;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      {sortedExpenses.length > 0 ? (
        <ul className="transaction-list">
          {sortedExpenses.map(expense => (
            <li key={expense.id} className="transaction-item">
              <div className="transaction-details">
                <div className="transaction-icon">
                  {getCategoryIcon(expense.category)}
                </div>
                <div className="transaction-info">
                  <h3>{expense.title}</h3>
                  <p>{formatDate(expense.date)}</p>
                </div>
              </div>
              
              <div className="transaction-actions-container">
                <span className="transaction-amount">{formatCurrency(expense.price)}</span>
                <div className="transaction-actions">
                  <button 
                    onClick={() => onEditExpense(expense.id)}
                    className="action-btn edit-btn"
                  >
                    <FaPen />
                  </button>
                  <button 
                    onClick={() => onDeleteExpense(expense.id)}
                    className="action-btn delete-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No transactions yet. Add an expense to get started!</p>
        </div>
      )}
    </div>
  );
}