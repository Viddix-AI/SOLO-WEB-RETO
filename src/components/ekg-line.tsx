import type { CSSProperties } from "react";

/**
 * Iridescent EKG / heartbeat line. Ported from 01-ui-components.jsx (`EKGLine`).
 * Server component: the gradient id is fixed (override `id` if multiple
 * instances appear on one page).
 */
export function EKGLine({
  height = 28,
  strokeWidth = 2,
  id = "reto-ekg",
  className = "",
  style,
}: {
  height?: number;
  strokeWidth?: number;
  id?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const path = "M0 24 H78 l7 -16 l8 34 l9 -44 l8 30 l6 -4 H260";
  return (
    <svg
      viewBox="0 0 260 48"
      preserveAspectRatio="none"
      height={height}
      width="100%"
      className={className}
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7FE3D2" />
          <stop offset="35%" stopColor="#BFC6D6" />
          <stop offset="60%" stopColor="#E9C9E4" />
          <stop offset="100%" stopColor="#9FD8CF" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
