"use client";

import * as React from "react";
import { AlertCircle, Check, Copy } from "lucide-react";
import { cn } from "./utils";

export function CopyButton({
  value,
  className,
  label = "Copy to clipboard",
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const [state, setState] = React.useState<"idle" | "copied" | "error">("idle");

  React.useEffect(() => {
    if (state === "idle") return;
    const timeout = window.setTimeout(() => setState("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [state]);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("error");
    }
  }

  const feedback = state === "copied" ? "Copied" : state === "error" ? "Copy failed" : label;
  const Icon = state === "copied" ? Check : state === "error" ? AlertCircle : Copy;

  return (
    <button
      type="button"
      onClick={copyValue}
      aria-label={feedback}
      title={feedback}
      className={cn("inline-flex size-8 items-center justify-center rounded-md text-muted outline-none transition hover:bg-muted/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary", state === "copied" && "text-success", state === "error" && "text-danger", className)}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}