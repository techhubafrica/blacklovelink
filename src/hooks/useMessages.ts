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
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!matchId) { setLoading(false); return; }

        setLoading(true);
        setConnected(false);

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("match_id", matchId)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error);
            } else {
                setMessages((data ?? []) as Message[]);
            }
            setLoading(false);
        };

        fetchMessages();

        // Mark messages as read when opening chat
        const markRead = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;
            await supabase
                .from("messages")
                .update({ read: true })
                .eq("match_id", matchId)
                .neq("sender_id", session.user.id)
                .eq("read", false);
        };
        markRead();

        // Realtime subscription with status tracking
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
                    setMessages((prev) => {
                        // Deduplicate in case of optimistic updates
                        const exists = prev.some(m => m.id === (payload.new as Message).id);
                        if (exists) return prev;
                        return [...prev, payload.new as Message];
                    });
                    // Mark incoming messages as read since we're viewing them
                    markRead();
                }
            )
            .subscribe((status) => {
                setConnected(status === "SUBSCRIBED");
                if (status === "CHANNEL_ERROR") {
                    console.error("Realtime channel error for messages:", matchId);
                }
            });

        return () => {
            supabase.removeChannel(channel);
            setConnected(false);
        };
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

    return { messages, loading, connected, sendMessage };
};
