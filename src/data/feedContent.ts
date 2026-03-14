export type ContentCardType = "article" | "quote" | "tip" | "story";

export interface FeedContentItem {
  id: string;
  type: ContentCardType;
  title?: string;
  body: string;
  author?: string;
  readTime?: string;
  category?: string;
  gradient: string;
  emoji: string;
}

export const FEED_CONTENT: FeedContentItem[] = [
  // Articles
  {
    id: "a1",
    type: "article",
    title: "5 Signs You're Genuinely Ready for a Serious Relationship",
    body: "True readiness isn't about finding the perfect person — it's about becoming the right partner. Here's how to know you're there.",
    readTime: "3 min read",
    category: "Relationships",
    gradient: "from-rose-600 via-pink-600 to-red-500",
    emoji: "❤️",
  },
  {
    id: "a2",
    type: "article",
    title: "Why Black Love Is Revolutionary",
    body: "Love between Black people has always been an act of resistance and joy. Discover why building a Black family is one of the most powerful things you can do.",
    readTime: "4 min read",
    category: "Culture",
    gradient: "from-amber-600 via-orange-500 to-red-600",
    emoji: "✊🏾",
  },
  {
    id: "a3",
    type: "article",
    title: "Communication Secrets of Couples Who Last",
    body: "Research shows that couples who thrive don't fight less — they fight smarter. These 4 habits make all the difference.",
    readTime: "5 min read",
    category: "Advice",
    gradient: "from-purple-600 via-violet-600 to-indigo-600",
    emoji: "💬",
  },
  {
    id: "a4",
    type: "article",
    title: "What Does 'Equally Yoked' Really Mean in 2025?",
    body: "Faith, ambition, values — being equally yoked goes far deeper than religion. A modern take on compatibility that actually works.",
    readTime: "4 min read",
    category: "Faith & Love",
    gradient: "from-teal-600 via-emerald-600 to-green-600",
    emoji: "🙏🏾",
  },
  {
    id: "a5",
    type: "article",
    title: "Dating Fatigue Is Real — Here's How to Reset",
    body: "Swiping burnout is affecting millions. Therapists share how to rediscover excitement and approach dating from a place of fullness.",
    readTime: "3 min read",
    category: "Wellness",
    gradient: "from-sky-600 via-blue-600 to-indigo-500",
    emoji: "🧘🏾",
  },
  {
    id: "a6",
    type: "article",
    title: "Attachment Styles: Why You Attract Who You Attract",
    body: "Understanding your attachment style — anxious, avoidant, or secure — could be the missing piece in your love life.",
    readTime: "6 min read",
    category: "Psychology",
    gradient: "from-fuchsia-600 via-pink-600 to-rose-500",
    emoji: "🔍",
  },

  // Quotes
  {
    id: "q1",
    type: "quote",
    body: "The most important thing in the world is family and love.",
    author: "John Wooden",
    gradient: "from-slate-800 via-gray-800 to-slate-900",
    emoji: "🖤",
  },
  {
    id: "q2",
    type: "quote",
    body: "You don't love someone for their looks or clothes or their fancy car, but because they sing a song only you can hear.",
    author: "Oscar Wilde",
    gradient: "from-rose-900 via-red-800 to-rose-900",
    emoji: "🎵",
  },
  {
    id: "q3",
    type: "quote",
    body: "Black love is Black wealth.",
    author: "Nikki Giovanni",
    gradient: "from-amber-900 via-orange-800 to-amber-900",
    emoji: "👑",
  },
  {
    id: "q4",
    type: "quote",
    body: "The best thing to hold onto in life is each other.",
    author: "Audrey Hepburn",
    gradient: "from-purple-900 via-violet-800 to-purple-900",
    emoji: "🤝🏾",
  },
  {
    id: "q5",
    type: "quote",
    body: "I am nothing special; just a common person with common thoughts, and I've led a common life. There are no monuments dedicated to me, but I've loved another with all my heart and soul, and to me, this has always been enough.",
    author: "The Notebook",
    gradient: "from-teal-900 via-emerald-800 to-teal-900",
    emoji: "💚",
  },

  // Tips
  {
    id: "t1",
    type: "tip",
    title: "Love Tip of the Day",
    body: "Before a first date, replace nervousness with curiosity. Instead of 'What if they don't like me?', ask 'What's interesting about this person?' It changes everything.",
    category: "Dating",
    gradient: "from-pink-500 via-rose-500 to-pink-600",
    emoji: "💡",
  },
  {
    id: "t2",
    type: "tip",
    title: "Relationship Tip",
    body: "Compliment your partner's character — not just their looks. 'You handled that situation with so much grace' lands deeper than 'You look good today.'",
    category: "Couples",
    gradient: "from-violet-500 via-purple-500 to-violet-600",
    emoji: "💡",
  },
  {
    id: "t3",
    type: "tip",
    title: "Love Tip of the Day",
    body: "Put your phone away for the first 30 minutes of every morning you spend together. That quiet time builds intimacy that no text message can replicate.",
    category: "Connection",
    gradient: "from-emerald-500 via-green-500 to-emerald-600",
    emoji: "💡",
  },
  {
    id: "t4",
    type: "tip",
    title: "Dating Tip",
    body: "Stop trying to impress. Instead, focus on genuinely connecting. The right person won't be wowed by your highlights — they'll be drawn to your authenticity.",
    category: "Dating",
    gradient: "from-orange-500 via-amber-500 to-orange-600",
    emoji: "💡",
  },

  // Success Stories
  {
    id: "s1",
    type: "story",
    title: "They Met Online. Now They're Building a Family.",
    body: "\"We matched on a Tuesday. By Saturday we had talked for 11 hours straight. A year later, we were married. I didn't believe apps could lead to real love — until it happened to me.\" — Amara & David, Lagos",
    gradient: "from-rose-700 via-pink-700 to-red-700",
    emoji: "💍",
  },
  {
    id: "s2",
    type: "story",
    title: "Two Strangers, One Mission",
    body: "\"We both said on our profiles we wanted to build something, not just date. When we matched, the first thing he asked was what I was building. I knew immediately.\" — Ife & Kofi, London",
    gradient: "from-amber-700 via-orange-700 to-amber-700",
    emoji: "🏠",
  },
  {
    id: "s3",
    type: "story",
    title: "Love Found at the Right Time",
    body: "\"I was about to delete the app. I told myself: one more week. That week, I found her. She was the first person who made me feel completely seen.\" — Marcus & Zara, Atlanta",
    gradient: "from-purple-700 via-violet-700 to-purple-700",
    emoji: "⏱️",
  },
];
