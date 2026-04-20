// ─────────────────────────────────────────────────────────────────────────────
// BLACKLOVELINK ARTICLES
// ─────────────────────────────────────────────────────────────────────────────
// To publish a new article:
//   1. Add a new object to the ARTICLES array below
//   2. Give it a unique `slug` (used in the URL: /articles/your-slug)
//   3. Write the `content` using the simple format below:
//       • Regular paragraphs: just plain text
//       • Section headings: start the line with "## "
//       • Bold text: wrap with **like this**
//       • Line breaks between paragraphs are automatic
// ─────────────────────────────────────────────────────────────────────────────

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  emoji: string;
  readTime: string;
  publishedAt: string; // "March 14, 2025"
  excerpt: string;     // 1–2 sentences shown in the feed card
  content: string;     // Full article — use ## for headings, **text** for bold
}

export const ARTICLES: Article[] = [
  // ─── ARTICLE 1 ──────────────────────────────────────────────────────────────
  {
    id: "art001",
    slug: "the-one-conversation-couples-never-have",
    title: "The One Conversation Most Couples Never Have",
    subtitle: "And why having it before you're in love is the most romantic thing you can do.",
    category: "Relationships",
    emoji: "💬",
    readTime: "5 min read",
    publishedAt: "March 14, 2025",
    excerpt: "Most couples talk about everything except the things that will actually end them. Here's the conversation that changes everything.",
    content: `Most couples spend their early days talking about favourite foods, childhood memories, and where they'd travel if money were no object. Beautiful conversations. Soft conversations.

They almost never talk about the things that will quietly dismantle them five years from now.

## The Conversation Nobody Wants to Start

Money. Not in an abstract, "I want to be financially stable" way. The real stuff. Do you have debt? How much? Do you believe in joint accounts or separate ones? What does financial security look like to you — does it mean a house, or investments, or the ability to quit your job without panic?

How do you handle conflict? Not "I prefer to talk things through" — but what actually happens to you when you're angry? Do you go quiet for three days? Do you raise your voice? Do you need 48 hours before you can say anything useful?

Do you want children? Not "someday, maybe" — but genuinely, in your body: do you want them? And if so, what does that look like? Who stays home? Who earns? What faith, if any, do they grow up in?

These aren't awkward questions. They're the questions that reveal whether two people are actually compatible — or just really, really attracted to each other.

## Why We Avoid It

We avoid these conversations because we're afraid the answers will cost us the connection. And that fear is understandable. When you like someone, the last thing you want to do is hand them a reason to leave.

But here's what nobody tells you: **the conversation doesn't cost you connection. It builds it.**

When you can sit with someone and say "I have $40,000 in student loans and I'm paying off $800 a month" — and they look at you not with judgement but with understanding — that's intimacy. Real intimacy. The kind that actually lasts.

## The Most Romantic Thing You Can Do

Choosing someone is not one decision. It's a thousand small ones over years. But the foundation of all those decisions is honesty — early, awkward, courageous honesty.

The couples who make it aren't the ones who never had hard conversations. They're the ones who had them early, before investment turned into obligation, before love made it harder to leave and easier to stay silent.

Have the conversation nobody wants to start. Ask the questions that scare you. Say the thing you've been holding back.

Not because it's practical. Because **loving someone well begins with seeing them clearly.**`,
  },

  // ─── ARTICLE 2 ──────────────────────────────────────────────────────────────
  {
    id: "art002",
    slug: "why-black-women-are-done-shrinking",
    title: "Why Black Women Are Done Shrinking",
    subtitle: "On standards, self-worth, and what it means to finally take up space.",
    category: "Culture",
    emoji: "👑",
    readTime: "4 min read",
    publishedAt: "March 14, 2025",
    excerpt: "For too long, Black women have been told their standards are the reason they're alone. That conversation is over.",
    content: `There is a story told about Black women in relationship spaces. It goes like this: you are too picky, too independent, too career-focused, too educated. You have priced yourself out of the market. You have forgotten how to be soft. Your standards are the reason you are alone.

This story is a lie. And more and more Black women are refusing to believe it.

## The Weight of the Narrative

For decades, Black women have been handed a peculiar burden: to be desirable, they must choose between their ambitions and their softness. They must lower the bar or risk being alone. They must be grateful for what comes, because what comes may be the best they can expect.

This narrative exists because Black women's relationship struggles are culturally legible in a way that makes them easy to blame. High unemployment, incarceration rates, gender imbalances — complex systemic issues get collapsed into: *you need to do better.*

But shrinking isn't working. And it never was.

## What Standards Actually Are

A standard is not a checklist. A standard is a line that protects your peace.

Wanting a partner who is emotionally present is not asking too much. Wanting someone who is building something with their life is not asking too much. Wanting to be chosen clearly, consistently, and without performance is not asking too much.

What sounds like "too much" is often just self-respect wearing its full size.

## Taking Up Space

The shift happening among Black women right now is not bitterness. It is not giving up. It is something far more powerful: **the decision to stop auditioning for people who wouldn't even cast them.**

It is the decision to be alone rather than be with someone who makes them feel alone.

It is the refusal to perform smallness for the comfort of people who were never going to pour back in equal measure.

It is, ultimately, a form of love — a radical commitment to themselves that makes room for someone who will actually rise to meet them.

## A Note for the Men Reading This

If a woman's standards feel threatening to you, that's worth sitting with. The question is not whether she can lower her bar. The question is whether you are willing to rise.

The Black women in your life deserve to be loved at full volume. They always have.`,
  },

  // ─── ARTICLE 3 ──────────────────────────────────────────────────────────────
  {
    id: "art003",
    slug: "the-myth-of-perfect-timing",
    title: "The Myth of Perfect Timing in Love",
    subtitle: "You will never be fully ready. That's not a problem — that's the point.",
    category: "Mindset",
    emoji: "⏱️",
    readTime: "4 min read",
    publishedAt: "March 14, 2025",
    excerpt: "People keep waiting until they're 'ready' for love. But the healing and the loving aren't a sequence — they happen together.",
    content: `How many people do you know who are waiting to be ready?

Waiting until the therapy is done. Until the career is stable. Until the weight is lost. Until the apartment is nicer. Until the past relationship is fully processed. Until the version of themselves they're working toward is finally finished.

There are entire communities of people on healing journeys who have quietly decided that love is the reward at the end — something you earn access to once you've become the right version of yourself.

This is a beautiful idea. It is also a trap.

## The Sequence That Doesn't Exist

The belief goes: heal first, love second. Become whole, then connect. Fix yourself, then offer yourself.

But healing doesn't work linearly. And love doesn't wait at a finish line.

The deepest growth most people experience happens *inside* relationships — in the friction, the mirror, the moment someone sees a thing in you that you didn't know was there. You learn things about yourself in love that no amount of solitary self-work will teach you.

This is not an argument to rush into relationships unprepared. It's an argument against a perfectionism that uses "I'm not ready" as armour against being known.

## What "Ready" Actually Means

You will never be fully ready. There is no version of you that will arrive on the other side of all your wounds with nothing left to figure out.

What you can be is **honest**. Present. Willing to be seen imperfectly. Willing to grow alongside someone rather than only before them.

That's not the absence of readiness. That's the deepest kind of it.

## The Cost of the Wait

Every year spent waiting for the right version of yourself is a year spent alone — not always by circumstance, but by choice.

And the painful truth is: the things most people are waiting to fix don't get fixed in isolation. They get fixed in connection. In the moments when someone holds your worst self and stays. In the practice of loving someone on the days when love is inconvenient.

You don't graduate into being loved. You learn how to be loved by letting it in.

**Start before you're ready. That's where all the real growth lives.**`,
  },

  // ─── ARTICLE 4 ──────────────────────────────────────────────────────────────
  {
    id: "art004",
    slug: "what-staying-actually-looks-like",
    title: "What Staying Actually Looks Like",
    subtitle: "We romanticise falling in love. Nobody talks about what it costs to stay.",
    category: "Marriage",
    emoji: "🔑",
    readTime: "5 min read",
    publishedAt: "March 14, 2025",
    excerpt: "Staying in a relationship isn't passive. It's an active, daily, sometimes exhausting decision. Here's what the couples who last actually do.",
    content: `Everyone wants to fall in love. Movies are made about it. Songs are written about it. The falling part — the electricity, the newness, the feeling that someone has finally found you — is the part we celebrate.

Nobody makes movies about what comes after.

After is where the real love lives.

## The Decision Nobody Talks About

Commitment is not a feeling. It is not the warm certainty of a first date. It is not the ease of early love before life gets complicated.

Commitment is a decision — made and remade, every single day, under conditions that were not in the brochure.

It is choosing the same person when you are exhausted and they are frustrating. It is choosing them when your paths diverge slightly and you have to actively close the distance. It is choosing them when the attraction has settled into something quieter — less fireworks, more fire. Steadier. Warmer. Less visible to the outside world, but infinitely more real.

## What the Couples Who Last Actually Do

They fight without contempt. Research by Dr. John Gottman found that contempt — eye-rolling, dismissiveness, the sense that your partner is beneath you — is the single most reliable predictor of divorce. The couples who survive conflict don't fight less. They fight without the poison.

They choose repair over being right. After every argument, someone has to reach back. Someone has to say: *the relationship matters more than winning this.* In the strongest couples, this happens fast. Not because they're conflict-avoidant — because they both know what they're protecting.

They stay curious about each other. Long-term partners can slip into thinking they know everything about each other. The ones who thrive don't. They ask questions. They are still interested. They treat their partner as a person in motion, not a fixed object.

They build something together. A shared mission — whether that's family, community, faith, or legacy — gives the relationship a third dimension. You are not just two people in love. You are building something that is bigger than both of you.

## The Radical Act of Staying

In a culture that frames leaving as liberation and staying as settling, staying — intentionally, actively, lovingly — has become one of the most countercultural things a person can do.

It is not weakness. It is not resignation.

**It is the choice, made again and again, that says: this person, this life, this us — is worth showing up for.**

That's what love actually looks like. Not the falling. The staying.`,
  },

  // ─── ARTICLE 5 ──────────────────────────────────────────────────────────────
  {
    id: "art005",
    slug: "you-are-not-looking-for-love",
    title: "You're Not Looking for Love. You're Running from Loneliness.",
    subtitle: "There's a difference. And it changes everything.",
    category: "Self",
    emoji: "🪞",
    readTime: "4 min read",
    publishedAt: "March 14, 2025",
    excerpt: "There's a version of searching for love that's really just searching for someone to fill a silence. Know which one you're doing.",
    content: `There is a version of searching for love that comes from abundance — from a full self, reaching outward for connection, companionship, and shared life.

There is another version that comes from lack — from a silence inside that needs filling, a hollow that feels unbearable, a loneliness so persistent that *anyone* starts to look like the answer.

Both versions look identical from the outside. The difference is felt from the inside. And it matters more than almost anything else.

## The Signal Worth Paying Attention To

When you are running from loneliness rather than moving toward love, certain patterns emerge.

You accept things you said you wouldn't accept — not because your standards evolved, but because the alternative is being alone again. You escalate relationships faster than feels natural, because the empty apartment at night is what you're afraid of, not the wrong person. You stay longer than you should, because leaving means returning to the thing you were escaping.

You fall in love with potential, not reality. Because potential gives you something to hold on to.

None of this is pathetic. It is profoundly human. Loneliness is one of the most painful human experiences. The impulse to escape it is sane.

But love built on the foundation of escape is fragile. It holds you together until it doesn't. And then you're back where you started, plus grief.

## What Fullness Looks Like

The people who find the healthiest relationships are not the ones who didn't need them. They are the ones who *wanted* them without *needing* them to survive.

They had lives that felt meaningful outside of romantic love. Friends, work, faith, purpose, creative practice — things that made them feel like a whole person. So when someone arrived, they were adding, not filling.

This is not about performing independence. It's about genuinely building a life that is worth sharing — so that when you invite someone into it, it's an offering, not a rescue request.

## The Question to Ask Yourself

Before you pursue someone new, before you re-download the app, before you say yes to another date because you're tired of eating alone — ask yourself:

*Am I reaching toward someone? Or am I running from something?*

You deserve to know the answer. And so does whoever you're about to bring into it.

**Love is not a cure for loneliness. But it is one of life's greatest gifts — when you enter it from a place of wholeness.**`,
  },
  // ─── ARTICLE 6 ──────────────────────────────────────────────────────────────
  {
    id: "art006",
    slug: "how-to-actually-enjoy-the-dating-process",
    title: "How to Actually Enjoy the Dating Process",
    subtitle: "A framework for approaching dating with clarity, authenticity, and emotional resilience.",
    category: "Mindset",
    emoji: "🧘🏾‍♀️",
    readTime: "7 min read",
    publishedAt: "April 20, 2026",
    excerpt: "Dating doesn’t have to feel like a means to an end: It can literally become an art form when you leave old beliefs behind.",
    content: `*By Marie Thouin, Ph.D. (Guest Contributor)*

I’m one of those freaks who genuinely enjoys dating. Not because I typically get what I want (believe me, I don’t), but because I see dating as a transformative and educational process—one that has the power to lead us into greater authenticity and intimacy with ourselves and others.

The realization that dating can be a valuable activity in and of itself, rather than a zero-sum game where a “bad” date means a waste of time, led me to become a dating coach. Not one who says, “let’s figure out how to manipulate someone into wanting you,” but rather someone who cheers you into viewing every single dating interaction as an opportunity for empowerment.

But in a world where humans often treat each other as objects of entertainment, disposable ego-boosts, or “needs-fulfilling machines,” what does it actually look like to date with integrity and meaning? 

Enter my framework: **The six pillars of mindful dating.**

In this context, mindful refers to one’s commitment to awareness and integrity, versus the outdated rulebooks, automatic responses, and bad behaviors that often prevail in the dating sphere. Practicing mindful dating is about letting go of old scripts around love, seduction, and roles, and instead, using the entire process of dating as a playground for developing authentic presence.

## Deep visioning: owning your WHY

Owning our truest WHY for dating is the first step in creating an aligned dating life. If you are dating on auto-pilot and feeling disappointing results, ask yourself: Why am I dating? What does love and intimacy really mean to me in the spectrum of my life’s purpose? What am I hoping to experience? What are my socially conditioned values, versus my chosen values? 

There are no right or wrong answers here, but a sincere inquiry into these questions leads to deeper intentionality with dating, and more aligned results.

## Cultivating an empowered self-concept

A big part of dating is deciding how to communicate about oneself. Research shows that how we conceptualize ourselves directly impacts our chances of selecting a compatible mate.

Learning to embrace and express an empowered self-concept is not arrogance. It’s about leading with your gifts. Core gifts are those precious parts of us that we often learn to repress during childhood to make people around us comfortable—for example, our thirst for love, our sensitivity, our empathy, or our exuberance—but these are the parts that constitute our deepest spark. 

Sharing one’s gifts in dating can be vulnerable, but it can be a definitive movement away from old patterns of self-repression, and towards a commitment to authenticity.

## Practicing mindful swiping

I get it: Online dating can feel soul-sucking and dehumanizing. Algorithms gamify dating and make us feel as if we are products on a shelf. But it doesn't have to be this way.

Mindful Swiping is a framework to help us use online dating as a mindfulness practice:
*   **Ritualize your use of the apps.** Stop swiping “mindlessly” and establish a ritual. Every time you use the apps, breathe deeply and reconnect with your intentions.
*   **Create an authentic profile.** Pick photos that feel like the real you. In the writeup, communicate unique qualities, interests, and values that convey the breadth of who you are.
*   **Practice discernment.** When swiping, use your rational mind AND your embodied intuition.
*   **Practice loving-kindness.** Remember there is a three-dimensional human on the other side of the app—a soul, a heart, a body that’s longing to be loved, just like you.

## Communicating to connect

Communication in early dating can be tricky. When a connection is new, it is naturally precarious, and ripe for misunderstandings. 

Before you can communicate truthfully, you have to discern what it is you really feel, want, and need—not imagining and complying with what other people expect you to say. Once you identify your needs and feelings, you must gather the courage to express them directly (and kindly). Stating your real desires means you might hear “no” for an answer, which can be terrifying. But hearing “yes” might be just as terrifying—because that means actual intimacy and being seen in your truth is within reach.

## Navigating challenging emotions and integrating learning

Dating has a way of bringing up challenging emotions: Rejection, comparison, loneliness, shame, disappointment, envy, jealousy, judgment, anger, hopelessness. There is no way to completely avoid them while keeping one’s heart open.

However, we can change our relationship to those feelings. We can learn to embrace these emotions, and utilize them to grow, learn, and transform, rather than hide away and judge ourselves. I invite you to practice positive defiance. That means choosing to keep an open heart and to practice love, kindness, and self-compassion in the face of emotional challenges and negative self-talk.

In sum, dating doesn’t have to feel like a means to an end: It can literally become an art form when you leave the old beliefs and patterns behind, and learn to act from a deeper source of self-expression, authenticity, and self-love.`,
  },
];

// Helper to find an article by slug
export const getArticleBySlug = (slug: string): Article | undefined =>
  ARTICLES.find(a => a.slug === slug);
