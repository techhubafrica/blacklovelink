import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
    id: string;
    match_id: string;
    sender_id: string;
    content: string;
    read: boolean;
    created_at: string;
    edited_at: string | null;
    deleted_at: string | null;
    reply_to: string | null;
}

export const useMessages = (matchId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

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

        // Clean up previous channel
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
        }

        // Realtime subscription for INSERT, UPDATE events
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
                        const exists = prev.some(m => m.id === (payload.new as Message).id);
                        if (exists) return prev;
                        return [...prev, payload.new as Message];
                    });
                    markRead();
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "messages",
                    filter: `match_id=eq.${matchId}`,
                },
                (payload) => {
                    const updated = payload.new as Message;
                    setMessages((prev) =>
                        prev.map(m => m.id === updated.id ? updated : m)
                    );
                }
            )
            .subscribe((status) => {
                setConnected(status === "SUBSCRIBED");
                if (status === "CHANNEL_ERROR") {
                    console.error("Realtime channel error for messages:", matchId);
                }
            });

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
            setConnected(false);
        };
    }, [matchId]);

    // Send a new message, optionally as a reply
    const sendMessage = useCallback(async (content: string, replyToId?: string) => {
        if (!matchId) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const newMsg: any = {
            match_id: matchId,
            sender_id: session.user.id,
            content,
        };
        if (replyToId) newMsg.reply_to = replyToId;

        // Optimistic insert
        const optimisticId = `optimistic-${Date.now()}`;
        const optimisticMsg: Message = {
            id: optimisticId,
            match_id: matchId,
            sender_id: session.user.id,
            content,
            read: false,
            created_at: new Date().toISOString(),
            edited_at: null,
            deleted_at: null,
            reply_to: replyToId || null,
        };
        setMessages(prev => [...prev, optimisticMsg]);

        const { data, error } = await supabase.from("messages").insert(newMsg).select().single();
        if (error) {
            console.error("Send message error:", error);
            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== optimisticId));
        } else if (data) {
            // Replace optimistic with real message
            setMessages(prev => prev.map(m => m.id === optimisticId ? (data as Message) : m));
        }
    }, [matchId]);

    // Edit an existing message
    const editMessage = useCallback(async (messageId: string, newContent: string) => {
        if (!matchId) return;

        // Optimistic update
        setMessages(prev =>
            prev.map(m =>
                m.id === messageId
                    ? { ...m, content: newContent, edited_at: new Date().toISOString() }
                    : m
            )
        );

        const { error } = await supabase
            .from("messages")
            .update({ content: newContent, edited_at: new Date().toISOString() })
            .eq("id", messageId);

        if (error) {
            console.error("Edit message error:", error);
            // Refetch to restore state
            const { data } = await supabase
                .from("messages")
                .select("*")
                .eq("match_id", matchId)
                .order("created_at", { ascending: true });
            if (data) setMessages(data as Message[]);
        }
    }, [matchId]);

    // Unsend (soft-delete) a message
    const unsendMessage = useCallback(async (messageId: string) => {
        if (!matchId) return;

        // Optimistic update
        setMessages(prev =>
            prev.map(m =>
                m.id === messageId
                    ? { ...m, deleted_at: new Date().toISOString(), content: "" }
                    : m
            )
        );

        const { error } = await supabase
            .from("messages")
            .update({ deleted_at: new Date().toISOString(), content: "" })
            .eq("id", messageId);

        if (error) {
            console.error("Unsend message error:", error);
            // Refetch to restore state
            const { data } = await supabase
                .from("messages")
                .select("*")
                .eq("match_id", matchId)
                .order("created_at", { ascending: true });
            if (data) setMessages(data as Message[]);
        }
    }, [matchId]);

    return { messages, loading, connected, sendMessage, editMessage, unsendMessage };
};
