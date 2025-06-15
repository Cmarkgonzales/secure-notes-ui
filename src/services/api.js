import axios from 'axios';

const API_URL = 'http://localhost:8086/api/v1';  // Update with your backend URL

// Get token from localStorage
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const register = (data) => axios.post(`${API_URL}/register`, data);
export const login = (data) => axios.post(`${API_URL}/login`, data);

export const getNotes = () => axios.get(`${API_URL}/notes`, { headers: getAuthHeader() });
export const createNote = (data) => axios.post(`${API_URL}/notes`, data, { headers: getAuthHeader() });
export const updateNote = (id, data) => axios.put(`${API_URL}/notes/${id}`, data, { headers: getAuthHeader() });
export const deleteNote = (id) => axios.delete(`${API_URL}/notes/${id}`, { headers: getAuthHeader() });
