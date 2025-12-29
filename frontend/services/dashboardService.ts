import { api } from './api';
import type { DashboardStats } from '../types';

interface DashboardFilters {
  startDate?: string;
  endDate?: string;
}

export const dashboardService = {
  async getStats(filters?: DashboardFilters): Promise<DashboardStats> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value);
        }
      });
    }
    const query = queryParams.toString();
    const response = await api.get(`/dashboard${query ? `?${query}` : ''}`);
    return response.data;
  },
};
