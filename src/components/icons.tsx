import type { ReactNode } from "react";

/** Inline icon set — ported verbatim from 01-ui-components.jsx (`Icons`). */
export const Icons: Record<string, ReactNode> = {
  ship: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
      <circle cx="7" cy="17.5" r="1.4" />
      <circle cx="17.5" cy="17.5" r="1.4" />
    </svg>
  ),
  shield: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  install: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M14 6l4 4M3 21l4-1 11-11-3-3L4 17z" />
    </svg>
  ),
  lock: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  concierge: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  ),
  arrow: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
};
