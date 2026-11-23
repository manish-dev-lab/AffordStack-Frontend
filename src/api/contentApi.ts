import axiosInstance from './axiosInstance';
import type { ApiResponse, ServiceCategory, ServiceItem, PortfolioProject, BlogPost, BlogCategory, Testimonial } from '../types';

export const contentApi = {
  // Services
  getServiceCategories: async (): Promise<ServiceCategory[]> => {
    try {
      const res = await axiosInstance.get<ApiResponse<ServiceCategory[]>>('/service-categories');
      return res.data.data || [];
    } catch {
      return [];
    }
  },

  getServices: async (params?: { categorySlug?: string; featuredOnly?: boolean }): Promise<ServiceItem[]> => {
    try {
      const res = await axiosInstance.get<ApiResponse<ServiceItem[]>>('/services', { params });
      return res.data.data || [];
    } catch {
      return [];
    }
  },

  getServiceBySlug: async (slug: string): Promise<ServiceItem> => {
    const res = await axiosInstance.get<ApiResponse<ServiceItem>>(`/services/${slug}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Service not found');
    }
    return res.data.data;
  },

  createService: async (payload: Partial<ServiceItem>): Promise<ServiceItem> => {
    const res = await axiosInstance.post<ApiResponse<ServiceItem>>('/admin/services', payload);
    return res.data.data!;
  },

  updateService: async (id: number, payload: Partial<ServiceItem>): Promise<ServiceItem> => {
    const res = await axiosInstance.put<ApiResponse<ServiceItem>>(`/admin/services/${id}`, payload);
    return res.data.data!;
  },

  deleteService: async (id: number): Promise<boolean> => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(`/admin/services/${id}`);
    return res.data.success;
  },

  // Portfolio
  getPortfolio: async (params?: { category?: string; featuredOnly?: boolean }): Promise<PortfolioProject[]> => {
    try {
      const res = await axiosInstance.get<ApiResponse<PortfolioProject[]>>('/portfolio', { params });
      return res.data.data || [];
    } catch {
      return [];
    }
  },

  getPortfolioBySlug: async (slug: string): Promise<PortfolioProject> => {
    const res = await axiosInstance.get<ApiResponse<PortfolioProject>>(`/portfolio/${slug}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Portfolio item not found');
    }
    return res.data.data;
  },

  createPortfolio: async (payload: Partial<PortfolioProject>): Promise<PortfolioProject> => {
    const res = await axiosInstance.post<ApiResponse<PortfolioProject>>('/admin/portfolio', payload);
    return res.data.data!;
  },

  updatePortfolio: async (id: number, payload: Partial<PortfolioProject>): Promise<PortfolioProject> => {
    const res = await axiosInstance.put<ApiResponse<PortfolioProject>>(`/admin/portfolio/${id}`, payload);
    return res.data.data!;
  },

  deletePortfolio: async (id: number): Promise<boolean> => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(`/admin/portfolio/${id}`);
    return res.data.success;
  },

  // Blog
  getBlogPosts: async (params?: { categorySlug?: string; page?: number; pageSize?: number }): Promise<BlogPost[]> => {
    try {
      const res = await axiosInstance.get<ApiResponse<BlogPost[]>>('/blog', { params });
      return res.data.data || [];
    } catch {
      return [];
    }
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPost> => {
    const res = await axiosInstance.get<ApiResponse<BlogPost>>(`/blog/${slug}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Article not found');
    }
    return res.data.data;
  },

  getBlogCategories: async (): Promise<BlogCategory[]> => {
    try {
      const res = await axiosInstance.get<ApiResponse<BlogCategory[]>>('/blog/categories');
      return res.data.data || [];
    } catch {
      return [];
    }
  },

  createBlogPost: async (payload: Partial<BlogPost>): Promise<BlogPost> => {
    const res = await axiosInstance.post<ApiResponse<BlogPost>>('/admin/blog', payload);
    return res.data.data!;
  },

  updateBlogPost: async (id: number, payload: Partial<BlogPost>): Promise<BlogPost> => {
    const res = await axiosInstance.put<ApiResponse<BlogPost>>(`/admin/blog/${id}`, payload);
    return res.data.data!;
  },

  deleteBlogPost: async (id: number): Promise<boolean> => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(`/admin/blog/${id}`);
    return res.data.success;
  },

  // Testimonials
  getTestimonials: async (featuredOnly = false): Promise<Testimonial[]> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Testimonial[]>>('/testimonials', {
        params: { featuredOnly },
      });
      return res.data.data || [];
    } catch {
      return [];
    }
  },

  createTestimonial: async (payload: Partial<Testimonial>): Promise<Testimonial> => {
    const res = await axiosInstance.post<ApiResponse<Testimonial>>('/admin/settings/testimonials', payload);
    return res.data.data!;
  },

  updateTestimonial: async (id: number, payload: Partial<Testimonial>): Promise<Testimonial> => {
    const res = await axiosInstance.put<ApiResponse<Testimonial>>(`/admin/settings/testimonials/${id}`, payload);
    return res.data.data!;
  },

  deleteTestimonial: async (id: number): Promise<boolean> => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(`/admin/settings/testimonials/${id}`);
    return res.data.success;
  },

  // Settings
  getSettings: async (): Promise<Record<string, string>> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Record<string, string>>>('/settings');
      return res.data.data || {};
    } catch {
      return {};
    }
  },

  updateSetting: async (key: string, value: string): Promise<boolean> => {
    const res = await axiosInstance.put<ApiResponse<boolean>>('/admin/settings', {
      settingKey: key,
      settingValue: value,
    });
    return res.data.success;
  },

  updateSettingsBatch: async (settings: Record<string, string>): Promise<boolean> => {
    const res = await axiosInstance.put<ApiResponse<boolean>>('/admin/settings/batch', settings);
    return res.data.success;
  },
};
