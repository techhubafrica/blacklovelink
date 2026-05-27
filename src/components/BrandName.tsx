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

// Logo-exact colours
const LOVE_RED   = "#CC0000";   // vivid red — LOVE text + background
const LINK_GREEN = "#1A8C2E";   // medium green — K only

interface BrandNameProps {
  className?: string;
  /** White for BLACK/LIN on dark backgrounds */
  dark?: boolean;
  /** Render as stacked 3-row logo layout */
  stacked?: boolean;
}

export default function BrandName({ className = "", dark = false, stacked = false }: BrandNameProps) {
  const baseColor = dark ? "#ffffff" : "#0a0a0a";

  if (stacked) {
    return (
      <span
        className={`inline-flex flex-col items-start leading-none font-black tracking-tight ${className}`}
        aria-label="BlackLoveLink"
      >
        {/* Row 1 — BLACK */}
        <span className="flex items-center gap-[0.12em]">
          {/* Mini badge icon — mirrors the logo's small brand mark */}
          <span
            className="inline-flex items-center justify-center rounded-[0.12em] mr-[0.06em] shrink-0"
            style={{
              width: "0.72em",
              height: "0.72em",
              background: "#0a0a0a",
              border: `0.06em solid ${LOVE_RED}`,
            }}
            aria-hidden
          >
            <span style={{ color: LOVE_RED, fontSize: "0.55em", lineHeight: 1, fontWeight: 900 }}>♥</span>
          </span>
          <span style={{ color: baseColor }}>BLACK</span>
        </span>

        {/* Row 2 — LOVE on red background strip */}
        <span
          className="px-[0.18em] py-[0.04em] rounded-[0.06em]"
          style={{ background: LOVE_RED, color: "#ffffff" }}
        >
          LOVE
        </span>

        {/* Row 3 — LINK (LIN base, K green) */}
        <span>
          <span style={{ color: baseColor }}>LIN</span>
          <span style={{ color: LINK_GREEN }}>K</span>
        </span>
      </span>
    );
  }

  // ── Inline (single-line) version ─────────────────────────────────────────
  return (
    <span className={`font-black tracking-tight ${className}`} aria-label="BlackLoveLink">
      <span style={{ color: baseColor }}>BLACK</span>
      <span style={{ color: LOVE_RED }}>LOVE</span>
      <span style={{ color: baseColor }}>LIN</span>
      <span style={{ color: LINK_GREEN }}>K</span>
    </span>
  );
}
