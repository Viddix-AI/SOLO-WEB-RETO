import type { CSSProperties } from "react";

/**
 * Striped image placeholder. Ported from 01-ui-components.jsx
 * (`ProductImage` / `ImgPlaceholder`) — the prototype's `<image-slot>` web
 * component is intentionally not ported; per the prototype README we keep the
 * striped `.img-ph` placeholder until real assets exist.
 *
 * Provide either `ratio` (inline aspect-ratio, e.g. "3 / 4") or responsive
 * aspect utilities via `className` (e.g. "aspect-[4/3] lg:aspect-[3/4]").
 */
export function ProductImage({
  label,
  ratio,
  radius = 14,
  className = "",
  id,
}: {
  label: string;
  ratio?: string;
  radius?: number;
  className?: string;
  id?: string;
}) {
  const style: CSSProperties = { borderRadius: radius };
  if (ratio) style.aspectRatio = ratio;
  return (
    <div id={id} className={["img-ph", className].filter(Boolean).join(" ")} style={style}>
      <span className="ph-label">{label}</span>
    </div>
  );
}
