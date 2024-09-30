import React, { useState } from 'react';

const SimpleExpenseTracker = () => {
  const [totalBudget, setTotalBudget] = useState(1000);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '' });

  const addExpense = () => {
    if (newExpense.category && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, amount: parseFloat(newExpense.amount) }]);
      setNewExpense({ category: '', amount: '' });
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalSpent;

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h1>Monthly Expense Tracker</h1>
      <div>
        <label>Total Budget: </label>
        <input
          type="number"
          value={totalBudget}
          onChange={(e) => setTotalBudget(parseFloat(e.target.value))}
          style={inputStyle}
        />
      </div>
      <div>
        <h2>Add Expense</h2>
        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          style={inputStyle}
        />
        <button onClick={addExpense} style={buttonStyle}>Add Expense</button>
      </div>
      <div>
        <h2>Summary</h2>
        <p>Total Budget: ${totalBudget}</p>
        <p>Total Spent: ${totalSpent}</p>
        <p>Remaining: ${remaining}</p>
      </div>
      <div>
        <h2>Expense Breakdown</h2>
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>{expense.category}: ${expense.amount}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SimpleExpenseTracker;