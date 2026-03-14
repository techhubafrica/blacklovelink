import { motion } from "framer-motion";
import { X, Flame, TrendingUp, Quote, Lightbulb, Heart } from "lucide-react";
import type { FeedContentItem } from "@/data/feedContent";

interface FeedContentCardProps {
    item: FeedContentItem;
    onDismiss: (id: string) => void;
}

const typeConfig = {
    stat: { icon: TrendingUp, color: "text-muted-foreground" },
    hottake: { icon: Flame, color: "text-muted-foreground" },
    quote: { icon: Quote, color: "text-muted-foreground" },
    tip: { icon: Lightbulb, color: "text-muted-foreground" },
    story: { icon: Heart, color: "text-muted-foreground" },
};

export default function FeedContentCard({ item, onDismiss }: FeedContentCardProps) {
    const { icon: Icon } = typeConfig[item.type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
            className={`relative mx-auto w-full max-w-md rounded-3xl border-2 ${item.border} ${item.bg} p-6 shadow-lg overflow-hidden`}
        >
            {/* Subtle accent glow in top-right corner */}
            <div className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-20 bg-current ${item.accent}`} />

            {/* Top row: tag + dismiss */}
            <div className="flex items-center justify-between mb-5">
                <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${item.accent}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {item.tag}
                </span>
                <button
                    onClick={() => onDismiss(item.id)}
                    className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
            </div>

            {/* Hook — the scroll-stopper */}
            <p className={`font-black leading-tight mb-3 ${item.type === "stat"
                    ? `text-6xl ${item.accent}`
                    : "text-xl text-foreground"
                }`}>
                {item.hook}
            </p>

            {/* Body */}
            {item.body && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.body}
                </p>
            )}

            {/* Author for quotes */}
            {item.author && (
                <p className={`mt-3 text-xs font-semibold tracking-wide ${item.accent}`}>
                    — {item.author}
                </p>
            )}

            {/* Bottom divider line in accent color */}
            <div className={`absolute bottom-0 inset-x-0 h-[3px] rounded-b-3xl bg-current opacity-40 ${item.accent}`} />
        </motion.div>
    );
}
