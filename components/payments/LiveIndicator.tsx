'use client';

import React from 'react';
import { usePaymentStream } from '@/lib/payment-stream-context';

export default function LiveIndicator() {
  const { status, reconnect, reconnectAttempts, isPaused } = usePaymentStream();

  let dotColor = 'bg-zinc-400';
  let badgeColor = 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400';
  let text = 'Offline';

  if (status === 'connected') {
    dotColor = 'bg-emerald-500 animate-pulse';
    badgeColor = 'border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300';
    text = 'Live';
  } else if (status === 'reconnecting') {
    dotColor = 'bg-amber-500 animate-ping';
    badgeColor = 'border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300';
    text = reconnectAttempts > 0 ? `Reconnecting (${reconnectAttempts})...` : 'Connecting...';
  } else if (status === 'paused' || isPaused) {
    dotColor = 'bg-zinc-400';
    badgeColor = 'border-zinc-200 bg-zinc-100/70 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400';
    text = 'Paused (Tab Hidden)';
  }

  return (
    <button
      type="button"
      onClick={status !== 'connected' ? reconnect : undefined}
      title={
        status === 'connected'
          ? 'Horizon SSE Stream Active'
          : 'Click to force reconnect stream'
      }
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${badgeColor}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      <span>{text}</span>
    </button>
  );
}
