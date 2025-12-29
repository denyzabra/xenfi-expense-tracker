
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, Zap, Calendar } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, categories }) => {
  const { user } = useAuth();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get current month and year
  const getCurrentMonthYear = () => {
    const date = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const expenses = useMemo(() =>
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const stats = useMemo(() => {
    const avgExpense = transactions.length ? expenses / transactions.length : 0;

    return [
      { label: 'Total Expenses', value: `UGX ${expenses.toLocaleString()}`, icon: <DollarSign className="text-primary" />, trend: 'This Month', isUp: false },
      { label: 'Transaction Count', value: transactions.length.toString(), icon: <Activity className="text-success" />, trend: `${transactions.length} entries`, isUp: true },
      { label: 'Average Expense', value: `UGX ${avgExpense.toFixed(2)}`, icon: <TrendingDown className="text-error" />, trend: 'Per transaction', isUp: false },
      { label: 'Categories', value: new Set(transactions.map(t => t.categoryId)).size.toString(), icon: <Activity className="text-info" />, trend: 'Active', isUp: true },
    ];
  }, [transactions, expenses]);

  const categorySpending = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
      const catName = categories.find(c => c.id === t.categoryId)?.name || 'Other';
      data[catName] = (data[catName] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  // Generate chart data from real transactions (last 6 months)
  const chartData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: Record<string, { expense: number }> = {};

    // Group transactions by month
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { expense: 0 };
      }

      monthlyData[monthKey].expense += t.amount;
    });

    // Convert to array and sort by date, take last 6 months
    const sortedData = Object.entries(monthlyData)
      .map(([name, data]) => ({ name: name.split(' ')[0], ...data }))
      .slice(-6);

    // If no data, show empty chart
    return sortedData.length > 0 ? sortedData : [
      { name: 'Jan', expense: 0 },
      { name: 'Feb', expense: 0 },
      { name: 'Mar', expense: 0 },
      { name: 'Apr', expense: 0 },
      { name: 'May', expense: 0 },
      { name: 'Jun', expense: 0 },
    ];
  }, [transactions]);

  const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#3B82F6', '#EF4444', '#A855F7'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-text-secondary mt-1">{getGreeting()}, {user?.name || 'User'}. Here's what's happening with your accounts.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 text-xs font-medium bg-card-dark border border-border-dark px-3 py-1.5 rounded-lg text-text-secondary">
            <Calendar size={14} />
            {getCurrentMonthYear()}
          </div>
          <div className="flex items-center gap-2 text-sm bg-card-dark border border-border-dark px-4 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-text-secondary font-medium uppercase tracking-wider text-[10px]">Real-time Syncing</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card-dark border border-border-dark p-6 rounded-xl hover:border-primary/50 transition-all group hover:translate-y-[-2px] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-card-elevated rounded-lg group-hover:bg-primary/10 transition-colors">
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                stat.isUp ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
              }`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card-dark border border-border-dark rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Cash Flow Trend
            </h3>
            <div className="flex bg-card-elevated p-1 rounded-lg">
              <button className="text-[10px] px-2 py-1 bg-primary text-white rounded-md font-bold uppercase tracking-tight transition-all">Daily</button>
              <button className="text-[10px] px-2 py-1 text-text-muted hover:text-text-primary rounded-md font-bold uppercase tracking-tight transition-all">Monthly</button>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#71717A', fontSize: 11}}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#71717A', fontSize: 11}}
                  tickFormatter={(val) => `${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#FAFAFA' }}
                  cursor={{stroke: '#EF4444', strokeWidth: 1}}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Breakdown */}
        <div className="space-y-6">
          {/* Quick Stats Panel */}
          <div className="bg-gradient-to-br from-[#1e1b4b] to-card-dark border border-indigo-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden group min-h-[180px]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
               <Zap size={64} className="text-primary" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Zap size={14} fill="currentColor" />
              </div>
              <h3 className="font-semibold text-indigo-100">Expense Insights</h3>
            </div>
            <div className="text-xs text-indigo-100/90 leading-relaxed space-y-2">
              <p className="flex gap-2">
                <span className="text-primary shrink-0">✦</span>
                <span>You have {transactions.length} expense{transactions.length !== 1 ? 's' : ''} recorded this period</span>
              </p>
              <p className="flex gap-2">
                <span className="text-primary shrink-0">✦</span>
                <span>Total spending: UGX {expenses.toLocaleString()}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-primary shrink-0">✦</span>
                <span>Track your expenses across {new Set(transactions.map(t => t.categoryId)).size} categories</span>
              </p>
            </div>
          </div>

          {/* Category Breakdown (Pie Chart) */}
          <div className="bg-card-dark border border-border-dark rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-text-muted">Expense Breakdown</h3>
            <div className="h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '8px' }}
                    itemStyle={{ color: '#FAFAFA' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categorySpending.slice(0, 3).map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                    <span className="text-text-secondary">{item.name}</span>
                  </div>
                  <span className="font-bold">UGX {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Mini-table */}
       <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between bg-card-elevated/20">
          <h3 className="font-semibold text-sm uppercase tracking-widest text-text-muted">Recent Activity</h3>
          <button className="text-xs text-primary hover:text-primary-hover font-bold transition-all">View Full Journal</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-border-dark">
              {transactions.slice(0, 4).map((t) => (
                <tr key={t.id} className="hover:bg-card-elevated/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{t.description}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] bg-card-elevated px-2 py-0.5 rounded text-text-muted font-bold">
                      {categories.find(c => c.id === t.categoryId)?.name || 'Misc'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-error">
                    UGX {t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
