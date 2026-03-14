import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Flame, TrendingUp, Quote, Lightbulb, Heart, BookOpen, ArrowRight } from "lucide-react";
import type { FeedContentItem } from "@/data/feedContent";

interface FeedContentCardProps {
    item: FeedContentItem;
    onDismiss: (id: string) => void;
}

const typeConfig = {
    stat: { icon: TrendingUp },
    hottake: { icon: Flame },
    quote: { icon: Quote },
    tip: { icon: Lightbulb },
    story: { icon: Heart },
    article: { icon: BookOpen },
};

export default function FeedContentCard({ item, onDismiss }: FeedContentCardProps) {
    const navigate = useNavigate();
    const { icon: Icon } = typeConfig[item.type];

    const handleCardClick = () => {
        if (item.type === "article" && item.articleSlug) {
            navigate(`/articles/${item.articleSlug}`);
        }
    };

    const isClickable = item.type === "article" && !!item.articleSlug;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
            onClick={isClickable ? handleCardClick : undefined}
            className={`relative mx-auto w-full max-w-md rounded-3xl border-2 ${item.border} ${item.bg} p-6 shadow-lg overflow-hidden ${isClickable ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
        >
            {/* Accent glow */}
            <div className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-20 bg-current ${item.accent}`} />

            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
                <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${item.accent}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {item.tag}
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); onDismiss(item.id); }}
                    className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
            </div>

            {/* Hook */}
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

            {/* Quote author */}
            {item.type === "quote" && item.author && (
                <p className={`mt-3 text-xs font-semibold tracking-wide ${item.accent}`}>
                    — {item.author}
                </p>
            )}

            {/* Article CTA */}
            {item.type === "article" && item.articleSlug && (
                <div className={`mt-4 flex items-center gap-1 text-xs font-bold ${item.accent}`}>
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                </div>
            )}

            {/* Bottom accent bar */}
            <div className={`absolute bottom-0 inset-x-0 h-[3px] rounded-b-3xl bg-current opacity-40 ${item.accent}`} />
        </motion.div>
    );
}
