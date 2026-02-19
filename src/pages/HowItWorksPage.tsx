import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCheck, Heart, MessageCircle, Sparkles, Shield, CheckCircle } from "lucide-react";
import blackLovelinkLogo from "@/assets/blacklovelink-logo.png";
import { useTranslation } from "@/hooks/useTranslation";

const HowItWorksPage = () => {
    const { t } = useTranslation();

    const steps = [
        {
            icon: UserCheck,
            title: "Create Your Profile",
            description: "Share your authentic self. Add photos, write about your passions, and let your personality shine. Our verification process ensures you're connecting with real people.",
            color: "from-primary to-secondary"
        },
        {
            icon: Shield,
            title: "Get Verified",
            description: "Complete our simple verification process. We prioritize safety and authenticity, so you can build genuine connections with confidence.",
            color: "from-secondary to-primary"
        },
        {
            icon: Heart,
            title: "Discover Matches",
            description: "Browse profiles of verified Black professionals who share your values. Our smart matching helps you find meaningful connections based on what matters most.",
            color: "from-primary to-secondary"
        },
        {
            icon: MessageCircle,
            title: "Start Conversations",
            description: "When you both show interest, it's a match! Break the ice with our conversation starters or jump right in. Real connections start with real conversations.",
            color: "from-secondary to-primary"
        },
        {
            icon: Sparkles,
            title: "Build Something Real",
            description: "Take your time getting to know each other. From casual chats to deep conversations, build the foundation for something meaningful at your own pace.",
            color: "from-primary to-secondary"
        }
    ];

    const features = [
        { icon: CheckCircle, text: "100% verified profiles" },
        { icon: CheckCircle, text: "Safe & secure messaging" },
        { icon: CheckCircle, text: "Privacy controls" },
        { icon: CheckCircle, text: "Smart matching algorithm" },
        { icon: CheckCircle, text: "24/7 support team" },
        { icon: CheckCircle, text: "Community guidelines" }
    ];

    return (
        <div className="min-h-screen font-display" style={{ "--background": "0 0% 100%", "--foreground": "240 10% 10%", "--card": "0 0% 100%", "--card-foreground": "240 10% 10%", "--muted": "240 5% 93%", "--muted-foreground": "240 4% 40%", "--border": "240 5% 84%", backgroundColor: "white", color: "#111" } as React.CSSProperties}>
            {/* Header */}
            <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-2xl bg-background/80 border-b border-border">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 py-4">
                    <Link to="/" className="flex items-center">
                        <img src={blackLovelinkLogo} alt="BlackLoveLink" className="h-11 w-auto" />
                    </Link>
                    <Link
                        to="/auth"
                        className="rounded-full gradient-brand px-7 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:scale-105"
                    >
                        Get Started
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">
                            How It <span className="text-gradient-brand">Works</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Finding authentic love shouldn't be complicated. Here's how BlackLoveLink helps you build meaningful connections.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="space-y-32">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
                            >
                                <div className="flex-shrink-0 relative">
                                    <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${step.color} p-1`}>
                                        <div className="w-full h-full rounded-3xl bg-background flex items-center justify-center">
                                            <step.icon className="w-16 h-16 text-foreground" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-lg">
                                        {index + 1}
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-card">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Built with your safety and success in mind
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 p-6 rounded-2xl bg-muted/50 border border-border hover:bg-muted transition-all"
                            >
                                <feature.icon className="w-6 h-6 text-secondary flex-shrink-0" />
                                <span className="text-foreground font-semibold">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12">
                            Join thousands of Black professionals finding authentic connections
                        </p>
                        <Link
                            to="/auth"
                            className="inline-block rounded-full gradient-brand px-12 py-4 text-lg font-bold text-primary-foreground shadow-button transition-all hover:scale-105"
                        >
                            Create Your Profile
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-12 px-6">
                <div className="mx-auto max-w-7xl text-center">
                    <p className="text-muted-foreground">
                        © 2026 BlackLoveLink. Building authentic connections.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HowItWorksPage;
