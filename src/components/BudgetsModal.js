import React, { useState } from 'react';
import { FaCoins, FaPlus, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import { chartColors } from '../utils/chartColors';
import { formatCurrency } from '../utils/formatters';

export const BudgetsModal = ({ isOpen, onClose }) => {
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food', amount: 500, spent: 320 },
    { id: 2, category: 'Entertainment', amount: 300, spent: 150 },
    { id: 3, category: 'Travel', amount: 1000, spent: 600 },
  ]);
  
  const [editingBudget, setEditingBudget] = useState(null);
  const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  
  if (!isOpen) return null;
  
  const handleDeleteBudget = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };
  
  const handleEditBudget = (budget) => {
    setEditingBudget({ ...budget });
  };
  
  const handleUpdateBudget = () => {
    setBudgets(budgets.map(budget => 
      budget.id === editingBudget.id ? editingBudget : budget
    ));
    setEditingBudget(null);
  };
  
  const handleAddBudget = () => {
    if (newBudget.category && newBudget.amount) {
      const newId = Math.max(0, ...budgets.map(b => b.id)) + 1;
      setBudgets([
        ...budgets, 
        { 
          id: newId, 
          category: newBudget.category, 
          amount: parseFloat(newBudget.amount), 
          spent: 0 
        }
      ]);
      setNewBudget({ category: '', amount: '' });
      setShowAddForm(false);
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2><FaCoins style={{ marginRight: '0.5rem' }} /> Budget Management</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px' 
          }}>
            <h3 style={{ margin: 0 }}>Monthly Budgets</h3>
            {!showAddForm && (
              <button 
                onClick={() => setShowAddForm(true)} 
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FaPlus style={{ marginRight: '5px' }} /> Add Budget
              </button>
            )}
          </div>
          
          {showAddForm && (
            <div style={{ 
              padding: '15px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: 'var(--radius)',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0' }}>Add New Budget</h4>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <select 
                  value={newBudget.category} 
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                  style={{
                    flex: '2',
                    padding: '8px',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--bg-light)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)'
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Travel">Travel</option>
                  <option value="Study">Study</option>
                  <option value="Utensils">Utensils</option>
                  <option value="Electronics">Electronics</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Amount"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                  style={{
                    flex: '1',
                    padding: '8px',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--bg-light)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleAddBudget}
                  style={{
                    flex: '1',
                    backgroundColor: 'var(--success-color)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    padding: '8px 15px',
                    cursor: 'pointer'
                  }}
                >
                  Add Budget
                </button>
                <button 
                  onClick={() => setShowAddForm(false)}
                  style={{
                    flex: '1',
                    backgroundColor: 'var(--bg-light)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    padding: '8px 15px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            borderRadius: 'var(--radius)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Budget</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Spent</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Remaining</th>
                  <th style={{ padding: '12px', textAlign: 'center', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                      No budgets added yet. Add your first budget above.
                    </td>
                  </tr>
                ) : (
                  budgets.map(budget => (
                    <tr key={budget.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {editingBudget && editingBudget.id === budget.id ? (
                        <>
                          <td style={{ padding: '12px' }}>
                            <select 
                              value={editingBudget.category} 
                              onChange={(e) => setEditingBudget({...editingBudget, category: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '6px',
                                borderRadius: 'var(--radius)',
                                backgroundColor: 'var(--bg-light)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-light)'
                              }}
                            >
                              <option value="Food">Food</option>
                              <option value="Entertainment">Entertainment</option>
                              <option value="Travel">Travel</option>
                              <option value="Study">Study</option>
                              <option value="Utensils">Utensils</option>
                              <option value="Electronics">Electronics</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <input 
                              type="number" 
                              value={editingBudget.amount}
                              onChange={(e) => setEditingBudget({...editingBudget, amount: parseFloat(e.target.value)})}
                              style={{
                                width: '100%',
                                padding: '6px',
                                borderRadius: 'var(--radius)',
                                backgroundColor: 'var(--bg-light)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-light)',
                                textAlign: 'right'
                              }}
                            />
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            {formatCurrency(budget.spent || 0)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            {formatCurrency((editingBudget.amount - budget.spent) || 0)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button
                              onClick={handleUpdateBudget}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--success-color)',
                                cursor: 'pointer',
                                marginRight: '10px'
                              }}
                              title="Save changes"
                            >
                              <FaSave />
                            </button>
                            <button
                              onClick={() => setEditingBudget(null)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-light)',
                                cursor: 'pointer'
                              }}
                              title="Cancel"
                            >
                              ×
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ 
                            padding: '12px', 
                            display: 'flex', 
                            alignItems: 'center' 
                          }}>
                            <div style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: chartColors[budget.category.toLowerCase()] || '#ccc',
                              marginRight: '10px'
                            }}></div>
                            {budget.category}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            {formatCurrency(budget.amount || 0)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            {formatCurrency(budget.spent || 0)}
                          </td>
                          <td style={{ 
                            padding: '12px', 
                            textAlign: 'right',
                            color: budget.amount - budget.spent > 0 ? 'var(--success-color)' : 'var(--secondary-color)'
                          }}>
                            {formatCurrency((budget.amount - budget.spent) || 0)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleEditBudget(budget)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary-color)',
                                cursor: 'pointer',
                                marginRight: '10px'
                              }}
                              title="Edit budget"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteBudget(budget.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--secondary-color)',
                                cursor: 'pointer'
                              }}
                              title="Delete budget"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <button 
              onClick={onClose}
              className="btn-secondary" 
              style={{ width: '180px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};