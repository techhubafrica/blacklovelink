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
            color: "from-pink-500 to-rose-500"
        },
        {
            icon: Shield,
            title: "Get Verified",
            description: "Complete our simple verification process. We prioritize safety and authenticity, so you can build genuine connections with confidence.",
            color: "from-purple-500 to-indigo-500"
        },
        {
            icon: Heart,
            title: "Discover Matches",
            description: "Browse profiles of verified Black professionals who share your values. Our smart matching helps you find meaningful connections based on what matters most.",
            color: "from-rose-500 to-pink-500"
        },
        {
            icon: MessageCircle,
            title: "Start Conversations",
            description: "When you both show interest, it's a match! Break the ice with our conversation starters or jump right in. Real connections start with real conversations.",
            color: "from-amber-500 to-orange-500"
        },
        {
            icon: Sparkles,
            title: "Build Something Real",
            description: "Take your time getting to know each other. From casual chats to deep conversations, build the foundation for something meaningful at your own pace.",
            color: "from-violet-500 to-purple-500"
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
        <div className="min-h-screen bg-gray-50 font-display">
            {/* Header */}
            <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 py-4">
                    <Link to="/" className="flex items-center">
                        <img src={blackLovelinkLogo} alt="BlackLoveLink" className="h-11 w-auto" />
                    </Link>
                    <Link
                        to="/swipe"
                        className="rounded-full bg-primary-foreground px-7 py-2.5 text-sm font-bold text-white transition-all hover:scale-105"
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
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">
                            How It <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Works</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-900/70 max-w-3xl mx-auto leading-relaxed">
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
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <div className={`relative w-32 h-32 rounded-3xl bg-gradient-to-br ${step.color} p-1`}>
                                        <div className="w-full h-full rounded-3xl bg-gray-50 flex items-center justify-center">
                                            <step.icon className="w-16 h-16 text-gray-900" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-black text-xl">
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-lg text-gray-900/70 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-black/20">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-gray-900/70">
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
                                className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50/40 backdrop-blur-sm border border-white/10 hover:bg-gray-50/60 transition-all"
                            >
                                <feature.icon className="w-6 h-6 text-primary flex-shrink-0" />
                                <span className="text-gray-900 font-semibold">{feature.text}</span>
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
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-gray-900/70 mb-12">
                            Join thousands of Black professionals finding authentic connections
                        </p>
                        <Link
                            to="/swipe"
                            className="inline-block rounded-full bg-primary-foreground px-12 py-4 text-lg font-bold text-white shadow-2xl shadow-primary-foreground/20 transition-all hover:scale-105"
                        >
                            Create Your Profile
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-6">
                <div className="mx-auto max-w-7xl text-center">
                    <p className="text-gray-900/60">
                        © 2024 BlackLoveLink. Building authentic connections.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HowItWorksPage;
