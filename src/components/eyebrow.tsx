import type { ReactNode } from "react";

/** Mono uppercase eyebrow label. Ported from 01-ui-components.jsx (`Eyebrow`). */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={["mono", className].filter(Boolean).join(" ")}>{children}</div>;
}
