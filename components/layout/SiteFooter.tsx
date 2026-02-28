import React from 'react';
import Link from 'next/link';
import { EmailCapture } from '@/components/shared/EmailCapture';

const navLinks = [
  { href: '/topics', label: 'Topics' },
  { href: '/start-here', label: 'Start Here' },
  { href: '/about', label: 'About' },
  { href: '/articles', label: 'All Articles' },
  { href: '/subscribe', label: 'Subscribe' },
];

const topicLinks = [
  { href: '/topics/platform', label: 'Platform' },
  { href: '/topics/operations', label: 'Operations' },
  { href: '/topics/marketing', label: 'Marketing' },
  { href: '/topics/finance', label: 'Finance' },
  { href: '/topics/technology', label: 'Technology' },
  { href: '/topics/strategy', label: 'Strategy' },
  { href: '/topics/logistics', label: 'Logistics' },
  { href: '/topics/team', label: 'Team' },
  { href: '/topics/customer', label: 'Customer' },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-[75rem] mx-auto px-4 md:px-6 py-12">
      {/* Main footer grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

        {/* Column 1 — Logo + tagline */}
        <div>
          <Link
            href="/"
            className="font-bold font-sans text-[--color-text-brand] text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 rounded-sm inline-block"
            aria-label="AHAeCommerce — home"
          >
            AHAeCommerce
          </Link>
          <p className="text-[--color-text-secondary] text-sm font-sans leading-relaxed mt-3">
            A&ndash;Z eCommerce Decision &amp; Execution Intelligence.
            Decision frameworks, system blueprints, and cost realities for operators
            who build to last.
          </p>
        </div>

        {/* Column 2 — Nav + Topics */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold font-sans text-[--color-text] uppercase tracking-wider mb-4">
              Navigate
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-[--color-text-secondary] hover:text-[--color-text-brand] transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold font-sans text-[--color-text] uppercase tracking-wider mb-4">
              Topics
            </h3>
            <ul className="space-y-2">
              {topicLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-[--color-text-secondary] hover:text-[--color-text-brand] transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3 — Email capture */}
        <div>
          <h3 className="text-sm font-semibold font-sans text-[--color-text] uppercase tracking-wider mb-4">
            Stay Informed
          </h3>
          <EmailCapture
            source="subscribe-page"
            heading="Get decision frameworks in your inbox"
            variant="inline"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[--color-border] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[--color-text-muted] text-xs font-sans">
          &copy; {currentYear} AHAeCommerce. All rights reserved.
        </p>
        <nav aria-label="Legal navigation" className="flex gap-6">
          <Link
            href="/privacy"
            className="text-[--color-text-muted] text-xs font-sans hover:text-[--color-text-secondary] transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-[--color-text-muted] text-xs font-sans hover:text-[--color-text-secondary] transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm"
          >
            Terms of Service
          </Link>
        </nav>
      </div>
    </div>
  );
}
