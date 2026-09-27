'use client';

import React from 'react';

interface StepWelcomeProps {
  onNext: () => void;
}

export default function StepWelcome({ onNext }: StepWelcomeProps) {
  const valueProps = [
    {
      icon: (
        <svg className="h-6 w-6 text-[#0088FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Instant Non-Custodial Settlement',
      desc: 'Funds settle directly to your Stellar wallet in 3-5 seconds with zero intermediary hold periods.',
    },
    {
      icon: (
        <svg className="h-6 w-6 text-[#0088FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Multi-Currency Stablecoins',
      desc: 'Accept USDC and EURC with near-zero network fees (<$0.0001) and eliminate chargeback fraud.',
    },
    {
      icon: (
        <svg className="h-6 w-6 text-[#0088FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Hosted Links & Developer Tools',
      desc: 'Share branded checkout links, dynamic QR codes, and connect webhooks for automated order fulfillment.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs font-semibold text-sky-700 dark:text-sky-300">
          <span className="flex h-2 w-2 rounded-full bg-[#55C2FF]" />
          Merchant Onboarding
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Welcome to <span className="text-[#0088FF] dark:text-[#55C2FF]">FacilPay</span>
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-300">
          Start accepting Stellar-powered payments in minutes. This guided wizard will configure your merchant profile, settlement account, stablecoin trustlines, and generate your first test payment link.
        </p>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {valueProps.map((prop, idx) => (
          <div
            key={idx}
            className="flex flex-col p-5 rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
          >
            <div className="h-11 w-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800/60 flex items-center justify-center mb-3">
              {prop.icon}
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1.5">
              {prop.title}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {prop.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Checklist Preview & Estimate */}
      <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Setup takes ~3 minutes • Progress is automatically saved at every step</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
          <span>Stellar Testnet Ready</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#55C2FF] to-[#0066FF] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <span>Begin Merchant Setup</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
