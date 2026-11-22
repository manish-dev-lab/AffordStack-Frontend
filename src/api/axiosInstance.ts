import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token with strict isolation between Customer and Admin sessions
axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const adminToken = localStorage.getItem('authToken');
    const userToken = localStorage.getItem('ss_user_token');

    let tokenToAttach: string | null = null;

    // 1. Customer User Endpoints: ONLY attach userToken, NEVER fall back to adminToken
    if (url.startsWith('/user/')) {
      tokenToAttach = userToken;
    }
    // 2. Admin & Staff Endpoints: ONLY attach adminToken, NEVER fall back to userToken
    else if (
      url.startsWith('/auth/') ||
      url.startsWith('/admin') ||
      url.startsWith('/configurations') ||
      url.startsWith('/dashboard') ||
      url.startsWith('/customers') ||
      url.startsWith('/payments') ||
      url.startsWith('/users')
    ) {
      tokenToAttach = adminToken;
    }
    // 3. Other protected resources (enquiries/quotations/projects):
    // Determine context strictly based on current window path
    else if (url.startsWith('/enquiries') || url.startsWith('/quotations') || url.startsWith('/projects')) {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        tokenToAttach = adminToken;
      } else {
        tokenToAttach = userToken;
      }
    }

    if (tokenToAttach && config.headers) {
      config.headers.Authorization = `Bearer ${tokenToAttach}`;
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

    // 1. Session expiration: redirect to appropriate login if unauthorized or forbidden
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      const isUserEndpoint = error.config?.url?.startsWith('/user/');
      const isAdminEndpoint =
        error.config?.url?.startsWith('/admin') ||
        error.config?.url?.startsWith('/auth/') ||
        (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));

      if (isUserEndpoint) {
        localStorage.removeItem('ss_user_token');
        localStorage.removeItem('ss_user');
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/user') && window.location.pathname !== '/user/login') {
          window.location.href = '/user/login';
        }
      } else if (isAdminEndpoint) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    }

    // 2. Extract human-readable error message from backend
    let friendlyMessage = '';
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
      // Avoid duplicate top toast if user is on login/registration pages that already show a modal popup
      const isAuthPage = typeof window !== 'undefined' && (window.location.pathname.includes('/login') || window.location.pathname.includes('/register'));
      if (typeof window !== 'undefined' && !isAuthPage) {
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
