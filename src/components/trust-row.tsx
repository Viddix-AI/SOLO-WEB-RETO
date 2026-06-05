import type { CSSProperties, ReactNode } from "react";

export interface TrustItem {
  icon: ReactNode;
  label: string;
}

/**
 * Row of trust signals (icon + mono label) in a hairline grid.
 * Ported from 01-ui-components.jsx (`TrustRow`). Two columns on mobile, one
 * column per item on desktop. Used by the product screens (Bloque C).
 */
export function TrustRow({ items, className = "" }: { items: TrustItem[]; className?: string }) {
  const style = { "--tc": String(items.length) } as CSSProperties;
  return (
    <div
      style={style}
      className={[
        "grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line-soft bg-line-soft",
        "lg:[grid-template-columns:repeat(var(--tc),minmax(0,1fr))]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2.5 bg-surface-1 px-[18px] py-4">
          <span className="inline-flex text-ink-2">{it.icon}</span>
          <span className="mono mono-sm text-ink-2">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
