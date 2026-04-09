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
                if (isMounted) setProfile(data as UserProfile | null);
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

                // First get current user's profile to know their gender
                const { data: myProfile } = await supabase
                    .from("profiles")
                    .select("gender")
                    .eq("user_id", session.user.id)
                    .maybeSingle();

                // Determine opposite gender to show
                const myGender = myProfile?.gender?.toLowerCase();
                let targetGender: string | null = null;
                if (myGender === "male") targetGender = "Female";
                else if (myGender === "female") targetGender = "Male";

                // Fetch absolutely all profiles except current user (temporary mode per request)
                let query = supabase
                    .from("profiles")
                    .select("*")
                    .neq("user_id", session.user.id)
                    .order("created_at", { ascending: false });

                // --- Temporarily Disabled: Gender & Swipes ---
                // if (targetGender) { ... }
                // if (swipedData) { ... }

                const { data, error } = await query;
                if (error) throw error;
                if (isMounted) setProfiles((data ?? []) as UserProfile[]);
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
