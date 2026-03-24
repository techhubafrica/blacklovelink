import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import TopNav from "@/components/TopNav";
import MatchOverlay from "@/components/MatchOverlay";
import FeedProfileCard from "@/components/feed/FeedProfileCard";
import { useProfiles, type UserProfile } from "@/hooks/useProfileData";
import { useSwipe } from "@/hooks/useSwipe";
import { Loader2, SearchX } from "lucide-react";

// ── LocalStorage helpers ──────────────────────────────────────────────────────
const LS_PASSED = "bll_passed_profiles";
const LS_LIKED = "bll_liked_profiles";
const loadSet = (key: string): Set<string> => new Set(JSON.parse(localStorage.getItem(key) ?? "[]"));
const saveSet = (key: string, set: Set<string>) => localStorage.setItem(key, JSON.stringify([...set]));

const SwipePage = () => {
  const { profiles, loading } = useProfiles();
  const { recordSwipe } = useSwipe();
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(() => loadSet(LS_LIKED));
  const [passedProfiles, setPassedProfiles] = useState<Set<string>>(() => loadSet(LS_PASSED));
  const [isResetting, setIsResetting] = useState(false);

  const visibleProfiles = useMemo(
    () => profiles.filter(p => !likedProfiles.has(p.user_id) && !passedProfiles.has(p.user_id)),
    [profiles, likedProfiles, passedProfiles]
  );

  const handleLike = async (profile: UserProfile) => {
    const next = new Set(likedProfiles).add(profile.user_id);
    setLikedProfiles(next); saveSet(LS_LIKED, next);
    const { matched } = await recordSwipe(profile, "right");
    if (matched) setMatchedProfile(profile);
  };

  const handlePass = async (profile: UserProfile) => {
    const next = new Set(passedProfiles).add(profile.user_id);
    setPassedProfiles(next); saveSet(LS_PASSED, next);
    await recordSwipe(profile, "left");
  };

  const handleMessage = async (profile: UserProfile, introText: string) => {
    const next = new Set(likedProfiles).add(profile.user_id);
    setLikedProfiles(next); saveSet(LS_LIKED, next);
    const { matched } = await recordSwipe(profile, "message", introText);
    if (matched) setMatchedProfile(profile);
  };

  const handleStartOver = async () => {
    try {
      setIsResetting(true);
      // Backend true reset
      const { error } = await supabase.rpc('reset_user_swipes');
      if (error) throw error;
      
      // Clear local records
      setLikedProfiles(new Set()); 
      setPassedProfiles(new Set()); 
      saveSet(LS_LIKED, new Set()); 
      saveSet(LS_PASSED, new Set());
      
      // Force reload to cleanly trigger useProfiles fetch
      window.location.reload();
    } catch (e) {
      console.error("Failed to reset swipes:", e);
      setIsResetting(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopNav />

      <main className="flex-1 overflow-y-auto pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Finding your matches…</p>
          </div>
        ) : visibleProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <SearchX className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">You've seen everyone!</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              No more new profiles right now. Check back later or explore the Community tab.
            </p>
            <button
              onClick={handleStartOver}
              disabled={isResetting}
              className="mt-2 px-8 py-3 flex items-center gap-2 rounded-full gradient-brand text-primary-foreground font-bold shadow-button hover:opacity-90 transition disabled:opacity-50"
            >
              {isResetting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Over"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 px-4 pt-4 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-foreground">Discover</h1>
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium">
                {visibleProfiles.length} nearby
              </span>
            </div>
            <AnimatePresence mode="popLayout">
              {visibleProfiles.map(profile => (
                <FeedProfileCard
                  key={profile.user_id}
                  profile={profile}
                  onLike={() => handleLike(profile)}
                  onPass={() => handlePass(profile)}
                  onMessage={(introText: string) => handleMessage(profile, introText)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <MatchOverlay profile={matchedProfile} onClose={() => setMatchedProfile(null)} />
    </div>
  );
};

export default SwipePage;
