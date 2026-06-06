"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Product image with a striped placeholder fallback. Ported from
 * 01-ui-components.jsx (`ProductImage` / `ImgPlaceholder`) and extended for real
 * assets: pass `src` (e.g. "/chamber.jpg") and the photo fades in over the
 * placeholder once it loads. If `src` is omitted OR the file is missing (404),
 * the striped `.img-ph` placeholder with its label stays — so dropping a file
 * into /public lights it up automatically, and a missing file never breaks the
 * layout.
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
  src,
  priority,
}: {
  label: string;
  ratio?: string;
  radius?: number;
  className?: string;
  id?: string;
  src?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showImg = Boolean(src) && !failed;

  // If the image is already cached/complete before React attaches onLoad (very
  // common on fast/cached loads + after hydration), onLoad never fires — so
  // sync state from the element on mount, otherwise the photo stays at opacity 0.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, [src]);

  const style: CSSProperties = { borderRadius: radius };
  if (ratio) style.aspectRatio = ratio;

  return (
    <div id={id} className={["img-ph", className].filter(Boolean).join(" ")} style={style}>
      {(!showImg || !loaded) && <span className="ph-label">{label}</span>}
      {showImg && (
        // Plain <img> (not next/image) so a missing /public file degrades to the
        // placeholder via onError instead of throwing.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={label}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ borderRadius: radius, opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}
