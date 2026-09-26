'use client';

import React, { useState, useEffect } from 'react';
import { GettingStartedTasks, PaymentLinkData } from '@/types/onboarding';
import {
  getGettingStartedTasks,
  saveGettingStartedTasks,
  INITIAL_GETTING_STARTED,
} from '@/lib/storage';
import WebhookModal from './WebhookModal';
import ApiKeyModal from './ApiKeyModal';
import InviteTeammateModal from './InviteTeammateModal';
import ReceivePaymentModal from './ReceivePaymentModal';

interface GettingStartedCardProps {
  paymentLink?: PaymentLinkData;
}

export default function GettingStartedCard({ paymentLink }: GettingStartedCardProps) {
  const [tasks, setTasks] = useState<GettingStartedTasks>(INITIAL_GETTING_STARTED);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<
    'webhook' | 'apikey' | 'teammate' | 'payment' | null
  >(null);

  useEffect(() => {
    const saved = getGettingStartedTasks();
    setTasks(saved);
    setIsLoaded(true);
  }, []);

  if (!isLoaded || tasks.dismissed) return null;

  const updateTask = (key: keyof Omit<GettingStartedTasks, 'dismissed'>, value: boolean) => {
    const updated = { ...tasks, [key]: value };
    setTasks(updated);
    saveGettingStartedTasks(updated);
  };

  const handleDismiss = () => {
    const updated = { ...tasks, dismissed: true };
    setTasks(updated);
    saveGettingStartedTasks(updated);
  };

  const taskList = [
    {
      key: 'addWebhook' as const,
      title: 'Add a Webhook',
      description: 'Receive real-time HTTP event notifications for payments & refunds',
      isCompleted: tasks.addWebhook,
      actionText: 'Configure Webhook',
      onAction: () => setActiveModal('webhook'),
    },
    {
      key: 'createApiKey' as const,
      title: 'Create an API Key',
      description: 'Generate publishable & secret keys to integrate the FacilPay SDK',
      isCompleted: tasks.createApiKey,
      actionText: 'Generate Key',
      onAction: () => setActiveModal('apikey'),
    },
    {
      key: 'inviteTeammate' as const,
      title: 'Invite a Teammate',
      description: 'Add engineers, accountants, or administrators to your dashboard',
      isCompleted: tasks.inviteTeammate,
      actionText: 'Invite Member',
      onAction: () => setActiveModal('teammate'),
    },
    {
      key: 'receiveFirstPayment' as const,
      title: 'Receive First Payment',
      description: 'Simulate or accept your first test checkout on Stellar Testnet',
      isCompleted: tasks.receiveFirstPayment,
      actionText: 'Simulate Payment',
      onAction: () => setActiveModal('payment'),
    },
  ];

  const completedCount = taskList.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / taskList.length) * 100);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-br from-white via-sky-50/30 to-blue-50/40 p-5 sm:p-6 shadow-sm dark:border-sky-900/60 dark:from-zinc-950 dark:via-zinc-900/70 dark:to-sky-950/20 mb-8 animate-fadeIn">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#55C2FF] to-[#0066FF] text-white shadow-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Getting Started with FacilPay
                </h3>
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                  {completedCount} of {taskList.length} completed
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Complete these recommended setup tasks to unlock full automation and developer capabilities.
              </p>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            title="Dismiss checklist"
            className="self-end sm:self-center flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <span>Dismiss</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
            <span>Setup Checklist Progress</span>
            <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#55C2FF] to-[#0066FF] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {taskList.map((task) => (
            <div
              key={task.key}
              className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all ${
                task.isCompleted
                  ? 'border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                  : 'border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => updateTask(task.key, !task.isCompleted)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all cursor-pointer ${
                    task.isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-zinc-300 dark:border-zinc-700 hover:border-sky-500'
                  }`}
                  title={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {task.isCompleted && (
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      task.isCompleted
                        ? 'text-emerald-900 dark:text-emerald-300 line-through opacity-85'
                        : 'text-zinc-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                {task.isCompleted ? (
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>✓ Done</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={task.onAction}
                    className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:hover:bg-sky-900 transition-colors cursor-pointer"
                  >
                    {task.actionText} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Action Modals */}
      <WebhookModal
        isOpen={activeModal === 'webhook'}
        onClose={() => setActiveModal(null)}
        onSuccess={() => updateTask('addWebhook', true)}
      />

      <ApiKeyModal
        isOpen={activeModal === 'apikey'}
        onClose={() => setActiveModal(null)}
        onSuccess={() => updateTask('createApiKey', true)}
      />

      <InviteTeammateModal
        isOpen={activeModal === 'teammate'}
        onClose={() => setActiveModal(null)}
        onSuccess={() => updateTask('inviteTeammate', true)}
      />

      <ReceivePaymentModal
        isOpen={activeModal === 'payment'}
        paymentLink={paymentLink}
        onClose={() => setActiveModal(null)}
        onSuccess={() => updateTask('receiveFirstPayment', true)}
      />
    </>
  );
}
