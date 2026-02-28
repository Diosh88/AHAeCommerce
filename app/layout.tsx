import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahaecommerce.com"
  ),
  title: {
    template: "%s | AHAeCommerce",
    default: "AHAeCommerce — A–Z eCommerce Decision Intelligence",
  },
  description:
    "Decision frameworks, system blueprints, and cost realities for eCommerce operators. Cut through noise. Build what works.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AHAeCommerce",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[--color-background] text-[--color-text] font-sans antialiased">
        {/* Skip to main content — required for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Site Header — sticky */}
        <header className="sticky top-0 z-50 bg-[--color-surface] border-b border-[--color-border]">
          <SiteHeader />
        </header>

        {/* Main content */}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        {/* Site Footer */}
        <footer className="bg-[--color-surface] border-t border-[--color-border] mt-24">
          <SiteFooter />
        </footer>

        {/* Plausible Analytics — privacy-first, no cookie banner needed */}
        <Script
          defer
          data-domain="ahaecommerce.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
