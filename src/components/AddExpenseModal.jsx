import React, { useState, useEffect } from 'react';
import { FaTimes, FaTag, FaDollarSign, FaList, FaCalendarAlt } from 'react-icons/fa';

export function AddExpenseModal({ isOpen, onClose, onSubmit, expenseToEdit }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setPrice(expenseToEdit.price.toString());
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date);
    } else {
      // Set today's date as default
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      setDate(formattedDate);
      setTitle('');
      setPrice('');
      setCategory('Food');
    }
  }, [expenseToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    setError('');
    
    try {
      const result = onSubmit({
        id: expenseToEdit?.id || '',
        title,
        price: priceNumber,
        category,
        date
      });
      
      if (result === false) {
        setError('Not enough balance for this expense');
        return;
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>{expenseToEdit ? 'Edit Expense' : 'Add New Expense'}</h2>
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
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              <FaTag style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Expense Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className="form-control"
              placeholder="What did you spend on?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              <FaDollarSign style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Amount
            </label>
            <input
              id="price"
              type="number"
              name="price"
              className="form-control"
              placeholder="How much did you spend?"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              <FaList style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Category
            </label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Food">Food</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Travel">Travel</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              <FaCalendarAlt style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {expenseToEdit ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}