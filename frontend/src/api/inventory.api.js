import api from './axios';

// Items
export const getItems = (params) => api.get('/inventory/items', { params });
export const getItemById = (id) => api.get(`/inventory/items/${id}`);
export const createItem = (data) => api.post('/inventory/items', data);
export const updateItem = (id, data) => api.put(`/inventory/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/inventory/items/${id}`);

// Categories
export const getCategories = () => api.get('/inventory/categories');
export const createCategory = (data) => api.post('/inventory/categories', data);
export const updateCategory = (id, data) => api.put(`/inventory/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/inventory/categories/${id}`);
