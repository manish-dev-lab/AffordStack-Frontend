import axiosInstance from './axiosInstance';
import type { ApiResponse, PagedResult, AdminUserAccount, UserEnquirySummary } from '../types';

export const adminUsersApi = {
  getAdminUsers: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<PagedResult<AdminUserAccount>> => {
    const res = await axiosInstance.get<ApiResponse<PagedResult<AdminUserAccount>>>('/admin/users', {
      params,
    });
    return res.data.data || { items: [], totalCount: 0, pageIndex: 1, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
  },

  getAdminUserById: async (id: number): Promise<AdminUserAccount> => {
    const res = await axiosInstance.get<ApiResponse<AdminUserAccount>>(`/admin/users/${id}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'User account not found');
    }
    return res.data.data;
  },

  getAdminUserEnquiries: async (id: number): Promise<UserEnquirySummary[]> => {
    const res = await axiosInstance.get<ApiResponse<UserEnquirySummary[]>>(`/admin/users/${id}/enquiries`);
    return res.data.data || [];
  },

  toggleUserStatus: async (id: number): Promise<boolean> => {
    const res = await axiosInstance.put<ApiResponse<boolean>>(`/admin/users/${id}/toggle-status`);
    return res.data.success;
  },
};
