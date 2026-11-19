import axiosInstance from './axiosInstance';
import type { ApiResponse, LoginResponse, AdminUser } from '../types';

export const authApi = {
  login: async (usernameOrEmail: string, password: string): Promise<LoginResponse> => {
    const res = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', {
      usernameOrEmail,
      password,
    });
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Login failed');
    }
    return res.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data.success;
  },

  getProfile: async (): Promise<AdminUser> => {
    const res = await axiosInstance.get<ApiResponse<AdminUser>>('/auth/profile');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to fetch profile');
    }
    return res.data.data;
  },
};
