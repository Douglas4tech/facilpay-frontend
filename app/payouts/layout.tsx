import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payouts | FacilPay Merchant Dashboard',
  description: 'Manage merchant settlements, Stellar anchor withdrawals, and tax reports.',
};

export default function PayoutsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
