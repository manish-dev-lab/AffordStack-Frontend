import axiosInstance from './axiosInstance';
import type { ApiResponse, TokenConfig, EmailConfig, WebsiteConfig, AppConfigItem } from '../types';

export const configurationApi = {
  getAll: async (): Promise<AppConfigItem[]> => {
    const res = await axiosInstance.get<ApiResponse<AppConfigItem[]>>('/admin/configurations');
    return res.data.data || [];
  },

  getTokenConfig: async (): Promise<TokenConfig> => {
    const res = await axiosInstance.get<ApiResponse<TokenConfig>>('/admin/configurations/token');
    return res.data.data || { tokenTimeoutMinutes: 60, refreshTokenDays: 7 };
  },

  getEmailConfig: async (): Promise<EmailConfig> => {
    const res = await axiosInstance.get<ApiResponse<EmailConfig>>('/admin/configurations/email');
    return res.data.data || {
      emailsEnabled: true,
      sendCustomerNotifications: true,
      sendAdminNotifications: true,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      username: '',
      fromEmail: '',
      fromName: 'AffordStack',
      adminNotificationEmail: '',
      enableSsl: true,
    };
  },

  getWebsiteConfig: async (): Promise<WebsiteConfig> => {
    const res = await axiosInstance.get<ApiResponse<WebsiteConfig>>('/admin/configurations/website');
    return res.data.data || {
      siteName: 'AffordStack Platform',
      supportEmail: '',
      supportPhone: '',
      contactAddress: '',
      maintenanceMode: false,
    };
  },

  updateConfig: async (key: string, value: string, description?: string): Promise<boolean> => {
    const res = await axiosInstance.put<ApiResponse<boolean>>(`/admin/configurations/${key}`, {
      value,
      description,
    });
    return res.data.success;
  },

  updateBatch: async (configs: Record<string, string>): Promise<boolean> => {
    const res = await axiosInstance.put<ApiResponse<boolean>>('/admin/configurations/batch', configs);
    return res.data.success;
  },
};
