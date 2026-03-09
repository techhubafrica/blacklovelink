import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Quote, Heart, MapPin, Calendar } from "lucide-react";
import SharedNavbar from "@/components/SharedNavbar";
import SiteFooter from "@/components/SiteFooter";
import story1 from "@/assets/story-1.png";
import story2 from "@/assets/story-2.png";
import story3 from "@/assets/story-3.png";
import story4 from "@/assets/story-4.png";
import { usePlatformStats } from "@/hooks/usePlatformStats";

const SuccessStoriesPage = () => {
    const { stats, loading, formatStat } = usePlatformStats();
    const stories = [
        {
            image: story1,
            names: "Amara & Kwame",
            location: "Atlanta, GA",
            date: "Met in January 2026",
            story: "We matched on BlackLoveLink during a cold January evening. What started as a conversation about our shared love for Ethiopian cuisine turned into late-night calls, weekend adventures, and eventually, us moving in together. We're both entrepreneurs, and having someone who understands the hustle while keeping me grounded has been a blessing.",
            quote: "I never thought I'd find someone who gets both my ambition and my need for balance. Kwame is my partner in every sense."
        },
        {
            image: story2,
            names: "Marcus & Zara",
            location: "New York, NY",
            date: "Met in March 2023",
            story: "After years of disappointing dates on other apps, I almost gave up. Then I found BlackLoveLink and matched with Marcus within my first week. We bonded over our love of jazz, Black literature, and Sunday brunch. A year later, we're planning our wedding in Martha's Vineyard.",
            quote: "Marcus showed me that the right person is worth the wait. Our connection is authentic, deep, and everything I dreamed of."
        },
        {
            image: story3,
            names: "Simone & Jamal",
            location: "Houston, TX",
            date: "Met in August 2023",
            story: "I'm a doctor, he's a software engineer. We're both workaholics who thought we didn't have time for dating. BlackLoveLink's verification process gave me confidence to open up, and Jamal's profile made me laugh out loud. Our first date was supposed to be coffee – it turned into a 6-hour conversation. Now we're engaged.",
            quote: "Jamal gets my crazy schedule and still makes me feel like a priority. That's love."
        },
        {
            image: story4,
            names: "Destiny & Andre",
            location: "Los Angeles, CA",
            date: "Met in June 2026",
            story: "As a creative director, I was skeptical about dating apps. Andre's profile stood out – he was genuine, ambitious, and had this infectious energy. We took things slow, built a real friendship first. Three months in, I knew he was different.",
            quote: "Andre is my best friend, my creative partner, and my love. I couldn't ask for more."
        }
    ];

    return (
        <div className="min-h-screen font-display bg-background text-foreground">
            <SharedNavbar />

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
                            <Heart className="w-5 h-5 text-primary fill-primary" />
                            <span className="text-primary font-semibold">Real Love, Real Stories</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">
                            Success <span className="text-gradient-brand">Stories</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Every connection has a story. Here are just a few of the thousands of couples who found authentic love on BlackLoveLink.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stories Section */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-6xl space-y-32">
                    {stories.map((story, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                        >
                            <div className="flex-1">
                                <div className="relative rounded-3xl overflow-hidden group">
                                    <img
                                        src={story.image}
                                        alt={story.names}
                                        className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h3 className="text-4xl font-black text-white mb-2">{story.names}</h3>
                                        <div className="flex flex-wrap gap-4 text-white/80">
                                            <span className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {story.location}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {story.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="relative">
                                    <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/20" />
                                    <p className="text-lg text-muted-foreground leading-relaxed pl-8">
                                        {story.story}
                                    </p>
                                </div>
                                <div className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-2xl">
                                    <p className="text-xl font-semibold text-foreground italic">
                                        "{story.quote}"
                                    </p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 bg-card">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                            You Could Be Next
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { number: loading ? "..." : formatStat(stats.successStories), label: "Success Stories" },
                            { number: loading ? "..." : formatStat(stats.messagesDaily), label: "Messages Daily" },
                            { number: loading ? "..." : formatStat(stats.satisfactionRate, true), label: "Satisfaction Rate" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-8 rounded-3xl bg-muted/50 border border-border"
                            >
                                <div className="text-5xl md:text-6xl font-black text-primary mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-xl text-foreground/70 font-semibold">
                                    {stat.label}
                                </div>
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
                            Write Your Own Story
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12">
                            Your success story starts with a single match
                        </p>
                        <Link
                            to="/auth"
                            className="inline-block rounded-full gradient-brand px-12 py-4 text-lg font-bold text-primary-foreground shadow-button transition-all hover:scale-105"
                        >
                            Start Matching Today
                        </Link>
                    </motion.div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default SuccessStoriesPage;
