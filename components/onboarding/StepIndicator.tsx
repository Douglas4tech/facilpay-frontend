'use client';

import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export const ONBOARDING_STEPS = [
  { id: 1, title: 'Welcome', subtitle: 'Introduction' },
  { id: 2, title: 'Business Details', subtitle: 'Profile info' },
  { id: 3, title: 'Settlement', subtitle: 'Wallet address' },
  { id: 4, title: 'Trustlines', subtitle: 'USDC & EURC' },
  { id: 5, title: 'Branding', subtitle: 'Logo & Color (Optional)' },
  { id: 6, title: 'Payment Link', subtitle: 'QR checkout' },
  { id: 7, title: 'Done', subtitle: 'Summary & links' },
] as const;

export default function StepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  const progressPercent = Math.round(((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100);

  return (
    <div className="w-full mb-8">
      {/* Mobile progress summary */}
      <div className="flex md:hidden items-center justify-between mb-3 text-sm">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          Step {currentStep} of {ONBOARDING_STEPS.length}:{' '}
          <span className="text-[#0088FF] dark:text-[#55C2FF]">
            {ONBOARDING_STEPS[currentStep - 1].title}
          </span>
        </span>
        <span className="text-xs font-mono text-zinc-500">{progressPercent}%</span>
      </div>

      {/* Progress bar line */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 mb-6">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#55C2FF] to-[#0066FF] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:grid grid-cols-7 gap-2">
        {ONBOARDING_STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted || step.id <= currentStep;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              className={`flex flex-col items-start p-2 rounded-xl text-left transition-all group ${
                isCurrent
                  ? 'bg-sky-50/70 border border-sky-200 dark:bg-sky-950/30 dark:border-sky-800/60'
                  : isClickable
                  ? 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-r from-[#55C2FF] to-[#0066FF] text-white shadow-sm shadow-sky-400/30 ring-2 ring-sky-300 dark:ring-sky-700'
                      : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs font-semibold truncate ${
                    isCurrent
                      ? 'text-sky-700 dark:text-sky-300'
                      : isCompleted
                      ? 'text-zinc-800 dark:text-zinc-200'
                      : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate w-full pl-8">
                {step.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
