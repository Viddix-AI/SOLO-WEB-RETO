"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper. Ported in spirit from 01-ui-components.jsx (`Reveal`).
 *
 * Robust + flash-free + SSR-safe:
 * - SSR / no-JS / reduced-motion → content is fully visible (`.reveal` base).
 * - Elements already in (or near) view on mount stay visible, no animation.
 * - Below-the-fold elements arm to hidden, then fade/slide in via
 *   IntersectionObserver when scrolled into view.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const vh = window.innerHeight || document.documentElement.clientHeight;
    // Already in / near view on mount → leave visible (no flash, no animation).
    if (el.getBoundingClientRect().top < vh * 0.92) return;

    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setArmed(false);
            io.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={["reveal", armed ? "is-armed" : "", className].filter(Boolean).join(" ")}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
