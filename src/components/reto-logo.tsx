import Image from "next/image";

/**
 * RETO logo. The official mark is the iridescent chrome heart + heartbeat
 * (public/reto-logo.png — transparent background, made for black surfaces),
 * followed by the RETO wordmark for legibility in the chrome. `height` scales
 * the mark to the prototype's Logo sizing (nav ~24, footer ~22). Pass
 * `priority` for above-the-fold use (the header) to skip lazy-loading.
 */
export function RetoLogo({
  className,
  height = 22,
  priority = false,
}: {
  className?: string;
  height?: number;
  priority?: boolean;
}) {
  const markH = Math.round(height * 1.12);
  const markW = Math.round((markH * 1080) / 1020); // source asset is 1080×1020
  const fontSize = Math.round(height * 0.82);
  return (
    <span className={["inline-flex items-center gap-2.5", className].filter(Boolean).join(" ")}>
      <Image
        src="/reto-logo.png"
        alt="RETO"
        width={markW}
        height={markH}
        priority={priority}
        className="shrink-0 select-none"
      />
      <span
        className="font-sans font-bold leading-none tracking-[0.26em] text-ink"
        style={{ fontSize }}
      >
        RETO
      </span>
    </span>
  );
}
