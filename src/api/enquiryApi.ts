import axiosInstance from './axiosInstance';
import type { ApiResponse, PagedResult, EnquiryListItem, EnquiryDetail, EnquiryStatus, EnquiryTracking } from '../types';

export const enquiryApi = {
  trackEnquiry: async (payload: { referenceNumber: string; email: string }): Promise<EnquiryTracking> => {
    const res = await axiosInstance.post<ApiResponse<EnquiryTracking>>('/enquiries/track', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to find enquiry tracking details.');
    }
    return res.data.data;
  },

  submitEnquiryForm: async (formData: FormData): Promise<{ referenceNumber: string; message: string }> => {
    const res = await axiosInstance.post<ApiResponse<{ referenceNumber: string; message: string }>>(
      '/enquiries',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to submit enquiry');
    }
    return res.data.data;
  },

  getAdminEnquiries: async (params?: {
    page?: number;
    pageSize?: number;
    status?: EnquiryStatus | number;
    serviceCategoryId?: number;
    search?: string;
  }): Promise<PagedResult<EnquiryListItem>> => {
    const res = await axiosInstance.get<ApiResponse<PagedResult<EnquiryListItem>>>('/admin/enquiries', {
      params,
    });
    return res.data.data || { items: [], totalCount: 0, pageIndex: 1, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
  },

  getAdminEnquiryById: async (id: number): Promise<EnquiryDetail> => {
    const res = await axiosInstance.get<ApiResponse<EnquiryDetail>>(`/admin/enquiries/${id}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Enquiry not found');
    }
    return res.data.data;
  },

  updateStatus: async (id: number, status: EnquiryStatus | number, note?: string): Promise<boolean> => {
    const res = await axiosInstance.put<ApiResponse<boolean>>(`/admin/enquiries/${id}/status`, {
      status,
      note,
    });
    return res.data.success;
  },

  addNote: async (id: number, noteContent: string): Promise<void> => {
    await axiosInstance.post<ApiResponse<unknown>>(`/admin/enquiries/${id}/notes`, {
      noteContent,
    });
  },

  deleteEnquiry: async (id: number): Promise<boolean> => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(`/admin/enquiries/${id}`);
    return res.data.success;
  },
};
