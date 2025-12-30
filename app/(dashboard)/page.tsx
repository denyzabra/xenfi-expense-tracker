'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { api } from '@/lib/utils/api-client';
import { Transaction, Category, TransactionType } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        api.get<{ status: string; data: { expenses: any[] } }>('/expenses'),
        api.get<{ status: string; data: { categories: Category[] } }>('/categories'),
      ]);

      // Transform expenses to transactions
      const transactionsData: Transaction[] = expensesRes.data.expenses.map((expense: any) => ({
        ...expense,
        type: TransactionType.EXPENSE,
      }));

      setTransactions(transactionsData);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return <Dashboard transactions={transactions} categories={categories} />;
}
