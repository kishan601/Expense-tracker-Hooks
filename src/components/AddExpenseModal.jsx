import React, { useEffect, useState } from 'react';

export function AddExpenseModal({ isOpen, onClose, onSubmit, expenseToEdit }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});  
  
  // Reset form when modal opens/closes or editing expense changes
  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        setTitle(expenseToEdit.title);
        setPrice(expenseToEdit.price.toString());
        setCategory(expenseToEdit.category);
        setDate(expenseToEdit.date);
      } else {
        // Default values for new expense
        setTitle('');
        setPrice('');
        setCategory('Food');
        setDate(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
      }
      setErrors({});
    }
  }, [isOpen, expenseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const validationErrors = {};
    
    if (!title.trim()) validationErrors.title = 'Title is required';
    
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      validationErrors.price = 'Please enter a valid positive price';
    }
    
    if (!category) validationErrors.category = 'Category is required';
    if (!date) validationErrors.date = 'Date is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Submit the form data
    const success = onSubmit({
      id: expenseToEdit?.id || '',
      title,
      price: priceNumber,
      category,
      date
    });
    
    // Modal will be closed by the parent component if submission was successful
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Expenses</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>
          
          <div className="form-group">
            <input
              className="form-control"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              step="0.01"
              min="0"
            />
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>
          
          <div className="form-group">
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Food">Food</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Travel">Travel</option>
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>
          
          <div className="form-group">
            <input
              className="form-control"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p className="error-text">{errors.date}</p>}
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
              {expenseToEdit ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}