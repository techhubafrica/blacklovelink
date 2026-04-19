import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORIES = ["My Story", "Love Advice", "Question", "Rant", "Confession"] as const;

interface NewPostModalProps {
    open: boolean;
    onClose: () => void;
    onPosted: () => void;
    userFullName: string;
}

export default function NewPostModal({ open, onClose, onPosted, userFullName }: NewPostModalProps) {
    const [category, setCategory] = useState<string>("Question");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const reset = () => {
        setTitle(""); setBody(""); setCategory("Question"); setIsAnonymous(false);
    };

    const handleClose = () => { reset(); onClose(); };

    const submit = async () => {
        if (!title.trim() || !body.trim()) {
            toast.error("Please fill in both the title and your story."); return;
        }
        setSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { toast.error("You must be logged in."); return; }

            const { error } = await (supabase as any).from("community_posts").insert({
                user_id: session.user.id,
                is_anonymous: isAnonymous,
                display_name: isAnonymous ? null : userFullName,
                category,
                title: title.trim(),
                body: body.trim(),
            });

            if (error) throw error;
            toast.success("Post shared with the community ❤️");
            reset();
            onPosted();
            onClose();
        } catch (e) {
            toast.error("Failed to post. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    {/* Sheet */}
                    <motion.div
                        key="sheet"
                        initial={{ y: "100%" }}
                        animate={{ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }}
                        exit={{ y: "100%", transition: { duration: 0.2 } }}
                        className="fixed bottom-0 inset-x-0 z-50 bg-card rounded-t-3xl border-t border-border max-h-[92vh] overflow-y-auto"
                    >
                        <div className="p-6 space-y-5">
                            {/* Handle + header */}
                            <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-1" />
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black text-foreground">Share with the Community</h2>
                                <button onClick={handleClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <X className="w-4 h-4 text-foreground" />
                                </button>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setCategory(c)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${category === c
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-border bg-muted text-foreground hover:border-primary/40"
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Title</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    maxLength={120}
                                    placeholder="Give your post a title..."
                                    className="w-full bg-muted border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition"
                                />
                            </div>

                            {/* Body */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Your story</label>
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    maxLength={2000}
                                    rows={5}
                                    placeholder="Share honestly. This is a safe space."
                                    className="w-full bg-muted border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition resize-none"
                                />
                                <p className="text-right text-xs text-muted-foreground mt-1">{body.length}/2000</p>
                            </div>

                            {/* Anonymous toggle */}
                            <button
                                onClick={() => setIsAnonymous(v => !v)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${isAnonymous ? "border-primary bg-primary/5" : "border-border bg-muted"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {isAnonymous
                                        ? <Lock className="w-5 h-5 text-primary" />
                                        : <User className="w-5 h-5 text-muted-foreground" />
                                    }
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-foreground">
                                            {isAnonymous ? "Posting anonymously" : `Posting as ${userFullName}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {isAnonymous ? "Your name won't be shown" : "Tap to post anonymously instead"}
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${isAnonymous ? "bg-primary" : "bg-muted-foreground/30"}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${isAnonymous ? "translate-x-4" : "translate-x-0"}`} />
                                </div>
                            </button>

                            {/* Submit */}
                            <button
                                onClick={submit}
                                disabled={submitting || !title.trim() || !body.trim()}
                                className="w-full py-4 rounded-2xl gradient-brand text-primary-foreground font-black text-base shadow-button disabled:opacity-50 transition hover:opacity-90"
                            >
                                {submitting ? "Sharing…" : "Share with Community"}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
