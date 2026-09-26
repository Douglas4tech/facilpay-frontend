'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { truncateAddress } from '@/lib/stellar';
import { DEFAULT_CONNECTED_WALLET } from '@/lib/storage';
import LiveIndicator from '@/components/payments/LiveIndicator';

export default function Navbar() {
  const pathname = usePathname();
  const { user, resetAll } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/overview" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#55C2FF] to-[#0066FF] shadow-sm shadow-[#55C2FF]/20 group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                Facil<span className="text-[#0088FF] dark:text-[#55C2FF]">Pay</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Merchant Portal
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-zinc-200 dark:border-zinc-800">
            <Link
              href="/overview"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/overview'
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/payments"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/payments'
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Payments
            </Link>
            <Link
              href="/onboarding"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/onboarding'
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Onboarding Wizard
            </Link>
          </nav>
        </div>

        {/* Right tools: Live status, Network badge, Wallet, Reset demo */}
        <div className="flex items-center gap-3">
          {/* Live Indicator (green = connected, amber = reconnecting, grey = offline) */}
          <LiveIndicator />

          {/* Stellar Network badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
            Stellar Testnet
          </div>

          {/* Connected wallet pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono">{truncateAddress(DEFAULT_CONNECTED_WALLET, 4)}</span>
          </div>

          {/* User status */}
          {user?.isLoggedIn && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="max-w-[120px] truncate font-medium text-zinc-900 dark:text-zinc-200">
                {user.name}
              </span>
            </div>
          )}

          {/* Quick Demo Reset Button */}
          <button
            onClick={resetAll}
            title="Reset wizard and auth state for testing"
            className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
