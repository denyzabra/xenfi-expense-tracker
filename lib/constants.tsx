import {
  LayoutDashboard,
  ArrowDownLeft,
  Tag,
  type LucideIcon
} from 'lucide-react';

export const NAV_ITEMS: Array<{ name: string; icon: LucideIcon; path: string }> = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Expenses', icon: ArrowDownLeft, path: '/expenses' },
  { name: 'Categories', icon: Tag, path: '/categories' },
];
