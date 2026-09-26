import type { Metadata } from "next";

import { getMockPayments } from "@/app/lib/api/payments";
import { PaymentsListClient } from "@/app/components/payments/PaymentsListClient";

export const metadata: Metadata = {
  title: "Payments — FacilPay",
  description: "Browse, search and filter all your FacilPay payment transactions.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
// Server Component: computes the unfiltered summary stats once at request time,
// then hands off to the fully-interactive PaymentsListClient for filtering,
// sorting, and pagination.

export default function PaymentsPage() {
  const all = getMockPayments();

  const totalCount     = all.length;
  const completedCount = all.filter((p) => p.status === "completed").length;
  const inProgressCount = all.filter(
    (p) => p.status === "pending" || p.status === "processing"
  ).length;
  const failedCount    = all.filter((p) => p.status === "failed").length;
  const totalVolumeUsd = all.reduce((sum, p) => sum + (p.amountUsd ?? p.amount), 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-2">
        {/* ── Page header ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Payments</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {totalCount} transaction{totalCount !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* ── Interactive list (client component) ── */}
        <PaymentsListClient
          totalCount={totalCount}
          completedCount={completedCount}
          inProgressCount={inProgressCount}
          failedCount={failedCount}
          totalVolumeUsd={totalVolumeUsd}
        />
      </div>
    </div>
  );
}
