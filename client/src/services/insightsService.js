import api from './api';

export const getMonthlyInsights = async () => {
  const response = await api.get('/insights/monthly');
  return response.data;
};