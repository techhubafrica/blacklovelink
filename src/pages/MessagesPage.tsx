import { useState, useRef, useEffect } from "react";
import TopNav from "@/components/TopNav";
import { Search, Send, ArrowLeft, Heart, MessageCircle, Clock, CheckCircle, X, User } from "lucide-react";
import { useMatches } from "@/hooks/useMatches";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type TabType = "chats" | "requests";

const MessagesPage = () => {
  const { matches, loading, refetch } = useMatches();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("chats");
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useMessages(selectedMatchId);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);
  const viewingMatch = matches.find((m) => m.id === viewingProfile);

  // Categorize matches
  const acceptedChats = matches.filter(m => m.status === "accepted");
  const pendingRequests = matches.filter(m => m.status === "pending_me");
  const sentRequests = matches.filter(m => m.status === "pending_them");
  const newMatches = matches.filter(m => m.status === "no_messages");

  const requestCount = pendingRequests.length;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage.trim());
    setNewMessage("");
    // Refetch to update status
    setTimeout(() => refetch(), 500);
  };

  const handleAcceptRequest = (matchId: string) => {
    // Opening chat and sending a message = accepting
    setSelectedMatchId(matchId);
    setViewingProfile(null);
  };

  const filteredAccepted = acceptedChats.filter((m) =>
    m.matchedProfile.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = pendingRequests.filter((m) =>
    m.matchedProfile.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Profile view modal
  if (viewingProfile && viewingMatch) {
    const profile = viewingMatch.matchedProfile;
    return (
      <div className="flex h-[100dvh] flex-col bg-background">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <button onClick={() => setViewingProfile(null)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-foreground">View Profile</span>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="relative">
            <img
              src={profile.photos?.[0] || profile.avatar_url || "/placeholder.svg"}
              alt={profile.full_name}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white">
                {profile.full_name}, {profile.age || "—"}
              </h2>
              <p className="text-white/80 text-sm">
                {profile.occupation_title} {profile.occupation_company && `at ${profile.occupation_company}`}
              </p>
              {profile.verified && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/20 rounded-full text-xs text-primary">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {profile.intent && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Looking for</h4>
                <p className="text-foreground">{profile.intent}</p>
              </div>
            )}
            
            {profile.bio && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">About</h4>
                <p className="text-foreground text-sm">{profile.bio}</p>
              </div>
            )}
            
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string) => (
                    <span key={interest} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Show their message */}
            {viewingMatch.lastMessage && (
              <div className="mt-6 p-4 bg-card rounded-xl border border-border">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Their Message</h4>
                <p className="text-foreground">{viewingMatch.lastMessage}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-border p-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setViewingProfile(null)}
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
          <Button
            className="flex-1 gradient-brand text-primary-foreground"
            onClick={() => handleAcceptRequest(viewingProfile)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Accept & Reply
          </Button>
        </div>
      </div>
    );
  }

  // Chat view
  if (selectedMatchId && selectedMatch) {
    const canChat = selectedMatch.status === "accepted" || selectedMatch.status === "pending_them" || selectedMatch.status === "no_messages";
    
    return (
      <div className="flex h-[100dvh] flex-col bg-background">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <button onClick={() => { setSelectedMatchId(null); refetch(); }} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary">
            <img
              src={selectedMatch.matchedProfile.avatar_url || "/placeholder.svg"}
              alt={selectedMatch.matchedProfile.full_name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">{selectedMatch.matchedProfile.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedMatch.matchedProfile.occupation_title}
            </p>
          </div>
          {selectedMatch.status === "pending_them" && (
            <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-600 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pending
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {selectedMatch.status === "no_messages" && (
            <div className="text-center text-muted-foreground text-sm mt-12">
              <div className="mx-auto w-16 h-16 rounded-full gradient-brand flex items-center justify-center mb-3">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">You matched!</p>
              <p>Send a message to start the conversation</p>
            </div>
          )}
          {selectedMatch.status === "pending_them" && messages.length > 0 && (
            <div className="text-center mb-4">
              <span className="text-xs bg-amber-500/20 text-amber-600 px-3 py-1 rounded-full">
                Waiting for {selectedMatch.matchedProfile.full_name.split(" ")[0]} to accept
              </span>
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
              placeholder={selectedMatch.status === "no_messages" ? "Say hello to start..." : "Type a message..."}
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
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("chats")}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                activeTab === "chats"
                  ? "gradient-brand text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors relative ${
                activeTab === "requests"
                  ? "gradient-brand text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Requests
              {requestCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {requestCount}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder={activeTab === "chats" ? "Search conversations" : "Search requests"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {loading && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-card p-3">
                  <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    <Skeleton className="h-3 w-40 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chats Tab */}
          {!loading && activeTab === "chats" && (
            <>
              {/* New Matches (no messages yet) */}
              {newMatches.length > 0 && (
                <>
                  <h3 className="mb-3 text-sm font-bold text-primary flex items-center gap-2">
                    <Heart className="w-4 h-4" /> New Matches
                  </h3>
                  <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
                    {newMatches.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMatchId(m.id)}
                        className="flex flex-col items-center flex-shrink-0"
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary relative">
                          <img
                            src={m.matchedProfile.avatar_url || "/placeholder.svg"}
                            alt={m.matchedProfile.full_name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <span className="mt-1 text-xs text-foreground truncate max-w-[4rem]">
                          {m.matchedProfile.full_name.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Sent Requests (waiting for them) */}
              {sentRequests.length > 0 && (
                <>
                  <h3 className="mb-3 text-sm font-bold text-amber-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Pending Sent
                  </h3>
                  <div className="space-y-2 mb-6">
                    {sentRequests.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMatchId(m.id)}
                        className="flex w-full items-center gap-3 rounded-xl bg-card p-3 text-left transition-colors hover:bg-muted border border-amber-500/20"
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
                            <span className="text-xs text-amber-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">
                            Waiting for response...
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Active Conversations */}
              {filteredAccepted.length > 0 && (
                <>
                  <h3 className="mb-3 text-sm font-bold text-primary flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Conversations
                  </h3>
                  <div className="space-y-2">
                    {filteredAccepted.map((m) => (
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
                              {m.lastMessageAt ? new Date(m.lastMessageAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">
                            {m.lastMessage || "Start chatting"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {newMatches.length === 0 && sentRequests.length === 0 && filteredAccepted.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-16"
                >
                  <div className="mx-auto h-20 w-20 rounded-full gradient-brand flex items-center justify-center mb-4">
                    <Heart className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">No conversations yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Keep swiping to find your match!</p>
                  <Button className="mt-4" onClick={() => navigate("/swipe")}>
                    Start Swiping
                  </Button>
                </motion.div>
              )}
            </>
          )}

          {/* Requests Tab */}
          {!loading && activeTab === "requests" && (
            <>
              {filteredRequests.length > 0 ? (
                <>
                  <h3 className="mb-3 text-sm font-bold text-foreground">
                    Message Requests ({filteredRequests.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    These people want to chat with you. View their profile to accept or decline.
                  </p>
                  <div className="space-y-3">
                    {filteredRequests.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl bg-card border border-border p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary">
                            <img
                              src={m.matchedProfile.avatar_url || "/placeholder.svg"}
                              alt={m.matchedProfile.full_name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{m.matchedProfile.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {m.matchedProfile.occupation_title}
                            </p>
                          </div>
                        </div>
                        
                        {m.lastMessage && (
                          <div className="bg-muted/50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-foreground line-clamp-2">"{m.lastMessage}"</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setViewingProfile(m.id)}
                          >
                            <User className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 gradient-brand text-primary-foreground"
                            onClick={() => handleAcceptRequest(m.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-16"
                >
                  <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">No requests</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    When someone sends you a message, it'll appear here
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
