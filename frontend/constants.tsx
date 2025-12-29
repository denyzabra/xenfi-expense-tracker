
import React from 'react';
import {
  LayoutDashboard,
  ArrowDownLeft,
  Zap
} from 'lucide-react';

export const NAV_ITEMS = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { name: 'Expenses', icon: <ArrowDownLeft size={20} />, path: '/expenses' },
];

export const AI_AVATAR = (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
    <Zap size={14} fill="currentColor" />
  </div>
);
