'use client';

import { useState, useEffect } from 'react';
import { TransactionModalProvider, useTransactionModal } from '@/components/providers/TransactionModalProvider';
import { useToast } from '@/components/providers/ToastProvider';
import Layout from '@/components/Layout';
import TransactionModal from '@/components/TransactionModal';
import { api } from '@/lib/utils/api-client';
import { Category, Transaction } from '@/types';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isModalOpen, closeModal, editingTransaction } = useTransactionModal();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get<{ status: string; data: { categories: Category[] } }>('/categories');
      setCategories(response.data.categories);
    } catch {
      showToast('Failed to load categories', 'error');
    }
  };

  const handleSaveTransaction = async (transaction: Omit<Transaction, 'id'> & { id?: string }) => {
    try {
      if (transaction.id) {
        await api.put(`/expenses/${transaction.id}`, transaction);
        showToast('Expense updated successfully!', 'success');
      } else {
        await api.post('/expenses', transaction);
        showToast('Expense created successfully!', 'success');
      }
      closeModal();
      setTimeout(() => window.location.reload(), 500);
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Failed to save expense', 'error');
    }
  };

  return (
    <>
      <Layout>{children}</Layout>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTransaction}
        categories={categories}
        editingTransaction={editingTransaction}
      />
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TransactionModalProvider>
      <DashboardContent>{children}</DashboardContent>
    </TransactionModalProvider>
  );
}
