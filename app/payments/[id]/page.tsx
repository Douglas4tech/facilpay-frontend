import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { getPaymentById, getMockPayments } from "@/app/lib/api/payments";
import { Card, CardHeader, CardDivider, DetailRow } from "@/app/components/ui/Card";
import { PaymentStatusPill } from "@/app/components/payments/PaymentStatusBadge";
import { PaymentTimeline } from "@/app/components/payments/PaymentTimeline";
import { OnChainVerification, OnChainPending } from "@/app/components/payments/OnChainVerification";
import { PaymentActions } from "@/app/components/payments/PaymentActions";

// ─── Static params (pre-render all known payments) ────────────────────────────

export async function generateStaticParams() {
  const payments = getMockPayments();
  return payments.map((p) => ({ id: p.id }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const payment = await getPaymentById(id);
  if (!payment) return { title: "Payment Not Found — FacilPay" };
  return {
    title: `${payment.reference} — FacilPay`,
    description: `Payment detail for ${payment.reference}: ${payment.amount} ${payment.currency} from ${payment.sender.name} to ${payment.recipient.name}.`,
  };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" clipRule="evenodd" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM6 13.25a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm3.25-.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z" clipRule="evenodd" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Helper: avatar initials ──────────────────────────────────────────────────

function avatarInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Participant card ─────────────────────────────────────────────────────────

function ParticipantCard({
  label,
  name,
  accountId,
  walletAddress,
  email,
}: {
  label: string;
  name: string;
  accountId: string;
  walletAddress?: string;
  email?: string;
}) {
  return (
    <div className="flex-1 min-w-0 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">
        {label}
      </p>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[#000F24] flex items-center justify-center text-white text-xs font-bold select-none">
          {avatarInitials(name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 truncate">{name}</p>
          {email && (
            <p className="text-xs text-zinc-500 truncate">{email}</p>
          )}
        </div>
      </div>
      {walletAddress && (
        <div className="mt-3 rounded-lg bg-white border border-zinc-200 px-2.5 py-1.5">
          <p className="text-xs text-zinc-400 mb-0.5">Wallet Address</p>
          <code className="text-[10px] font-mono text-zinc-700 break-all leading-tight">
            {walletAddress}
          </code>
        </div>
      )}
      <p className="mt-2 text-xs text-zinc-400 font-mono">{accountId}</p>
    </div>
  );
}

// ─── Transfer arrow ───────────────────────────────────────────────────────────

function TransferArrow({ amount, currency }: { amount: number; currency: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-2 shrink-0">
      <div className="flex items-center gap-1">
        <div className="h-px w-8 bg-zinc-300" />
        <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-[10px] font-semibold text-zinc-500 tabular-nums whitespace-nowrap">
        {amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
        {currency}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await getPaymentById(id);

  if (!payment) notFound();

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "medium",
    });

  const fmtCurrency = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <Link
            href="/payments"
            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <ChevronLeftIcon />
            Payments
          </Link>
          <span className="text-zinc-300 select-none">/</span>
          <span className="text-sm font-medium text-zinc-900 truncate">
            {payment.reference}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page header ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-zinc-900">
                {payment.reference}
              </h1>
              <PaymentStatusPill status={payment.status} />
            </div>
            {payment.description && (
              <p className="mt-1 text-sm text-zinc-500">{payment.description}</p>
            )}
          </div>

          {/* Amount hero */}
          <div className="shrink-0 text-right">
            <p className="text-3xl font-bold text-zinc-900 tabular-nums">
              {fmtCurrency(payment.amount)}{" "}
              <span className="text-xl font-semibold text-zinc-500">
                {payment.currency}
              </span>
            </p>
            {payment.amountUsd != null && payment.currency !== "USD" && (
              <p className="text-sm text-zinc-400 tabular-nums">
                ≈ ${fmtCurrency(payment.amountUsd)} USD
              </p>
            )}
          </div>
        </div>

        {/* ── Main grid: left column + right sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT: main content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Participants */}
            <Card>
              <CardHeader
                icon={<UserIcon />}
                title="Participants"
                subtitle="Sender and recipient details"
              />
              <CardDivider className="my-4" />
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <ParticipantCard
                  label="From"
                  name={payment.sender.name}
                  accountId={payment.sender.accountId}
                  walletAddress={payment.sender.walletAddress}
                  email={payment.sender.email}
                />
                <TransferArrow amount={payment.amount} currency={payment.currency} />
                <ParticipantCard
                  label="To"
                  name={payment.recipient.name}
                  accountId={payment.recipient.accountId}
                  walletAddress={payment.recipient.walletAddress}
                  email={payment.recipient.email}
                />
              </div>
            </Card>

            {/* Payment details */}
            <Card>
              <CardHeader
                icon={<ReceiptIcon />}
                title="Payment Details"
              />
              <CardDivider className="my-4" />
              <dl className="space-y-4">
                <DetailRow label="Payment ID"   value={payment.id}        mono />
                <DetailRow label="Reference"    value={payment.reference} />
                <DetailRow
                  label="Method"
                  value={
                    <span className="capitalize">
                      {payment.method.replace("_", " ")}
                      {payment.network ? ` · ${payment.network.charAt(0).toUpperCase() + payment.network.slice(1)}` : ""}
                    </span>
                  }
                />
                <DetailRow label="Amount"
                  value={
                    <span className="tabular-nums">
                      {fmtCurrency(payment.amount)} {payment.currency}
                      {payment.amountUsd != null && payment.currency !== "USD" &&
                        ` (≈ $${fmtCurrency(payment.amountUsd)} USD)`}
                    </span>
                  }
                />
                {payment.description && (
                  <DetailRow label="Description" value={payment.description} />
                )}
                {payment.notes && (
                  <DetailRow label="Notes" value={payment.notes} />
                )}
                {payment.tags && payment.tags.length > 0 && (
                  <DetailRow
                    label="Tags"
                    value={
                      <div className="flex flex-wrap gap-1.5">
                        {payment.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    }
                  />
                )}
                <CardDivider />
                <DetailRow label="Created"   value={fmtDate(payment.createdAt)} />
                <DetailRow label="Updated"   value={fmtDate(payment.updatedAt)} />
                {payment.completedAt && (
                  <DetailRow label="Completed" value={fmtDate(payment.completedAt)} />
                )}
                {payment.expiresAt && (
                  <DetailRow label="Expires"   value={fmtDate(payment.expiresAt)} />
                )}
              </dl>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader
                icon={<ClockIcon />}
                title="Payment Lifecycle"
                subtitle="Full event history, newest first"
              />
              <CardDivider className="my-4" />
              <PaymentTimeline events={payment.events} />
            </Card>

          </div>

          {/* ── RIGHT: sidebar ── */}
          <div className="space-y-6">
            {/* On-chain verification */}
            {payment.onChain ? (
              <OnChainVerification data={payment.onChain} />
            ) : (
              <OnChainPending />
            )}

            {/* Actions */}
            <PaymentActions payment={payment} />

            {/* Quick stats */}
            <Card>
              <h2 className="text-base font-semibold text-zinc-900 mb-4">
                Quick Stats
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between items-center">
                  <dt className="text-xs text-zinc-500">Total Events</dt>
                  <dd className="text-sm font-semibold text-zinc-900 tabular-nums">
                    {payment.events.length}
                  </dd>
                </div>
                {payment.onChain && (
                  <div className="flex justify-between items-center">
                    <dt className="text-xs text-zinc-500">Confirmations</dt>
                    <dd className="text-sm font-semibold text-zinc-900 tabular-nums">
                      {payment.onChain.confirmations}
                    </dd>
                  </div>
                )}
                {payment.onChain && (
                  <div className="flex justify-between items-center">
                    <dt className="text-xs text-zinc-500">Network Fee</dt>
                    <dd className="text-sm font-semibold text-zinc-900 tabular-nums">
                      {payment.onChain.fee} {payment.onChain.feeAsset}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <dt className="text-xs text-zinc-500">Network</dt>
                  <dd className="text-sm font-semibold text-zinc-900 capitalize">
                    {payment.network ?? "—"}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
