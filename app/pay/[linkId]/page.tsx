'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOnboardingState } from '@/lib/storage';
import { OnboardingState } from '@/types/onboarding';
import { generateQRSvg } from '@/lib/qr';
import { truncateAddress } from '@/lib/stellar';

export default function HostedPayPage() {
  const params = useParams();
  const linkId = params?.linkId as string;

  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');

  useEffect(() => {
    const data = getOnboardingState();
    setOnboarding(data);

    if (typeof window !== 'undefined') {
      const svg = generateQRSvg(window.location.href, {
        size: 160,
        margin: 2,
        fgColor: '#000000',
        bgColor: '#ffffff',
      });
      setQrSvg(svg);
    }
  }, []);

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      const hash = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      setTxHash(hash);
      setIsPaying(false);
      setIsPaid(true);
    }, 1200);
  };

  const business = onboarding?.business;
  const branding = onboarding?.branding;
  const paymentLink = onboarding?.paymentLink;
  const settlement = onboarding?.settlement;

  const brandColor = branding?.brandColor || '#55C2FF';
  const logoUrl = branding?.logoUrl;
  const title = paymentLink?.title || 'Test Payment';
  const amount = paymentLink?.amount || '10.00';
  const currency = paymentLink?.currency || 'USDC';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4">
      {/* Checkout Card */}
      <div className="w-full max-w-md rounded-3xl border border-zinc-200/80 bg-white/95 p-6 sm:p-8 shadow-2xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950 space-y-6">
        {/* Merchant Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm shadow-sm overflow-hidden"
              style={{ backgroundColor: brandColor }}
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
              ) : (
                (business?.name || 'F').charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[200px]">
                {business?.name || 'FacilPay Merchant'}
              </h2>
              <span className="text-[10px] text-zinc-400 font-mono">
                Order ID: {linkId?.slice(0, 14)}...
              </span>
            </div>
          </div>

          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            Stellar Testnet
          </span>
        </div>

        {!isPaid ? (
          <div className="space-y-6">
            {/* Amount details */}
            <div className="text-center py-2 space-y-1">
              <span className="text-xs text-zinc-500">{title}</span>
              <div className="text-3xl font-extrabold tracking-tight font-mono text-zinc-900 dark:text-white">
                ${amount} <span className="text-base font-semibold text-zinc-500">{currency}</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
              {qrSvg ? (
                <div
                  className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <div className="h-40 w-40 flex items-center justify-center text-xs text-zinc-400">
                  Loading QR...
                </div>
              )}
              <span className="text-[11px] text-zinc-400 font-mono mt-2">
                Scan with any Stellar QR wallet to pay
              </span>
            </div>

            {/* Settlement destination notice */}
            <div className="text-center text-[11px] text-zinc-400">
              Direct non-custodial settlement to{' '}
              <span className="font-mono text-zinc-600 dark:text-zinc-300">
                {truncateAddress(settlement?.address || '', 4)}
              </span>
            </div>

            {/* Pay Button styled with custom brandColor */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isPaying}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-all hover:opacity-95 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: brandColor }}
            >
              {isPaying ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Processing Settlement on Stellar...</span>
                </>
              ) : (
                <span>Pay ${amount} {currency}</span>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4 animate-fadeIn">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl mx-auto shadow-sm">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Payment Received & Settled!
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                ${amount} {currency} has settled into the merchant wallet.
              </p>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-left border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-zinc-400">
                Stellar Transaction Hash
              </span>
              <p className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 break-all">
                {txHash}
              </p>
            </div>

            <Link
              href="/overview"
              className="inline-flex items-center justify-center w-full rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900 hover:opacity-90"
            >
              Return to Merchant Overview
            </Link>
          </div>
        )}

        <div className="text-center text-[10px] text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          Powered by <span className="font-bold text-zinc-600 dark:text-zinc-300">FacilPay</span> • Stellar Network
        </div>
      </div>
    </div>
  );
}
