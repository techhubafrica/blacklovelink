import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import TopNav from "@/components/TopNav";
import MatchOverlay from "@/components/MatchOverlay";
import FeedProfileCard from "@/components/feed/FeedProfileCard";
import FeedContentCard from "@/components/feed/FeedContentCard";
import { useProfiles, type UserProfile } from "@/hooks/useProfileData";
import { useSwipe } from "@/hooks/useSwipe";
import { FEED_CONTENT } from "@/data/feedContent";
import { Loader2, SearchX } from "lucide-react";

// ── Fisher-Yates shuffle ──────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Interleave profiles + shuffled content ────────────────────────────────────
function interleave(
  profiles: UserProfile[],
  content: typeof FEED_CONTENT
) {
  type Item =
    | { kind: "profile"; data: UserProfile; key: string }
    | { kind: "content"; data: typeof FEED_CONTENT[0]; key: string };

  const result: Item[] = [];
  let ci = 0;

  // Always open with a content card
  if (content.length > 0) {
    result.push({ kind: "content", data: content[ci], key: content[ci].id });
    ci++;
  }

  profiles.forEach((p, i) => {
    result.push({ kind: "profile", data: p, key: p.user_id });
    // Content card after every 2 profiles
    if ((i + 1) % 2 === 0 && ci < content.length) {
      result.push({ kind: "content", data: content[ci], key: content[ci].id });
      ci++;
    }
  });

  return result;
}

// ── LocalStorage helpers ──────────────────────────────────────────────────────
const LS_PASSED = "bll_passed_profiles";
const LS_LIKED = "bll_liked_profiles";
const LS_CONTENT = "bll_dismissed_content";

const loadSet = (key: string): Set<string> =>
  new Set(JSON.parse(localStorage.getItem(key) ?? "[]"));

const saveSet = (key: string, set: Set<string>) =>
  localStorage.setItem(key, JSON.stringify([...set]));

// ─────────────────────────────────────────────────────────────────────────────

const SwipePage = () => {
  const { profiles, loading } = useProfiles();
  const { recordSwipe } = useSwipe();

  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);

  // Persist across refreshes via localStorage
  const [dismissedContent, setDismissedContent] = useState<Set<string>>(() => loadSet(LS_CONTENT));
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(() => loadSet(LS_LIKED));
  const [passedProfiles, setPassedProfiles] = useState<Set<string>>(() => loadSet(LS_PASSED));

  // Shuffle content once per mount so every refresh feels fresh
  const shuffledContent = useMemo(() => shuffle(FEED_CONTENT), []);

  // Build full interleaved feed
  const rawFeed = useMemo(
    () => interleave(profiles, shuffledContent),
    [profiles, shuffledContent]
  );

  // Filter out dismissed/swiped items
  const feed = rawFeed.filter(item => {
    if (item.kind === "content") return !dismissedContent.has(item.data.id);
    return !likedProfiles.has(item.data.user_id) && !passedProfiles.has(item.data.user_id);
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLike = async (profile: UserProfile) => {
    const next = new Set(likedProfiles).add(profile.user_id);
    setLikedProfiles(next);
    saveSet(LS_LIKED, next);
    const { matched } = await recordSwipe(profile, "right");
    if (matched) setMatchedProfile(profile);
  };

  const handlePass = async (profile: UserProfile) => {
    const next = new Set(passedProfiles).add(profile.user_id);
    setPassedProfiles(next);
    saveSet(LS_PASSED, next);
    await recordSwipe(profile, "left");
  };

  const handleSuperLike = async (profile: UserProfile) => {
    const next = new Set(likedProfiles).add(profile.user_id);
    setLikedProfiles(next);
    saveSet(LS_LIKED, next);
    const { matched } = await recordSwipe(profile, "up");
    if (matched) setMatchedProfile(profile);
  };

  const handleDismissContent = (id: string) => {
    const next = new Set(dismissedContent).add(id);
    setDismissedContent(next);
    saveSet(LS_CONTENT, next);
  };

  const handleStartOver = () => {
    // Clear locally dismissed content so fresh content appears (profiles stay filtered via DB)
    setDismissedContent(new Set());
    saveSet(LS_CONTENT, new Set());
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopNav />

      <main className="flex-1 overflow-y-auto pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Finding your matches…</p>
          </div>
        ) : feed.filter(i => i.kind === "profile").length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <SearchX className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">You've seen everyone!</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              No more new profiles right now. Check back later for new members.
            </p>
            <button
              onClick={handleStartOver}
              className="mt-2 px-8 py-3 rounded-full gradient-brand text-primary-foreground font-bold shadow-button hover:opacity-90 transition"
            >
              Refresh Content
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 px-4 pt-4 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-foreground">Discover</h1>
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium">
                {feed.filter(i => i.kind === "profile").length} nearby
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {feed.map(item =>
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
