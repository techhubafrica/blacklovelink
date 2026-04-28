import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Fingerprint, BookOpen, Image, AlertTriangle, Scale } from "lucide-react";
import SharedNavbar from "@/components/SharedNavbar";
import SiteFooter from "@/components/SiteFooter";

const sections = [
  {
    id: "ownership",
    icon: Fingerprint,
    title: "Platform Ownership",
    content:
      "BlackLoveLink and all of its original content, features, and functionality are owned by BlackLoveLink, Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. Our Platform is protected as a collective work under U.S. and international copyright laws.",
  },
  {
    id: "trademarks",
    icon: BookOpen,
    title: "Trademarks",
    content:
      'The BlackLoveLink name, BlackLoveLink logo, the tagline "Where Black Love Grows," and all related names, logos, product and service names, designs, and slogans are trademarks of BlackLoveLink, Inc. You may not use these marks without our prior written permission. All other names, logos, and brands are the property of their respective owners.',
  },
  {
    id: "user-content",
    icon: Image,
    title: "User Content License",
    content:
      "You retain full ownership of the content you create and share on BlackLoveLink, including photos, profile text, messages, and other materials. By posting content on the Platform, you grant BlackLoveLink a non-exclusive, worldwide, royalty-free, transferable, sublicensable license to use, reproduce, modify, distribute, and display your content solely for the purpose of operating, developing, and improving the Platform. This license ends when you delete your content or your account, except where your content has been shared with others and they have not deleted it.",
  },
  {
    id: "dmca",
    icon: AlertTriangle,
    title: "DMCA & Copyright Complaints",
    content:
      "BlackLoveLink respects the intellectual property rights of others and expects our users to do the same. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our Copyright Agent with the following information:\n\n• A physical or electronic signature of the copyright owner or authorized representative\n• A description of the copyrighted work you claim has been infringed\n• A description of where the allegedly infringing material is located on the Platform\n• Your contact information (address, phone number, and email)\n• A statement that you have a good-faith belief that the disputed use is not authorized\n• A statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner",
  },
  {
    id: "restrictions",
    icon: Scale,
    title: "Usage Restrictions",
    content:
      "You may not: reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any material from our Platform, except as permitted by these terms; use any illustrations, photographs, video or audio sequences, or any graphics separately from the accompanying text; delete or alter any copyright, trademark, or other proprietary rights notices; access or use for any commercial purposes any part of the Platform or any services or materials available through the Platform; or use any data mining, robots, or similar data gathering and extraction methods.",
  },
];

const IntellectualPropertyPage = () => {
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
              <Fingerprint className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Legal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">
              Intellectual <span className="text-gradient-brand">Property</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Learn about intellectual property rights, trademarks, copyright protections, and content usage policies at BlackLoveLink.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-4">
              Effective Date: April 28, 2026 · Last Updated: April 28, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-8 rounded-3xl bg-card border border-border scroll-mt-24"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-foreground mb-4">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Copyright Agent Contact */}
      <section className="py-16 px-6 bg-card">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 text-center"
          >
            <h2 className="text-3xl font-black text-foreground mb-4">
              Copyright Agent
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-2 leading-relaxed">
              To submit a DMCA takedown notice or intellectual property concern, contact our designated agent:
            </p>
            <p className="text-lg font-bold text-foreground mb-1">BlackLoveLink, Inc.</p>
            <p className="text-muted-foreground">Attn: Copyright Agent</p>
            <p className="text-muted-foreground mb-6">legal@blacklovelink.com</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@blacklovelink.com"
                className="rounded-full gradient-brand px-8 py-3 text-sm font-bold text-primary-foreground hover:scale-105 transition-all"
              >
                Email Legal Team
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

export default IntellectualPropertyPage;
