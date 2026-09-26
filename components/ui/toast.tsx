"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "./utils";

export type ToastVariant = "success" | "error" | "info";
type ToastEntry = { id: number; message: string; variant: ToastVariant };
type ToastAction = (message: string, variant?: ToastVariant) => void;

const ToastContext = React.createContext<ToastAction | null>(null);
let toastSequence = 0;

const iconByVariant = {
  success: <CheckCircle2 className="size-4 text-success" aria-hidden="true" />,
  error: <AlertCircle className="size-4 text-danger" aria-hidden="true" />,
  info: <Info className="size-4 text-info" aria-hidden="true" />,
};

export function ToastProvider({ children, duration = 4000 }: { children: React.ReactNode; duration?: number }) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const toast: ToastAction = (message, variant = "info") => {
    toastSequence += 1;
    setToasts((current) => [...current, { id: toastSequence, message, variant }]);
  };
  const dismiss = (id: number) => setToasts((current) => current.filter((item) => item.id !== id));

  return (
    <ToastContext.Provider value={toast}>
      <ToastPrimitive.Provider duration={duration} swipeDirection="right">
        {children}
        <ToastPrimitive.Viewport className="fixed right-0 top-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-sm">
          {toasts.map((item) => (
            <ToastPrimitive.Root
              key={item.id}
              duration={duration}
              onOpenChange={(open) => !open && dismiss(item.id)}
              className="flex items-start gap-3 rounded-md border border-border bg-card p-4 text-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out"
            >
              {iconByVariant[item.variant]}
              <ToastPrimitive.Description className="flex-1 text-sm">{item.message}</ToastPrimitive.Description>
              <ToastPrimitive.Close className={cn("rounded-sm text-muted outline-none focus-visible:ring-2 focus-visible:ring-primary")} aria-label="Dismiss notification">
                <X className="size-4" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          ))}
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = React.useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used within ToastProvider");
  return toast;
}