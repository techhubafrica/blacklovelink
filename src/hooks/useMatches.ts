import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/hooks/useProfileData";

export interface Match {
    id: string;
    matchedProfile: UserProfile;
    created_at: string;
    status: "pending_them" | "pending_me" | "accepted" | "no_messages";
    lastMessage?: string;
    lastMessageAt?: string;
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

            // Fetch profiles
            const { data: profiles } = await supabase
                .from("profiles")
                .select("*")
                .in("user_id", otherIds);

            const profileMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));

            // Fetch all messages for these matches to determine status
            const matchIds = matchRows.map((m: any) => m.id);
            const { data: allMessages } = await supabase
                .from("messages")
                .select("*")
                .in("match_id", matchIds)
                .order("created_at", { ascending: false });

            // Group messages by match_id
            const messagesByMatch = new Map<string, any[]>();
            (allMessages ?? []).forEach((msg: any) => {
                const list = messagesByMatch.get(msg.match_id) || [];
                list.push(msg);
                messagesByMatch.set(msg.match_id, list);
            });

            const result: Match[] = matchRows
                .map((m: any) => {
                    const otherId = m.user_a === userId ? m.user_b : m.user_a;
                    const prof = profileMap.get(otherId);
                    if (!prof) return null;

                    const msgs = messagesByMatch.get(m.id) || [];
                    
                    // Determine status based on message history
                    let status: Match["status"] = "no_messages";
                    const iSent = msgs.some((msg: any) => msg.sender_id === userId);
                    const theySent = msgs.some((msg: any) => msg.sender_id === otherId);

                    if (iSent && theySent) {
                        status = "accepted"; // Both have messaged - conversation active
                    } else if (iSent && !theySent) {
                        status = "pending_them"; // I sent a request, waiting for them
                    } else if (!iSent && theySent) {
                        status = "pending_me"; // They sent a request, waiting for me to accept
                    }

                    const lastMsg = msgs[0];

                    return {
                        id: m.id,
                        matchedProfile: prof as UserProfile,
                        created_at: m.created_at,
                        status,
                        lastMessage: lastMsg?.content,
                        lastMessageAt: lastMsg?.created_at,
                    };
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
