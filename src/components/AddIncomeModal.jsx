import React, { useState } from 'react';
import { FaTimes, FaDollarSign, FaMoneyBillWave } from 'react-icons/fa';

export function AddIncomeModal({ isOpen, onClose, onAddIncome }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    const success = onAddIncome(numAmount);
    
    // Modal will be closed by the parent component if submission was successful
    if (success) {
      setAmount('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
            <FaMoneyBillWave style={{ marginRight: '0.75rem', color: 'var(--success-color)' }} />
            Add Income
          </h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: 'var(--text-light)',
              display: 'flex',
              padding: '0.5rem'
            }}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
        
        {error && (
          <div className="error-message" style={{ 
            backgroundColor: 'rgba(244, 63, 94, 0.1)', 
            color: 'var(--secondary-color)', 
            padding: '0.75rem 1rem', 
            borderRadius: 'var(--radius)', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '0.5rem' }}>⚠️</span> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="income-amount" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              <FaDollarSign style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Income Amount
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                left: '0.875rem',
                color: 'var(--text-secondary)'
              }}>
                <FaDollarSign />
              </div>
              <input
                id="income-amount"
                className="form-control"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            
            <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
              Enter the amount you want to add to your wallet balance.
            </p>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              style={{ backgroundColor: 'var(--success-color)' }}
            >
              Add Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}