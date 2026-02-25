import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

// Auth
export const loginUser    = (email, password) => api.post('/auth/login', { email, password });
export const registerUser = (name, email, password) => api.post('/auth/register', { name, email, password });

// Income
export const getIncomes   = (userId) => api.get('/incomes', { params: { userId } });
export const addIncome    = (data)   => api.post('/incomes', data);
export const updateIncome = (id, data) => api.put('/incomes/' + id, data);
export const deleteIncome = (id)     => api.delete('/incomes/' + id);

// Expenses
export const getExpenses   = (userId) => api.get('/expenses', { params: { userId } });
export const addExpense    = (data)   => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put('/expenses/' + id, data);
export const deleteExpense = (id)     => api.delete('/expenses/' + id);

// Budgets
export const getBudgets   = (userId) => api.get('/budgets', { params: { userId } });
export const addBudget    = (data)   => api.post('/budgets', data);
export const updateBudget = (id, data) => api.put('/budgets/' + id, data);
export const deleteBudget = (id)     => api.delete('/budgets/' + id);

// Goals
export const getGoals   = (userId) => api.get('/goals', { params: { userId } });
export const addGoal    = (data)   => api.post('/goals', data);
export const updateGoal = (id, data) => api.put('/goals/' + id, data);
export const deleteGoal = (id)     => api.delete('/goals/' + id);