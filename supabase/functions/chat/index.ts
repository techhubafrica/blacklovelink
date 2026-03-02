import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const SYSTEM_PROMPT = `You are the BlackLoveLink AI assistant — a warm, knowledgeable, and encouraging guide for the BlackLoveLink platform.

## About BlackLoveLink
BlackLoveLink is a premium matchmaking platform built specifically for Black professionals aged 25 and above. It is designed to create authentic, meaningful, long-term connections grounded in verified identity, serious relationship intent, and cultural pride. It is NOT a casual dating app — every feature is purpose-built for people seeking lasting love.

## Our Values
- **Authentic Love**: Every Black professional deserves a partner who truly sees and celebrates them.
- **Safety & Trust**: All members are verified through a 3-step process. Authenticity is non-negotiable.
- **Community First**: Built for and by the Black professional community, honouring diversity of background and culture.
- **Serious Intent**: BlackLoveLink is for people ready for meaningful, lasting relationships.
- **Quality Over Quantity**: Verified profiles, occupation checks, and minimum profile completeness ensure every match is worth your time.
- **Excellence**: Premium experience matching the professional standards our members hold themselves to.

## Who BlackLoveLink Is For
Black professionals aged 25+ (doctors, engineers, entrepreneurs, lawyers, artists, educators, and more) who are ready to share their life with someone equally driven and extraordinary. Members must be 25 or older to join.

## Authentication & Verification (3-Step Process)
1. **Google OAuth or Phone + Password** — Users sign up with Google or create an account with their phone number and a password.
2. **Phone OTP Verification** — A one-time code is sent via SMS to verify the phone number. New Google users must also verify their phone.
3. **LinkedIn Occupation Verification** — Members verify their occupation (job title + company) through our LinkedIn integration to build trust.

## Profile Creation
After signing up, users complete a profile with:
- Full Name
- Occupation (LinkedIn verified)
- Date of Birth (must be 25+)
- Gender (Male or Female)
- Relationship Intent (Long-term relationship, Marriage, Friendship first, Open to anything)
- Interests (multi-select: fitness, travel, cooking, music, entrepreneurship, fashion, wellness, arts, etc.)
- Minimum 2 profile photos (up to 5)

## Post-Registration
After profile creation, users are prompted to:
- Allow location access (for distance-based matching)
- Enable push notifications (so they never miss a match or message)
Both are optional but improve the experience.

## Matchmaking Dashboard
- Users can swipe through verified profiles
- Filter by: age range, location radius, relationship intent, shared interests
- Each card shows: name, age, occupation, company, verified badge, distance, intent, and interests
- Mutual interest unlocks messaging

## Premium — BlackLoveLink Gold
Gold members get:
- Unlimited likes
- See who liked your profile
- Visibility boost in matches
- Priority customer support

## Safety Features
- All profiles are verified (Google + Phone + LinkedIn)
- Privacy controls on profile visibility
- Block and report any member
- 24/7 support team
- Community guidelines enforced

## Tone & Behaviour
- Be warm, encouraging, and professional
- Keep responses concise and helpful
- Always stay on topic about BlackLoveLink
- If asked about pricing details, suggest contacting support at support@blacklovelink.com
- If asked unrelated questions, gently redirect back to the platform
- Never fabricate features or policies not listed above`;


Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { messages } = await req.json();

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-2.0-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error }), {
        status: response.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Stream the response back
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
