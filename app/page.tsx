import Link from "next/link";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { WalletNetworkWarning } from "@/components/wallet/network-warning";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-8">
        <Link href="/" className="font-heading text-lg font-bold text-accent">FacilPay</Link>
        <ConnectWalletButton />
      </header>
      <WalletNetworkWarning />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <h1 className="font-heading text-2xl font-semibold">Merchant dashboard</h1>
        <p className="mt-2 text-sm text-muted">Connect a Stellar wallet to manage your FacilPay account.</p>
      </section>
    </main>
  );
}
