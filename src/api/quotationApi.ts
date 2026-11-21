import axiosInstance from './axiosInstance';
import type { ApiResponse, PagedResult, Quotation, PublicQuotation, QuotationStatus } from '../types';

export const quotationApi = {
  // Public customer methods
  getPublicQuotation: async (secureToken: string): Promise<PublicQuotation> => {
    const res = await axiosInstance.get<ApiResponse<PublicQuotation>>(`/public/quotations/${secureToken}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Quotation not found');
    }
    return res.data.data;
  },

  acceptPublicQuotation: async (secureToken: string, remarks?: string): Promise<boolean> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(`/public/quotations/${secureToken}/accept`, {
      remarks,
    });
    return res.data.success;
  },

  rejectPublicQuotation: async (secureToken: string, remarks?: string): Promise<boolean> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(`/public/quotations/${secureToken}/reject`, {
      remarks,
    });
    return res.data.success;
  },

  // Admin methods
  getAdminQuotations: async (params?: {
    page?: number;
    pageSize?: number;
    status?: QuotationStatus | number;
    search?: string;
  }): Promise<PagedResult<Quotation>> => {
    const res = await axiosInstance.get<ApiResponse<PagedResult<Quotation>>>('/admin/quotations', {
      params,
    });
    return res.data.data || { items: [], totalCount: 0, pageIndex: 1, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
  },

  getAdminQuotationById: async (id: number): Promise<Quotation> => {
    const res = await axiosInstance.get<ApiResponse<Quotation>>(`/admin/quotations/${id}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Quotation not found');
    }
    return res.data.data;
  },

  createQuotation: async (payload: Partial<Quotation>): Promise<Quotation> => {
    const res = await axiosInstance.post<ApiResponse<Quotation>>('/admin/quotations', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to create quotation');
    }
    return res.data.data;
  },

  updateQuotation: async (id: number, payload: Partial<Quotation>): Promise<Quotation> => {
    const res = await axiosInstance.put<ApiResponse<Quotation>>(`/admin/quotations/${id}`, payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to update quotation');
    }
    return res.data.data;
  },

  sendQuotationEmail: async (id: number): Promise<boolean> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(`/admin/quotations/${id}/send`);
    return res.data.success;
  },

  downloadPdfUrl: (id: number): string => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${base}/admin/quotations/${id}/pdf`;
  },

  downloadPublicPdfUrl: (secureToken: string): string => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${base}/public/quotations/${secureToken}/pdf`;
  },
};
