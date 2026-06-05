import { IBM_Plex_Mono } from "next/font/google";

/**
 * Mono typeface (labels / eyebrows / prices) loaded via next/font.
 * Exposed as the CSS variable --font-plex-mono, which --font-mono
 * (globals.css) references. The sans face is Helvetica Neue — a system
 * font — so it stays in the CSS font stack (nothing to self-host).
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  variable: "--font-plex-mono",
  display: "swap",
});
