import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, HelpCircle, Send } from "lucide-react";
import blackLovelinkLogo from "@/assets/blacklovelink-logo.png";

const SupportPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const faqs = [
        {
            question: "How do I verify my profile?",
            answer: "After creating your account, navigate to Settings > Verification. You'll be asked to take a selfie that matches your profile photos and provide a valid ID. Verification typically takes 24-48 hours."
        },
        {
            question: "Is BlackLoveLink free to use?",
            answer: "Yes! Creating a profile, browsing, and basic matching is completely free. We offer premium features like unlimited likes, advanced filters, and read receipts through our Premium membership."
        },
        {
            question: "How does matching work?",
            answer: "Our algorithm considers your preferences, location, interests, and values. When you both show interest (like/super like), it's a match! You'll be notified and can start chatting."
        },
        {
            question: "Can I hide my profile?",
            answer: "Absolutely. Go to Settings > Privacy and toggle 'Hide Profile.' You'll be invisible to other users but can still browse. You can also pause your account temporarily."
        },
        {
            question: "What if I encounter inappropriate behavior?",
            answer: "Tap the three dots on any profile or conversation and select 'Report.' Our safety team reviews all reports within 24 hours. You can also block users directly."
        },
        {
            question: "How do I delete my account?",
            answer: "Go to Settings > Account > Delete Account. Please note this action is permanent and cannot be undone. Your data will be deleted according to our privacy policy."
        }
    ];

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Us",
            description: "Get a response within 24 hours",
            action: "support@blacklovelink.com",
            color: "from-blue-500 to-indigo-500"
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Available Mon-Fri, 9AM-6PM ET",
            action: "Start Chat",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Phone,
            title: "Call Us",
            description: "Speak with our team directly",
            action: "1-800-LOVE-LINK",
            color: "from-purple-500 to-pink-500"
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
    };

    return (
        <div className="min-h-screen bg-foreground font-display">
            {/* Header */}
            <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 py-4">
                    <Link to="/" className="flex items-center">
                        <img src={blackLovelinkLogo} alt="BlackLoveLink" className="h-11 w-auto" />
                    </Link>
                    <Link
                        to="/swipe"
                        className="rounded-full bg-primary-foreground px-7 py-2.5 text-sm font-bold text-background transition-all hover:scale-105"
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
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            <span className="text-primary font-semibold">We're Here to Help</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-primary-foreground mb-6">
                            Support <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Center</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-foreground/70 max-w-3xl mx-auto leading-relaxed">
                            Have questions? Need help? Our dedicated support team is here for you.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 rounded-3xl bg-background/40 backdrop-blur-sm border border-white/10 hover:bg-background/60 transition-all  text-center group"
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <method.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-primary-foreground mb-2">
                                    {method.title}
                                </h3>
                                <p className="text-primary-foreground/60 mb-6">
                                    {method.description}
                                </p>
                                <div className="text-primary font-bold text-lg">
                                    {method.action}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 px-6 bg-black/20">
                <div className="mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-primary-foreground mb-4">
                            Send Us a Message
                        </h2>
                        <p className="text-xl text-primary-foreground/70">
                            We'll get back to you within 24 hours
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onSubmit={handleSubmit}
                        className="p-8 rounded-3xl bg-background/40 backdrop-blur-sm border border-white/10 space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-primary-foreground mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background/40 border border-white/10 text-primary-foreground focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary-foreground mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background/40 border border-white/10 text-primary-foreground focus:border-primary focus:outline-none transition-colors"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-primary-foreground mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-background/40 border border-white/10 text-primary-foreground focus:border-primary focus:outline-none transition-colors"
                                placeholder="How can we help?"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-primary-foreground mb-2">
                                Message
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-background/40 border border-white/10 text-primary-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                                rows={6}
                                placeholder="Tell us more about your question or concern..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-background font-bold hover:scale-105 transition-all"
                        >
                            <Send className="w-5 h-5" />
                            Send Message
                        </button>
                    </motion.form>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-primary-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-primary-foreground/70">
                            Quick answers to common questions
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.details
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 rounded-2xl bg-background/40 backdrop-blur-sm border border-white/10 group"
                            >
                                <summary className="text-lg font-bold text-primary-foreground cursor-pointer list-none flex items-center justify-between">
                                    {faq.question}
                                    <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                                </summary>
                                <p className="mt-4 text-primary-foreground/70 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </motion.details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-6">
                <div className="mx-auto max-w-7xl text-center">
                    <p className="text-primary-foreground/60">
                        © 2024 BlackLoveLink. Building authentic connections.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SupportPage;
