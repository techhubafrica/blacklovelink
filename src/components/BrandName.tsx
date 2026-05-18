/**
 * BrandName — renders "BlackLoveLink" exactly matching the logo's typography:
 *   • B·LACK  — dark/foreground, "B" slightly larger
 *   • ❤ LOVE  — logo red  (#C41414)
 *   • LI·NK   — "LI" dark, "NK" logo green (#0F6B25)
 *
 * Uses explicit inline style colours (comma-format hsl) instead of Tailwind
 * CSS-variable classes so every mobile browser — including older Samsung
 * Internet and Android WebView — renders the correct colours without needing
 * CSS Color Level 4 (space-separated hsl) support.
 *
 * Usage:
 *   <BrandName />                     — default (inherits parent font-size)
 *   <BrandName className="text-4xl" /> — scale via className
 */

// Logo-exact colours in universally-supported hsl(h, s%, l%) format
const LOVE_RED   = "hsl(0, 86%, 43%)";   // ≈ #C41414 — logo red
const LINK_GREEN = "hsl(145, 70%, 28%)"; // ≈ #0F6B25 — logo green

interface BrandNameProps {
  className?: string;
  /** If true, renders on a dark background — "BLACK"/"LI" use white */
  dark?: boolean;
}

export default function BrandName({ className = "", dark = false }: BrandNameProps) {
  const baseColor = dark ? "#ffffff" : "hsl(220, 15%, 10%)";

  return (
    <span className={`font-black tracking-tight ${className}`} aria-label="BlackLoveLink">
      <span style={{ color: baseColor }}>B</span>
      <span style={{ color: baseColor }}>LACK</span>
      {/* LOVE — logo red */}
      <span style={{ color: LOVE_RED }}>LOVE</span>
      {/* LI — same as BLACK */}
      <span style={{ color: baseColor }}>LI</span>
      {/* NK — logo green */}
      <span style={{ color: LINK_GREEN }}>NK</span>
    </span>
  );
}
