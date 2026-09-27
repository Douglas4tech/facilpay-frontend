import * as React from "react";
import { cn } from "./utils";

export const Card = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(function Card(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={cn("rounded-lg border border-border bg-card text-foreground shadow-sm", className)} />;
});

export function CardHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={cn("flex flex-col gap-1.5 p-5", className)} />;
}

export function CardTitle({ className, ...props }: React.ComponentPropsWithoutRef<"h3">) {
  return <h3 {...props} className={cn("font-heading text-lg font-semibold leading-tight", className)} />;
}

export function CardDescription({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  return <p {...props} className={cn("text-sm text-muted", className)} />;
}

export function CardContent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={cn("px-5 pb-5", className)} />;
}

export function CardFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={cn("flex items-center gap-2 border-t border-border px-5 py-4", className)} />;
}