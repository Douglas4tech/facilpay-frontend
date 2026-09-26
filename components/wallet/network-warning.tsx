"use client";

import { AlertTriangle } from "lucide-react";
import { useWallet } from "./wallet-provider";

export function WalletNetworkWarning() {
  const { configuredNetwork, isNetworkMismatch, isNetworkUnverified, network } = useWallet();

  if (isNetworkMismatch) {
    return (
      <div role="alert" className="flex items-start gap-2 border-b border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning sm:px-8">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>Your wallet is connected to {network}. Switch it to {configuredNetwork} before signing transactions.</p>
      </div>
    );
  }

  if (isNetworkUnverified) {
    return (
      <div role="alert" className="flex items-start gap-2 border-b border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning sm:px-8">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>The connected wallet network could not be verified. Transaction signing is disabled.</p>
      </div>
    );
  }

  return null;
}