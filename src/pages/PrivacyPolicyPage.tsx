import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Clock, Mail } from "lucide-react";
import SharedNavbar from "@/components/SharedNavbar";
import SiteFooter from "@/components/SiteFooter";

const PrivacyPolicyPage = () => {
  const upcomingSections = [
    "Information We Collect",
    "How We Use Your Information",
    "How We Share Your Information",
    "Data Retention & Deletion",
    "Your Privacy Rights",
    "Cookies & Tracking Technologies",
    "Children's Privacy",
    "International Data Transfers",
    "Changes to This Policy",
  ];

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
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Legal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">
              Privacy <span className="text-gradient-brand">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your privacy matters to us. We are committed to protecting the personal information you share on BlackLoveLink.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-4">
              Policy Under Review
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
              Our legal team is finalizing our comprehensive Privacy Policy. This page will be updated with the full document soon.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Last updated: Coming soon
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Will Be Covered */}
      <section className="py-16 px-6 bg-card">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              What Our Policy Will Cover
            </h2>
            <p className="text-lg text-muted-foreground">
              Here's a preview of the topics our Privacy Policy will address
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-muted/50 border border-border"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-foreground font-medium">{section}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-black text-foreground mb-4">
              Questions About Your Privacy?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              If you have any questions or concerns about how we handle your data, please don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@blacklovelink.com"
                className="rounded-full gradient-brand px-8 py-3 text-sm font-bold text-primary-foreground hover:scale-105 transition-all"
              >
                privacy@blacklovelink.com
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

export default PrivacyPolicyPage;
