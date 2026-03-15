import api from './axios';

export const getUsers = () => api.get('/users');
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const resetPassword = (id, data) => api.put(`/users/${id}/reset-password`, data);

export const getDashboardSummary = () => api.get('/reports/summary');
export const getInventoryReport = () => api.get('/reports/inventory');
export const getRequestsReport = (params) => api.get('/reports/requests', { params });
export const getTransactionsReport = (params) => api.get('/reports/transactions', { params });
