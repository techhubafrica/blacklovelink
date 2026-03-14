import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import TopNav from "@/components/TopNav";
import MatchOverlay from "@/components/MatchOverlay";
import FeedProfileCard from "@/components/feed/FeedProfileCard";
import FeedContentCard from "@/components/feed/FeedContentCard";
import { useProfiles, type UserProfile } from "@/hooks/useProfileData";
import { useSwipe } from "@/hooks/useSwipe";
import { FEED_CONTENT } from "@/data/feedContent";
import { Loader2, SearchX } from "lucide-react";

// Interleave profiles and content cards.
// Pattern: content → profile → profile → content → profile → profile → …
function interleave(profiles: UserProfile[], content: typeof FEED_CONTENT) {
  const result: Array<
    { kind: "profile"; data: UserProfile; key: string } |
    { kind: "content"; data: typeof FEED_CONTENT[0]; key: string }
  > = [];

  let ci = 0;

  // Always start with a content card if available
  if (content.length > 0) {
    result.push({ kind: "content", data: content[ci], key: content[ci].id });
    ci++;
  }

  profiles.forEach((p, i) => {
    result.push({ kind: "profile", data: p, key: p.user_id });
    // Insert a content card every 2 profiles
    if ((i + 1) % 2 === 0 && ci < content.length) {
      result.push({ kind: "content", data: content[ci], key: content[ci].id });
      ci++;
    }
  });

  return result;
}

const SwipePage = () => {
  const { profiles, loading } = useProfiles();
  const { recordSwipe } = useSwipe();
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [dismissedContent, setDismissedContent] = useState<Set<string>>(new Set());
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [passedProfiles, setPassedProfiles] = useState<Set<string>>(new Set());

  // Build the interleaved feed (profile cards + content cards)
  const rawFeed = useMemo(() => interleave(profiles, FEED_CONTENT), [profiles]);

  // Filter out dismissed content and swiped profiles
  const feed = rawFeed.filter(item => {
    if (item.kind === "content") return !dismissedContent.has(item.data.id);
    if (item.kind === "profile") {
      return !likedProfiles.has(item.data.user_id) && !passedProfiles.has(item.data.user_id);
    }
    return true;
  });

  const handleLike = async (profile: UserProfile) => {
    setLikedProfiles(prev => new Set(prev).add(profile.user_id));
    const { matched } = await recordSwipe(profile, "right");
    if (matched) setMatchedProfile(profile);
  };

  const handlePass = async (profile: UserProfile) => {
    setPassedProfiles(prev => new Set(prev).add(profile.user_id));
    await recordSwipe(profile, "left");
  };

  const handleSuperLike = async (profile: UserProfile) => {
    setLikedProfiles(prev => new Set(prev).add(profile.user_id));
    const { matched } = await recordSwipe(profile, "up");
    if (matched) setMatchedProfile(profile);
  };

  const handleDismissContent = (id: string) => {
    setDismissedContent(prev => new Set(prev).add(id));
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopNav />

      {/* ── Feed ── */}
      <main className="flex-1 overflow-y-auto pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Finding your matches…</p>
          </div>
        ) : feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <SearchX className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">You've seen everyone!</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              You've gone through all available profiles. Check back later for new members.
            </p>
            <button
              onClick={() => {
                setLikedProfiles(new Set());
                setPassedProfiles(new Set());
              }}
              className="mt-2 px-8 py-3 rounded-full gradient-brand text-primary-foreground font-bold shadow-button hover:opacity-90 transition"
            >
              Start Over
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 px-4 pt-4 max-w-md mx-auto">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-foreground">Discover</h1>
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium">
                {profiles.filter(p => !likedProfiles.has(p.user_id) && !passedProfiles.has(p.user_id)).length} nearby
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {feed.map((item) =>
                item.kind === "profile" ? (
                  <FeedProfileCard
                    key={item.key}
                    profile={item.data}
                    onLike={() => handleLike(item.data)}
                    onPass={() => handlePass(item.data)}
                    onSuperLike={() => handleSuperLike(item.data)}
                  />
                ) : (
                  <FeedContentCard
                    key={item.key}
                    item={item.data}
                    onDismiss={handleDismissContent}
                  />
                )
              )}
            </AnimatePresence>

            {/* End of feed */}
            {feed.length > 0 && (
              <p className="text-center text-xs text-muted-foreground pb-4">
                You're all caught up ✨
              </p>
            )}
          </div>
        )}
      </main>

      <MatchOverlay profile={matchedProfile} onClose={() => setMatchedProfile(null)} />
    </div>
  );
};

export default SwipePage;
