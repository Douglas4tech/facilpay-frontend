"use client";

import * as React from "react";
import { cn } from "./utils";

type FieldProps = {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size"> & FieldProps;
export type TextareaProps = React.ComponentPropsWithoutRef<"textarea"> & Omit<FieldProps, "leftIcon" | "rightIcon">;

const fieldControl =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/30";

function FieldMessage({ id, error, helperText }: { id: string; error?: string; helperText?: string }) {
  const message = error || helperText;
  if (!message) return null;

  return (
    <p id={id} className={cn("text-xs", error ? "text-danger" : "text-muted")}>
      {message}
    </p>
  );
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, helperText, id: providedId, label, leftIcon, rightIcon, ...props },
  ref,
) {
  const generatedId = React.useId();
  const id = providedId || generatedId;
  const messageId = `${id}-message`;

  return (
    <div className="grid gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        {leftIcon && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">{leftIcon}</span>}
        <input
          {...props}
          ref={ref}
          id={id}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={error || helperText ? messageId : props["aria-describedby"]}
          className={cn(fieldControl, leftIcon && "pl-10", rightIcon && "pr-10", className)}
        />
        {rightIcon && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">{rightIcon}</span>}
      </div>
      <FieldMessage id={messageId} error={error} helperText={helperText} />
    </div>
  );
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, helperText, id: providedId, label, ...props },
  ref,
) {
  const generatedId = React.useId();
  const id = providedId || generatedId;
  const messageId = `${id}-message`;

  return (
    <div className="grid gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>}
      <textarea
        {...props}
        ref={ref}
        id={id}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={error || helperText ? messageId : props["aria-describedby"]}
        className={cn(fieldControl, "min-h-24 resize-y", className)}
      />
      <FieldMessage id={messageId} error={error} helperText={helperText} />
    </div>
  );
});