import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#a4de6c', '#d0ed57'];

const EnhancedExpenseTracker = () => {
  const [totalBudget, setTotalBudget] = useState(1000);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '' });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [expenses]);

  const addExpense = () => {
    if (newExpense.category && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, amount: parseFloat(newExpense.amount) }]);
      setNewExpense({ category: '', amount: '' });
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalSpent;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  };

  const inputStyle = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
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
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  };

  const summaryStyle = {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  };

  const listItemStyle = {
    backgroundColor: '#fff',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '5px',
    boxShadow: '0 0 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    transform: animate ? 'scale(1.05)' : 'scale(1)',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{color: '#333'}}>Monthly Expense Tracker</h1>
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
        <h2 style={{color: '#444'}}>Add Expense</h2>
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
      <div style={summaryStyle}>
        <h2 style={{color: '#444'}}>Summary</h2>
        <p>Total Budget: ${totalBudget}</p>
        <p>Total Spent: ${totalSpent}</p>
        <p>Remaining: ${remaining}</p>
      </div>
      <div>
        <h2 style={{color: '#444'}}>Expense Breakdown</h2>
        <ul style={{listStyle: 'none', padding: 0}}>
          {expenses.map((expense, index) => (
            <li key={index} style={listItemStyle}>
              {expense.category}: ${expense.amount}
            </li>
          ))}
        </ul>
      </div>
      {expenses.length > 0 && (
        <div style={{height: '300px', marginTop: '20px'}}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {expenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend 
                formatter={(value, entry, index) => expenses[index].category}
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default EnhancedExpenseTracker;