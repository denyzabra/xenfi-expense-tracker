
import { Transaction, TransactionType, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Food & Dining', description: 'Groceries and restaurants' },
  { id: 'cat_2', name: 'Transport', description: 'Fuel, public transit, Uber' },
  { id: 'cat_3', name: 'Housing', description: 'Rent and utilities' },
  { id: 'cat_4', name: 'Entertainment', description: 'Movies, streaming, hobbies' },
  { id: 'cat_5', name: 'Salary', description: 'Primary income' },
  { id: 'cat_6', name: 'Investment', description: 'Stocks and bonds' },
  { id: 'cat_7', name: 'Shopping', description: 'Clothing and gadgets' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 4500, type: TransactionType.INCOME, categoryId: 'cat_5', description: 'Monthly Salary', date: '2024-05-01', paymentMethod: 'Bank Transfer' },
  { id: '2', amount: 120, type: TransactionType.EXPENSE, categoryId: 'cat_1', description: 'Grocery shopping', date: '2024-05-02', paymentMethod: 'Credit Card' },
  { id: '3', amount: 45, type: TransactionType.EXPENSE, categoryId: 'cat_2', description: 'Uber ride', date: '2024-05-03', paymentMethod: 'Cash' },
  { id: '4', amount: 800, type: TransactionType.EXPENSE, categoryId: 'cat_3', description: 'Rent payment', date: '2024-05-05', paymentMethod: 'Direct Debit' },
  { id: '5', amount: 200, type: TransactionType.INCOME, categoryId: 'cat_6', description: 'Dividend payment', date: '2024-05-10', paymentMethod: 'Bank Transfer' },
  { id: '6', amount: 60, type: TransactionType.EXPENSE, categoryId: 'cat_4', description: 'Movie tickets', date: '2024-05-12', paymentMethod: 'Credit Card' },
  { id: '7', amount: 150, type: TransactionType.EXPENSE, categoryId: 'cat_7', description: 'New headphones', date: '2024-05-15', paymentMethod: 'Credit Card' },
  { id: '8', amount: 25, type: TransactionType.EXPENSE, categoryId: 'cat_1', description: 'Coffee', date: '2024-05-16', paymentMethod: 'Mobile Pay' },
];

export const MOCK_CHART_DATA = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];
