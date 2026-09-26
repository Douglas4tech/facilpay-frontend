'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ExportModal from '@/components/ExportModal';
import { Refund } from '@/lib/types';
import { INITIAL_REFUNDS, REFUND_EXPORT_COLUMNS } from '@/lib/mockData';

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>(INITIAL_REFUNDS);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [assetFilter, setAssetFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-01-31');

  // Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filtered Refunds
  const filteredRefunds = useMemo(() => {
    return refunds.filter((item) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesQuery =
          item.id.toLowerCase().includes(query) ||
          item.paymentId.toLowerCase().includes(query) ||
          item.reason.toLowerCase().includes(query) ||
          item.customerWallet.toLowerCase().includes(query) ||
          item.txHash.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      if (assetFilter !== 'ALL' && item.asset !== assetFilter) {
        return false;
      }

      if (startDate) {
        const itemDate = item.date.slice(0, 10);
        if (itemDate < startDate) return false;
      }
      if (endDate) {
        const itemDate = item.date.slice(0, 10);
        if (itemDate > endDate) return false;
      }

      return true;
    });
  }, [refunds, searchTerm, statusFilter, assetFilter, startDate, endDate]);

  const filterSummary = useMemo(() => {
    const parts = [];
    if (statusFilter !== 'ALL') parts.push(`Status: ${statusFilter}`);
    if (assetFilter !== 'ALL') parts.push(`Asset: ${assetFilter}`);
    if (startDate && endDate) parts.push(`${startDate} to ${endDate}`);
    return parts.length > 0 ? parts.join(' • ') : 'All Dates & Assets';
  }, [statusFilter, assetFilter, startDate, endDate]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setAssetFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Refunds
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Track customer refund reversals, reason codes, and export accounting reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="export-refunds-btn"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#000F24] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-[#55C2FF] dark:text-black dark:hover:bg-[#A5D4FF]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Export CSV</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-mono dark:bg-black/20">
                {filteredRefunds.length.toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
                Search Refunds
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Refund ID, payment ID, reason..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 focus:border-sky-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
                Asset
              </label>
              <select
                value={assetFilter}
                onChange={(e) => setAssetFilter(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 focus:border-sky-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="ALL">All Assets</option>
                <option value="USDC">USDC</option>
                <option value="XLM">XLM</option>
                <option value="EURC">EURC</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-2.5 py-2 text-xs text-zinc-900 focus:border-sky-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-2.5 py-2 text-xs text-zinc-900 focus:border-sky-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800">
            <span>
              Showing{' '}
              <strong className="text-zinc-900 dark:text-white">
                {filteredRefunds.length}
              </strong>{' '}
              of {refunds.length} refunds
            </span>
            {(searchTerm ||
              statusFilter !== 'ALL' ||
              assetFilter !== 'ALL' ||
              startDate !== '2026-01-01' ||
              endDate !== '2026-01-31') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Refunds Table */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 uppercase tracking-wider text-[11px] font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                <tr>
                  <th className="px-5 py-3.5">Refund ID</th>
                  <th className="px-5 py-3.5">Original Payment</th>
                  <th className="px-5 py-3.5">Date (UTC)</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Tx Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
                {filteredRefunds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                      No refunds found matching the active criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRefunds.map((refund) => (
                    <tr
                      key={refund.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    >
                      <td className="px-5 py-4 font-mono font-semibold text-zinc-900 dark:text-white">
                        {refund.id}
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-600 dark:text-zinc-400">
                        {refund.paymentId}
                      </td>
                      <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                        {refund.date.slice(0, 10)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-zinc-900 dark:text-white">
                        {refund.amount.toFixed(2)}{' '}
                        <span className="font-normal text-zinc-500">
                          {refund.asset}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                            refund.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                          }`}
                        >
                          {refund.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-zinc-700 dark:text-zinc-300 max-w-xs truncate">
                        {refund.reason}
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-500">
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${refund.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline dark:text-sky-400"
                        >
                          {refund.txHash.slice(0, 8)}...
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CSV Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        type="refunds"
        title="Refunds"
        data={filteredRefunds}
        columns={REFUND_EXPORT_COLUMNS}
        filterStartDate={startDate}
        filterEndDate={endDate}
        filterSummary={filterSummary}
      />
    </DashboardLayout>
  );
}
