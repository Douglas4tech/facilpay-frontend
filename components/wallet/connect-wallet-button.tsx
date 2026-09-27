"use client";

import * as React from "react";
import { ChevronDown, Wallet as WalletIcon } from "lucide-react";
import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit/types";
import {
  AddressDisplay,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useWallet } from "./wallet-provider";

const walletOrder = ["freighter", "xbull", "albedo", "lobstr"];

export function ConnectWalletButton() {
  const {
    address,
    connect,
    disconnect,
    isConnected,
    isConnecting,
    isRestoring,
    walletId,
    wallets,
  } = useWallet();
  const [open, setOpen] = React.useState(false);

  const orderedWallets = walletOrder
    .map((id) => wallets.find((wallet) => wallet.id === id))
    .filter((wallet): wallet is ISupportedWallet => Boolean(wallet));

  async function selectWallet(wallet: ISupportedWallet) {
    if (!wallet.isAvailable) return;
    try {
      await connect(wallet.id);
      setOpen(false);
    } catch {
      // The provider shows a toast with connection guidance.
    }
  }

  if (isConnected && address) {
    const connectedWallet = wallets.find((wallet) => wallet.id === walletId);
    return (
      <div className="flex items-center gap-1">
        <AddressDisplay address={address} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Wallet options">
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{connectedWallet?.name ?? "Connected wallet"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void disconnect()}>Disconnect wallet</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button loading={isConnecting} disabled={isRestoring}>
          <WalletIcon className="size-4" aria-hidden="true" />
          {isRestoring ? "Checking wallet…" : "Connect wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect a Stellar wallet</DialogTitle>
          <DialogDescription>Choose the wallet you use to manage your FacilPay account.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {orderedWallets.map((wallet) => (
            <div key={wallet.id} className="flex items-center gap-3 rounded-md border border-border p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/15 font-heading font-semibold text-accent" aria-hidden="true">
                {wallet.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{wallet.name}</p>
                <p className="text-xs text-muted">
                  {wallet.isAvailable ? "Ready to connect" : "Wallet extension not detected"}
                </p>
              </div>
              {wallet.isAvailable && (
                <Button size="sm" variant="outline" loading={isConnecting} onClick={() => void selectWallet(wallet)}>
                  Connect
                </Button>
              )}
              <a
                href={wallet.url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-xs font-medium text-info underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {wallet.isAvailable ? "Get wallet" : "Install wallet"}
              </a>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted">For xBull or Albedo, a wallet window may open to complete the connection.</p>
      </DialogContent>
    </Dialog>
  );
}