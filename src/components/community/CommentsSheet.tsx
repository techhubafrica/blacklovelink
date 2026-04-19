import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Send, Flag, Trash2, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { CommunityPost } from "./PostCard";

interface Comment {
    id: string;
    user_id: string;
    is_anonymous: boolean;
    display_name: string | null;
    body: string;
    heart_count: number;
    created_at: string;
    has_hearted?: boolean;
}

interface CommentsSheetProps {
    post: CommunityPost | null;
    currentUserId: string;
    userFullName: string;
    onClose: () => void;
}

const REPORT_REASONS = ["Spam", "Hate speech", "Harassment", "Misinformation", "Other"];

export default function CommentsSheet({ post, currentUserId, userFullName, onClose }: CommentsSheetProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [body, setBody] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [reportingId, setReportingId] = useState<string | null>(null);
    const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!post) return;
        setLoading(true);
        (supabase as any)
            .from("community_comments")
            .select("*")
            .eq("post_id", post.id)
            .eq("hidden", false)
            .order("created_at", { ascending: true })
            .then(async ({ data }: any) => {
                const raw = (data ?? []) as Comment[];
                // Check which ones current user has hearted
                const { data: hearted } = await (supabase as any)
                    .from("comment_hearts")
                    .select("comment_id")
                    .eq("user_id", currentUserId)
                    .in("comment_id", raw.map(c => c.id));
                const heartedSet = new Set((hearted ?? []).map((h: any) => h.comment_id));
                setComments(raw.map(c => ({ ...c, has_hearted: heartedSet.has(c.id) })));
                setLoading(false);
            });
    }, [post, currentUserId]);

    const submitComment = async () => {
        if (!body.trim() || !post) return;
        setSubmitting(true);
        try {
            const { data, error } = await (supabase as any)
                .from("community_comments")
                .insert({
                    post_id: post.id,
                    user_id: currentUserId,
                    is_anonymous: isAnonymous,
                    display_name: isAnonymous ? null : userFullName,
                    body: body.trim(),
                })
                .select()
                .single();
            if (error) throw error;
            setComments(prev => [...prev, { ...(data as Comment), has_hearted: false }]);
            setBody("");
        } catch {
            toast.error("Failed to post comment.");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleCommentHeart = async (comment: Comment) => {
        if (comment.has_hearted) {
            await (supabase as any).from("comment_hearts").delete().eq("comment_id", comment.id).eq("user_id", currentUserId);
        } else {
            await (supabase as any).from("comment_hearts").insert({ comment_id: comment.id, user_id: currentUserId });
        }
        setComments(prev => prev.map(c => c.id === comment.id
            ? { ...c, heart_count: c.heart_count + (c.has_hearted ? -1 : 1), has_hearted: !c.has_hearted }
            : c
        ));
    };

    const reportComment = async (commentId: string, reason: string) => {
        await (supabase as any).from("comment_reports").insert({ comment_id: commentId, reporter_id: currentUserId, reason });
        setReportedIds(prev => new Set(prev).add(commentId));
        setReportingId(null);
        toast.success("Comment reported.");
    };

    const deleteComment = async (commentId: string) => {
        await (supabase as any).from("community_comments").delete().eq("id", commentId);
        setComments(prev => prev.filter(c => c.id !== commentId));
    };

    return (
        <AnimatePresence>
            {post && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        key="sheet"
                        initial={{ y: "100%" }}
                        animate={{ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }}
                        exit={{ y: "100%", transition: { duration: 0.2 } }}
                        className="fixed bottom-0 inset-x-0 z-50 bg-card rounded-t-3xl border-t border-border flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                            <div>
                                <h3 className="font-bold text-foreground text-sm">{post.title}</h3>
                                <p className="text-xs text-muted-foreground">{comments.length} comments</p>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <X className="w-4 h-4 text-foreground" />
                            </button>
                        </div>

                        {/* Comments list */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                            {loading ? (
                                <p className="text-center text-sm text-muted-foreground py-8">Loading comments…</p>
                            ) : comments.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-8">No comments yet. Be the first!</p>
                            ) : (
                                comments.map(c => {
                                    const name = c.is_anonymous ? "Anonymous" : (c.display_name ?? "Member");
                                    return (
                                        <div key={c.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                                                {c.is_anonymous ? "?" : name[0]?.toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <p className="text-xs font-bold text-foreground">{name} <span className="font-normal text-muted-foreground">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span></p>
                                                    {/* Comment actions */}
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => toggleCommentHeart(c)} className={`flex items-center gap-1 text-xs ${c.has_hearted ? "text-rose-500" : "text-muted-foreground"}`}>
                                                            <Heart className={`w-3.5 h-3.5 ${c.has_hearted ? "fill-rose-500" : ""}`} />
                                                            {c.heart_count > 0 && c.heart_count}
                                                        </button>
                                                        {c.user_id === currentUserId ? (
                                                            <button onClick={() => deleteComment(c.id)} className="text-muted-foreground hover:text-red-500 transition">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        ) : reportedIds.has(c.id) ? (
                                                            <span className="text-xs text-muted-foreground">Reported</span>
                                                        ) : reportingId === c.id ? (
                                                            <div className="bg-card border border-border rounded-xl p-2 absolute right-4 z-10 shadow-lg">
                                                                {REPORT_REASONS.map(r => (
                                                                    <button key={r} onClick={() => reportComment(c.id, r)} className="block w-full text-left text-xs px-2 py-1.5 hover:bg-muted rounded-lg text-foreground">
                                                                        {r}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => setReportingId(c.id)} className="text-muted-foreground hover:text-orange-500 transition">
                                                                <Flag className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-foreground/80 leading-relaxed">{c.body}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Comment input */}
                        <div className="px-4 py-3 border-t border-border shrink-0 space-y-2">
                            {/* Anon toggle */}
                            <button
                                onClick={() => setIsAnonymous(v => !v)}
                                className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${isAnonymous ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground"
                                    }`}
                            >
                                {isAnonymous ? <Lock className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                {isAnonymous ? "Anonymous" : "As yourself"}
                            </button>
                            <div className="flex items-end gap-2">
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    placeholder="Add a comment…"
                                    rows={2}
                                    maxLength={500}
                                    className="flex-1 bg-muted border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none transition"
                                />
                                <button
                                    onClick={submitComment}
                                    disabled={!body.trim() || submitting}
                                    className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0"
                                >
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
