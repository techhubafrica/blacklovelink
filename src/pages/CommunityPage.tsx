import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { PenSquare, Loader2 } from "lucide-react";
import TopNav from "@/components/TopNav";
import PostCard, { type CommunityPost } from "@/components/community/PostCard";
import NewPostModal from "@/components/community/NewPostModal";
import CommentsSheet from "@/components/community/CommentsSheet";
import FeedContentCard from "@/components/feed/FeedContentCard";
import { FEED_CONTENT, type FeedContentItem } from "@/data/feedContent";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUserProfile } from "@/hooks/useProfileData";

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const LS_DISMISSED = "bll_community_dismissed";
const loadDismissed = () => new Set<string>(JSON.parse(localStorage.getItem(LS_DISMISSED) ?? "[]"));
const saveDismissed = (s: Set<string>) => localStorage.setItem(LS_DISMISSED, JSON.stringify([...s]));

const CATEGORY_FILTERS = ["All", "My Story", "Love Advice", "Question", "Rant", "Confession"];

export default function CommunityPage() {
    const { profile } = useCurrentUserProfile();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState("");
    const [newPostOpen, setNewPostOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
    const [filter, setFilter] = useState("All");
    const [dismissed, setDismissed] = useState<Set<string>>(loadDismissed);
    const shuffledContent = useMemo(() => shuffle(FEED_CONTENT), []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) setCurrentUserId(session.user.id);
        });
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data } = await (supabase as any)
            .from("community_posts")
            .select("*")
            .eq("hidden", false)
            .order("created_at", { ascending: false });

        const raw = (data ?? []) as unknown as CommunityPost[];

        // Fetch heart status + comment counts
        if (raw.length > 0 && currentUserId) {
            const [{ data: hearts }, { data: commentCounts }] = await Promise.all([
                (supabase as any).from("post_hearts").select("post_id").eq("user_id", currentUserId).in("post_id", raw.map(p => p.id)),
                (supabase as any).from("community_comments").select("post_id").in("post_id", raw.map(p => p.id)).eq("hidden", false),
            ]);
            const heartedSet = new Set((hearts ?? []).map((h: any) => h.post_id));
            const commentMap: Record<string, number> = {};
            (commentCounts ?? []).forEach((c: any) => { commentMap[c.post_id] = (commentMap[c.post_id] ?? 0) + 1; });

            setPosts(raw.map(p => ({ ...p, has_hearted: heartedSet.has(p.id), comment_count: commentMap[p.id] ?? 0 })));
        } else {
            setPosts(raw);
        }
        setLoading(false);
    };

    useEffect(() => { if (currentUserId) fetchPosts(); }, [currentUserId]);

    const dismissContent = (id: string) => {
        const next = new Set(dismissed).add(id);
        setDismissed(next); saveDismissed(next);
    };

    const filteredPosts = filter === "All" ? posts : posts.filter(p => p.category === filter);

    // Build interleaved feed: content card → 3 posts → content card → ...
    type FeedItem =
        | { kind: "post"; data: CommunityPost; key: string }
        | { kind: "content"; data: FeedContentItem; key: string };

    const feed = useMemo<FeedItem[]>(() => {
        const result: FeedItem[] = [];
        let ci = 0;
        const availableContent = shuffledContent.filter(c => !dismissed.has(c.id));

        if (availableContent.length > 0) {
            result.push({ kind: "content", data: availableContent[ci], key: availableContent[ci].id });
            ci++;
        }
        filteredPosts.forEach((p, i) => {
            result.push({ kind: "post", data: p, key: p.id });
            if ((i + 1) % 3 === 0 && ci < availableContent.length) {
                result.push({ kind: "content", data: availableContent[ci], key: availableContent[ci].id });
                ci++;
            }
        });
        return result;
    }, [filteredPosts, shuffledContent, dismissed]);

    const userFullName = profile?.full_name ?? "Member";

    return (
        <div className="flex min-h-[100dvh] flex-col bg-background">
            <TopNav />

            <main className="flex-1 overflow-y-auto pb-10">
                <div className="max-w-md mx-auto px-4 pt-4 space-y-4">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-foreground">Community</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Love, advice & real talk</p>
                        </div>
                        <button
                            onClick={() => setNewPostOpen(true)}
                            className="flex items-center gap-2 gradient-brand text-primary-foreground text-sm font-bold px-4 py-2.5 rounded-full shadow-button hover:opacity-90 transition"
                        >
                            <PenSquare className="w-4 h-4" />
                            Post
                        </button>
                    </div>

                    {/* Category filters */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {CATEGORY_FILTERS.map(c => (
                            <button
                                key={c}
                                onClick={() => setFilter(c)}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === c
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-muted text-foreground hover:border-primary/40"
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Feed */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-7 h-7 animate-spin text-primary" />
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {feed.map(item =>
                                item.kind === "post" ? (
                                    <PostCard
                                        key={item.key}
                                        post={item.data}
                                        currentUserId={currentUserId}
                                        onCommentsClick={setSelectedPost}
                                        onDeleted={id => setPosts(prev => prev.filter(p => p.id !== id))}
                                    />
                                ) : (
                                    <FeedContentCard
                                        key={item.key}
                                        item={item.data}
                                        onDismiss={dismissContent}
                                    />
                                )
                            )}
                        </AnimatePresence>
                    )}

                    {!loading && filteredPosts.length === 0 && (
                        <div className="text-center py-16 space-y-3">
                            <p className="text-4xl">💬</p>
                            <p className="font-bold text-foreground">No posts yet in this category</p>
                            <p className="text-sm text-muted-foreground">Be the first to share something!</p>
                            <button
                                onClick={() => setNewPostOpen(true)}
                                className="mt-2 px-8 py-3 rounded-full gradient-brand text-primary-foreground font-bold text-sm shadow-button hover:opacity-90 transition"
                            >
                                Write a post
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <NewPostModal
                open={newPostOpen}
                onClose={() => setNewPostOpen(false)}
                onPosted={fetchPosts}
                userFullName={userFullName}
            />
            <CommentsSheet
                post={selectedPost}
                currentUserId={currentUserId}
                userFullName={userFullName}
                onClose={() => setSelectedPost(null)}
            />
        </div>
    );
}
