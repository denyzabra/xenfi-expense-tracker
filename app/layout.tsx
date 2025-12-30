'use client';

import "./globals.css";
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>XenFi - Expense Tracker</title>
        <meta name="description" content="Smart Financial Management, Simplified. Track expenses, analyze spending patterns, and take control of your financial future." />
      </head>
      <body className="font-sans antialiased">
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
