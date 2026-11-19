import axiosInstance from './axiosInstance';
import type { ApiResponse, DashboardStats } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await axiosInstance.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to load dashboard statistics');
    }
    return res.data.data;
  },
};
