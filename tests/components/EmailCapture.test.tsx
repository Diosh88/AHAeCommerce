/**
 * [SPEC] EmailCapture component tests — Gate 4c component test requirement.
 * Primary conversion component — highest-impact component in the project.
 *
 * Strategy: Render with @testing-library/react + userEvent. Mock global fetch
 * to control API responses without a real server.
 *
 * Spec source: components/shared/EmailCapture.tsx
 *
 * Props:
 *   source: EmailSource (required)
 *   heading?: string (falls back to defaultHeadings[source])
 *   description?: string
 *   variant?: 'inline' | 'footer' (default 'inline')
 *
 * States: idle → loading → success | error
 *
 * Requirements:
 *   - Renders email input with label
 *   - Default heading from defaultHeadings when heading is not provided
 *   - Custom heading overrides default
 *   - Submit with empty field → error state (no fetch call)
 *   - Submit with email → loading state while fetching
 *   - Successful API response → success state (form replaced by confirmation)
 *   - Failed API response → error state with message
 *   - Network error → error state with generic message
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EmailCapture } from '@/components/shared/EmailCapture';

// ── Mock global fetch ─────────────────────────────────────────────────────────

// fetch is mocked per-test to control API response behavior
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build a mock fetch Response for the /api/subscribe endpoint.
 */
