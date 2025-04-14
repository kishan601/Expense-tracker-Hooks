import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaPlus, FaTrash, FaEdit, FaSave, FaCheck, FaRegClock } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatters';

export const BillsModal = ({ isOpen, onClose }) => {
  const [bills, setBills] = useState([]);
  const [editingBill, setEditingBill] = useState(null);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Load bills from localStorage on mount
  useEffect(() => {
    const savedBills = localStorage.getItem('bills');
    if (savedBills) {
      try {
        const parsedBills = JSON.parse(savedBills);
        if (Array.isArray(parsedBills)) {
          setBills(parsedBills);
        }
      } catch (e) {
        console.error("Error parsing saved bills:", e);
        localStorage.removeItem('bills');
      }
    }
  }, []);
  
  // Save bills to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);
  
  if (!isOpen) return null;
  
  const handleDeleteBill = (id) => {
    setBills(bills.filter(bill => bill.id !== id));
  };
  
  const handleEditBill = (bill) => {
    setEditingBill({ ...bill });
  };
  
  const handleUpdateBill = () => {
    setBills(bills.map(bill => 
      bill.id === editingBill.id ? editingBill : bill
    ));
    setEditingBill(null);
  };
  
  const handleAddBill = () => {
    if (newBill.name && newBill.amount && newBill.dueDate) {
      const newId = Math.max(0, ...bills.map(b => b.id), 0) + 1;
      setBills([
        ...bills, 
        { 
          id: newId, 
          name: newBill.name, 
          amount: parseFloat(newBill.amount), 
          dueDate: newBill.dueDate,
          paid: false
        }
      ]);
      setNewBill({ name: '', amount: '', dueDate: '' });
      setShowAddForm(false);
    }
  };
  
  const handleTogglePaid = (id) => {
    setBills(bills.map(bill => 
      bill.id === id ? { ...bill, paid: !bill.paid } : bill
    ));
  };
  
  const sortedBills = [...bills].sort((a, b) => {
    // Sort by paid status first (unpaid first)
    if (a.paid !== b.paid) return a.paid ? 1 : -1;
    
    // Then by due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getDueStatus = (dueDate, paid) => {
    if (paid) return { text: 'Paid', color: 'var(--success-color)' };
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'var(--secondary-color)' };
    if (diffDays === 0) return { text: 'Due today', color: 'var(--warning-color)' };
    if (diffDays <= 3) return { text: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`, color: 'var(--warning-color)' };
    return { text: `Due in ${diffDays} days`, color: 'var(--text-light)' };
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2><FaCreditCard style={{ marginRight: '0.5rem' }} /> Bill Management</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px' 
          }}>
            <h3 style={{ margin: 0 }}>Upcoming Bills</h3>
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
                <FaPlus style={{ marginRight: '5px' }} /> Add Bill
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
              <h4 style={{ margin: '0 0 15px 0' }}>Add New Bill</h4>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder="Bill Name"
                  value={newBill.name}
                  onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                  style={{
                    flex: '2',
                    padding: '8px',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--bg-light)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-light)'
                  }}
                />
                <input 
                  type="number" 
                  placeholder="Amount"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
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
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Due Date</label>
                <input 
                  type="date" 
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                  style={{
                    width: '100%',
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
                  onClick={handleAddBill}
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
                  Add Bill
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
            <div className="custom-scrollbar" style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.2) rgba(255,255,255,0.05)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Bill Name</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Due Date</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'center', width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                        No bills added yet. Add your first bill above.
                      </td>
                    </tr>
                  ) : (
                    sortedBills.map(bill => (
                      <tr key={bill.id} style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)', 
                        opacity: bill.paid ? 0.6 : 1 
                      }}>
                        {editingBill && editingBill.id === bill.id ? (
                          <>
                            <td style={{ padding: '12px' }}>
                              <input 
                                type="text" 
                                value={editingBill.name}
                                onChange={(e) => setEditingBill({...editingBill, name: e.target.value})}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  borderRadius: 'var(--radius)',
                                  backgroundColor: 'var(--bg-light)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-light)'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input 
                                type="number" 
                                value={editingBill.amount}
                                onChange={(e) => setEditingBill({...editingBill, amount: parseFloat(e.target.value)})}
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
                            <td style={{ padding: '12px' }}>
                              <input 
                                type="date" 
                                value={editingBill.dueDate}
                                onChange={(e) => setEditingBill({...editingBill, dueDate: e.target.value})}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  borderRadius: 'var(--radius)',
                                  backgroundColor: 'var(--bg-light)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-light)'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <label style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}>
                                <input 
                                  type="checkbox" 
                                  checked={editingBill.paid}
                                  onChange={(e) => setEditingBill({...editingBill, paid: e.target.checked})}
                                  style={{ marginRight: '5px' }}
                                />
                                Paid
                              </label>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <button
                                onClick={handleUpdateBill}
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
                                onClick={() => setEditingBill(null)}
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
                            <td style={{ padding: '12px' }}>
                              {bill.name}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                              {formatCurrency(bill.amount || 0)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              {formatDate(bill.dueDate)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <div style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                padding: '4px 8px', 
                                borderRadius: '20px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: getDueStatus(bill.dueDate, bill.paid).color,
                                fontSize: '0.8rem'
                              }}>
                                {bill.paid ? (
                                  <FaCheck style={{ marginRight: '5px' }} />
                                ) : (
                                  <FaRegClock style={{ marginRight: '5px' }} />
                                )}
                                {getDueStatus(bill.dueDate, bill.paid).text}
                              </div>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleTogglePaid(bill.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: bill.paid ? 'var(--warning-color)' : 'var(--success-color)',
                                  cursor: 'pointer',
                                  marginRight: '10px'
                                }}
                                title={bill.paid ? "Mark as unpaid" : "Mark as paid"}
                              >
                                {bill.paid ? "Undo" : "Pay"}
                              </button>
                              <button
                                onClick={() => handleEditBill(bill)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--primary-color)',
                                  cursor: 'pointer',
                                  marginRight: '10px'
                                }}
                                title="Edit bill"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteBill(bill.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--secondary-color)',
                                  cursor: 'pointer'
                                }}
                                title="Delete bill"
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