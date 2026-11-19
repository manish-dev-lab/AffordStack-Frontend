import axiosInstance from './axiosInstance';
import type { ApiResponse, PagedResult, Project, ProjectStatus, ProjectMilestone } from '../types';

export const projectApi = {
  getProjects: async (params?: {
    page?: number;
    pageSize?: number;
    status?: ProjectStatus | number;
    search?: string;
  }): Promise<PagedResult<Project>> => {
    const res = await axiosInstance.get<ApiResponse<PagedResult<Project>>>('/admin/projects', {
      params,
    });
    return res.data.data || { items: [], totalCount: 0, pageIndex: 1, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
  },

  getProjectById: async (id: number): Promise<Project> => {
    const res = await axiosInstance.get<ApiResponse<Project>>(`/admin/projects/${id}`);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Project not found');
    }
    return res.data.data;
  },

  createProject: async (payload: Partial<Project>): Promise<Project> => {
    const res = await axiosInstance.post<ApiResponse<Project>>('/admin/projects', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to create project');
    }
    return res.data.data;
  },

  updateProject: async (id: number, payload: Partial<Project>): Promise<Project> => {
    const res = await axiosInstance.put<ApiResponse<Project>>(`/admin/projects/${id}`, payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Failed to update project');
    }
    return res.data.data;
  },

  addMilestone: async (projectId: number, milestone: Partial<ProjectMilestone>): Promise<boolean> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(`/admin/projects/${projectId}/milestones`, milestone);
    return res.data.success;
  },

  updateMilestoneStatus: async (milestoneId: number, isCompleted: boolean): Promise<boolean> => {
    const res = await axiosInstance.put<ApiResponse<boolean>>(`/admin/projects/milestones/${milestoneId}/status`, isCompleted);
    return res.data.success;
  },
};
