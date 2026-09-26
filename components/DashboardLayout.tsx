'use client';

import React from 'react';
import Navbar from './Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans text-zinc-900 antialiased dark:bg-black dark:text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              FacilPay
            </span>
            <span>•</span>
            <span>Stellar Payment Facilitation Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <span>ISO 8601 Compliance</span>
            <span>•</span>
            <span>RFC 4180 CSV Engine</span>
            <span>•</span>
            <span>Vector PDF Receipts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
