import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { getArticleBySlug } from "@/data/articles";

// Renders article content: ## heading, **bold**, plain paragraph
function renderContent(content: string) {
    const paragraphs = content.trim().split(/\n\n+/);
    return paragraphs.map((para, i) => {
        if (para.startsWith("## ")) {
            return (
                <h2 key={i} className="text-xl font-black text-foreground mt-8 mb-3">
                    {para.replace("## ", "")}
                </h2>
            );
        }
        // Bold: replace **text** with <strong>
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
            <p key={i} className="text-base text-foreground/80 leading-relaxed mb-4">
                {parts.map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={j} className="text-foreground font-bold">
                            {part.slice(2, -2)}
                        </strong>
                    ) : (
                        part
                    )
                )}
            </p>
        );
    });
}

export default function ArticleReaderPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const article = slug ? getArticleBySlug(slug) : undefined;

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center px-6">
                    <p className="text-4xl mb-4">📄</p>
                    <h1 className="text-xl font-bold text-foreground mb-2">Article not found</h1>
                    <button onClick={() => navigate(-1)} className="text-primary text-sm font-medium hover:underline">
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
                <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <span className="text-sm font-semibold text-muted-foreground truncate flex-1">
                        {article.category}
                    </span>
                </div>
            </div>

            {/* Article body */}
            <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto px-5 pt-8 pb-20"
            >
                {/* Emoji + category */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl">{article.emoji}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                        {article.category}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-foreground leading-tight mb-3">
                    {article.title}
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-muted-foreground leading-snug mb-6">
                    {article.subtitle}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-8 pb-6 border-b border-border">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        BlackLoveLink
                    </span>
                    <span>{article.publishedAt}</span>
                </div>

                {/* Content */}
                <div>{renderContent(article.content)}</div>

                {/* Footer CTA */}
                <div className="mt-12 p-6 rounded-3xl bg-primary/5 border border-primary/20 text-center">
                    <p className="text-2xl mb-2">❤️</p>
                    <p className="font-black text-foreground text-lg mb-1">Ready to find your person?</p>
                    <p className="text-sm text-muted-foreground mb-4">Thousands of Black professionals are looking for exactly what you're looking for.</p>
                    <button
                        onClick={() => navigate("/swipe")}
                        className="px-8 py-3 rounded-full gradient-brand text-primary-foreground font-bold text-sm shadow-button hover:opacity-90 transition"
                    >
                        Discover Profiles
                    </button>
                </div>
            </motion.article>
        </div>
    );
}
