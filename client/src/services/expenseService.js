import api from './api';

export const getTransactions = async (filters = {}) => {
  const response = await api.get('/expenses', { params: filters });
  return response.data;
};

export const addTransaction = async (transactionData) => {
  const response = await api.post('/expenses', transactionData);
  return response.data;
};

export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/expenses/${id}`, transactionData);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};