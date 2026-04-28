import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cookie, Settings, BarChart, Shield, Users } from "lucide-react";
import SharedNavbar from "@/components/SharedNavbar";
import SiteFooter from "@/components/SiteFooter";

const cookieTypes = [
  {
    icon: Shield,
    title: "Essential Cookies",
    description:
      "These cookies are strictly necessary for the Platform to function. They enable core features like account authentication, session management, and security protections. You cannot opt out of essential cookies as the Platform cannot function without them.",
    examples: [
      "Session authentication tokens",
      "CSRF protection tokens",
      "Load balancing identifiers",
      "Cookie consent preferences",
    ],
  },
  {
    icon: Settings,
    title: "Functional Cookies",
    description:
      "These cookies remember your preferences and settings to provide a more personalized experience. They help the Platform remember choices you've made, such as your language, theme, or notification preferences.",
    examples: [
      "Language and region preferences",
      "Theme settings (light/dark mode)",
      "Previously viewed profiles",
      "Notification preferences",
    ],
  },
  {
    icon: BarChart,
    title: "Analytics Cookies",
    description:
      "These cookies help us understand how users interact with our Platform. The data collected is aggregated and anonymous, allowing us to improve the user experience, identify popular features, and fix issues.",
    examples: [
      "Page view counts and navigation paths",
      "Feature usage statistics",
      "Error and crash reporting",
      "Performance monitoring",
    ],
  },
  {
    icon: Users,
    title: "Marketing Cookies",
    description:
      "These cookies are used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns. We may share this data with advertising partners to show you personalized ads across other platforms.",
    examples: [
      "Ad targeting and retargeting",
      "Campaign performance tracking",
      "Social media integration pixels",
      "Referral source tracking",
    ],
  },
];

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen font-display bg-background text-foreground">
      <SharedNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Cookie className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Legal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">
              Cookie <span className="text-gradient-brand">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              This policy explains how BlackLoveLink uses cookies and similar technologies when you use our platform.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-4">
              Effective Date: April 28, 2026 · Last Updated: April 28, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-card border border-border"
          >
            <h2 className="text-2xl font-black text-foreground mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cookies are small text files stored on your device when you visit a website. They serve various purposes, from remembering your login status to understanding how you interact with the Platform. Cookies may be set by BlackLoveLink ("first-party cookies") or by third-party services we use ("third-party cookies").
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Similar technologies include local storage, session storage, and tracking pixels, which serve similar functions. When we refer to "cookies" in this policy, we include all such technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16 px-6 bg-card">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Types of Cookies We Use
            </h2>
          </motion.div>

          <div className="space-y-6">
            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-muted/50 border border-border"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <cookie.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-foreground mb-3">
                      {cookie.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {cookie.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground/70">Examples:</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cookie.examples.map((example, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-card border border-border"
          >
            <h2 className="text-2xl font-black text-foreground mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can control and manage cookies through your browser settings. Most web browsers allow you to view, delete, and block cookies from websites. Please note that disabling certain cookies may impact the functionality of our Platform.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Here's how to manage cookies in popular browsers:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <strong className="text-foreground/80">Chrome:</strong> Settings → Privacy and Security → Cookies
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <strong className="text-foreground/80">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <strong className="text-foreground/80">Safari:</strong> Preferences → Privacy → Manage Website Data
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <strong className="text-foreground/80">Edge:</strong> Settings → Cookies and Site Permissions → Manage and Delete Cookies
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-card border border-border"
          >
            <h2 className="text-2xl font-black text-foreground mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we make changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-card border border-border"
          >
            <h2 className="text-2xl font-black text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about this Cookie Policy or our use of cookies, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:privacy@blacklovelink.com"
                className="rounded-full gradient-brand px-8 py-3 text-sm font-bold text-primary-foreground hover:scale-105 transition-all text-center"
              >
                privacy@blacklovelink.com
              </a>
              <Link
                to="/contact"
                className="rounded-full bg-muted border border-border px-8 py-3 text-sm font-bold text-foreground hover:bg-accent transition-all text-center"
              >
                Contact Page
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default CookiePolicyPage;
