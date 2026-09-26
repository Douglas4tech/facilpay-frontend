'use client';

import React, { useState } from 'react';
import { SettlementAccount } from '@/types/onboarding';
import { isValidStellarAddress, truncateAddress } from '@/lib/stellar';
import { DEFAULT_CONNECTED_WALLET } from '@/lib/storage';

interface StepSettlementProps {
  initialData: SettlementAccount;
  onNext: (data: SettlementAccount) => void;
  onBack: () => void;
}

export default function StepSettlement({
  initialData,
  onNext,
  onBack,
}: StepSettlementProps) {
  const [accountType, setAccountType] = useState<'connected' | 'custom'>(
    initialData.type || 'connected'
  );
  const [customAddress, setCustomAddress] = useState(
    initialData.type === 'custom' ? initialData.address : ''
  );
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const connectedWallet = initialData.connectedWalletAddress || DEFAULT_CONNECTED_WALLET;

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTypeSelect = (type: 'connected' | 'custom') => {
    setAccountType(type);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (accountType === 'connected') {
      onNext({
        type: 'connected',
        address: connectedWallet,
        connectedWalletAddress: connectedWallet,
      });
    } else {
      const trimmed = customAddress.trim();
      if (!trimmed) {
        setError('Please enter a Stellar public key address');
        return;
      }
      if (!isValidStellarAddress(trimmed)) {
        setError('Invalid Stellar address. Must start with "G" and be 56 alphanumeric characters (base32).');
        return;
      }
      setError('');
      onNext({
        type: 'custom',
        address: trimmed,
        connectedWalletAddress: connectedWallet,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Settlement Account
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          FacilPay is non-custodial. All customer payments are automatically routed and settled directly to your designated Stellar wallet.
        </p>
      </div>

      {/* Account Type Selection Options */}
      <div className="space-y-3">
        {/* Option 1: Connected Wallet */}
        <label
          onClick={() => handleTypeSelect('connected')}
          className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
            accountType === 'connected'
              ? 'border-sky-400 bg-sky-50/60 dark:border-sky-700 dark:bg-sky-950/40 ring-2 ring-sky-200 dark:ring-sky-900/60'
              : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60'
          }`}
        >
          <div className="flex items-start sm:items-center gap-3">
            <input
              type="radio"
              name="accountType"
              checked={accountType === 'connected'}
              onChange={() => handleTypeSelect('connected')}
              className="mt-1 sm:mt-0 h-4 w-4 text-sky-600 focus:ring-sky-500 border-zinc-300"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Connected Stellar Wallet
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
                  {truncateAddress(connectedWallet, 8)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(connectedWallet);
                  }}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  title="Copy full address"
                >
                  {copied ? (
                    <span className="text-[10px] font-medium text-emerald-600">Copied!</span>
                  ) : (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <span className="mt-2 sm:mt-0 text-[11px] font-medium text-sky-600 dark:text-sky-400">
            Recommended
          </span>
        </label>

        {/* Option 2: Enter another address */}
        <label
          onClick={() => handleTypeSelect('custom')}
          className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${
            accountType === 'custom'
              ? 'border-sky-400 bg-sky-50/60 dark:border-sky-700 dark:bg-sky-950/40 ring-2 ring-sky-200 dark:ring-sky-900/60'
              : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="accountType"
              checked={accountType === 'custom'}
              onChange={() => handleTypeSelect('custom')}
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-zinc-300"
            />
            <div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                Enter Another Settlement Address
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Specify a dedicated cold wallet, multi-sig vault, or custodial treasury address.
              </p>
            </div>
          </div>

          {/* Custom Address Input */}
          {accountType === 'custom' && (
            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Stellar Public Key (G...) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={customAddress}
                onChange={(e) => {
                  setCustomAddress(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 font-mono text-xs transition-all focus:outline-none dark:bg-zinc-900 dark:text-white ${
                  error
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-rose-600'
                    : 'border-zinc-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-zinc-700'
                }`}
              />
              {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
            </div>
          )}
        </label>
      </div>

      {/* Security notice */}
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/50 p-4 dark:border-sky-900/60 dark:bg-sky-950/20 text-xs text-sky-800 dark:text-sky-300 flex items-start gap-3">
        <svg className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="leading-relaxed">
          <strong>Non-Custodial Architecture:</strong> FacilPay does not hold your funds. Settlements execute directly on the Stellar ledger via smart contracts with cryptographic proof.
        </p>
      </div>

      {/* Navigation Buttons */}
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
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#55C2FF] to-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <span>Next: Trustlines Setup</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </form>
  );
}
