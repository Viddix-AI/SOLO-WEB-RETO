/**
 * RETO wordmark. No official logo asset was supplied in the design reference,
 * so this is a faithful typographic mark: the "RETO" wordmark in Helvetica Neue,
 * preceded by a small iridescent EKG/heartbeat glyph (the irid chrome is used
 * very sparingly, per the design tokens). The `height` prop scales it to match
 * the prototype's Logo sizing (nav ~24, footer ~22). A standalone
 * /public/reto-logo.svg mirrors this. Drop in the official PNG/SVG to replace it.
 */
export function RetoLogo({ className, height = 22 }: { className?: string; height?: number }) {
  const fontSize = Math.round(height * 0.82);
  const markH = Math.round(height * 0.62);
  const markW = Math.round((markH * 22) / 14);
  const gradId = `reto-irid-${height}`;
  return (
    <span className={["inline-flex items-center gap-2.5", className].filter(Boolean).join(" ")}>
      <RetoMark width={markW} height={markH} gradId={gradId} />
      <span
        className="font-sans font-bold leading-none tracking-[0.26em] text-ink"
        style={{ fontSize }}
      >
        RETO
      </span>
    </span>
  );
}

function RetoMark({ width, height, gradId }: { width: number; height: number; gradId: string }) {
  return (
    <svg width={width} height={height} viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="22" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7FE3D2" />
          <stop offset="0.3" stopColor="#BFC6D6" />
          <stop offset="0.55" stopColor="#E9C9E4" />
          <stop offset="0.8" stopColor="#9FD8CF" />
          <stop offset="1" stopColor="#C7C3E0" />
        </linearGradient>
      </defs>
      <path
        d="M1 7h4.5l1.8-5 3 11 2-6h8.7"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
