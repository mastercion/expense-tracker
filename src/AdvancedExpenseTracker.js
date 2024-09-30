import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#a4de6c', '#d0ed57'];

const AdvancedExpenseTracker = () => {
    const [state, setState] = useState(() => {
        const savedData = localStorage.getItem('expenseTrackerData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                console.log('Initial load - Parsed data:', parsedData);
                return {
                    totalBudget: parsedData.totalBudget || 1000,
                    permanentExpenses: parsedData.permanentExpenses || [],
                    monthlyData: parsedData.monthlyData || {},
                    categories: parsedData.categories || ['Car', 'Handy', 'Fixed Cost', 'Sonstige'],
                    darkMode: parsedData.darkMode || false,
                };
            } catch (error) {
                console.error('Error parsing saved data:', error);
            }
        }
        return {
            totalBudget: 1000,
            permanentExpenses: [],
            monthlyData: {},
            categories: ['Car', 'Handy', 'Fixed Cost', 'Sonstige'],
            darkMode: false,
        };
    });

    const [newExpense, setNewExpense] = useState({ category: '', amount: '', isPermanent: false });
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [newCategory, setNewCategory] = useState('');
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        console.log('Saving data to localStorage');
        try {
            localStorage.setItem('expenseTrackerData', JSON.stringify(state));
            console.log('Saved data:', state);
            setIsSaving(true);
            const timer = setTimeout(() => setIsSaving(false), 1000);
            return () => clearTimeout(timer);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }, [state]);

    const addExpense = () => {
        console.log('Adding expense', newExpense);
        if (newExpense.category && newExpense.amount) {
            const expenseToAdd = { ...newExpense, amount: parseFloat(newExpense.amount), id: Date.now() };
            if (newExpense.isPermanent) {
                setState(prevState => ({
                    ...prevState,
                    permanentExpenses: [...prevState.permanentExpenses, expenseToAdd],
                }));
            } else {
                setState(prevState => ({
                    ...prevState,
                    monthlyData: {
                        ...prevState.monthlyData,
                        [selectedMonth]: [...(prevState.monthlyData[selectedMonth] || []), expenseToAdd],
                    },
                }));
            }
            setNewExpense({ category: '', amount: '', isPermanent: false });
        }
    };

    const deleteExpense = (id, isPermanent) => {
        if (isPermanent) {
            setState(prevState => ({
                ...prevState,
                permanentExpenses: prevState.permanentExpenses.filter(expense => expense.id !== id),
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                monthlyData: {
                    ...prevState.monthlyData,
                    [selectedMonth]: prevState.monthlyData[selectedMonth].filter(expense => expense.id !== id),
                },
            }));
        }
    };

    const addNewCategory = () => {
        console.log('Adding new category', newCategory);
        if (newCategory && !state.categories.includes(newCategory)) {
            setState(prevState => ({
                ...prevState,
                categories: [...prevState.categories, newCategory],
            }));
            setNewCategory('');
            setIsAddingNewCategory(false);
        }
    };

    const handleBudgetChange = (newBudget) => {
        console.log('Updating budget:', newBudget);
        setState(prevState => ({
            ...prevState,
            totalBudget: newBudget,
        }));
    };

    const toggleDarkMode = () => {
        setState(prevState => ({
            ...prevState,
            darkMode: !prevState.darkMode,
        }));
    };

    function getCurrentMonth() {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }).filter((value, index, self) => self.indexOf(value) === index);

    const currentMonthExpenses = [...(state.monthlyData[selectedMonth] || []), ...state.permanentExpenses];
    const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = state.totalBudget - totalSpent;

    const chartData = [
        ...currentMonthExpenses.map(expense => ({
            name: expense.category,
            value: expense.amount,
        })),
        {
            name: 'Unused',
            value: Math.max(0, remaining),
        },
    ];

    const containerStyle = {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: state.darkMode ? '#1a1a1a' : '#f0f0f0',
        color: state.darkMode ? '#ffffff' : '#333333',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
    };

    const inputStyle = {
        width: 'calc(100% - 20px)',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        backgroundColor: state.darkMode ? '#333' : '#fff',
        color: state.darkMode ? '#fff' : '#333',
        fontSize: '16px',
    };

    const buttonStyle = {
        backgroundColor: state.darkMode ? '#4CAF50' : '#45a049',
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
        backgroundColor: state.darkMode ? '#2a2a2a' : '#fff',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '20px',
        boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    };

    const listItemStyle = {
        backgroundColor: state.darkMode ? '#2a2a2a' : '#fff',
        padding: '10px',
        marginBottom: '5px',
        borderRadius: '5px',
        boxShadow: '0 0 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: state.darkMode ? '#d32f2f' : '#f44336',
        padding: '5px 10px',
        fontSize: '14px',
    };

    return (
        <div style={containerStyle}>
            {isSaving && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'green',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '3px',
                    zIndex: 1000,
                }}>
                    Saved
                </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{color: state.darkMode ? '#fff' : '#333'}}>Advanced Expense Tracker</h1>
                <button onClick={toggleDarkMode} style={{ ...buttonStyle, padding: '5px 10px' }}>
                    {state.darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            <div>
                <label>Total Budget: </label>
                <input
                    type="number"
                    value={state.totalBudget}
                    onChange={(e) => handleBudgetChange(parseFloat(e.target.value))}
                    style={inputStyle}
                />
            </div>

            <div>
                <h2 style={{color: state.darkMode ? '#ddd' : '#444'}}>Select Month</h2>
                <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={inputStyle}
                >
                    {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
            </div>

            <div>
                <h2 style={{color: state.darkMode ? '#ddd' : '#444'}}>Add Expense</h2>
                <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    style={inputStyle}
                >
                    <option value="">Select Category</option>
                    {state.categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    style={inputStyle}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={newExpense.isPermanent}
                        onChange={(e) => setNewExpense({ ...newExpense, isPermanent: e.target.checked })}
                    />
                    Permanent Expense
                </label>
                <button onClick={addExpense} style={buttonStyle}>Add Expense</button>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isAddingNewCategory}
                        onChange={(e) => setIsAddingNewCategory(e.target.checked)}
                    />
                    Add New Category
                </label>
                {isAddingNewCategory && (
                    <div>
                        <input
                            type="text"
                            placeholder="New Category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            style={inputStyle}
                        />
                        <button onClick={addNewCategory} style={buttonStyle}>Add Category</button>
                    </div>
                )}
            </div>

            <div style={summaryStyle}>
                <h2 style={{color: state.darkMode ? '#ddd' : '#444'}}>Summary for {selectedMonth}</h2>
                <p>Total Budget: ${state.totalBudget}</p>
                <p>Total Spent: ${totalSpent}</p>
                <p>Remaining: ${remaining}</p>
            </div>

            <div>
                <h2 style={{color: state.darkMode ? '#ddd' : '#444'}}>Expense Breakdown</h2>
                <ul style={{listStyle: 'none', padding: 0}}>
                    {currentMonthExpenses.map((expense) => (
                        <li key={expense.id} style={listItemStyle}>
                            <span>{expense.category}: ${expense.amount} {expense.isPermanent ? '(Permanent)' : ''}</span>
                            <button 
                                onClick={() => deleteExpense(expense.id, expense.isPermanent)} 
                                style={deleteButtonStyle}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {chartData.length > 0 && (
                <div style={{height: '400px', marginTop: '20px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'Unused' ? (state.darkMode ? '#555' : '#D3D3D3') : COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value}`} />
                            <Legend layout="vertical" align="right" verticalAlign="middle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default AdvancedExpenseTracker;