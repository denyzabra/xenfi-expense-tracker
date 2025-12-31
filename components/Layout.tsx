'use client';

import React, { useState } from 'react';
import { Search, Menu, X, Plus, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTransactionModal } from '@/components/providers/TransactionModalProvider';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  isRefreshing?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isRefreshing = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { openModal } = useTransactionModal();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-dark text-text-primary">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-56' : 'w-16'
        } flex-shrink-0 transition-all duration-300 ease-in-out border-r border-border-dark flex flex-col bg-card-dark z-20 shadow-xl`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-primary/20">
              X
            </div>
            {isSidebarOpen && <span className="text-xl font-bold tracking-tight">XenFi</span>}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-card-elevated rounded-md text-text-secondary transition-colors"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                  isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-text-secondary hover:bg-card-elevated hover:text-text-primary'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-text-muted group-hover:text-primary transition-colors'}>
                  <Icon size={20} />
                </span>
                {isSidebarOpen && <span className="font-medium whitespace-nowrap text-sm tracking-tight">{item.name}</span>}
                {!isSidebarOpen && isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-dark bg-card-elevated/10 space-y-2">
          <div className="flex items-center gap-3">
            <img
              src="https://picsum.photos/seed/xenfi-user/80/80"
              className="w-10 h-10 rounded-full border border-border-dark shadow-sm"
              alt="Avatar"
            />
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate tracking-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-text-secondary hover:bg-card-elevated hover:text-error group"
          >
            <LogOut size={18} className="shrink-0" />
            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-border-dark flex items-center justify-between px-6 bg-card-dark/60 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Instant jump to transaction..."
              className="w-full bg-card-elevated/50 border border-border-dark rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-text-muted focus:bg-card-elevated"
            />
          </div>

          <div className="flex items-center gap-4">
            {isRefreshing && (
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span>Syncing...</span>
              </div>
            )}
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <Plus size={18} />
              <span>Create Entry</span>
            </button>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-background-dark scroll-smooth">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
