'use client';

import React from 'react';

interface FailureWarningBannerProps {
  failureRate: number;
  failedCount: number;
  totalCount: number;
  onFilterFailed: () => void;
}

export default function FailureWarningBanner({
  failureRate,
  failedCount,
  totalCount,
  onFilterFailed,
}: FailureWarningBannerProps) {
  if (failureRate <= 20) return null;

  return (
    <div className="rounded-2xl border border-rose-300 bg-gradient-to-r from-rose-50 via-rose-50/70 to-amber-50/60 p-4 sm:p-5 dark:border-rose-900/80 dark:from-rose-950/40 dark:via-zinc-950 dark:to-amber-950/20 shadow-sm animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300 font-bold text-base">
            ⚠️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                High Webhook Delivery Failure Rate ({failureRate}%)
              </h4>
              <span className="rounded-full bg-rose-200/80 dark:bg-rose-900 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:text-rose-200 uppercase">
                Threshold: &gt;20%
              </span>
            </div>
            <p className="text-xs text-rose-800/80 dark:text-rose-300/80 mt-1 max-w-2xl leading-relaxed">
              <strong>{failedCount} of {totalCount}</strong> deliveries to this endpoint failed or timed out over the past 7 days. Automatic retry with exponential backoff is active, but your receiving server may be experiencing downtime or database pool exhaustion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={onFilterFailed}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm transition-colors cursor-pointer"
          >
            <span>View Failed Deliveries</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
