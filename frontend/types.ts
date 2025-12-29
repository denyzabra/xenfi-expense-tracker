export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export enum TransactionType {
  EXPENSE = 'EXPENSE'
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  attachmentUrl?: string;
  categoryId: string;
  userId?: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

// Alias for backward compatibility with existing UI components
export interface Transaction extends Expense {
  type: TransactionType;
}

export interface DashboardStats {
  summary: {
    totalAmount: number;
    totalCount: number;
    period: {
      start: string;
      end: string;
    };
  };
  categoryBreakdown: Array<{
    category: Category;
    totalAmount: number;
    count: number;
  }>;
  recentExpenses: Expense[];
}

export interface AuthResponse {
  status: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  currency: string;
}