function mockSubscribeResponse({
  success,
  message,
  status = 200,
}: {
  success: boolean;
  message: string;
  status?: number;
}): Response {
  return new Response(
    JSON.stringify({ success, message }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('EmailCapture', () => {

  describe('[SPEC] Initial render — idle state', () => {
    it('renders an email input', () => {
      render(<EmailCapture source="subscribe-page" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'email');
    });

    it('email input has an accessible label', () => {
      render(<EmailCapture source="subscribe-page" />);
      // sr-only label + aria-label on input
      const input = screen.getByLabelText(/email address/i);
      expect(input).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      render(<EmailCapture source="subscribe-page" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('uses the default heading for subscribe-page source', () => {
      render(<EmailCapture source="subscribe-page" />);
      // defaultHeadings['subscribe-page'] = 'Get the A-Z Decision Playbook, Free'
      expect(screen.getByText(/get the a-z decision playbook, free/i)).toBeInTheDocument();
    });

    it('uses the default heading for home-hero source', () => {
      render(<EmailCapture source="home-hero" />);
      // defaultHeadings['home-hero'] = 'Get decision frameworks in your inbox'
      expect(screen.getByText(/get decision frameworks in your inbox/i)).toBeInTheDocument();
    });

    it('overrides default heading when heading prop is provided', () => {
      render(
        <EmailCapture source="subscribe-page" heading="Custom Heading Override" />
      );
      expect(screen.getByText('Custom Heading Override')).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(
        <EmailCapture
          source="subscribe-page"
          description="Join 1,000+ operators."
        />
      );
      expect(screen.getByText('Join 1,000+ operators.')).toBeInTheDocument();
    });

    it('does not render description when omitted', () => {
      render(<EmailCapture source="subscribe-page" />);
      // No description prop — element should not be in DOM
      const desc = document.querySelector('.text-sm.mb-3');
      expect(desc).not.toBeInTheDocument();
    });

    it('shows the privacy hint text in inline variant', () => {
      render(<EmailCapture source="subscribe-page" variant="inline" />);
      expect(screen.getByText(/no spam/i)).toBeInTheDocument();
    });
  });

  describe('[SPEC] Empty email validation', () => {
    it('shows error message when form is submitted with empty email', async () => {
      const user = userEvent.setup();
      render(<EmailCapture source="subscribe-page" />);

      // Submit without filling the email input
      await user.click(screen.getByRole('button'));

      expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
      // [SPEC] No fetch call should be made for empty submissions
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('error message has role="alert" for screen reader announcement', async () => {
      const user = userEvent.setup();
      render(<EmailCapture source="subscribe-page" />);

      await user.click(screen.getByRole('button'));

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('[SPEC] Loading state', () => {
    it('disables the submit button while a request is in flight', async () => {
      const user = userEvent.setup();

      // Never-resolving promise simulates in-flight request
      mockFetch.mockReturnValue(new Promise(() => {}));

      render(<EmailCapture source="subscribe-page" />);
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      await user.type(input, 'loading@example.com');
      await user.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });

    it('disables the email input while loading', async () => {
      const user = userEvent.setup();
      mockFetch.mockReturnValue(new Promise(() => {}));

      render(<EmailCapture source="subscribe-page" />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'loading@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(input).toBeDisabled();
      });
    });
  });

  describe('[SPEC] Success state', () => {
    it('shows success state when API returns success:true', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue(
        mockSubscribeResponse({
          success: true,
          message: "You're in! Check your inbox for a confirmation email.",
        })
      );

      render(<EmailCapture source="subscribe-page" />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'success@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(
          screen.getByText(/you're in! check your inbox/i)
        ).toBeInTheDocument();
      });
    });

    it('success container has role="status" for accessible announcement', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue(
        mockSubscribeResponse({
          success: true,
          message: "You're in!",
        })
      );

      render(<EmailCapture source="subscribe-page" />);
      await user.type(screen.getByRole('textbox'), 'a11y@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });

    it('hides the form after successful submission (replaced by success message)', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue(
        mockSubscribeResponse({ success: true, message: "You're in!" })
      );

      render(<EmailCapture source="subscribe-page" />);
      await user.type(screen.getByRole('textbox'), 'replace@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        // The form should no longer be in the DOM after success
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('[SPEC] Error state — API failure', () => {
    it('shows API error message when success:false is returned', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue(
        mockSubscribeResponse({
          success: false,
          message: 'Something went wrong. Please try again.',
          status: 500,
        })
      );

      render(<EmailCapture source="subscribe-page" />);
      await user.type(screen.getByRole('textbox'), 'apierr@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it('form remains visible in error state (user can retry)', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue(
        mockSubscribeResponse({ success: false, message: 'Error occurred.' })
      );

      render(<EmailCapture source="subscribe-page" />);
      await user.type(screen.getByRole('textbox'), 'retry@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        // After error, button should still be in the DOM and enabled again
        expect(screen.getByRole('button')).not.toBeDisabled();
      });
    });
  });

  describe('[SPEC] Error state — network failure', () => {
    it('shows generic error message when fetch throws (network down)', async () => {
      const user = userEvent.setup();

      mockFetch.mockRejectedValue(new Error('Failed to fetch'));

      render(<EmailCapture source="subscribe-page" />);
      await user.type(screen.getByRole('textbox'), 'netfail@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/unable to connect/i)).toBeInTheDocument();
      });
    });
  });

  describe('[SPEC] Footer variant', () => {
    it('renders in footer variant without breaking', () => {
      render(<EmailCapture source="home-hero" variant="footer" />);
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('footer variant shows success text without the full success block', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue(
        mockSubscribeResponse({ success: true, message: "You're in!" })
      );

      render(<EmailCapture source="home-hero" variant="footer" />);
      await user.type(screen.getByRole('textbox'), 'footer@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        // Footer variant shows: "You're in! Check your inbox."
        expect(screen.getByText(/you're in! check your inbox/i)).toBeInTheDocument();
      });
    });
  });

  describe('[SPEC] fetch call structure', () => {
    it('calls /api/subscribe with correct method and headers', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue(
        mockSubscribeResponse({ success: true, message: "You're in!" })
      );

      render(<EmailCapture source="article-end" />);
      await user.type(screen.getByRole('textbox'), 'fetch@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledOnce();
      });

      const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('/api/subscribe');
      expect(options.method).toBe('POST');
      expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    });

    it('sends correct source in request body', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValue(
        mockSubscribeResponse({ success: true, message: "You're in!" })
      );

      render(<EmailCapture source="article-inline" />);
      await user.type(screen.getByRole('textbox'), 'source@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());

      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
      const body = JSON.parse(options.body as string) as { source: string; gdprConsent: boolean };
      expect(body.source).toBe('article-inline');
      // [SPEC] EmailCapture always sends gdprConsent: true (user-initiated form submission)
      expect(body.gdprConsent).toBe(true);
    });
  });
});
