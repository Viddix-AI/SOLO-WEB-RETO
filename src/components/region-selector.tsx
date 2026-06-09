"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { REGION_ORDER, REGIONS } from "@/lib/regions";
import { useRegion } from "@/lib/region-context";

/**
 * Region selector dropdown. Ported from 01-ui-components.jsx (`RegionSelector`).
 * `setRegion(rid)` is replaced by navigation: it swaps the leading region
 * segment of the current path, so language + currency change live.
 */
export function RegionSelector({ compact = false }: { compact?: boolean }) {
  const { region } = useRegion();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function pick(slug: string) {
    const rest = pathname.replace(/^\/(us|latam|eu)(?=\/|$)/i, "");
    setOpen(false);
    router.push(`/${slug}${rest}`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          "flex items-center gap-2 rounded-pill border border-line bg-transparent font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-line-hover",
          compact ? "px-2.5 py-1.5" : "px-3.5 py-2",
        ].join(" ")}
      >
        <span className="h-[5px] w-[5px] rounded-full bg-positive" />
        {region.short}
        <svg
          width="9"
          height="6"
          className={["ml-0.5 transition-transform", open ? "rotate-180" : ""].join(" ")}
        >
          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" fill="none" strokeWidth="1.2" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+8px)] z-[60] min-w-[220px] max-w-[calc(100vw-24px)] rounded-xl border border-line bg-surface-2 p-1.5 shadow-pop"
        >
          <div className="mono mono-sm px-3 pb-1.5 pt-2 text-ink-4">Región · Region</div>
          {REGION_ORDER.map((rid) => {
            const r = REGIONS[rid];
            const active = rid === region.id;
            return (
              <button
                key={rid}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(r.routeSlug)}
                className={[
                  "flex w-full items-center justify-between rounded-[8px] px-3 py-[11px] text-left",
                  active ? "bg-white/5" : "",
                ].join(" ")}
              >
                <span className="flex flex-col gap-[3px]">
                  <span className="text-[14px] tracking-[-0.01em] text-ink">{r.label}</span>
                  <span className="mono mono-sm text-ink-3">{r.short}</span>
                </span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-positive" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
