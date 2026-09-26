import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Balances & Account Overview | FacilPay Merchant Dashboard',
  description: 'View live Stellar account balances, minimum reserves, trustlines, and recent Horizon operations.',
};

export default function BalancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
