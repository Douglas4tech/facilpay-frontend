import * as React from "react";
import { cn } from "./utils";

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
}: {
  className?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={cn("flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center", className)}>
      {icon && <div className="text-muted [&_svg]:size-8" aria-hidden="true">{icon}</div>}
      <div className="grid max-w-md gap-1.5">
        <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted">{description}</p>
      </div>
      {action}
    </section>
  );
}