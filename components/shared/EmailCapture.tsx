'use client';

import React, { useRef, useState } from 'react';

type EmailSource =
  | 'home-hero'
  | 'article-inline'
  | 'article-end'
  | 'subscribe-page'
  | 'category-page';

type CaptureVariant = 'inline' | 'footer';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface EmailCaptureProps {
  source: EmailSource;
  heading?: string;
  description?: string;
  variant?: CaptureVariant;
}

const defaultHeadings: Record<EmailSource, string> = {
  'home-hero': 'Get decision frameworks in your inbox',
  'article-inline': 'Found this useful?',
  'article-end': 'Get more frameworks like this',
  'subscribe-page': 'Get the A-Z Decision Playbook, Free',
  'category-page': 'Stay ahead of the decisions',
};

const SpinnerIcon = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export function EmailCapture({
  source,
  heading,
  description,
  variant = 'inline',
}: EmailCaptureProps) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const emailId = `email-input-${source}`;

  const displayHeading = heading ?? defaultHeadings[source];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Cancel any pending request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get('email') as string)?.trim();

    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          gdprConsent: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      const data = (await response.json()) as { success: boolean; message: string };

      if (data.success) {
        setStatus('success');
        setSuccessMessage(data.message);
        form.reset();
      } else {
        setStatus('error');
        setErrorMessage(data.message ?? 'Something went wrong. Please try again.');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setStatus('error');
      setErrorMessage('Unable to connect. Please try again.');
    }
  };

  if (status === 'success') {
    if (variant === 'footer') {
      return (
        <p className="text-[--color-text-inverse] text-sm font-sans opacity-90">
          You&apos;re in! Check your inbox.
        </p>
      );
    }
    return (
      <div
        className="bg-[--color-success-bg] border-l-4 border-[--color-success] p-6 rounded-md"
        role="status"
        aria-live="polite"
      >
        <p className="text-[--color-text] font-semibold text-base font-sans">
          {successMessage || "You're in! Check your inbox."}
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div>
        <p className="text-[--color-text-inverse] font-semibold text-base mb-3 font-sans opacity-90">
          {displayHeading}
        </p>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex gap-2"
          aria-label="Subscribe to email list"
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={status === 'loading'}
            aria-label="Email address"
            aria-describedby={status === 'error' ? `${emailId}-error` : undefined}
            aria-invalid={status === 'error'}
            className="flex-1 border border-[--color-border] rounded-sm px-4 py-3 text-base font-sans bg-[--color-surface] text-[--color-text] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            aria-label="Subscribe"
            className="bg-[--color-accent] hover:bg-[--color-accent-hover] text-[--color-text-inverse] font-bold px-4 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px] min-w-[44px]"
          >
            {status === 'loading' ? <SpinnerIcon /> : <span aria-hidden="true">→</span>}
          </button>
        </form>
        {status === 'error' && (
          <p
            id={`${emailId}-error`}
            role="alert"
            className="text-[--color-error] text-xs mt-2 font-sans"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  // inline variant (default)
  return (
    <div className="bg-[--color-brand-light] border-l-4 border-[--color-border-brand] p-6 rounded-md">
      <p className="text-[--color-text-brand] font-semibold text-base mb-1 font-sans">
        {displayHeading}
      </p>
      {description && (
        <p className="text-[--color-text-secondary] text-sm mb-3 font-sans">{description}</p>
      )}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex gap-2 mt-3"
        aria-label="Subscribe to email list"
      >
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          disabled={status === 'loading'}
          aria-label="Email address"
          aria-describedby={
            status === 'error' ? `${emailId}-error` : `${emailId}-hint`
          }
          aria-invalid={status === 'error'}
          className="flex-1 border border-[--color-border] rounded-sm px-4 py-3 text-base font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 bg-[--color-surface] text-[--color-text] disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-label={status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          className="bg-[--color-accent] hover:bg-[--color-accent-hover] text-[--color-text-inverse] font-bold px-4 py-3 rounded-md transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px] min-w-[44px]"
        >
          {status === 'loading' ? <SpinnerIcon /> : <span aria-hidden="true">→</span>}
        </button>
      </form>

      {status === 'error' && (
        <p
          id={`${emailId}-error`}
          role="alert"
          aria-live="assertive"
          className="text-[--color-error] text-xs mt-2 font-sans"
        >
          {errorMessage}
        </p>
      )}

      <p
        id={`${emailId}-hint`}
        className="text-[--color-text-muted] text-xs mt-2 font-sans"
      >
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
