import React from 'react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 bg-[--color-error-bg] border-l-4 border-[--color-error] rounded-md p-4"
    >
      {/* Error icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5 text-[--color-error] shrink-0 mt-0.5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>

      <div className="flex-1 min-w-0">
        <p className="text-[--color-text] text-sm font-sans">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-semibold text-[--color-error] underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-error] focus-visible:ring-offset-2 rounded-sm transition-base"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
