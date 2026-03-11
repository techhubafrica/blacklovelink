import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SwipeCard from "@/components/SwipeCard";
import ActionButtons from "@/components/ActionButtons";
import MatchOverlay from "@/components/MatchOverlay";
import TopNav from "@/components/TopNav";
import { useProfiles, type UserProfile } from "@/hooks/useProfileData";
import { useSwipe } from "@/hooks/useSwipe";
import { SlidersHorizontal, X, RotateCcw, Loader2, SearchX } from "lucide-react";

const INTENTS = ["All", "Long-term relationship", "Marriage", "Open to explore", "Networking only"];
const INTERESTS_OPTIONS = ["Travel", "Fitness", "Tech", "Entrepreneurship", "Faith", "Music", "Art", "Reading", "Wellness"];

const SwipePage = () => {
  const { profiles, loading } = useProfiles();
  const { recordSwipe } = useSwipe();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [ageRange, setAgeRange] = useState<[number, number]>([18, 45]);
  const [radiusKm, setRadiusKm] = useState(50);
  const [intentFilter, setIntentFilter] = useState("All");
  const [interestFilter, setInterestFilter] = useState<string[]>([]);

  const filteredProfiles = profiles.filter((p) => {
    if (p.age !== null && p.age !== undefined) {
      if (p.age < ageRange[0] || p.age > ageRange[1]) return false;
    }
    if (intentFilter !== "All" && p.intent !== intentFilter) return false;
    if (interestFilter.length > 0 && !interestFilter.some((i) => (p.interests ?? []).includes(i))) return false;
    return true;
  });

  const visibleList = filteredProfiles.slice(currentIndex, currentIndex + 2);
  const allSwiped = currentIndex >= filteredProfiles.length;
  const hasActiveFilters = intentFilter !== "All" || interestFilter.length > 0;

  const handleSwipe = useCallback(
    async (direction: "left" | "right" | "up") => {
      const current = filteredProfiles[currentIndex];
      if (!current) return;
      const { matched } = await recordSwipe(current, direction);
      if (matched) setMatchedProfile(current);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, filteredProfiles, recordSwipe]
  );

  const resetFilters = () => {
    setAgeRange([18, 45]);
    setRadiusKm(50);
    setIntentFilter("All");
    setInterestFilter([]);
    setCurrentIndex(0);
  };

  const toggleInterest = (i: string) => {
    setInterestFilter((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <TopNav />

      {/* Subtle toolbar */}
      <div className="flex items-center justify-between px-5 py-2.5">
        <p className="text-sm text-muted-foreground font-medium">
          {loading ? "Finding profiles…" : allSwiped ? "No more profiles" : `${filteredProfiles.length - currentIndex} nearby`}
        </p>
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-foreground bg-card border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors active:scale-95"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
        </button>
      </div>

      {/* Card area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Finding matches nearby…</p>
          </div>
        ) : allSwiped ? (
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-9 h-9 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground mb-1">You've seen everyone!</p>
            <p className="text-muted-foreground text-sm mb-6">Adjust your filters or check back later.</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="gradient-brand rounded-full px-8 py-3 font-semibold text-primary-foreground shadow-button active:scale-95 transition-transform"
            >
              Start Over
            </button>
          </motion.div>
        ) : (
          <div className="relative w-full max-w-[380px] mx-auto" style={{ height: "min(68vh, 540px)" }}>
            <AnimatePresence>
              {visibleList
                .slice()
                .reverse()
                .map((profile, i) => (
                  <SwipeCard
                    key={profile.id}
                    profile={profile}
                    onSwipe={handleSwipe}
                    isTop={i === visibleList.length - 1}
                  />
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!allSwiped && !loading && (
        <ActionButtons
          onNope={() => handleSwipe("left")}
          onLike={() => handleSwipe("right")}
          onSuperLike={() => handleSwipe("up")}
          onRewind={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onBoost={() => {}}
        />
      )}

      <MatchOverlay profile={matchedProfile} onClose={() => setMatchedProfile(null)} />

      {/* Filter Drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              key="drawer"
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-[28px] border-t border-border p-6 space-y-6 max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }}
              exit={{ y: "100%", transition: { duration: 0.2 } }}
            >
              {/* Handle bar */}
              <div className="flex justify-center -mt-2 mb-2">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground text-lg">Filters</h3>
                <div className="flex items-center gap-3">
                  <button onClick={resetFilters} className="text-sm text-primary flex items-center gap-1 hover:underline">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                  <button onClick={() => setFilterOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Age range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Age Range</label>
                  <span className="text-sm text-muted-foreground">{ageRange[0]} – {ageRange[1]} yrs</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">{ageRange[0]}</span>
                    <input type="range" min={18} max={ageRange[1] - 1} value={ageRange[0]} onChange={(e) => setAgeRange([+e.target.value, ageRange[1]])} className="flex-1 h-2 accent-primary" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">{ageRange[1]}</span>
                    <input type="range" min={ageRange[0] + 1} max={70} value={ageRange[1]} onChange={(e) => setAgeRange([ageRange[0], +e.target.value])} className="flex-1 h-2 accent-primary" />
                  </div>
                </div>
              </div>

              {/* Location radius */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Location Radius</label>
                  <span className="text-sm text-muted-foreground">{radiusKm} km</span>
                </div>
                <input type="range" min={5} max={200} step={5} value={radiusKm} onChange={(e) => setRadiusKm(+e.target.value)} className="w-full h-2 accent-primary" />
              </div>

              {/* Intent */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Relationship Intent</label>
                <div className="flex flex-wrap gap-2">
                  {INTENTS.map((opt) => (
                    <button key={opt} onClick={() => setIntentFilter(opt)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${intentFilter === opt ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-foreground hover:border-primary/40"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Shared Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map((interest) => (
                    <button key={interest} onClick={() => toggleInterest(interest)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${interestFilter.includes(interest) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-foreground hover:border-primary/40"}`}>
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => { setCurrentIndex(0); setFilterOpen(false); }} className="w-full py-4 rounded-2xl gradient-brand text-primary-foreground font-bold shadow-button hover:opacity-90 transition active:scale-[0.98]">
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwipePage;
