import * as React from "react";
import { cn } from "./utils";

export type BadgeStatus = "pending" | "completed" | "failed" | "refunded" | "expired";

const statusStyles: Record<BadgeStatus, string> = {
  pending: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
  failed: "bg-danger/10 text-danger",
  refunded: "bg-info/10 text-info",
  expired: "bg-muted/10 text-muted",
};

export type BadgeProps = React.ComponentPropsWithoutRef<"span"> & { status: BadgeStatus };

export function Badge({ className, children, status, ...props }: BadgeProps) {
  return (
    <span {...props} className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize", statusStyles[status], className)}>
      {children ?? status}
    </span>
  );
}