import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // Crucial for sending & receiving httpOnly JWT cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle global unauthorized redirection if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return custom error message from server if available
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default api;
