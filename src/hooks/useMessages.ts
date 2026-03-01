import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
    id: string;
    match_id: string;
    sender_id: string;
    content: string;
    read: boolean;
    created_at: string;
}

export const useMessages = (matchId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!matchId) { setLoading(false); return; }

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("match_id", matchId)
                .order("created_at", { ascending: true });

            if (error) console.error("Error fetching messages:", error);
            setMessages((data ?? []) as Message[]);
            setLoading(false);
        };

        fetchMessages();

        // Realtime subscription
        const channel = supabase
            .channel(`messages-${matchId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `match_id=eq.${matchId}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [matchId]);

    const sendMessage = useCallback(async (content: string) => {
        if (!matchId) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { error } = await supabase.from("messages").insert({
            match_id: matchId,
            sender_id: session.user.id,
            content,
        });
        if (error) console.error("Send message error:", error);
    }, [matchId]);

    return { messages, loading, sendMessage };
};
