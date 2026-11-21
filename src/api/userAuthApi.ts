import axiosInstance from './axiosInstance';
import type { ApiResponse, UserLoginResponse, UserProfile, UserEnquirySummary } from '../types';

export const userAuthApi = {
  sendRegistrationOtp: async (payload: { email: string; fullName: string }): Promise<boolean> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>('/user/auth/send-otp', payload);
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to send verification code');
    }
    return res.data.data ?? true;
  },

  register: async (payload: {
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName?: string;
    password: string;
    otp?: string;
  }): Promise<UserLoginResponse> => {
    const res = await axiosInstance.post<ApiResponse<UserLoginResponse>>('/user/auth/register', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Registration failed');
    }
    return res.data.data;
  },

  login: async (payload: { email: string; password: string }): Promise<UserLoginResponse> => {
    const res = await axiosInstance.post<ApiResponse<UserLoginResponse>>('/user/auth/login', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Login failed');
    }
    return res.data.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const res = await axiosInstance.get<ApiResponse<UserProfile>>('/user/auth/profile');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch profile');
    }
    return res.data.data;
  },

  getMyEnquiries: async (): Promise<UserEnquirySummary[]> => {
    const res = await axiosInstance.get<ApiResponse<UserEnquirySummary[]>>('/user/auth/enquiries');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch enquiries');
    }
    return res.data.data;
  },

  changePassword: async (payload: { currentPassword: string; newPassword: string }): Promise<boolean> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>('/user/auth/change-password', payload);
    return res.data.success;
  },

  forgotPassword: async (email: string): Promise<boolean> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>('/user/auth/forgot-password', { email });
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to send reset code');
    }
    return res.data.data ?? true;
  },

  resetPassword: async (payload: { email: string; otp: string; newPassword: string }): Promise<boolean> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>('/user/auth/reset-password', payload);
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to reset password');
    }
    return res.data.data ?? true;
  },
};
