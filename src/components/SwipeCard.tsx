import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { MapPin, Briefcase, CheckCircle2, Heart, X } from "lucide-react";
import type { UserProfile } from "@/hooks/useProfileData";

interface SwipeCardProps {
  profile: UserProfile;
  onSwipe: (direction: "left" | "right" | "up") => void;
  isTop: boolean;
}

const intentColors: Record<string, string> = {
  "Long-term relationship": "bg-primary/10 text-primary",
  "Marriage": "bg-rose-500/10 text-rose-500",
  "Open to explore": "bg-amber-500/10 text-amber-600",
  "Networking only": "bg-blue-500/10 text-blue-500",
};

const SwipeCard = ({ profile, onSwipe, isTop }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => onSwipe("right"), 250);
    } else if (info.offset.x < -100) {
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => onSwipe("left"), 250);
    } else {
      animate(x, 0, { duration: 0.4, type: "spring" });
    }
  };

  const intentColorClass = intentColors[profile.intent] ?? "bg-muted text-muted-foreground";

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
      style={{ x, rotate, zIndex: isTop ? 10 : 5 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.96, y: isTop ? 0 : 12 }}
    >
      {/* Card */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-card">
        {/* Profile image */}
        <img
          src={profile.avatar_url ?? profile.photos?.[0] ?? "/placeholder.svg"}
          alt={profile.full_name}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* LIKE label */}
        <motion.div
          className="absolute top-10 left-6 border-2 border-green-400 text-green-400 font-black text-2xl px-4 py-1 rounded-lg rotate-[-20deg]"
          style={{ opacity: likeOpacity }}
        >
          LIKE 💚
        </motion.div>

        {/* NOPE label */}
        <motion.div
          className="absolute top-10 right-6 border-2 border-rose-400 text-rose-400 font-black text-2xl px-4 py-1 rounded-lg rotate-[20deg]"
          style={{ opacity: nopeOpacity }}
        >
          NOPE ✗
        </motion.div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
          {/* Name + age + verified */}
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black text-white">
              {profile.full_name}, {profile.age ?? ""}
            </h3>
            {profile.verified && (
              <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" />
            )}
          </div>

          {/* Occupation */}
          <div className="flex items-center gap-1.5 text-white/80 text-sm">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{profile.occupation_title} · {profile.occupation_company}</span>
          </div>

          {/* Distance + intent */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              {profile.distance}
            </div>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${intentColorClass}`}>
              {profile.intent ?? ""}
            </span>
          </div>

          {/* Bio */}
          <p className="text-sm text-white/80 leading-snug line-clamp-2">{profile.bio}</p>

          {/* Interest tags */}
          <div className="flex gap-1.5 flex-wrap pt-1">
            {(profile.interests ?? []).slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick action hints at bottom */}
      {isTop && (
        <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-6 text-xs text-muted-foreground opacity-60">
          <span className="flex items-center gap-1"><X className="w-3 h-3 text-rose-400" /> Swipe left</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-green-400" /> Swipe right</span>
        </div>
      )}
    </motion.div>
  );
};

export default SwipeCard;
