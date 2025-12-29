import { api } from './api';
import type { Category } from '../types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data.categories;
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data.category;
  },

  async create(data: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const response = await api.post('/categories', data);
    return response.data.category;
  },

  async update(id: string, data: Partial<Omit<Category, 'id' | 'userId'>>): Promise<Category> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.category;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
