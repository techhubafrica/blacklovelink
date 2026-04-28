import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/hooks/useProfileData";

export const useSwipe = () => {
    const recordSwipe = useCallback(async (
        swipedProfile: UserProfile,
        direction: "left" | "right" | "up" | "message",
        introText?: string
    ): Promise<{ matched: boolean }> => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return { matched: false };

            // Record the swipe
            const { error } = await supabase.from("swipes").insert({
                swiper_id: session.user.id,
                swiped_id: swipedProfile.user_id,
                direction,
                ...(introText ? { intro_text: introText } : {}),
            });

            if (error) {
                console.error("Swipe error:", error);
                return { matched: false };
            }

            // Check if a match was created by the DB trigger
            if (direction === "right" || direction === "up" || direction === "message") {
                const userId = session.user.id;
                const otherId = swipedProfile.user_id;
                const [a, b] = userId < otherId ? [userId, otherId] : [otherId, userId];

                const { data: matchData } = await supabase
                    .from("matches")
                    .select("id")
                    .eq("user_a", a)
                    .eq("user_b", b)
                    .maybeSingle();

                if (matchData) {
                    // If this was a message request and we have intro text,
                    // insert the intro text as the first message in the conversation
                    if (direction === "message" && introText?.trim()) {
                        await supabase.from("messages").insert({
                            match_id: matchData.id,
                            sender_id: session.user.id,
                            content: introText.trim(),
                        });
                    }

                    return { matched: true };
                }

                // No match yet — but if this was a message direction with intro text,
                // we still want to track the intro for when a match IS created later.
                // The intro_text is already stored on the swipe row, so we don't need
                // to do anything extra here. The frontend will show it from the swipe data.
            }

            return { matched: false };
        } catch (e) {
            console.error("Swipe error:", e);
            return { matched: false };
        }
    }, []);

    return { recordSwipe };
};
