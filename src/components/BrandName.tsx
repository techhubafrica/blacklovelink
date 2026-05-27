/**
 * BrandName — renders "blacklovelink" matching the official logo wordmark.
 *
 * Typography:  Playfair Display, italic, weight 600
 * Colours:     black = #0a0a0a  |  love = #C8102E  |  link = #0F7B3C
 *
 * dark=true  →  "black" renders white with a soft glow for readability
 *               on the dark hero background photo.
 */

// Logo-exact colours (pan-African palette from the official wordmark)
const FLAG_BLACK = "#0a0a0a";
const FLAG_RED   = "#C8102E";
const FLAG_GREEN = "#0F7B3C";

interface BrandNameProps {
  className?: string;
  /** Render "black" in white instead of black (for dark backgrounds) */
  dark?: boolean;
  /** Legacy prop — kept for backward compatibility, no longer changes layout */
  stacked?: boolean;
}

export default function BrandName({ className = "", dark = false }: BrandNameProps) {
  const blackTone = dark ? "#ffffff" : FLAG_BLACK;

  // Soft white glow so "black" is readable over the dark hero image
  const blackGlow = dark
    ? "0 0 20px rgba(255,255,255,0.85), 0 0 50px rgba(255,255,255,0.40), 0 2px 6px rgba(0,0,0,0.9)"
    : "none";

  return (
    <span
      className={`font-serif italic leading-[0.9] tracking-[-0.02em] whitespace-nowrap inline-flex items-baseline ${className}`}
      style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontWeight: 600 }}
      aria-label="blacklovelink"
    >
      <span style={{ color: blackTone, textShadow: blackGlow }}>black</span>
      <span style={{ color: FLAG_RED }}>love</span>
      <span style={{ color: FLAG_GREEN }}>link</span>
    </span>
  );
}
