/**
 * BrandName — renders "BlackLoveLink" matching the logo exactly.
 *
 * Logo layout (stacked, 3 rows):
 *   Row 1: [badge icon]  B·LACK  — white on dark bg / black on light bg
 *   Row 2:               LOVE    — white text on a vivid red background strip
 *   Row 3:               LIN·K   — LIN white/dark, K green
 *
 * Props:
 *   dark     — use white for BLACK/LIN (hero on dark image)
 *   stacked  — render as 3 rows like the logo (default: false = inline)
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

/**
 * Renders the BlackLoveLink wordmark recreated in pure HTML/CSS — no image,
 * no background. Serif lowercase letters, pan-African colour split, and a
 * flag-striped capital "L" leading the word. Matches the official artwork.
 */
export default function BrandName({ className = "", dark = false }: BrandNameProps) {
  const blackTone = dark ? "#ffffff" : FLAG_BLACK;

  return (
    <span
      className={`font-serif italic leading-[0.9] tracking-[-0.02em] whitespace-nowrap inline-flex items-baseline ${className}`}
      style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif', fontWeight: 600 }}
      aria-label="blacklovelink"
    >
      {/* Flag-striped capital L */}
      <span
        aria-hidden
        className="inline-block align-baseline"
        style={{
          width: "0.55em",
          height: "0.95em",
          marginRight: "0.04em",
          background: `linear-gradient(to bottom, ${FLAG_BLACK} 0 33.33%, ${FLAG_RED} 33.33% 66.66%, ${FLAG_GREEN} 66.66% 100%)`,
          WebkitMask:
            "linear-gradient(#000,#000) left/0.18em 100% no-repeat, linear-gradient(#000,#000) bottom/100% 0.18em no-repeat",
          mask:
            "linear-gradient(#000,#000) left/0.18em 100% no-repeat, linear-gradient(#000,#000) bottom/100% 0.18em no-repeat",
        }}
      />
      <span style={{ color: blackTone }}>black</span>
      <span style={{ color: FLAG_RED }}>love</span>
      <span style={{ color: FLAG_GREEN }}>link</span>
    </span>
  );
}
