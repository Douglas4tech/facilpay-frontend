import * as React from "react";
import { cn } from "./utils";

export function Skeleton({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div aria-hidden="true" {...props} className={cn("animate-pulse rounded-md bg-muted/15", className)} />;
}