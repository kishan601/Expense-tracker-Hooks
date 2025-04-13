import React from 'react';
import { TransactionsList } from './TransactionsList';
import { ExpenseCharts } from './ExpenseCharts';
import { formatCurrency } from '../utils/formatters';

export function Dashboard({
  walletBalance,
  totalExpenses,
  expenses,
  chartData,
  maxCategoryAmount,
  onAddIncome,
  onAddExpense,
  onEditExpense,
  onDeleteExpense
}) {
  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get top 3 expenses
  const topExpenses = [...expenses]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  return (
    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
      {/* Overview and Actions */}
      <div style={{ 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        backgroundColor: 'var(--card-bg, #fff)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Overview</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ marginBottom: '0.5rem', color: 'var(--muted-text, #64748b)' }}>Wallet Balance</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary, #1e293b)' }}>
            {formatCurrency(walletBalance)}
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '0.5rem', color: 'var(--muted-text, #64748b)' }}>Total Expenses</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary, #1e293b)' }}>
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={onAddIncome}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--primary-color, #3b82f6)',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Add Income
          </button>
          <button 
            onClick={onAddExpense}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--secondary-color, #ef4444)',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Add Expense
          </button>
        </div>
      </div>
      
      {/* Chart Section */}
      <div style={{ 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        backgroundColor: 'var(--card-bg, #fff)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Expense Distribution</h2>
        <ExpenseCharts.PieChart data={chartData} />
        <ExpenseCharts.BarChart data={chartData} maxAmount={maxCategoryAmount} />
      </div>
      
      {/* Top Expenses Section */}
      <div style={{ 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        backgroundColor: 'var(--card-bg, #fff)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Top Expenses</h2>
        {topExpenses.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {topExpenses.map(expense => (
              <li 
                key={expense.id} 
                style={{ 
                  padding: '0.75rem', 
                  marginBottom: '0.5rem', 
                  backgroundColor: 'var(--bg-subtle, #f1f5f9)', 
                  borderRadius: '0.375rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ fontWeight: 'bold' }}>{expense.title}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted-text, #64748b)' }}>{expense.category}</p>
                </div>
                <p style={{ fontWeight: 'bold', color: 'var(--secondary-color, #ef4444)' }}>
                  {formatCurrency(expense.price)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'var(--muted-text, #64748b)' }}>No expenses yet.</p>
        )}
      </div>
      
      {/* Transactions Section */}
      <div style={{ 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        backgroundColor: 'var(--card-bg, #fff)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        gridColumn: '1 / -1'  // Make transactions span full width
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Transactions</h2>
        <TransactionsList 
          expenses={sortedExpenses} 
          onEditExpense={onEditExpense} 
          onDeleteExpense={onDeleteExpense} 
        />
      </div>
    </div>
  );
}