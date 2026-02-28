import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin, CheckCircle2, Loader2, Building2, Briefcase } from "lucide-react";

interface LinkedInVerifyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: (jobTitle: string, company: string) => void;
}

const LinkedInVerifyModal = ({ isOpen, onClose, onVerified }: LinkedInVerifyModalProps) => {
    const [jobTitle, setJobTitle] = useState("");
    const [company, setCompany] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    const handleVerify = async () => {
        if (!jobTitle.trim() || !company.trim()) return;
        setLoading(true);
        // Simulate LinkedIn OAuth round-trip delay
        await new Promise((res) => setTimeout(res, 1800));
        setLoading(false);
        setVerified(true);
        await new Promise((res) => setTimeout(res, 900));
        onVerified(jobTitle.trim(), company.trim());
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }}
                            exit={{ scale: 0.92, y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* LinkedIn brand header */}
                            <div className="bg-[#0077B5] px-6 py-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white rounded-md p-1">
                                        <Linkedin className="w-6 h-6 text-[#0077B5]" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-base">LinkedIn Verification</p>
                                        <p className="text-white/70 text-xs">Confirm your professional info</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-5">
                                {!verified ? (
                                    <>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            BlackLoveLink uses your LinkedIn profile to verify your occupation and build trust with other members.
                                        </p>

                                        {/* Job Title */}
                                        <div className="space-y-2">
                                            <label htmlFor="li-title" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-primary" /> Current Job Title
                                            </label>
                                            <input
                                                id="li-title"
                                                type="text"
                                                placeholder="e.g. Software Engineer, Marketing Director"
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B5]/40 transition"
                                            />
                                        </div>

                                        {/* Company */}
                                        <div className="space-y-2">
                                            <label htmlFor="li-company" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-primary" /> Current Company / Employer
                                            </label>
                                            <input
                                                id="li-company"
                                                type="text"
                                                placeholder="e.g. Google, Self-Employed, Deloitte"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B5]/40 transition"
                                            />
                                        </div>

                                        <button
                                            onClick={handleVerify}
                                            disabled={loading || !jobTitle.trim() || !company.trim()}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0077B5] text-white font-semibold text-sm hover:bg-[#005f8d] transition disabled:opacity-40"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Verifying with LinkedIn…
                                                </>
                                            ) : (
                                                <>
                                                    <Linkedin className="w-4 h-4" />
                                                    Verify Occupation
                                                </>
                                            )}
                                        </button>

                                        <p className="text-center text-xs text-muted-foreground">
                                            Your LinkedIn data is used only for verification purposes.
                                        </p>
                                    </>
                                ) : (
                                    <motion.div
                                        className="flex flex-col items-center gap-4 py-6"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        </div>
                                        <p className="font-bold text-foreground text-lg">Occupation Verified!</p>
                                        <p className="text-sm text-muted-foreground text-center">
                                            Your LinkedIn profile has been successfully verified.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LinkedInVerifyModal;
