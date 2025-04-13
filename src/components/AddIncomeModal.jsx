import React, { useState } from 'react';

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
        <h2>Add Balance</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Income Amount"
              step="0.01"
              min="0"
            />
            {error && <p className="error-text">{error}</p>}
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
            >
              Add Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}