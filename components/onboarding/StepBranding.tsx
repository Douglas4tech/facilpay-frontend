'use client';

import React, { useState, useRef } from 'react';
import { BrandingDetails } from '@/types/onboarding';

interface StepBrandingProps {
  businessName: string;
  initialData: BrandingDetails;
  onNext: (data: BrandingDetails) => void;
  onSkip: () => void;
  onBack: () => void;
}

const PRESET_COLORS = [
  { name: 'FacilPay Blue', hex: '#55C2FF' },
  { name: 'Sky Blue', hex: '#0284C7' },
  { name: 'Royal Indigo', hex: '#4F46E5' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Coral Rose', hex: '#F43F5E' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Obsidian', hex: '#0F172A' },
];

export default function StepBranding({
  businessName,
  initialData,
  onNext,
  onSkip,
  onBack,
}: StepBrandingProps) {
  const [logoUrl, setLogoUrl] = useState<string>(initialData.logoUrl || '');
  const [brandColor, setBrandColor] = useState<string>(initialData.brandColor || '#55C2FF');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image file size must be under 2MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onNext({
      logoUrl,
      brandColor,
      brandName: businessName,
      skipped: false,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Branding & Checkout Styling
            </h2>
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              Optional
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Personalize your hosted checkout pages and payment links with your brand logo and accent color.
          </p>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="self-start sm:self-center text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 underline cursor-pointer"
        >
          Skip this step
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Logo Upload Section */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Merchant Logo
            </label>

            <div className="flex items-center gap-4">
              {/* Logo Preview or Placeholder */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden shadow-sm">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="Brand Logo Preview"
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="logo-upload-input"
                  />
                  <label
                    htmlFor="logo-upload-input"
                    className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors shadow-sm"
                  >
                    {logoUrl ? 'Change Logo' : 'Upload Image'}
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Recommended: Square PNG or SVG, max 2MB.
                </p>
                {error && <p className="text-xs text-rose-500">{error}</p>}
              </div>
            </div>
          </div>

          {/* Brand Color Picker */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Primary Brand Accent Color
            </label>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PRESET_COLORS.map((preset) => {
                const isSelected = brandColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setBrandColor(preset.hex)}
                    title={preset.name}
                    className={`group relative flex h-10 w-full items-center justify-center rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-zinc-900 ring-offset-2 dark:ring-white dark:ring-offset-zinc-950 scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && (
                      <svg className="h-4 w-4 text-white drop-shadow" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-3 pt-2">
              <div className="relative flex items-center">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="h-9 w-9 rounded-lg border border-zinc-200 cursor-pointer overflow-hidden dark:border-zinc-700"
                />
              </div>
              <input
                type="text"
                value={brandColor.toUpperCase()}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('#')) val = '#' + val;
                  setBrandColor(val);
                }}
                className="w-28 rounded-xl border border-zinc-300 px-3 py-1.5 font-mono text-xs uppercase dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                maxLength={7}
              />
              <span className="text-xs text-zinc-500">Custom Hex Code</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Checkout Preview */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-3">
              Live Checkout Preview
            </span>

            {/* Mini Checkout Card Mock */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-xs shadow-sm"
                    style={{ backgroundColor: brandColor }}
                  >
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt="logo" className="h-full w-full object-contain p-1" />
                    ) : (
                      (businessName || 'F').charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[140px]">
                    {businessName || 'Your Business Name'}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Testnet Checkout</span>
              </div>

              <div className="space-y-1 py-1">
                <span className="text-[11px] text-zinc-500">Order Summary</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Standard Payment
                  </span>
                  <span className="font-mono text-base font-bold text-zinc-900 dark:text-white">
                    $25.00 USDC
                  </span>
                </div>
              </div>

              {/* Pay Button styled with custom brandColor */}
              <button
                type="button"
                className="w-full rounded-xl py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
                style={{ backgroundColor: brandColor }}
              >
                Pay with Stellar Wallet
              </button>

              <div className="text-center text-[10px] text-zinc-400">
                Powered by <span className="font-semibold text-zinc-600 dark:text-zinc-300">FacilPay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Skip for now
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#55C2FF] to-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <span>Save & Continue</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
