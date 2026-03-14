export type ContentCardType = "stat" | "hottake" | "quote" | "tip" | "story";

export interface FeedContentItem {
  id: string;
  type: ContentCardType;
  hook: string;       // Big bold line — the scroll-stopper
  body: string;       // Short follow-up
  author?: string;    // For quotes
  tag: string;        // Category pill label
  accent: string;     // Tailwind text color for accent
  bg: string;         // Card bg class
  border: string;     // Border accent
}

export const FEED_CONTENT: FeedContentItem[] = [
  // ── Stats (surprising, shareable) ──
  {
    id: "s1",
    type: "stat",
    hook: "67%",
    body: "of married couples say they were friends first. Friendship isn't the consolation prize — it's the foundation.",
    tag: "Did You Know",
    accent: "text-rose-500",
    bg: "bg-card",
    border: "border-rose-500/30",
  },
  {
    id: "s2",
    type: "stat",
    hook: "4 years.",
    body: "That's how long the average person dates before finding their long-term partner. You're not behind — you're building.",
    tag: "Perspective",
    accent: "text-amber-500",
    bg: "bg-card",
    border: "border-amber-500/30",
  },
  {
    id: "s3",
    type: "stat",
    hook: "93%",
    body: "of people say shared values matter more than physical attraction in a long-term relationship. Swipe with your gut, not just your eyes.",
    tag: "Research",
    accent: "text-violet-500",
    bg: "bg-card",
    border: "border-violet-500/30",
  },
  {
    id: "s4",
    type: "stat",
    hook: "1 in 3",
    body: "couples in the US now meet online. The stigma is dead. The question is whether you're showing up as your real self.",
    tag: "Modern Dating",
    accent: "text-sky-500",
    bg: "bg-card",
    border: "border-sky-500/30",
  },

  // ── Hot Takes (spicy, relatable, debate-worthy) ──
  {
    id: "h1",
    type: "hottake",
    hook: "He's not emotionally unavailable. He's just not choosing you.",
    body: "The right person will rise to meet you. Stop coaching grown adults into basic vulnerability.",
    tag: "Hot Take",
    accent: "text-red-500",
    bg: "bg-card",
    border: "border-red-500/30",
  },
  {
    id: "h2",
    type: "hottake",
    hook: "\"I'm not ready\" is sometimes just \"I'm not ready for YOU.\"",
    body: "Timing is real — but so is selective readiness. Know the difference and protect your peace.",
    tag: "Hot Take",
    accent: "text-red-500",
    bg: "bg-card",
    border: "border-red-500/30",
  },
  {
    id: "h3",
    type: "hottake",
    hook: "You don't need to be healed to be loved.",
    body: "Growth and love aren't a sequence — they're parallel. Don't exile yourself from connection while you're still becoming.",
    tag: "Mindset",
    accent: "text-emerald-500",
    bg: "bg-card",
    border: "border-emerald-500/30",
  },
  {
    id: "h4",
    type: "hottake",
    hook: "Standards aren't the reason you're single.",
    body: "Rigidity might be. There's a difference between knowing your worth and having a checklist no human can survive.",
    tag: "Real Talk",
    accent: "text-orange-500",
    bg: "bg-card",
    border: "border-orange-500/30",
  },

  // ── Quotes (power quotes, not generic) ──
  {
    id: "q1",
    type: "quote",
    hook: "\"Black love is an act of political warfare.\"",
    body: "",
    author: "Toni Morrison",
    tag: "Quote",
    accent: "text-amber-400",
    bg: "bg-card",
    border: "border-amber-400/30",
  },
  {
    id: "q2",
    type: "quote",
    hook: "\"The most radical thing I ever did was to stay.\"",
    body: "On commitment, courage, and choosing the same person every single day.",
    author: "Unknown",
    tag: "Quote",
    accent: "text-rose-400",
    bg: "bg-card",
    border: "border-rose-400/30",
  },
  {
    id: "q3",
    type: "quote",
    hook: "\"Don't settle for a relationship that won't let you be yourself.\"",
    body: "",
    author: "Oprah Winfrey",
    tag: "Quote",
    accent: "text-purple-400",
    bg: "bg-card",
    border: "border-purple-400/30",
  },

  // ── Tips (sharp, specific, not generic) ──
  {
    id: "t1",
    type: "tip",
    hook: "On a first date — ask about a failure, not a success.",
    body: "How someone talks about their worst moment tells you more than their highlight reel ever will.",
    tag: "Dating Tip",
    accent: "text-teal-500",
    bg: "bg-card",
    border: "border-teal-500/30",
  },
  {
    id: "t2",
    type: "tip",
    hook: "Want to know if they're serious? Watch their consistency, not their words.",
    body: "Anyone can say the right thing once. The right person shows up without being asked — repeatedly.",
    tag: "Relationship Tip",
    accent: "text-teal-500",
    bg: "bg-card",
    border: "border-teal-500/30",
  },
  {
    id: "t3",
    type: "tip",
    hook: "Never mistake intensity for intimacy.",
    body: "Butterflies can be anxiety. Chemistry can be chaos. Slow, steady warmth is often the realest thing in the room.",
    tag: "Dating Tip",
    accent: "text-teal-500",
    bg: "bg-card",
    border: "border-teal-500/30",
  },

  // ── Love Stories (cinematic, real-feeling) ──
  {
    id: "r1",
    type: "story",
    hook: "She almost deleted the app that Sunday.",
    body: "\"I gave it one more week. On day 4, he messaged. We talked until 3am about God, grief, and goals. A year later, we were married.\" — Amara, 31",
    tag: "Love Story",
    accent: "text-pink-500",
    bg: "bg-card",
    border: "border-pink-500/30",
  },
  {
    id: "r2",
    type: "story",
    hook: "He asked one question on their first date.",
    body: "\"What are you building?\" Not 'what do you do' — what are you *building*. That was Kofi. I knew in 10 minutes.\" — Ife, 28",
    tag: "Love Story",
    accent: "text-pink-500",
    bg: "bg-card",
    border: "border-pink-500/30",
  },
];
