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

                return { matched: !!matchData };
            }

            return { matched: false };
        } catch (e) {
            console.error("Swipe error:", e);
            return { matched: false };
        }
    }, []);

    return { recordSwipe };
};
