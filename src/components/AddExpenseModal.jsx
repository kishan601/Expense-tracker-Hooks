import React, { useState, useEffect } from 'react';

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
      // eslint-disable-next-line no-unused-vars
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
        <h2>{expenseToEdit ? 'Edit Expense' : 'Add New Expense'}</h2>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Expense Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <input
              type="number"
              name="price"
              className="form-control"
              placeholder="Amount"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <select
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
            <input
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