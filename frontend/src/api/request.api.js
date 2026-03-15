import api from './axios';

export const getRequests = () => api.get('/requests');
export const createRequest = (data) => api.post('/requests', data);
export const reviewRequest = (id, data) => api.put(`/requests/${id}/review`, data);
