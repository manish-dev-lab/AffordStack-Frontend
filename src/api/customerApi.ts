import axiosInstance from './axiosInstance';
import type { ApiResponse, PagedResult, CustomerItem } from '../types';

export const customerApi = {
  getCustomers: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<PagedResult<CustomerItem>> => {
    const res = await axiosInstance.get<ApiResponse<PagedResult<CustomerItem>>>('/admin/customers', {
      params,
    });
    return res.data.data || { items: [], totalCount: 0, pageIndex: 1, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
  },
};
