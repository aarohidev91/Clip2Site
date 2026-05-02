import type { ExportResponse, GenerationResponse, ProviderStatus } from '../types/generation';
import type { CreateProjectData, Project } from '../types/project';
import api from './api';

export const projectsService = {
  async list(): Promise<Project[]> {
    const { data } = await api.get<Project[]>('/api/projects');
    return data;
  },

  async create(projectData: CreateProjectData): Promise<Project> {
    const { data } = await api.post<Project>('/api/projects', projectData);
    return data;
  },

  async get(id: string): Promise<Project> {
    const { data } = await api.get<Project>(`/api/projects/${id}`);
    return data;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data } = await api.put<Project>(`/api/projects/${id}`, updates);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/projects/${id}`);
  },

  async uploadVideo(projectId: string, file: File): Promise<Project> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<Project>(`/api/projects/${projectId}/upload-video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async generate(projectId: string): Promise<GenerationResponse> {
    const { data } = await api.post<GenerationResponse>(`/api/projects/${projectId}/generate`);
    return data;
  },

  async updateContent(projectId: string, content: Record<string, unknown>): Promise<Project> {
    const { data } = await api.put<Project>(`/api/projects/${projectId}/content`, {
      generated_content: content,
    });
    return data;
  },

  async exportHtml(projectId: string): Promise<ExportResponse> {
    const { data } = await api.post<ExportResponse>(`/api/projects/${projectId}/export/html`);
    return data;
  },

  async exportReact(projectId: string): Promise<ExportResponse> {
    const { data } = await api.post<ExportResponse>(`/api/projects/${projectId}/export/react`);
    return data;
  },

  async getProviderStatus(): Promise<ProviderStatus> {
    const { data } = await api.get<ProviderStatus>('/api/provider/status');
    return data;
  },
};
