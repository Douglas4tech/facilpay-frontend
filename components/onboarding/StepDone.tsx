'use client';

import React from 'react';
import Link from 'next/link';
import { OnboardingState } from '@/types/onboarding';
import { truncateAddress } from '@/lib/stellar';

interface StepDoneProps {
  data: OnboardingState;
  onFinish: () => void;
  onBack: () => void;
}

export default function StepDone({ data, onFinish, onBack }: StepDoneProps) {
  const { business, settlement, trustlines, branding, paymentLink } = data;

  const checklistItems = [
    {
      title: 'Merchant Profile Configured',
      detail: `${business.name || 'Acme Store'} • ${business.category || 'E-Commerce'} (${business.country || 'Global'})`,
      icon: '🏢',
      status: 'Ready',
    },
    {
      title: 'Settlement Account Designated',
      detail: `Stellar Testnet Address: ${truncateAddress(settlement.address, 6)}`,
      icon: '👛',
      status: 'Connected',
    },
    {
      title: 'Stablecoin Trustlines Active',
      detail: `USDC (${trustlines.usdc ? 'Active' : 'Configured'}) • EURC (${trustlines.eurc ? 'Active' : 'Configured'})`,
      icon: '⚡',
      status: 'Enabled',
    },
    {
      title: 'Branding & Hosted Checkout',
      detail: branding.skipped
        ? 'Standard FacilPay Theme'
        : `Custom Logo & Accent (${branding.brandColor})`,
      icon: '🎨',
      status: 'Styled',
    },
    {
      title: 'First Payment Link Generated',
      detail: `${paymentLink.title || 'Demo Link'}: $${paymentLink.amount || '10.00'} ${paymentLink.currency || 'USDC'}`,
      icon: '🔗',
      status: 'Live',
    },
  ];

  const quickLinks = [
    {
      title: 'Webhooks Integration',
      description: 'Receive real-time automated HTTP POST payloads for every payment and refund.',
      href: '/settings/webhooks',
      badge: 'Developers',
    },
    {
      title: 'API Keys Management',
      description: 'Generate publishable and secret API keys to connect FacilPay SDK to your backend.',
      href: '/settings/api-keys',
      badge: 'SDK Access',
    },
    {
      title: 'Developer Documentation',
      description: 'Review API references, Soroban contract addresses, and sample code in our docs.',
      href: 'https://docs.facilpay.io',
      external: true,
      badge: 'Docs',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Celebration Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-2xl shadow-sm">
          🎉
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          You&apos;re All Set to Accept Payments!
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Your merchant profile and Stellar settlement pipeline are ready. Review your summary below or explore developer integrations.
        </p>
      </div>

      {/* Summary Checklist */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          Onboarding Configuration Checklist
        </h3>

        <div className="space-y-2.5">
          {checklistItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/80 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>{item.title}</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      ✓ Done
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{item.detail}</p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Links: Webhooks, API keys and Docs */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Next Steps & Developer Tools
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
            >
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    {link.title}
                  </span>
                  <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9px] font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-100 dark:border-sky-900">
                    {link.badge}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {link.description}
                </p>
              </div>

              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                >
                  <span>Open Documentation</span>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                >
                  <span>Configure Now</span>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation & Launch Dashboard Button */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onFinish}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#55C2FF] to-[#0066FF] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <span>Complete Onboarding & Go to Overview</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
