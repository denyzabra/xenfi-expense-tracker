
import React, { useState } from 'react';
import { Edit2, Trash2, Filter, Download, Plus, Search, Calendar, ChevronDown } from 'lucide-react';
import { Transaction, Category } from '../types';

interface ExpensesViewProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const ExpensesView: React.FC<ExpensesViewProps> = ({ transactions, categories, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.categoryId === categoryFilter;

    // Date range filter
    const transactionDate = new Date(t.date);
    const matchesStartDate = !startDate || transactionDate >= new Date(startDate);
    const matchesEndDate = !endDate || transactionDate <= new Date(endDate);

    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-text-secondary mt-1">Review and manage your financial activity across all accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-card-elevated border border-border-dark hover:border-text-muted px-4 py-2 rounded-lg text-sm font-medium transition-all">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card-dark border border-border-dark p-4 rounded-xl space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card-elevated border border-border-dark rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text-muted" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-card-elevated border border-border-dark rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <Calendar size={16} className="text-text-muted" />
          <span className="text-xs font-semibold text-text-muted uppercase">Date Range:</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="bg-card-elevated border border-border-dark rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
            <span className="text-text-muted">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="bg-card-elevated border border-border-dark rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-xs text-primary hover:text-primary-hover font-bold px-3 py-2 rounded-lg hover:bg-primary/10 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-text-muted bg-card-elevated/50 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-card-elevated/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{t.description}</div>
                      <div className="text-[10px] text-text-muted uppercase mt-0.5">{t.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] bg-card-elevated px-2.5 py-1 rounded-md text-text-secondary border border-border-dark">
                        {getCategoryName(t.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{t.paymentMethod}</td>
                    <td className="px-6 py-4 text-text-muted flex items-center gap-1.5 pt-6">
                      <Calendar size={12} />
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-error">
                      UGX {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(t)}
                          className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-md text-text-muted transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="p-1.5 hover:bg-error/10 hover:text-error rounded-md text-text-muted transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesView;
