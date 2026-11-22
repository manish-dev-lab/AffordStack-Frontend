import axiosInstance from './axiosInstance';
import type { 
  ApiResponse, 
  PagedResult, 
  Payment, 
  CashfreeOrderResponse, 
  PaymentVerificationResponse, 
  CustomerPayment 
} from '../types';

export const paymentApi = {
  // Admin Methods
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

  // Customer Cashfree Methods
  createQuoteAdvanceOrder: async (secureToken: string, returnUrl?: string): Promise<CashfreeOrderResponse> => {
    const res = await axiosInstance.post<ApiResponse<CashfreeOrderResponse>>(
      `/payments/quotations/${encodeURIComponent(secureToken)}/create-order`,
      { returnUrl }
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to initialize payment session.');
    }
    return res.data.data;
  },

  createMilestoneOrder: async (milestoneId: number, returnUrl?: string): Promise<CashfreeOrderResponse> => {
    const res = await axiosInstance.post<ApiResponse<CashfreeOrderResponse>>(
      `/payments/milestones/${milestoneId}/create-order`,
      { returnUrl }
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to initialize milestone payment.');
    }
    return res.data.data;
  },

  verifyPayment: async (orderId: string): Promise<PaymentVerificationResponse> => {
    const res = await axiosInstance.post<ApiResponse<PaymentVerificationResponse>>(
      `/payments/verify/${encodeURIComponent(orderId)}`
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Payment verification failed.');
    }
    return res.data.data;
  },

  getMyPayments: async (): Promise<CustomerPayment[]> => {
    const res = await axiosInstance.get<ApiResponse<CustomerPayment[]>>('/payments/my-payments');
    return res.data.data || [];
  }
};
