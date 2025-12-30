'use client';

import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Filter, Download, Search, Calendar, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction, Category } from '@/types';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';

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
  const [sorting, setSorting] = useState<SortingState>([]);

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

  // Define columns
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info) => (
          <div>
            <div className="font-medium text-text-primary">{info.getValue() as string}</div>
            <div className="text-[10px] text-text-muted uppercase mt-0.5">{info.row.original.id}</div>
          </div>
        ),
      },
      {
        accessorKey: 'categoryId',
        header: 'Category',
        cell: (info) => (
          <span className="text-[11px] bg-card-elevated px-2.5 py-1 rounded-md text-text-secondary border border-border-dark">
            {getCategoryName(info.getValue() as string)}
          </span>
        ),
      },
      {
        accessorKey: 'paymentMethod',
        header: 'Payment Method',
        cell: (info) => <span className="text-text-muted">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-text-muted">
            <Calendar size={12} />
            {new Date(info.getValue() as string).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: (info) => (
          <span className="font-bold text-error">
            UGX {(info.getValue() as number).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(info.row.original)}
              className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-md text-text-muted transition-all"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(info.row.original.id)}
              className="p-1.5 hover:bg-error/10 hover:text-error rounded-md text-text-muted transition-all"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [categories, onEdit, onDelete]
  );

  // Filter data
  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.categoryId === categoryFilter;
      const transactionDate = new Date(t.date);
      const matchesStartDate = !startDate || transactionDate >= new Date(startDate);
      const matchesEndDate = !endDate || transactionDate <= new Date(endDate);
      return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
    });
  }, [transactions, searchTerm, categoryFilter, startDate, endDate]);

  // Initialize table
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
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
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs text-primary hover:text-primary-hover font-bold px-3 py-2 rounded-lg hover:bg-primary/10 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-text-muted bg-card-elevated/50 text-[10px] uppercase tracking-wider">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 font-semibold">
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${
                            header.column.getCanSort() ? 'cursor-pointer select-none hover:text-text-primary' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-text-muted">
                              {{
                                asc: <ChevronUp size={14} />,
                                desc: <ChevronDown size={14} />,
                              }[header.column.getIsSorted() as string] ?? <ChevronsUpDown size={14} />}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border-dark">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-card-elevated/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-text-muted italic">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="border-t border-border-dark px-6 py-4 flex items-center justify-between bg-card-elevated/20">
            <div className="text-sm text-text-secondary">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                filteredData.length
              )}{' '}
              of {filteredData.length} entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-lg border border-border-dark hover:bg-card-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      table.getState().pagination.pageIndex === pageIndex
                        ? 'bg-primary text-white'
                        : 'border border-border-dark hover:bg-card-elevated text-text-secondary'
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-lg border border-border-dark hover:bg-card-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesView;
