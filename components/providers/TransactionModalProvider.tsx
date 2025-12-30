'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction } from '@/types';

interface TransactionModalContextType {
  isModalOpen: boolean;
  editingTransaction: Transaction | null;
  openModal: (transaction?: Transaction) => void;
  closeModal: () => void;
}

const TransactionModalContext = createContext<TransactionModalContextType | undefined>(undefined);

export function TransactionModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const openModal = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <TransactionModalContext.Provider
      value={{
        isModalOpen,
        editingTransaction,
        openModal,
        closeModal,
      }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
}

export function useTransactionModal() {
  const context = useContext(TransactionModalContext);
  if (!context) throw new Error('useTransactionModal must be used within TransactionModalProvider');
  return context;
}
