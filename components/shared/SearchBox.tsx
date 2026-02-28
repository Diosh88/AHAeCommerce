'use client';

/**
 * SearchBox — client component using Pagefind for full-text search.
 * Pagefind index is built at build time via: npx pagefind --site out
 * https://pagefind.app/docs/
 *
 * Pagefind is loaded via a runtime script tag (not webpack import) because:
 * - It's a build artifact at /pagefind/pagefind.js (not in node_modules)
 * - Webpack cannot resolve it at compile time
 * - The script tag approach is the official Pagefind integration pattern
 *
 * Note on dangerouslySetInnerHTML: Pagefind excerpt HTML wraps matched terms
 * in <mark> tags. This HTML originates from Pagefind's build-time index —
 * it is NOT user input. The index is built from our own MDX content during
 * `npx pagefind --site out`. No user-supplied data reaches this render path.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface PagefindResult {
  id: string;
  url: string;
  meta: {
    title?: string;
    description?: string;
  };
  excerpt: string;
}

interface PagefindSearchResult {
  results: Array<{
    data: () => Promise<PagefindResult>;
    id: string;
  }>;
}

interface PagefindInstance {
  search: (query: string) => Promise<PagefindSearchResult>;
}

declare global {
  interface Window {
    pagefind?: PagefindInstance;
  }
}

type SearchStatus = 'idle' | 'ready' | 'error' | 'searching';

function loadPagefindScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser'));
      return;
    }
    if (window.pagefind) {
      resolve();
      return;
    }
    // Check if script already added
    if (document.querySelector('script[data-pagefind]')) {
      // Wait briefly for it to load
      const check = setInterval(() => {
        if (window.pagefind) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        reject(new Error('Pagefind load timeout'));
      }, 5000);
      return;
    }
    const script = document.createElement('script');
    script.setAttribute('data-pagefind', 'true');
    script.type = 'module';
    script.textContent = `
      try {
        const pagefind = await import('/pagefind/pagefind.js');
        await pagefind.init();
        window.pagefind = pagefind;
        window.dispatchEvent(new Event('pagefind:ready'));
      } catch (e) {
        window.dispatchEvent(new Event('pagefind:error'));
      }
    `;
    document.head.appendChild(script);

    const onReady = () => {
      window.removeEventListener('pagefind:ready', onReady);
      window.removeEventListener('pagefind:error', onError);
      resolve();
    };
    const onError = () => {
      window.removeEventListener('pagefind:ready', onReady);
      window.removeEventListener('pagefind:error', onError);
      reject(new Error('Pagefind unavailable'));
    };

    window.addEventListener('pagefind:ready', onReady);
    window.addEventListener('pagefind:error', onError);
  });
}

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [pagefindStatus, setPagefindStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputId = 'search-input';

  // Load Pagefind on mount via script tag (not webpack import)
  useEffect(() => {
    loadPagefindScript()
      .then(() => setPagefindStatus('ready'))
      .catch(() => setPagefindStatus('unavailable'));
  }, []);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim() || pagefindStatus !== 'ready' || !window.pagefind) {
      setResults([]);
      setStatus('idle');
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setStatus('searching');

    try {
      const searchResult = await window.pagefind.search(q);

      if (signal.aborted) return;

      const resolvedResults = await Promise.all(
        searchResult.results.slice(0, 10).map((r) => r.data())
      );

      if (signal.aborted) return;

      setResults(resolvedResults);
      setStatus('ready');
    } catch {
      if (!signal.aborted) {
        setStatus('error');
        setResults([]);
      }
    }
  }, [pagefindStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      setResults([]);
      setStatus('idle');
      return;
    }

    debounceRef.current = setTimeout(() => {
      void performSearch(val);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  const hasResults = results.length > 0;
  const showNoResults = status === 'ready' && query.trim() && !hasResults;

  return (
    <div>
      {/* Search input */}
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          Search articles
        </label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[--color-text-muted]"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
            />
          </svg>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={handleChange}
            placeholder="Search frameworks, topics, decisions..."
            autoComplete="off"
            aria-label="Search articles"
            aria-describedby={
              pagefindStatus === 'unavailable'
                ? 'search-unavailable'
                : hasResults
                ? 'search-results-count'
                : undefined
            }
            className="w-full pl-12 pr-4 py-4 border border-[--color-border] rounded-md bg-[--color-surface] text-[--color-text] text-base font-sans placeholder:text-[--color-text-muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 min-h-[52px]"
          />
          {status === 'searching' && (
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <svg
                className="animate-spin h-5 w-5 text-[--color-text-muted]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Pagefind unavailable notice */}
      {pagefindStatus === 'unavailable' && (
        <p
          id="search-unavailable"
          className="text-sm font-sans text-[--color-text-muted] mt-3"
          role="status"
        >
          Search index not available. Run{' '}
          <code className="font-mono text-xs bg-[--color-surface-raised] px-1 py-0.5 rounded">
            npm run build
          </code>{' '}
          then{' '}
          <code className="font-mono text-xs bg-[--color-surface-raised] px-1 py-0.5 rounded">
            npx pagefind --site out
          </code>{' '}
          to enable search.
        </p>
      )}

      {/* Results */}
      {hasResults && (
        <>
          <p
            id="search-results-count"
            className="text-sm font-sans text-[--color-text-muted] mt-4"
            role="status"
            aria-live="polite"
          >
            {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
          </p>
          <ul
            className="mt-4 space-y-3"
            role="list"
            aria-label="Search results"
          >
            {results.map((result) => (
              <li key={result.url}>
                <Link
                  href={result.url}
                  className="block border border-[--color-border] rounded-md p-5 bg-[--color-surface] hover:border-[--color-border-brand] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2 transition-base"
                >
                  {result.meta.title && (
                    <h2 className="text-base font-semibold font-sans text-[--color-text]">
                      {result.meta.title}
                    </h2>
                  )}
                  {result.excerpt && (
                    // Pagefind excerpt: build-time generated HTML with <mark> highlights.
                    // Source: our own .mdx content index — not user input.
                    <p
                      className="text-sm font-sans text-[--color-text-secondary] mt-1 leading-relaxed line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  )}
                  <p className="text-xs font-sans text-[--color-text-muted] mt-2">
                    {result.url}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* No results */}
      {showNoResults && (
        <div
          className="mt-6 text-center py-10"
          role="status"
          aria-live="polite"
        >
          <p className="text-base font-sans text-[--color-text-secondary]">
            No results for &ldquo;{query}&rdquo;.
          </p>
          <p className="text-sm font-sans text-[--color-text-muted] mt-1">
            Try different keywords or{' '}
            <Link
              href="/articles"
              className="text-[--color-text-brand] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm"
            >
              browse all articles
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
