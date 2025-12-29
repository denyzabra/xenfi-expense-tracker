import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, Zap, TrendingUp, DollarSign } from 'lucide-react';

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8 animate-in fade-in duration-1000">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-primary/30">
              X
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">XenFi</h1>
              <p className="text-text-muted text-sm uppercase tracking-widest">Expense Tracker</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Smart Financial Management,
              <br />
              <span className="text-primary">Simplified.</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Track expenses, analyze spending patterns, and take control of your financial future with XenFi's powerful analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-4 p-4 bg-card-dark/50 border border-border-dark rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Real-time Analytics</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  Get instant insights into your spending habits with beautiful visualizations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-card-dark/50 border border-border-dark rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <DollarSign className="text-success" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Category Breakdown</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  Organize expenses across multiple categories for better tracking
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-card-dark/50 border border-border-dark rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Zap className="text-indigo-400" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Secure & Private</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  Your financial data is encrypted and protected with industry-standard security
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-card-dark border border-border-dark rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2 lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                  X
                </div>
                <span className="text-xl font-bold tracking-tight">XenFi</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h2>
              <p className="text-text-secondary text-sm">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl">
                <p className="text-error text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-muted uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="demo@xenfi.com"
                    className="w-full bg-card-elevated border border-border-dark rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text-muted focus:bg-card-elevated focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-text-muted uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-card-elevated border border-border-dark rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text-muted focus:bg-card-elevated focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-card-elevated disabled:text-text-muted text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border-dark">
              <p className="text-center text-sm text-text-secondary">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="text-primary hover:text-primary-hover font-bold transition-colors"
                >
                  Create account
                </button>
              </p>
            </div>

            <div className="mt-6 p-4 bg-card-elevated/50 border border-border-dark rounded-xl">
              <p className="text-xs text-text-muted text-center mb-2 font-semibold uppercase tracking-wider">
                Demo Account
              </p>
              <div className="flex items-center justify-center gap-4 text-xs">
                <span className="text-text-secondary font-mono">demo@xenfi.com</span>
                <span className="text-text-muted">/</span>
                <span className="text-text-secondary font-mono">password123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
