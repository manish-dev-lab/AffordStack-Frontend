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
    // Log complete error response for local debugging
    console.error('[API Error Debug]:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      error,
    });

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
    const status = error.response?.status;
    const resData = error.response?.data;

    let isServerOrTechnicalError = false;

    if (!status || status >= 500 || error.code === 'ECONNABORTED' || !error.response) {
      isServerOrTechnicalError = true;
    }

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

    // Inspect if the extracted text itself contains internal technical keywords
    const lowerMsg = (friendlyMessage || '').toLowerCase();
    if (
      lowerMsg.includes('internal server error') ||
      lowerMsg.includes('unhandled exception') ||
      lowerMsg.includes('npgsql') ||
      lowerMsg.includes('syntax error') ||
      lowerMsg.includes('relation ') ||
      lowerMsg.includes('column ') ||
      lowerMsg.includes('stack trace') ||
      lowerMsg.includes('nullreference') ||
      lowerMsg.includes('object reference') ||
      lowerMsg.includes('exception of type')
    ) {
      isServerOrTechnicalError = true;
    }

    if (isServerOrTechnicalError) {
      friendlyMessage = 'Something went wrong while processing your request. Please try again shortly.';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: {
              type: 'error',
              title: 'Something went wrong',
              message: 'We experienced an unexpected issue. Please try again in a moment.',
            },
          })
        );
      }
    } else if (!friendlyMessage) {
      if (status === 401) {
        friendlyMessage = 'Incorrect username or password. Please verify your credentials.';
      } else if (status === 403) {
        friendlyMessage = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        friendlyMessage = 'The requested information could not be found.';
      } else if (status === 409) {
        friendlyMessage = 'A conflict occurred. This record may already exist.';
      } else if (status === 422) {
        friendlyMessage = 'Provided information is incomplete or invalid. Please check your inputs.';
      } else {
        friendlyMessage = 'Unable to complete your request. Please try again.';
      }
    }

    error.message = friendlyMessage;
    error.isServerError = isServerOrTechnicalError;
    return Promise.reject(error);
  }
);

export default axiosInstance;
