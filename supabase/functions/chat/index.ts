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
2. **Phone OTP Verification** — A one-time code is sent via SMS to verify the phone number.
3. **LinkedIn Occupation Verification** — Members verify their occupation (job title + company) through LinkedIn.

## Profile Creation
After signing up, users complete a profile with:
- Full Name, Occupation (LinkedIn verified), Date of Birth, Gender, Relationship Intent, Interests, 2–5 photos.

## Matchmaking Dashboard
- Swipe through verified profiles, filter by age, location, intent, interests.
- Mutual interest unlocks messaging.

## Premium — BlackLoveLink Gold
Unlimited likes, see who liked you, visibility boost, priority support.

## Safety Features
Verified profiles, privacy controls, block/report, 24/7 support.

## Tone & Behaviour
- Be warm, encouraging, and professional.
- Keep responses concise and helpful.
- Always stay on topic about BlackLoveLink.
- For pricing: suggest support@blacklovelink.com
- Never fabricate features or policies not listed above.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Gemini's native API (non-streaming for reliability)
    const geminiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm not sure how to help with that.";

    // Return as a simple SSE stream so the frontend reader still works
    const stream = new ReadableStream({
      start(controller) {
        const chunk = JSON.stringify({ choices: [{ delta: { content: text } }] });
        controller.enqueue(new TextEncoder().encode(`data: ${chunk}\n\n`));
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
