import axiosInstance from './axiosInstance';
import type { ApiResponse, PagedResult, Payment } from '../types';

export const paymentApi = {
  getPayments: async (params?: {
    page?: number;
    pageSize?: number;
    projectId?: number;
    search?: string;
  }): Promise<PagedResult<Payment>> => {
    const res = await axiosInstance.get<ApiResponse<PagedResult<Payment>>>('/admin/payments', {
      params,
    });
    return res.data.data || { items: [], totalCount: 0, pageIndex: 1, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
  },

  recordPayment: async (payload: Partial<Payment>): Promise<Payment> => {
    const res = await axiosInstance.post<ApiResponse<Payment>>('/admin/payments', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to record payment');
    }
    return res.data.data;
  },
};
