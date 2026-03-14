import { motion } from "framer-motion";
import { X, Clock, BookOpen, Lightbulb, Heart, Quote } from "lucide-react";
import type { FeedContentItem } from "@/data/feedContent";

interface FeedContentCardProps {
    item: FeedContentItem;
    onDismiss: (id: string) => void;
}

const typeConfig = {
    article: { icon: BookOpen, label: "Article" },
    tip: { icon: Lightbulb, label: "Tip" },
    quote: { icon: Quote, label: "Quote" },
    story: { icon: Heart, label: "Love Story" },
};

export default function FeedContentCard({ item, onDismiss }: FeedContentCardProps) {
    const { icon: Icon, label } = typeConfig[item.type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-xl"
        >
            {/* Gradient background */}
            <div className={`bg-gradient-to-br ${item.gradient} p-6 pb-7`}>

                {/* Top row: badge + dismiss */}
                <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        <Icon className="w-3 h-3" />
                        {label}
                        {item.category && <span className="opacity-70">· {item.category}</span>}
                    </span>
                    <button
                        onClick={() => onDismiss(item.id)}
                        className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* Emoji */}
                <p className="text-4xl mb-3">{item.emoji}</p>

                {/* Title */}
                {item.title && (
                    <h3 className="text-white font-black text-xl leading-tight mb-3">
                        {item.title}
                    </h3>
                )}

                {/* Body */}
                {item.type === "quote" ? (
                    <blockquote className="text-white/90 text-lg font-medium leading-relaxed italic">
                        "{item.body}"
                        {item.author && (
                            <footer className="mt-3 text-white/60 text-sm font-normal not-italic">
                                — {item.author}
                            </footer>
                        )}
                    </blockquote>
                ) : (
                    <p className="text-white/90 text-base leading-relaxed">
                        {item.body}
                    </p>
                )}

                {/* Read time for articles */}
                {item.readTime && (
                    <div className="flex items-center gap-1.5 mt-4 text-white/60 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {item.readTime}
                    </div>
                )}

                {/* Bottom shimmer line */}
                <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/20 rounded-full" />
            </div>
        </motion.div>
    );
}
