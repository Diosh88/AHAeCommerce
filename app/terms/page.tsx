import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'AHAeCommerce terms of service — the rules and conditions for using this site.',
};

export default function TermsPage() {
  const lastUpdated = 'February 28, 2026';

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[45rem] mx-auto px-4">
        <h1 className="text-4xl font-bold leading-tight font-sans text-[--color-text]">
          Terms of Service
        </h1>
        <p className="text-sm font-sans text-[--color-text-muted] mt-2">
          Last updated: {lastUpdated}
        </p>

        <div className="prose mt-10">
          <p>
            By accessing or using ahaecommerce.com (&ldquo;the Site&rdquo;), you agree to
            these Terms of Service. If you do not agree, please do not use the Site.
          </p>

          <h2>1. Use of Content</h2>
          <p>
            All content published on AHAeCommerce &mdash; including articles, frameworks,
            and guides &mdash; is the intellectual property of AHAeCommerce unless otherwise
            noted. You may:
          </p>
          <ul>
            <li>Read and share links to content</li>
            <li>Quote brief excerpts with proper attribution</li>
          </ul>
          <p>You may <strong>not</strong>:</p>
          <ul>
            <li>Reproduce full articles without written permission</li>
            <li>Use content for commercial purposes without permission</li>
            <li>Scrape or systematically download content</li>
          </ul>

          <h2>2. Accuracy of Information</h2>
          <p>
            AHAeCommerce publishes content to help operators make better decisions. However,
            the information provided is for educational purposes only and does not constitute
            legal, financial, or professional advice.
          </p>
          <p>
            eCommerce is complex and conditions change. Always verify information with
            appropriate professionals before making significant business decisions.
          </p>

          <h2>3. Affiliate Links</h2>
          <p>
            Some articles may contain affiliate links. Where this is the case, it is
            disclosed prominently at the top of the article. We only recommend products
            and services we genuinely believe in.
          </p>

          <h2>4. Email Subscriptions</h2>
          <p>
            By subscribing to our email list, you consent to receive emails from AHAeCommerce.
            You can unsubscribe at any time using the link in any email we send.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            AHAeCommerce is provided &ldquo;as is.&rdquo; We are not liable for any
            damages arising from your use of the Site or reliance on any content published here.
          </p>

          <h2>6. Third-Party Links</h2>
          <p>
            The Site may link to third-party websites. We are not responsible for the
            content or privacy practices of those sites.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the Site after changes
            constitutes acceptance of the updated terms.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms are governed by applicable law. Disputes will be resolved in the
            appropriate jurisdiction.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions about these terms?{' '}
            <a href="mailto:legal@ahaecommerce.com">legal@ahaecommerce.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
