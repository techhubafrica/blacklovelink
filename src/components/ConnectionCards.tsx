import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles } from "lucide-react";
import story1 from "@/assets/story-1.png";
import story2 from "@/assets/story-2.png";
import story3 from "@/assets/story-3.png";

const connections = [
  {
    image: story1,
    names: "Amara & Kwame",
    location: "Atlanta, GA",
    tag: "Matched 2024",
    story:
      "They matched over a shared love of Ethiopian cuisine. What started as weekend brunch dates turned into late-night calls, a surprise proposal, and a life built around supporting each other's dreams.",
  },
  {
    image: story2,
    names: "Zara & Marcus",
    location: "New York, NY",
    tag: "Engaged",
    story:
      "A first date at a jazz club turned into a tradition. Every anniversary they return to the same spot — now planning their wedding. Proof that the best love stories start with good music.",
  },
  {
    image: story3,
    names: "Simone & Jamal",
    location: "Houston, TX",
    tag: "Married",
    story:
      "Two busy professionals who thought they didn't have time for love. One coffee date turned into six hours of conversation. Now they're building a life together, one adventure at a time.",
  },
];

const cardConfigs = [
  [0, 1, 2],
  [1, 2, 0],
  [2, 0, 1],
];

const positions = [
  { x: 0, y: 0, rotate: -8, scale: 1, z: 30 },
  { x: 70, y: 20, rotate: 4, scale: 0.9, z: 20 },
  { x: 130, y: 40, rotate: 14, scale: 0.8, z: 10 },
];

const ConnectionCards = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // Faster rotation - 2 seconds instead of 3.5
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => (r + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const order = cardConfigs[rotation];

  return (
    <>
      <div className="relative h-[520px] flex items-center justify-center" style={{ perspective: "1400px" }}>
        {/* Ambient glow behind cards */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent blur-3xl" />
        </div>

        <AnimatePresence mode="popLayout">
          {positions.map((pos, posIdx) => {
            const cardIdx = order[posIdx];
            const card = connections[cardIdx];
            const isFront = posIdx === 0;

            return (
              <motion.div
                key={`${cardIdx}-${rotation}`}
                className="absolute cursor-pointer"
                style={{
                  zIndex: pos.z,
                  transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0, rotateY: -30, x: pos.x - 50, y: pos.y + 20, scale: pos.scale * 0.8 }}
                animate={{
                  opacity: 1,
                  x: pos.x,
                  y: pos.y,
                  rotate: pos.rotate,
                  scale: pos.scale,
                  rotateY: isFront ? [0, 8, 0] : 0,
                  rotateX: isFront ? [0, -4, 0] : 0,
                }}
                exit={{ opacity: 0, rotateY: 30, scale: 0.7, x: pos.x + 50 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  rotateY: isFront ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined,
                  rotateX: isFront ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined,
                }}
                onClick={() => setSelectedCard(cardIdx)}
                whileHover={{
                  scale: pos.scale * 1.08,
                  rotateY: 15,
                  rotateX: -6,
                  transition: { duration: 0.25 },
                }}
              >
                {/* Card container with premium styling */}
                <div className="relative w-60 sm:w-72 rounded-[2rem] overflow-hidden shadow-2xl group">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-[2rem] p-[3px] bg-gradient-to-br from-primary via-secondary to-primary opacity-80">
                    <div className="w-full h-full rounded-[1.85rem] bg-background" />
                  </div>

                  {/* Card content */}
                  <div className="relative rounded-[1.85rem] overflow-hidden m-[3px]">
                    <img
                      src={card.image}
                      alt={card.names}
                      className="h-[360px] sm:h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />

                    {/* Premium gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />

                    {/* Shimmer effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      {/* Tag with icon */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          <Sparkles className="w-3 h-3" />
                          {card.tag}
                        </span>
                      </div>

                      {/* Names */}
                      <h3 className="text-white text-lg font-black tracking-tight">{card.names}</h3>

                      {/* Location */}
                      <p className="text-white/60 text-sm mt-1">{card.location}</p>

                      {/* CTA hint */}
                      <div className="flex items-center gap-2 mt-3 text-white/50 text-xs">
                        <Heart className="w-3 h-3" />
                        <span>Tap to read their story</span>
                      </div>
                    </div>

                    {/* Verified badge on front card */}
                    {isFront && (
                      <motion.div
                        className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-background text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        Verified
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation dots - more premium */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setRotation(i)}
              className={`relative h-2.5 rounded-full transition-all duration-500 overflow-hidden ${
                rotation === i ? "w-8 bg-gradient-to-r from-primary to-secondary" : "w-2.5 bg-foreground/20 hover:bg-foreground/40"
              }`}
            >
              {rotation === i && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Premium story modal */}
      <AnimatePresence>
        {selectedCard !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              className="relative max-w-lg w-full rounded-[2rem] overflow-hidden bg-card shadow-2xl border border-border"
              initial={{ scale: 0.85, rotateY: -15, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.85, rotateY: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{ perspective: "1000px" }}
            >
              {/* Image section */}
              <div className="relative">
                <img
                  src={connections[selectedCard].image}
                  alt={connections[selectedCard].names}
                  className="h-72 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                {/* Close button */}
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/50 backdrop-blur-sm p-2.5 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Floating tag */}
                <div className="absolute bottom-4 left-6">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    {connections[selectedCard].tag}
                  </span>
                </div>
              </div>

              {/* Content section */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-foreground">
                      {connections[selectedCard].names}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {connections[selectedCard].location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Heart className="w-5 h-5 fill-primary" />
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {connections[selectedCard].story}
                </p>

                {/* CTA */}
                <button className="mt-6 w-full gradient-brand rounded-full py-3.5 text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                  Start Your Journey
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConnectionCards;
