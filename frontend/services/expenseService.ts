import { api } from './api';
import type { Expense } from '../types';

interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const expenseService = {
  async getAll(filters?: ExpenseFilters): Promise<Expense[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    const response = await api.get(`/expenses${query ? `?${query}` : ''}`);
    return response.data.expenses;
  },

  async getById(id: string): Promise<Expense> {
    const response = await api.get(`/expenses/${id}`);
    return response.data.expense;
  },

  async create(data: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'category'>): Promise<Expense> {
    const response = await api.post('/expenses', data);
    return response.data.expense;
  },

  async update(id: string, data: Partial<Omit<Expense, 'id' | 'userId' | 'category'>>): Promise<Expense> {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data.expense;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },
};
