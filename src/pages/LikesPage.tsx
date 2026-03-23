import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, ArrowLeft, CheckCircle2, Briefcase, Loader2, X } from "lucide-react";
import TopNav from "@/components/TopNav";
import { useLikes } from "@/hooks/useLikes";
import type { LikeEntry } from "@/hooks/useLikes";
import { useSwipe } from "@/hooks/useSwipe";
import type { UserProfile } from "@/hooks/useProfileData";

const LikesPage = () => {
    const { likes, loading, refetch } = useLikes();
    const { recordSwipe } = useSwipe();
    const [selected, setSelected] = useState<LikeEntry | null>(null);
    const [acting, setActing] = useState(false);

    const handleLikeBack = async (liker: UserProfile) => {
        setActing(true);
        await recordSwipe(liker, "right");
        await refetch();
        setSelected(null);
        setActing(false);
    };

    const handlePass = async (liker: UserProfile) => {
        setActing(true);
        await recordSwipe(liker, "left");
        await refetch();
        setSelected(null);
        setActing(false);
    };

    // Profile detail view
    if (selected) {
        const { liker, intro_text, direction } = selected;
        return (
            <div className="flex h-[100dvh] flex-col bg-background">
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-foreground">Their Profile</span>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Photo */}
                    <div className="relative h-80">
                        <img
                            src={liker.photos?.[0] || liker.avatar_url || "/placeholder.svg"}
                            alt={liker.full_name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-white">
                                    {liker.full_name}{liker.age ? `, ${liker.age}` : ""}
                                </h2>
                                {liker.verified && <CheckCircle2 className="w-5 h-5 text-blue-400" fill="currentColor" />}
                            </div>
                            {liker.occupation_title && (
                                <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {liker.occupation_title}{liker.occupation_company && ` · ${liker.occupation_company}`}
                                </p>
                            )}
                        </div>

                        {/* Badge for how they liked */}
                        <div className="absolute top-4 right-4">
                            {direction === "message" ? (
                                <span className="flex items-center gap-1 px-3 py-1.5 bg-primary rounded-full text-xs font-bold text-primary-foreground shadow">
                                    <MessageCircle className="w-3.5 h-3.5" /> Messaged You
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 rounded-full text-xs font-bold text-white shadow">
                                    <Heart className="w-3.5 h-3.5" fill="white" /> Liked You
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Their Message */}
                        {intro_text && (
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <MessageCircle className="w-3.5 h-3.5" /> Their Message
                                </p>
                                <p className="text-foreground text-sm leading-relaxed">"{intro_text}"</p>
                            </div>
                        )}

                        {liker.intent && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Looking for</p>
                                <p className="text-foreground flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-primary" />
                                    {liker.intent}
                                </p>
                            </div>
                        )}

                        {liker.bio && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">About</p>
                                <p className="text-sm text-foreground/80 leading-relaxed">{liker.bio}</p>
                            </div>
                        )}

                        {liker.interests?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Interests</p>
                                <div className="flex flex-wrap gap-2">
                                    {liker.interests.map((interest) => (
                                        <span key={interest} className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="border-t border-border p-4 flex gap-3">
                    <button
                        onClick={() => handlePass(liker)}
                        disabled={acting}
                        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-card border border-border font-semibold text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-950 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-red-500" /> Pass
                    </button>
                    <button
                        onClick={() => handleLikeBack(liker)}
                        disabled={acting}
                        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full gradient-brand text-primary-foreground font-semibold shadow-button hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {acting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" fill="white" />}
                        Like Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[100dvh] flex-col bg-background">
            <TopNav />

            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-md px-4 pt-5 pb-10">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
                            <Heart className="w-7 h-7 text-primary" fill="currentColor" />
                            Likes You
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {likes.length > 0
                                ? `${likes.length} ${likes.length === 1 ? "person" : "people"} liked your profile`
                                : "People who like your profile will appear here"}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-52 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground text-sm">Loading...</p>
                        </div>
                    ) : likes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mt-20"
                        >
                            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                                <Heart className="w-12 h-12 text-primary" />
                            </div>
                            <p className="text-xl font-bold text-foreground">No likes yet</p>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                                Complete your profile and keep swiping — your likes will show up here!
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <AnimatePresence>
                                {likes.map((entry, i) => (
                                    <motion.button
                                        key={entry.swipe_id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelected(entry)}
                                        className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-muted text-left shadow-sm border border-border hover:shadow-lg transition-shadow group"
                                    >
                                        <img
                                            src={entry.liker.photos?.[0] || entry.liker.avatar_url || "/placeholder.svg"}
                                            alt={entry.liker.full_name}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                        {/* Like/Message badge */}
                                        <div className="absolute top-2 right-2">
                                            {entry.direction === "message" ? (
                                                <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-full shadow">
                                                    <MessageCircle className="w-4 h-4 text-white" />
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center w-8 h-8 bg-rose-500 rounded-full shadow">
                                                    <Heart className="w-4 h-4 text-white" fill="white" />
                                                </span>
                                            )}
                                        </div>

                                        {/* Name at bottom */}
                                        <div className="absolute bottom-0 inset-x-0 p-3">
                                            <p className="text-white font-bold text-sm leading-tight">
                                                {entry.liker.full_name.split(" ")[0]}
                                                {entry.liker.age ? `, ${entry.liker.age}` : ""}
                                            </p>
                                            {entry.liker.occupation_title && (
                                                <p className="text-white/70 text-xs truncate">{entry.liker.occupation_title}</p>
                                            )}
                                            {entry.intro_text && (
                                                <p className="text-white/80 text-xs mt-1 line-clamp-1 italic">"{entry.intro_text}"</p>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LikesPage;
