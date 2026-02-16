import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const HeroChatbot = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to connect");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "What is BlackLoveLink?",
    "How does matching work?",
    "Is it free to join?",
  ];

  return (
    <section className="bg-primary-foreground px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-background/80">AI Assistant</span>
          </div>
          <h3 className="text-3xl font-black text-background">
            Ask anything about <span className="text-gradient-brand">BlackLoveLink</span>
          </h3>
          <p className="mt-2 text-background/50">
            Get instant answers about our platform, features, and more
          </p>
        </motion.div>

        <div className="rounded-2xl border border-background/10 bg-background/5 backdrop-blur-sm overflow-hidden">
          {/* Chat area */}
          <div
            ref={scrollRef}
            className="h-[320px] overflow-y-auto p-4 space-y-3"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <MessageCircle className="h-10 w-10 text-background/20" />
                <p className="text-sm text-background/40 text-center">
                  Start a conversation with our AI assistant
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setInput(s);
                      }}
                      className="rounded-full border border-background/20 px-3 py-1.5 text-xs font-medium text-background/60 hover:bg-background/10 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "user"
                        ? "gradient-brand text-primary-foreground"
                        : "bg-background/10 text-background/90"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-background/10 rounded-2xl px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 bg-background/40 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-background/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-background/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-background/10 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about BlackLoveLink..."
                className="flex-1 bg-transparent text-sm text-background placeholder:text-background/30 outline-none px-2"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="gradient-brand rounded-full p-2.5 text-primary-foreground disabled:opacity-40 transition-opacity hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroChatbot;
