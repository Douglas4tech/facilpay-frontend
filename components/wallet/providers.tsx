"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui";
import { WalletProvider } from "./wallet-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <WalletProvider>{children}</WalletProvider>
    </ToastProvider>
  );
}