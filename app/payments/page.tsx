'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/lib/auth-context';
import { PaymentStreamProvider, usePaymentStream } from '@/lib/payment-stream-context';
import RecentPaymentsTable from '@/components/payments/RecentPaymentsTable';
import PaymentToast from '@/components/payments/PaymentToast';

function PaymentsPageContent() {
  const { payments } = usePaymentStream();

  const totalUsdc = payments
    .filter((p) => p.asset_code === 'USDC')
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  const totalEurc = payments
    .filter((p) => p.asset_code === 'EURC')
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  const totalXlm = payments
    .filter((p) => p.asset_code === 'XLM')
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/overview" className="hover:text-zinc-900 dark:hover:text-white">
          Overview
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">Payments</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            On-Chain Payment Stream
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time feed of all incoming transactions streaming from Stellar Testnet Horizon.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500">USDC Volume</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-white font-mono mt-1">
            ${totalUsdc.toFixed(2)} USDC
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500">EURC Volume</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-white font-mono mt-1">
            €{totalEurc.toFixed(2)} EURC
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60">
          <span className="text-xs text-zinc-500">XLM Volume</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-white font-mono mt-1">
            {totalXlm.toFixed(2)} XLM
          </div>
        </div>
      </div>

      {/* Full Payments Table */}
      <RecentPaymentsTable maxRows={100} showViewAll={false} />

      <PaymentToast />
    </main>
  );
}

export default function PaymentsPage() {
  return (
    <AuthProvider>
      <PaymentStreamProvider>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col">
          <Navbar />
          <PaymentsPageContent />
        </div>
      </PaymentStreamProvider>
    </AuthProvider>
  );
}
