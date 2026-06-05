import type { ReactNode } from "react";

/** Badge / iridescent badge. Ported from 01-ui-components.jsx (`Badge`). */
export function Badge({
  children,
  dot,
  irid,
  className = "",
}: {
  children: ReactNode;
  dot?: boolean;
  irid?: boolean;
  className?: string;
}) {
  if (irid) {
    return (
      <span className={["badge-irid", className].filter(Boolean).join(" ")}>
        <span>{children}</span>
      </span>
    );
  }
  return (
    <span className={["badge", className].filter(Boolean).join(" ")}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}
