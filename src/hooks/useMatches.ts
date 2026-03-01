import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/hooks/useProfileData";

export interface Match {
    id: string;
    matchedProfile: UserProfile;
    created_at: string;
}

export const useMatches = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMatches = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) { setLoading(false); return; }

            const userId = session.user.id;

            const { data: matchRows, error } = await supabase
                .from("matches")
                .select("*")
                .or(`user_a.eq.${userId},user_b.eq.${userId}`)
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (!matchRows || matchRows.length === 0) {
                setMatches([]);
                setLoading(false);
                return;
            }

            // Get the other user_ids
            const otherIds = matchRows.map((m: any) =>
                m.user_a === userId ? m.user_b : m.user_a
            );

            const { data: profiles } = await supabase
                .from("profiles")
                .select("*")
                .in("user_id", otherIds);

            const profileMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));

            const result: Match[] = matchRows
                .map((m: any) => {
                    const otherId = m.user_a === userId ? m.user_b : m.user_a;
                    const prof = profileMap.get(otherId);
                    if (!prof) return null;
                    return { id: m.id, matchedProfile: prof as UserProfile, created_at: m.created_at };
                })
                .filter(Boolean) as Match[];

            setMatches(result);
        } catch (e) {
            console.error("Error fetching matches:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    return { matches, loading, refetch: fetchMatches };
};
