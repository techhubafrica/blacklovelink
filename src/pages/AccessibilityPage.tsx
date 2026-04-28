import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Accessibility, Eye, Ear, Hand, Monitor, MessageSquare, CheckCircle2 } from "lucide-react";
import SharedNavbar from "@/components/SharedNavbar";
import SiteFooter from "@/components/SiteFooter";

const commitments = [
  {
    icon: Eye,
    title: "Visual Accessibility",
    items: [
      "High contrast color ratios meeting WCAG 2.1 AA standards",
      "Scalable text that responds to browser font-size settings",
      "Alt text on all meaningful images and icons",
      "Dark and light mode support for visual comfort",
      "Clear visual focus indicators for keyboard navigation",
    ],
  },
  {
    icon: Hand,
    title: "Motor Accessibility",
    items: [
      "Full keyboard navigation support throughout the platform",
      "Large, well-spaced touch targets on mobile devices",
      "No time-limited interactions that could disadvantage users",
      "Skip navigation links for quick content access",
      "Swipe gestures paired with button alternatives",
    ],
  },
  {
    icon: Ear,
    title: "Auditory Accessibility",
    items: [
      "No audio-only content without text alternatives",
      "Visual notifications for all alerts and messages",
      "Captions on any video content",
      "No sound required to use any Platform feature",
    ],
  },
  {
    icon: Monitor,
    title: "Technology Compatibility",
    items: [
      "Compatible with popular screen readers (NVDA, JAWS, VoiceOver)",
      "Proper ARIA labels and landmarks throughout the interface",
      "Semantic HTML for clear document structure",
      "Responsive design across all device sizes",
      "Progressive enhancement for older browsers",
    ],
  },
];

const AccessibilityPage = () => {
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
              <Accessibility className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Inclusion</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">
              Accessibility <span className="text-gradient-brand">Statement</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              BlackLoveLink is committed to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-card border border-border"
          >
            <h2 className="text-2xl font-black text-foreground mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe that love should be accessible to everyone. BlackLoveLink strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines provide a framework for making web content more accessible to people with disabilities, including visual, auditory, motor, and cognitive impairments.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our team actively works to audit the Platform, identify barriers, and implement improvements to ensure an inclusive experience for all users.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="py-16 px-6 bg-card">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Accessibility Features
            </h2>
            <p className="text-lg text-muted-foreground">
              How we make BlackLoveLink accessible for everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commitments.map((commitment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <commitment.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-black text-foreground">{commitment.title}</h3>
                </div>
                <ul className="space-y-3">
                  {commitment.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Known Limitations */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-card border border-border"
          >
            <h2 className="text-2xl font-black text-foreground mb-4">Known Limitations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While we strive for full accessibility, some areas of the Platform may have limitations we are actively working to address:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                Some third-party integrations may not fully meet WCAG standards
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                Certain interactive animations may not reduce motion for all user preferences
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                User-generated content (profile photos, bios) may lack alt-text
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Report Issues */}
      <section className="py-16 px-6 bg-card">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 text-center"
          >
            <MessageSquare className="w-14 h-14 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-black text-foreground mb-4">
              Report an Accessibility Issue
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              We value your feedback. If you encounter any accessibility barriers while using BlackLoveLink, please let us know so we can address them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:accessibility@blacklovelink.com"
                className="rounded-full gradient-brand px-8 py-3 text-sm font-bold text-primary-foreground hover:scale-105 transition-all"
              >
                accessibility@blacklovelink.com
              </a>
              <Link
                to="/contact"
                className="rounded-full bg-muted border border-border px-8 py-3 text-sm font-bold text-foreground hover:bg-accent transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default AccessibilityPage;
