import { useState, useRef, useEffect } from "react";
import TopNav from "@/components/TopNav";
import { Search, Send, ArrowLeft } from "lucide-react";
import { useMatches } from "@/hooks/useMatches";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";

const MessagesPage = () => {
  const { matches, loading } = useMatches();
  const { user } = useAuth();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useMessages(selectedMatchId);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage.trim());
    setNewMessage("");
  };

  const filteredMatches = matches.filter((m) =>
    m.matchedProfile.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chat view
  if (selectedMatchId && selectedMatch) {
    return (
      <div className="flex h-[100dvh] flex-col bg-background">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <button onClick={() => setSelectedMatchId(null)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary">
            <img
              src={selectedMatch.matchedProfile.avatar_url || "/placeholder.svg"}
              alt={selectedMatch.matchedProfile.full_name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-foreground">{selectedMatch.matchedProfile.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedMatch.matchedProfile.occupation_title}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm mt-12">
              <p>No messages yet. Say hello! 👋</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMe
                      ? "gradient-brand text-primary-foreground rounded-br-md"
                      : "bg-card border border-border text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.content}
                  <div className={`text-xs mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-full gradient-brand text-primary-foreground disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Match list view
  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <TopNav />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-sm px-4 py-4">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search matches"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {loading && (
            <p className="text-center text-muted-foreground text-sm mt-8">Loading matches…</p>
          )}

          {!loading && matches.length === 0 && (
            <div className="text-center mt-12">
              <p className="text-lg font-semibold text-foreground">No matches yet</p>
              <p className="text-sm text-muted-foreground mt-1">Keep swiping to find your match!</p>
            </div>
          )}

          {/* Matches */}
          {filteredMatches.length > 0 && (
            <>
              <h3 className="mb-3 text-sm font-bold text-primary">Your Matches</h3>
              <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
                {filteredMatches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMatchId(m.id)}
                    className="flex flex-col items-center flex-shrink-0"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary">
                      <img
                        src={m.matchedProfile.avatar_url || "/placeholder.svg"}
                        alt={m.matchedProfile.full_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="mt-1 text-xs text-foreground truncate max-w-[4rem]">
                      {m.matchedProfile.full_name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Conversation list */}
              <h3 className="mb-3 text-sm font-bold text-primary">Messages</h3>
              <div className="space-y-2">
                {filteredMatches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMatchId(m.id)}
                    className="flex w-full items-center gap-3 rounded-xl bg-card p-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
                      <img
                        src={m.matchedProfile.avatar_url || "/placeholder.svg"}
                        alt={m.matchedProfile.full_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{m.matchedProfile.full_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(m.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        Tap to start chatting
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
