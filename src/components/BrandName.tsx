/**
 * BrandName — renders "BlackLoveLink" exactly matching the logo's typography:
 *   • B·LACK  — dark/foreground, "B" slightly larger
 *   • ❤ LOVE  — primary red
 *   • LI·NK   — "LI" dark, "NK" secondary green  (chain motif)
 *
 * Usage:
 *   <BrandName />                     — default (inherits parent font-size)
 *   <BrandName className="text-4xl" /> — scale via className
 */

interface BrandNameProps {
  className?: string;
  /** If true, renders on a dark background — "BLACK"/"LI" use white instead of foreground */
  dark?: boolean;
}

export default function BrandName({ className = "", dark = false }: BrandNameProps) {
  const baseText = dark ? "text-white" : "text-foreground";

  return (
    <span className={`font-black tracking-tight ${className}`} aria-label="BlackLoveLink">
      {/* B */}
      <span className={`${baseText}`}>B</span>
      {/* LACK */}
      <span className={`${baseText}`}>LACK</span>
      {/* LOVE — red primary */}
      <span className="text-primary">LOVE</span>
      {/* LI — dark, starts the chain */}
      <span className={`${baseText}`}>LI</span>
      {/* NK — secondary green, ends the chain */}
      <span className="text-secondary">NK</span>
    </span>
  );
}
