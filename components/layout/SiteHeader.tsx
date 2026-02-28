'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/topics', label: 'Topics' },
  { href: '/start-here', label: 'Start Here' },
  { href: '/about', label: 'About' },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-6 h-6"
      aria-hidden="true"
    >
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
      )}
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  const activeLinkClasses = 'text-[--color-text-brand] font-semibold border-b-2 border-[--color-border-brand]';
  const inactiveLinkClasses = 'text-[--color-text-secondary] hover:text-[--color-text] transition-base';

  return (
    <>
      <div className="max-w-[75rem] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold font-sans text-[--color-text-brand] text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 rounded-sm"
          aria-label="AHAeCommerce — home"
        >
          AHAeCommerce
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={[
                'text-sm font-sans py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 rounded-sm',
                isActive(link.href) ? activeLinkClasses : inactiveLinkClasses,
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Subscribe CTA */}
        <div className="hidden md:flex">
          <Link
            href="/subscribe"
            className="bg-[--color-accent] hover:bg-[--color-accent-hover] text-[--color-text-inverse] font-bold px-5 py-2.5 rounded-md text-sm font-sans transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 min-h-[44px] inline-flex items-center"
          >
            Subscribe &rarr;
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md text-[--color-text-secondary] hover:text-[--color-text] hover:bg-[--color-surface-raised] transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]"
          onClick={() => setDrawerOpen((prev) => !prev)}
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <HamburgerIcon open={drawerOpen} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[--color-text] opacity-30"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel — slides from right */}
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile navigation"
            className="absolute top-0 right-0 h-full w-[280px] bg-[--color-surface] border-l border-[--color-border] flex flex-col pt-16 shadow-lg"
          >
            <div className="flex flex-col gap-1 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={[
                    'text-base font-sans px-4 py-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] min-h-[44px] flex items-center',
                    isActive(link.href)
                      ? 'bg-[--color-brand-light] text-[--color-text-brand] font-semibold'
                      : 'text-[--color-text-secondary] hover:bg-[--color-surface-raised] hover:text-[--color-text] transition-base',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/subscribe"
                className="mt-4 bg-[--color-accent] hover:bg-[--color-accent-hover] text-[--color-text-inverse] font-bold px-4 py-3 rounded-md text-base font-sans transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 min-h-[44px] flex items-center justify-center"
              >
                Subscribe &mdash; it&apos;s free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
