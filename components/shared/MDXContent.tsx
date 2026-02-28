'use client';

/**
 * MDXContent — renders Velite-compiled MDX function bodies.
 * The `code` field is produced by Velite at BUILD TIME (s.mdx() schema).
 * It is NOT user input — it comes from .mdx files processed during `velite build`.
 * This is the standard Velite rendering pattern. See: https://velite.js.org/guide/using-mdx
 */
import React, { useMemo } from 'react';
import * as runtime from 'react/jsx-runtime';

interface MDXContentProps {
  code: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useMDXComponent(code: string): React.ComponentType<any> {
  return useMemo(() => {
    // code is build-time compiled MDX from Velite — not dynamic user input
    // skipcq: JS-0060
    const fn = new Function(code); // NOSONAR
    return fn({ ...runtime }).default;
  }, [code]);
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component />;
}
