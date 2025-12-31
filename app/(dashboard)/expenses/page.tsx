'use client';

import { useEffect, useState } from 'react';
import ExpensesView from '@/components/ExpensesView';
import TransactionModal from '@/components/TransactionModal';
import ConfirmModal from '@/components/ConfirmModal';
import { Transaction, Category, TransactionType, Expense } from '@/types';
import { api } from '@/lib/utils/api-client';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTransactionModal } from '@/components/providers/TransactionModalProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { useRouter } from 'next/navigation';

export default function ExpensesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isModalOpen, editingTransaction, openModal, closeModal } = useTransactionModal();
  const { showToast } = useToast();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; transactionId: string | null }>({
    show: false,
    transactionId: null,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, categoriesRes] = await Promise.all([
        api.get<{ status: string; data: { expenses: Expense[] } }>('/expenses'),
        api.get<{ status: string; data: { categories: Category[] } }>('/categories'),
      ]);

      // Convert Expense[] to Transaction[]
      const transactionsData: Transaction[] = expensesRes.data.expenses.map((expense) => ({
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

  const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id'> & { id?: string }) => {
    try {
      if (transactionData.id) {
        // Update existing transaction
        await api.put(`/expenses/${transactionData.id}`, {
          amount: transactionData.amount,
          description: transactionData.description,
          categoryId: transactionData.categoryId,
          date: transactionData.date,
          paymentMethod: transactionData.paymentMethod,
          attachmentUrl: transactionData.attachmentUrl,
        });
        showToast('Expense updated successfully!', 'success');
      } else {
        // Create new transaction
        await api.post('/expenses', {
          amount: transactionData.amount,
          description: transactionData.description,
          categoryId: transactionData.categoryId,
          date: transactionData.date,
          paymentMethod: transactionData.paymentMethod,
          attachmentUrl: transactionData.attachmentUrl,
        });
        showToast('Expense created successfully!', 'success');
      }

      await fetchData();
      closeModal();
    } catch (error: unknown) {
      console.error('Error saving transaction:', error);
      showToast(error instanceof Error ? error.message : 'Failed to save expense. Please try again.', 'error');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    openModal(transaction);
  };

  const handleDeleteTransaction = (id: string) => {
    setDeleteConfirm({ show: true, transactionId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.transactionId) return;

    try {
      await api.delete(`/expenses/${deleteConfirm.transactionId}`);
      showToast('Expense deleted successfully!', 'success');
      setDeleteConfirm({ show: false, transactionId: null });
      await fetchData();
    } catch (error: unknown) {
      console.error('Error deleting transaction:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete expense. Please try again.', 'error');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <ExpensesView
        transactions={transactions}
        categories={categories}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
      <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTransaction}
        categories={categories}
        editingTransaction={editingTransaction}
      />
      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, transactionId: null })}
        onConfirm={confirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
      />
    </>
  );
}
