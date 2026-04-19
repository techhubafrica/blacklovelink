import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Flag, MoreHorizontal, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export interface CommunityPost {
    id: string;
    user_id: string;
    is_anonymous: boolean;
    display_name: string | null;
    category: string;
    title: string;
    body: string;
    heart_count: number;
    created_at: string;
    comment_count?: number;
    has_hearted?: boolean;
}

const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
    "My Story": { color: "text-rose-500", bg: "bg-rose-500/10" },
    "Love Advice": { color: "text-amber-500", bg: "bg-amber-500/10" },
    "Question": { color: "text-sky-500", bg: "bg-sky-500/10" },
    "Rant": { color: "text-orange-500", bg: "bg-orange-500/10" },
    "Confession": { color: "text-purple-500", bg: "bg-purple-500/10" },
};

const REPORT_REASONS = ["Spam", "Hate speech", "Harassment", "Misinformation", "Other"];

interface PostCardProps {
    post: CommunityPost;
    currentUserId: string;
    onCommentsClick: (post: CommunityPost) => void;
    onDeleted: (id: string) => void;
}

export default function PostCard({ post, currentUserId, onCommentsClick, onDeleted }: PostCardProps) {
    const [hearted, setHearted] = useState(post.has_hearted ?? false);
    const [hearts, setHearts] = useState(post.heart_count);
    const [menuOpen, setMenuOpen] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [reported, setReported] = useState(false);
    const style = CATEGORY_STYLES[post.category] ?? { color: "text-primary", bg: "bg-primary/10" };

    const toggleHeart = async () => {
        if (hearted) {
            await (supabase as any).from("post_hearts").delete().eq("post_id", post.id).eq("user_id", currentUserId);
            setHearts(h => h - 1);
        } else {
            await (supabase as any).from("post_hearts").insert({ post_id: post.id, user_id: currentUserId });
            setHearts(h => h + 1);
        }
        setHearted(v => !v);
    };

    const reportPost = async (reason: string) => {
        await (supabase as any).from("post_reports").insert({ post_id: post.id, reporter_id: currentUserId, reason });
        setReported(true);
        setReporting(false);
        setMenuOpen(false);
    };

    const deletePost = async () => {
        await (supabase as any).from("community_posts").delete().eq("id", post.id);
        onDeleted(post.id);
    };

    const isOwner = post.user_id === currentUserId;
    const displayName = post.is_anonymous ? "Anonymous" : (post.display_name ?? "Member");
    const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="bg-card border border-border rounded-3xl p-5 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-base font-bold text-muted-foreground shrink-0">
                        {post.is_anonymous ? "?" : displayName[0]?.toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Category pill */}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.bg} ${style.color}`}>
                        {post.category}
                    </span>
                    {/* Menu */}
                    <div className="relative">
                        <button onClick={() => setMenuOpen(v => !v)} className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center transition">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <AnimatePresence>
                            {menuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-8 z-50 bg-card border border-border rounded-2xl shadow-xl min-w-[160px] overflow-hidden"
                                >
                                    {isOwner ? (
                                        <button onClick={deletePost} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-muted transition">
                                            <Trash2 className="w-4 h-4" /> Delete post
                                        </button>
                                    ) : reported ? (
                                        <p className="px-4 py-3 text-xs text-muted-foreground">Thanks for reporting</p>
                                    ) : !reporting ? (
                                        <button onClick={() => setReporting(true)} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-orange-500 hover:bg-muted transition">
                                            <Flag className="w-4 h-4" /> Report post
                                        </button>
                                    ) : (
                                        <div className="p-2">
                                            <p className="text-xs font-semibold text-foreground px-2 mb-1">Report reason</p>
                                            {REPORT_REASONS.map(r => (
                                                <button key={r} onClick={() => reportPost(r)} className="w-full text-left text-xs px-2 py-2 rounded-lg hover:bg-muted text-foreground transition">
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-foreground text-base mb-1.5 leading-snug">{post.title}</h3>

            {/* Body */}
            <p className="text-sm text-foreground/75 leading-relaxed line-clamp-4">{post.body}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                <button onClick={toggleHeart} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${hearted ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"}`}>
                    <Heart className={`w-4 h-4 ${hearted ? "fill-rose-500" : ""}`} />
                    {hearts}
                </button>
                <button onClick={() => onCommentsClick(post)} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {post.comment_count ?? 0} comments
                </button>
            </div>
        </motion.div>
    );
}
