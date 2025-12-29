
import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpensesView from './components/ExpensesView';
import TransactionModal from './components/TransactionModal';
import { Transaction, Category, TransactionType } from './types';
import { expenseService } from './services/expenseService';
import { categoryService } from './services/categoryService';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentPath, setCurrentPath] = useState('/');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; description: string } | null>(null);

  // Show notification with auto-dismiss
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch expenses and categories
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesData, categoriesData] = await Promise.all([
        expenseService.getAll(),
        categoryService.getAll(),
      ]);

      console.log('Fetched expenses:', expensesData);
      console.log('Fetched categories:', categoriesData);

      // Convert Expense to Transaction format for UI compatibility
      const transactionsData: Transaction[] = expensesData.map(expense => ({
        ...expense,
        type: TransactionType.EXPENSE,
      }));

      setTransactions(transactionsData);
      setCategories(categoriesData);

      console.log('Transactions set:', transactionsData.length);
      console.log('Categories set:', categoriesData.length);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showNotification('error', 'Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    setDeleteConfirmation({
      id,
      description: transaction?.description || 'this expense'
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await expenseService.delete(deleteConfirmation.id);
      showNotification('success', 'Expense deleted successfully!');
      setDeleteConfirmation(null);
      await fetchData();
    } catch (error: any) {
      console.error('Failed to delete:', error);
      const errorMessage = error?.message || 'Failed to delete expense. Please try again.';
      showNotification('error', errorMessage);
      setDeleteConfirmation(null);
    }
  };

  const handleSaveTransaction = async (data: Omit<Transaction, 'id'> & { id?: string }) => {
    try {
      const expenseData = {
        amount: data.amount,
        description: data.description,
        date: data.date,
        paymentMethod: data.paymentMethod,
        categoryId: data.categoryId,
        ...(data.attachmentUrl && { attachmentUrl: data.attachmentUrl }),
      };

      console.log('Saving expense data:', expenseData);

      if (data.id) {
        await expenseService.update(data.id, expenseData);
        showNotification('success', 'Expense updated successfully!');
      } else {
        const result = await expenseService.create(expenseData);
        console.log('Created expense:', result);
        showNotification('success', 'Expense created successfully!');
      }

      setIsModalOpen(false);
      setEditingTransaction(null);
      await fetchData();
    } catch (error: any) {
      console.error('Failed to save - Full error:', error);
      console.error('Error response:', error?.response);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save expense. Please try again.';
      showNotification('error', errorMessage);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'signup') {
      return <Signup onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToSignup={() => setAuthView('signup')} />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-text-secondary">Loading data...</p>
        </div>
      );
    }

    switch (currentPath) {
      case '/':
        return <Dashboard transactions={transactions} categories={categories} />;
      case '/expenses':
        return (
          <ExpensesView
            transactions={transactions}
            categories={categories}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        );
      default:
        return <Dashboard transactions={transactions} categories={categories} />;
    }
  };

  return (
    <Layout activePath={currentPath} onNavigate={setCurrentPath} onAddTransaction={handleAddTransaction}>
      {renderContent()}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        categories={categories}
        editingTransaction={editingTransaction}
      />

      {/* Notification Toast - Centered */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 pointer-events-none">
          <div className="pointer-events-auto animate-in slide-in-from-top-4 fade-in duration-300">
            <div className={`flex items-center gap-3 px-8 py-5 rounded-2xl shadow-2xl border backdrop-blur-sm ${
              notification.type === 'success'
                ? 'bg-success/20 border-success/40 text-success'
                : 'bg-error/20 border-error/40 text-error'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle size={24} className="shrink-0" />
              ) : (
                <XCircle size={24} className="shrink-0" />
              )}
              <p className="font-bold text-base">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-lg hover:opacity-70 transition-opacity font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Centered */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card-dark border border-border-dark rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-error" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Delete Expense?</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Are you sure you want to delete "<span className="font-semibold text-text-primary">{deleteConfirmation.description}</span>"? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-border-dark text-text-secondary hover:bg-card-elevated hover:text-text-primary transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-error hover:bg-error/90 text-white transition-all font-bold shadow-lg shadow-error/20 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
