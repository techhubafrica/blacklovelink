import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart, X, Star, ChevronLeft, ChevronRight,
    Briefcase, CheckCircle2, MapPin,
} from "lucide-react";
import type { UserProfile } from "@/hooks/useProfileData";

interface FeedProfileCardProps {
    profile: UserProfile;
    onLike: () => void;
    onPass: () => void;
    onSuperLike: () => void;
    onMatch?: () => void;
}

export default function FeedProfileCard({
    profile,
    onLike,
    onPass,
    onSuperLike,
}: FeedProfileCardProps) {
    const photos = profile.photos?.length ? profile.photos : ["/placeholder.svg"];
    const [photoIndex, setPhotoIndex] = useState(0);
    const [reaction, setReaction] = useState<"like" | "pass" | "super" | null>(null);
    const [expanded, setExpanded] = useState(false);

    const nextPhoto = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((i) => (i + 1) % photos.length);
    }, [photos.length]);

    const prevPhoto = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
    }, [photos.length]);

    const handleAction = (type: "like" | "pass" | "super") => {
        setReaction(type);
        setTimeout(() => {
            setReaction(null);
            if (type === "like") onLike();
            else if (type === "pass") onPass();
            else onSuperLike();
        }, 400);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-2xl bg-card border border-border"
        >
            {/* ── Photo area ── */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={photoIndex}
                        src={photos[photoIndex]}
                        alt={profile.full_name}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    />
                </AnimatePresence>

                {/* Photo dots */}
                {photos.length > 1 && (
                    <div className="absolute top-3 inset-x-3 flex gap-1">
                        {photos.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${i === photoIndex ? "bg-white" : "bg-white/40"}`}
                            />
                        ))}
                    </div>
                )}

                {/* Photo nav */}
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={prevPhoto}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={nextPhoto}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </>
                )}

                {/* Reaction flash overlay */}
                <AnimatePresence>
                    {reaction && (
                        <motion.div
                            key="reaction"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.4 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <div className={`rounded-full p-6 ${reaction === "like" ? "bg-green-500/80" :
                                    reaction === "pass" ? "bg-red-500/80" : "bg-blue-500/80"
                                }`}>
                                {reaction === "like" && <Heart className="w-14 h-14 text-white" fill="white" />}
                                {reaction === "pass" && <X className="w-14 h-14 text-white" />}
                                {reaction === "super" && <Star className="w-14 h-14 text-white" fill="white" />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Name / age overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-white text-2xl font-black">
                                    {profile.full_name}{profile.age ? `, ${profile.age}` : ""}
                                </h2>
                                {profile.verified && (
                                    <CheckCircle2 className="w-5 h-5 text-blue-400" fill="currentColor" />
                                )}
                            </div>
                            {(profile.occupation_title || profile.occupation_company) && (
                                <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {profile.occupation_title}
                                    {profile.occupation_company && ` · ${profile.occupation_company}`}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setExpanded((v) => !v)}
                            className="text-xs text-white/70 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 hover:bg-white/20 transition"
                        >
                            {expanded ? "Less" : "More"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Expanded info ── */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 py-4 space-y-3 border-t border-border">
                            {profile.intent && (
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-foreground">{profile.intent}</span>
                                </p>
                            )}
                            {profile.bio && (
                                <p className="text-sm text-foreground/80 leading-relaxed">{profile.bio}</p>
                            )}
                            {profile.interests?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {profile.interests.slice(0, 6).map((interest) => (
                                        <span
                                            key={interest}
                                            className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Action buttons ── */}
            <div className="flex items-center justify-center gap-5 px-6 py-5">
                {/* Pass */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAction("pass")}
                    className="w-14 h-14 rounded-full bg-card border-2 border-red-400/40 flex items-center justify-center shadow-lg hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                    <X className="w-7 h-7 text-red-400" />
                </motion.button>

                {/* Super Like */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAction("super")}
                    className="w-12 h-12 rounded-full bg-card border-2 border-blue-400/40 flex items-center justify-center shadow hover:border-blue-400 transition-colors"
                >
                    <Star className="w-5 h-5 text-blue-400" />
                </motion.button>

                {/* Like */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAction("like")}
                    className="w-14 h-14 rounded-full gradient-brand flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                >
                    <Heart className="w-7 h-7 text-white" fill="white" />
                </motion.button>
            </div>
        </motion.div>
    );
}
