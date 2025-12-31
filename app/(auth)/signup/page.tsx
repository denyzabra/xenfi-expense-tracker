'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { UserPlus, Mail, Lock, User, Zap, Shield, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password, name);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
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
              Take Control of Your
              <br />
              <span className="text-primary">Financial Journey</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Join thousands of users who are already managing their expenses smarter with XenFi&apos;s intuitive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-4 p-4 bg-card-dark/50 border border-border-dark rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BarChart3 className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Powerful Analytics</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  Visualize your spending with interactive charts and real-time insights
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-card-dark/50 border border-border-dark rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <Shield className="text-success" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Bank-Level Security</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  Your data is protected with enterprise-grade encryption and security
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-card-dark/50 border border-border-dark rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Zap className="text-indigo-400" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Get Started in Seconds</h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  No credit card required. Start tracking your expenses immediately
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-card-dark border border-border-dark rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2 lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                  X
                </div>
                <span className="text-xl font-bold tracking-tight">XenFi</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Create Account</h2>
              <p className="text-text-secondary text-sm">
                Start your journey to financial clarity
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
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full bg-card-elevated border border-border-dark rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text-muted focus:bg-card-elevated focus:border-primary"
                  />
                </div>
              </div>

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
                    placeholder="you@example.com"
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
                    minLength={6}
                    className="w-full bg-card-elevated border border-border-dark rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text-muted focus:bg-card-elevated focus:border-primary"
                  />
                </div>
                <p className="text-xs text-text-muted mt-2 ml-1">
                  Minimum 6 characters required
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-card-elevated disabled:text-text-muted text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border-dark">
              <p className="text-center text-sm text-text-secondary">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-hover font-bold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-indigo-500/5 border border-primary/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="text-primary" size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary mb-1">
                    Free Forever
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    No credit card required. Full access to all features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
