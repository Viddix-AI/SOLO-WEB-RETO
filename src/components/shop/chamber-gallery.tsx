"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product-image";

const LABELS = ["EXTERIOR — sobre negro", "INTERIOR — detalle", "CONTROL — pantalla táctil"];
const THUMBS = ["EXT", "INT", "UI"];

/** Chamber image gallery (main + thumbnails). Ported from 04-chamber-book-screens.jsx. */
export function ChamberGallery() {
  const [gi, setGi] = useState(0);
  return (
    <div>
      <ProductImage label={LABELS[gi]} src={gi === 0 ? "/chamber.jpg" : undefined} ratio="1 / 1" radius={16} />
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {THUMBS.map((th, i) => (
          <button
            key={th}
            type="button"
            onClick={() => setGi(i)}
            aria-label={LABELS[i]}
            aria-pressed={gi === i}
            className={[
              "overflow-hidden rounded-[10px] border p-0",
              gi === i ? "border-line-hover" : "border-line-soft",
            ].join(" ")}
          >
            <ProductImage label={th} ratio="1 / 1" radius={9} />
          </button>
        ))}
      </div>
    </div>
  );
}
