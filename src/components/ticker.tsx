/**
 * Horizontal triad ticker. Ported from 01-ui-components.jsx (`Ticker`).
 * Server component — the marquee is CSS-only (`.ticker-track`) and respects
 * prefers-reduced-motion via globals.css. Pass the (already translated) text.
 */
export function Ticker({ text }: { text: string }) {
  const seq = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="overflow-hidden border-y border-line-soft py-3.5">
      <div className="ticker-track">
        {[0, 1].map((g) => (
          <div key={g} className="inline-flex items-center">
            {seq.map((i) => (
              <span key={i} className="mono px-7 text-[12px]">
                {text}
                <span className="ml-7 text-ink-4">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
