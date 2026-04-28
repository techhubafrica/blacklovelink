import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
    id: string;
    user_id: string;
    full_name: string;
    occupation_title: string;
    occupation_company: string;
    dob: string | null;
    age: number | null;
    gender: string | null;
    intent: string | null;
    interests: string[];
    bio: string;
    photos: string[];
    avatar_url: string | null;
    verified: boolean;
    profile_completed: boolean;
    push_notifications: boolean;
    email_notifications: boolean;
    is_public: boolean;
}

export const useCurrentUserProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) {
                    if (isMounted) setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", session.user.id)
                    .maybeSingle();

                if (error) throw error;
                if (isMounted) setProfile(data as unknown as UserProfile | null);
            } catch (e) {
                console.error("Error fetching current user profile:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProfile();
        return () => { isMounted = false; };
    }, []);

    return { profile, loading };
};

/**
 * Compute a compatibility score between the current user and a candidate profile.
 * Higher score = better match. Factors:
 *   - Shared interests (3 pts each)
 *   - Same dating intent (10 pts)
 *   - Verified profile (5 pts)
 *   - Profile recency bonus (0-5 pts, decays over 90 days)
 */
const computeScore = (
    myProfile: { interests: string[]; intent: string | null },
    candidate: UserProfile
): number => {
    let score = 0;

    // Shared interests — 3 points each
    const myInterests = new Set((myProfile.interests ?? []).map(i => i.toLowerCase().trim()));
    const theirInterests = (candidate.interests ?? []).map(i => i.toLowerCase().trim());
    for (const interest of theirInterests) {
        if (myInterests.has(interest)) score += 3;
    }

    // Same dating intent — 10 points
    if (
        myProfile.intent &&
        candidate.intent &&
        myProfile.intent.toLowerCase() === candidate.intent.toLowerCase()
    ) {
        score += 10;
    }

    // Verified profile bonus — 5 points
    if (candidate.verified) score += 5;

    // Recency bonus — up to 5 points (profiles created in last 90 days)
    if (candidate.created_at) {
        const daysSinceCreation = (Date.now() - new Date((candidate as any).created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation < 90) {
            score += Math.round(5 * (1 - daysSinceCreation / 90));
        }
    }

    return score;
};

export const useProfiles = () => {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchProfiles = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) {
                    if (isMounted) setLoading(false);
                    return;
                }

                // 1. Get current user's full profile for scoring
                const { data: myProfile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", session.user.id)
                    .maybeSingle();

                const myGender = myProfile?.gender?.toLowerCase();
                let targetGender: string | null = null;
                if (myGender === "male") targetGender = "Female";
                else if (myGender === "female") targetGender = "Male";

                // 2. Get already-swiped user_ids to exclude them server-side
                const { data: existingSwipes } = await (supabase as any)
                    .from("swipes")
                    .select("swiped_id")
                    .eq("swiper_id", session.user.id);

                const swipedIds = new Set(
                    (existingSwipes ?? []).map((s: any) => s.swiped_id)
                );

                // 3. Fetch candidate profiles
                let query = supabase
                    .from("profiles")
                    .select("*")
                    .eq("profile_completed", true)
                    .eq("is_public", true)
                    .neq("user_id", session.user.id)
                    .order("created_at", { ascending: false });

                if (targetGender) {
                    query = query.ilike("gender", targetGender);
                }

                const { data, error } = await query;
                if (error) throw error;

                let candidates = (data ?? []) as unknown as UserProfile[];

                // 4. Filter out already-swiped profiles
                if (swipedIds.size > 0) {
                    candidates = candidates.filter(p => !swipedIds.has(p.user_id));
                }

                // 5. Score and sort by compatibility
                if (myProfile) {
                    const scored = candidates.map(candidate => ({
                        profile: candidate,
                        score: computeScore(
                            {
                                interests: myProfile.interests ?? [],
                                intent: myProfile.intent ?? null,
                            },
                            candidate
                        ),
                    }));

                    // Sort by score descending, then by creation date for ties
                    scored.sort((a, b) => b.score - a.score);
                    candidates = scored.map(s => s.profile);
                }

                if (isMounted) setProfiles(candidates);
            } catch (e) {
                console.error("Error fetching profiles:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProfiles();
        return () => { isMounted = false; };
    }, []);

    return { profiles, loading };
};
