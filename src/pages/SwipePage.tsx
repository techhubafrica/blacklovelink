import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SwipeCard from "@/components/SwipeCard";
import ActionButtons from "@/components/ActionButtons";
import MatchOverlay from "@/components/MatchOverlay";
import TopNav from "@/components/TopNav";
import { useProfiles, type UserProfile } from "@/hooks/useProfileData";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

const INTENTS = ["All", "Long-term relationship", "Marriage", "Open to explore", "Networking only"];
const INTERESTS_OPTIONS = ["Travel", "Fitness", "Tech", "Entrepreneurship", "Faith", "Music", "Art", "Reading", "Wellness"];

const SwipePage = () => {
  const { profiles, loading } = useProfiles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 45]);
  const [radiusKm, setRadiusKm] = useState(50);
  const [intentFilter, setIntentFilter] = useState("All");
  const [interestFilter, setInterestFilter] = useState<string[]>([]);

  // Apply filters to profiles
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

  const handleSwipe = useCallback(
    (direction: "left" | "right" | "up") => {
      const current = filteredProfiles[currentIndex];
      if (!current) return;
      if (direction === "right" && Math.random() < 0.35) {
        setMatchedProfile(current);
      }
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, filteredProfiles]
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

      {/* Loading state */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Finding matches nearby…</p>
        </div>
      )}

      {/* ─── Filter drawer button ─── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <p className="text-sm text-muted-foreground">
          {allSwiped ? "No more profiles" : `${filteredProfiles.length - currentIndex} matches nearby`}
        </p>
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground bg-card border border-border rounded-full px-3 py-1.5 hover:bg-muted transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {(intentFilter !== "All" || interestFilter.length > 0) && (
            <span className="w-2 h-2 rounded-full bg-primary ml-0.5" />
          )}
        </button>
      </div>

      {/* ─── Card area ─── */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-2">
        {allSwiped ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">You've seen everyone!</p>
            <p className="mt-2 text-muted-foreground">Adjust your filters or check back later.</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="gradient-brand mt-6 rounded-full px-8 py-3 font-semibold text-primary-foreground shadow-button"
            >
              Start Over
            </button>
          </div>
        ) : (
          <div className="relative h-[62vh] w-full max-w-sm">
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

      {/* ─── Action buttons ─── */}
      {!allSwiped && (
        <ActionButtons
          onNope={() => handleSwipe("left")}
          onLike={() => handleSwipe("right")}
          onSuperLike={() => handleSwipe("up")}
          onRewind={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          onBoost={() => { }}
        />
      )}

      <MatchOverlay profile={matchedProfile} onClose={() => setMatchedProfile(null)} />

      {/* ─── Filter Drawer ─── */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              key="drawer"
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl border border-border p-6 space-y-6 max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }}
              exit={{ y: "100%", transition: { duration: 0.2 } }}
            >
              {/* Drawer header */}
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
                    <input
                      type="range"
                      min={18}
                      max={ageRange[1] - 1}
                      value={ageRange[0]}
                      onChange={(e) => setAgeRange([+e.target.value, ageRange[1]])}
                      className="flex-1 h-2 accent-primary"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">{ageRange[1]}</span>
                    <input
                      type="range"
                      min={ageRange[0] + 1}
                      max={70}
                      value={ageRange[1]}
                      onChange={(e) => setAgeRange([ageRange[0], +e.target.value])}
                      className="flex-1 h-2 accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Location radius */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Location Radius</label>
                  <span className="text-sm text-muted-foreground">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={200}
                  step={5}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(+e.target.value)}
                  className="w-full h-2 accent-primary"
                />
              </div>

              {/* Relationship Intent */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Relationship Intent</label>
                <div className="flex flex-wrap gap-2">
                  {INTENTS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setIntentFilter(opt)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${intentFilter === opt
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted text-foreground hover:border-primary/40"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shared interests */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Shared Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${interestFilter.includes(interest)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted text-foreground hover:border-primary/40"
                        }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setCurrentIndex(0); setFilterOpen(false); }}
                className="w-full py-4 rounded-2xl gradient-brand text-primary-foreground font-bold shadow-button hover:opacity-90 transition"
              >
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
