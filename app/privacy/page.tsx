import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'AHAeCommerce privacy policy — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  const lastUpdated = 'February 28, 2026';

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[45rem] mx-auto px-4">
        <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
          Privacy Policy
        </h1>
        <p className="text-sm font-sans text-[--color-text-muted] mt-2">
          Last updated: {lastUpdated}
        </p>

        <div className="prose mt-10">
          <p>
            This Privacy Policy explains how AHAeCommerce (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
            or &ldquo;our&rdquo;) collects, uses, and protects your information when you
            visit ahaecommerce.com or subscribe to our email list.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>
              <strong>Email address</strong> &mdash; when you subscribe to our email list
            </li>
            <li>
              <strong>Name</strong> (optional) &mdash; if you provide it at subscription
            </li>
            <li>
              <strong>Subscription source</strong> &mdash; which page you subscribed from
              (for analytics only)
            </li>
            <li>
              <strong>Usage data</strong> &mdash; pages visited, time on page (via analytics,
              if enabled)
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Send you eCommerce decision frameworks and updates you subscribed to</li>
            <li>Understand which content is most useful (anonymous analytics)</li>
            <li>Prevent spam and abuse</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your data. We do not share it with third parties
            except as required to operate our service (email platform, hosting).
          </p>

          <h2>3. Email Service</h2>
          <p>
            We use Kit (ConvertKit) to manage our email list. When you subscribe, your email
            address and any provided information is stored in Kit&rsquo;s systems. Kit&rsquo;s
            privacy policy applies to their handling of this data.
          </p>

          <h2>4. Cookies</h2>
          <p>
            This site may use minimal cookies for analytics and functionality. We do not
            use advertising cookies or third-party tracking for advertising purposes.
          </p>

          <h2>5. GDPR Rights (EU/UK Residents)</h2>
          <p>If you are in the EU or UK, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
            <li>Withdraw consent at any time (by unsubscribing)</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at the address below.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain subscriber data for as long as you remain subscribed. When you
            unsubscribe, your data is marked inactive. You may request full deletion at any time.
          </p>

          <h2>7. Security</h2>
          <p>
            We implement reasonable security measures to protect your information. Sensitive
            data is stored using industry-standard encryption.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Significant changes will be
            communicated to subscribers. The &ldquo;last updated&rdquo; date at the top
            reflects the most recent revision.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions about this policy? Contact us at:{' '}
            <a href="mailto:privacy@ahaecommerce.com">privacy@ahaecommerce.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
