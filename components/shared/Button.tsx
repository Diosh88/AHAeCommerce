'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'cta';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[--color-brand] hover:bg-[--color-brand-hover] text-[--color-text-inverse] font-semibold ' +
    'focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 ' +
    'active:scale-[0.98] active:brightness-90',
  secondary:
    'border border-[--color-border-brand] text-[--color-text-brand] hover:bg-[--color-brand-light] font-semibold ' +
    'bg-transparent focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 ' +
    'active:scale-[0.98]',
  cta:
    'bg-[--color-accent] hover:bg-[--color-accent-hover] text-[--color-text-inverse] font-bold ' +
    'focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 ' +
    'active:scale-[0.98] active:brightness-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-md min-h-[36px]',
  md: 'px-6 py-3 text-base rounded-md min-h-[44px]',
  lg: 'px-8 py-4 text-lg rounded-md min-h-[52px]',
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

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={[
        'inline-flex items-center justify-center gap-2',
        'transition-base',
        'focus-visible:outline-none',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled
          ? 'opacity-50 cursor-not-allowed pointer-events-none'
          : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && (
        <>
          <SpinnerIcon />
          <span className="sr-only">Loading</span>
        </>
      )}
      {children}
    </button>
  );
}
