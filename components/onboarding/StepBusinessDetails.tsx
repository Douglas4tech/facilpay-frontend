'use client';

import React, { useState } from 'react';
import { BusinessDetails } from '@/types/onboarding';

interface StepBusinessDetailsProps {
  initialData: BusinessDetails;
  onNext: (data: BusinessDetails) => void;
  onBack: () => void;
}

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Nigeria',
  'Kenya',
  'South Africa',
  'Brazil',
  'Singapore',
  'Australia',
  'India',
  'Japan',
  'Spain',
  'Netherlands',
  'United Arab Emirates',
  'Other',
];

const CATEGORIES = [
  'E-commerce & Retail',
  'SaaS & Software Services',
  'Digital Goods & Content',
  'Freelance & Consulting',
  'Marketplace & Platforms',
  'Financial Services & Fintech',
  'Education & EdTech',
  'Gaming & Entertainment',
  'Non-Profit & Charity',
  'Other Services',
];

export default function StepBusinessDetails({
  initialData,
  onNext,
  onBack,
}: StepBusinessDetailsProps) {
  const [formData, setFormData] = useState<BusinessDetails>({
    name: initialData.name || '',
    country: initialData.country || '',
    category: initialData.category || '',
    website: initialData.website || '',
    supportEmail: initialData.supportEmail || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (data: BusinessDetails) => {
    const errs: Record<string, string> = {};

    if (!data.name.trim()) {
      errs.name = 'Business name is required';
    } else if (data.name.trim().length < 2) {
      errs.name = 'Business name must be at least 2 characters';
    }

    if (!data.country) {
      errs.country = 'Please select your operating country';
    }

    if (!data.category) {
      errs.category = 'Please select a business category';
    }

    if (!data.website.trim()) {
      errs.website = 'Website URL is required';
    } else {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
      if (!urlPattern.test(data.website.trim())) {
        errs.website = 'Please enter a valid website URL (e.g. https://example.com)';
      }
    }

    if (!data.supportEmail.trim()) {
      errs.supportEmail = 'Support email is required';
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(data.supportEmail.trim())) {
        errs.supportEmail = 'Please enter a valid email address';
      }
    }

    return errs;
  };

  const handleChange = (field: keyof BusinessDetails, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const currentErrs = validate(updated);
      setErrors((prev) => ({
        ...prev,
        [field]: currentErrs[field] || '',
      }));
    }
  };

  const handleBlur = (field: keyof BusinessDetails) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrs = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: currentErrs[field] || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = {
      name: true,
      country: true,
      category: true,
      website: true,
      supportEmail: true,
    };
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Normalize website prefix
      let normalizedWebsite = formData.website.trim();
      if (!/^https?:\/\//i.test(normalizedWebsite)) {
        normalizedWebsite = `https://${normalizedWebsite}`;
      }
      onNext({
        ...formData,
        website: normalizedWebsite,
        name: formData.name.trim(),
        supportEmail: formData.supportEmail.trim().toLowerCase(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Business Details
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Tell us about your company so customers can identify your brand during payment checkout.
        </p>
      </div>

      <div className="space-y-4">
        {/* Business Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
            Business Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Acme Tech Store"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none dark:bg-zinc-900 dark:text-white ${
              errors.name && touched.name
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-rose-600'
                : 'border-zinc-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-zinc-700'
            }`}
          />
          {errors.name && touched.name && (
            <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
          )}
        </div>

        {/* Country & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Country */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Operating Country <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              onBlur={() => handleBlur('country')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none dark:bg-zinc-900 dark:text-white ${
                errors.country && touched.country
                  ? 'border-rose-400 focus:border-rose-500 dark:border-rose-600'
                  : 'border-zinc-300 focus:border-sky-500 dark:border-zinc-700'
              }`}
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.country && touched.country && (
              <p className="mt-1 text-xs text-rose-500">{errors.country}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Business Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none dark:bg-zinc-900 dark:text-white ${
                errors.category && touched.category
                  ? 'border-rose-400 focus:border-rose-500 dark:border-rose-600'
                  : 'border-zinc-300 focus:border-sky-500 dark:border-zinc-700'
              }`}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && touched.category && (
              <p className="mt-1 text-xs text-rose-500">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
            Website URL <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              onBlur={() => handleBlur('website')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none dark:bg-zinc-900 dark:text-white ${
                errors.website && touched.website
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-rose-600'
                  : 'border-zinc-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-zinc-700'
              }`}
            />
          </div>
          {errors.website && touched.website ? (
            <p className="mt-1 text-xs text-rose-500">{errors.website}</p>
          ) : (
            <p className="mt-1 text-[11px] text-zinc-500">
              Customers will see this link on receipts and payment confirmation screens.
            </p>
          )}
        </div>

        {/* Support Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
            Customer Support Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            placeholder="support@acme.com"
            value={formData.supportEmail}
            onChange={(e) => handleChange('supportEmail', e.target.value)}
            onBlur={() => handleBlur('supportEmail')}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all focus:outline-none dark:bg-zinc-900 dark:text-white ${
              errors.supportEmail && touched.supportEmail
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:border-rose-600'
                : 'border-zinc-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-zinc-700'
            }`}
          />
          {errors.supportEmail && touched.supportEmail && (
            <p className="mt-1 text-xs text-rose-500">{errors.supportEmail}</p>
          )}
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

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#55C2FF] to-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <span>Next: Settlement Account</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </form>
  );
}
