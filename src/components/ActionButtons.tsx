import { motion } from "framer-motion";
import { X, Heart, Star, RotateCcw, Zap } from "lucide-react";

interface ActionButtonsProps {
  onNope: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onRewind: () => void;
  onBoost: () => void;
}

const ActionButtons = ({ onNope, onLike, onSuperLike, onRewind, onBoost }: ActionButtonsProps) => {
  const buttons = [
    {
      icon: RotateCcw,
      onClick: onRewind,
      size: "small" as const,
      label: "Rewind",
      ring: "ring-amber-500/30",
      iconClass: "text-amber-500",
      bgHover: "hover:bg-amber-500/10",
    },
    {
      icon: X,
      onClick: onNope,
      size: "large" as const,
      label: "Skip",
      ring: "ring-rose-500/40",
      iconClass: "text-rose-500",
      bgHover: "hover:bg-rose-500/10",
    },
    {
      icon: Star,
      onClick: onSuperLike,
      size: "small" as const,
      label: "Super Like",
      ring: "ring-sky-400/30",
      iconClass: "text-sky-400",
      bgHover: "hover:bg-sky-400/10",
    },
    {
      icon: Heart,
      onClick: onLike,
      size: "large" as const,
      label: "Like",
      ring: "ring-emerald-500/40",
      iconClass: "text-emerald-500",
      bgHover: "hover:bg-emerald-500/10",
    },
    {
      icon: Zap,
      onClick: onBoost,
      size: "small" as const,
      label: "Boost",
      ring: "ring-violet-500/30",
      iconClass: "text-violet-500",
      bgHover: "hover:bg-violet-500/10",
    },
  ];

  return (
    <div className="flex items-end justify-center gap-3 pb-6 pt-2 px-4">
      {buttons.map(({ icon: Icon, onClick, size, label, ring, iconClass, bgHover }, i) => (
        <motion.button
          key={i}
          onClick={onClick}
          whileHover={{ scale: 1.12, y: -4 }}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div
            className={`flex items-center justify-center rounded-full bg-card ring-2 shadow-lg transition-colors ${ring} ${bgHover} ${
              size === "large" ? "h-[64px] w-[64px]" : "h-[48px] w-[48px]"
            }`}
          >
            <Icon
              className={`${iconClass} ${size === "large" ? "h-7 w-7" : "h-5 w-5"}`}
              fill={size === "large" ? "currentColor" : "none"}
            />
          </div>
          <span className={`text-[10px] font-semibold tracking-wide ${iconClass} opacity-70 group-hover:opacity-100 transition-opacity`}>
            {label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default ActionButtons;
