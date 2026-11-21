import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token dynamically (Admin vs User)
axiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('authToken');
    const userToken = localStorage.getItem('ss_user_token');

    // For user auth endpoints or public user calls, prefer user token
    let token = adminToken;
    if (config.url?.startsWith('/user/') || (userToken && !adminToken)) {
      token = userToken || adminToken;
    } else if (config.url?.startsWith('/enquiries') && userToken && !adminToken) {
      token = userToken;
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized Error Handling & Human-Friendly Messages
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Session expiration: redirect to appropriate login if unauthorized
    if (error.response?.status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        window.location.href = '/admin/login';
      } else if (window.location.pathname.startsWith('/user') && window.location.pathname !== '/user/login') {
        localStorage.removeItem('ss_user_token');
        localStorage.removeItem('ss_user');
        window.location.href = '/user/login';
      }
    }

    // 2. Extract human-readable error message from backend
    let friendlyMessage = '';
    const resData = error.response?.data;

    if (resData) {
      if (typeof resData === 'string' && resData.trim().length > 0) {
        friendlyMessage = resData;
      } else if (resData.message && typeof resData.message === 'string') {
        friendlyMessage = resData.message;
      } else if (resData.errors && typeof resData.errors === 'object') {
        // Validation dictionary from ASP.NET Core
        const allErrors = Object.values(resData.errors).flat();
        if (allErrors.length > 0 && typeof allErrors[0] === 'string') {
          friendlyMessage = allErrors[0];
        }
      } else if (resData.title && typeof resData.title === 'string' && !resData.title.includes('RFC')) {
        friendlyMessage = resData.title;
      }
    }

    if (!friendlyMessage) {
      const status = error.response?.status;
      if (status === 401) {
        friendlyMessage = 'Incorrect username or password. Please verify your credentials.';
      } else if (status === 403) {
        friendlyMessage = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        friendlyMessage = 'The requested information could not be found.';
      } else if (status === 409) {
        friendlyMessage = 'A conflict occurred. This record may already exist.';
      } else if (status === 415) {
        friendlyMessage = 'Unsupported media format. Please check your input.';
      } else if (status && status >= 500) {
        friendlyMessage = 'A server error occurred. Please try again shortly.';
      } else if (error.code === 'ECONNABORTED' || !error.response) {
        friendlyMessage = 'Network connection failed. Please check your network connection.';
      } else {
        friendlyMessage = 'An unexpected error occurred. Please try again.';
      }
    }

    error.message = friendlyMessage;
    return Promise.reject(error);
  }
);

export default axiosInstance;
