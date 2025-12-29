
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> & { id?: string }) => void;
  categories: Category[];
  editingTransaction?: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  editingTransaction
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    amount: 0,
    type: TransactionType.EXPENSE,
    categoryId: categories[0]?.id || '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        categoryId: editingTransaction.categoryId,
        description: editingTransaction.description,
        date: editingTransaction.date,
        paymentMethod: editingTransaction.paymentMethod,
        attachmentUrl: editingTransaction.attachmentUrl,
      });
    } else {
      setFormData({
        amount: 0,
        type: TransactionType.EXPENSE,
        categoryId: categories[0]?.id || '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Credit Card',
      });
    }
  }, [editingTransaction, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Convert date string to ISO datetime format for backend
      const dateTime = new Date(formData.date + 'T00:00:00.000Z').toISOString();
      await onSave({ ...formData, date: dateTime, id: editingTransaction?.id });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card-dark border border-border-dark w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between bg-card-elevated/30">
          <h2 className="text-xl font-bold">{editingTransaction ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-card-elevated rounded-full text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase">Amount (UGX)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                placeholder="10000"
                className="w-full bg-card-elevated border border-border-dark rounded-lg py-2 px-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase">Description</label>
            <input
              type="text"
              required
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-card-elevated border border-border-dark rounded-lg py-2 px-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-card-elevated border border-border-dark rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-card-elevated border border-border-dark rounded-lg py-2 px-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase">Payment Method</label>
            <input
              type="text"
              placeholder="e.g. Credit Card, Cash, PayPal"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full bg-card-elevated border border-border-dark rounded-lg py-2 px-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border-dark text-text-secondary hover:bg-card-elevated hover:text-text-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white px-4 py-2.5 rounded-lg font-bold transition-all disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {editingTransaction ? 'Update' : 'Save Transaction'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
