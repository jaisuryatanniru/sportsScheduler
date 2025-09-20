import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/authentication',
});
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('authToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export default api;
