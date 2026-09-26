"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Check } from "lucide-react";
import { cn } from "./utils";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      ref={ref}
      className={cn("peer size-4 shrink-0 rounded-sm border border-border bg-card text-accent shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary disabled:cursor-not-allowed disabled:opacity-50", className)}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center"><Check className="size-3.5" /></CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

export function CheckboxField({
  id,
  label,
  description,
  className,
  ...props
}: React.ComponentProps<typeof Checkbox> & { label: string; description?: string; className?: string }) {
  const generatedId = React.useId();
  const controlId = id || generatedId;

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <Checkbox id={controlId} aria-describedby={description ? `${controlId}-description` : undefined} {...props} />
      <div className="grid gap-0.5">
        <label htmlFor={controlId} className="cursor-pointer text-sm font-medium text-foreground">{label}</label>
        {description && <p id={`${controlId}-description`} className="text-xs text-muted">{description}</p>}
      </div>
    </div>
  );
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(function Switch({ className, ...props }, ref) {
  return (
    <SwitchPrimitive.Root
      {...props}
      ref={ref}
      className={cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50", className)}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 rounded-full bg-card shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );
});

export { RadioGroup, RadioGroupItem } from "./radio-group";