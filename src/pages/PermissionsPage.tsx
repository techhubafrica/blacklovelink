import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bell, ChevronRight, Shield, Heart } from "lucide-react";

type PermStep = "location" | "notifications" | "done";

const PermissionsPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<PermStep>("location");
    const [locationGranted, setLocationGranted] = useState<boolean | null>(null);

    const handleLocation = async (allow: boolean) => {
        if (allow) {
            try {
                await new Promise<GeolocationPosition>((resolve, reject) =>
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
                );
                setLocationGranted(true);
            } catch {
                setLocationGranted(false);
            }
        } else {
            setLocationGranted(false);
        }
        setStep("notifications");
    };

    const handleNotifications = async (allow: boolean) => {
        if (allow && "Notification" in window) {
            await Notification.requestPermission();
        }
        setStep("done");
        // Brief pause to show completion before navigating
        setTimeout(() => navigate("/swipe"), 900);
    };

    const fadeUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 font-display">
            <div className="w-full max-w-md">

                {/* Logo / brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-brand mb-5 shadow-glow">
                        <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Almost there</p>
                    <h1 className="text-3xl font-black text-foreground mt-1">
                        One last <span className="text-gradient-brand">step</span>
                    </h1>
                </div>

                {/* Step dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {(["location", "notifications", "done"] as PermStep[]).map((s, i) => (
                        <div
                            key={s}
                            className={`rounded-full transition-all duration-300 ${step === s ? "w-8 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-border"
                                }`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ─── Location ─── */}
                    {step === "location" && (
                        <motion.div key="location" {...fadeUp} className="space-y-6">
                            <div className="rounded-3xl bg-card border border-border p-8 text-center space-y-5">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <MapPin className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Enable Location</h2>
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        BlackLoveLink uses your location to suggest nearby matches and
                                        proximity-based connections — so you can meet people who are
                                        actually close to you.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 bg-muted/60 rounded-2xl p-4 text-left space-y-2">
                                    {[
                                        "Find matches in your area",
                                        "Distance shown on profile cards",
                                        "City-level accuracy only — never shared",
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <motion.button
                                    onClick={() => handleLocation(true)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl gradient-brand text-primary-foreground font-bold text-base shadow-button hover:opacity-90 transition"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <MapPin className="w-5 h-5" />
                                    Allow Location Access
                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                </motion.button>
                                <button
                                    onClick={() => handleLocation(false)}
                                    className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── Notifications ─── */}
                    {step === "notifications" && (
                        <motion.div key="notifications" {...fadeUp} className="space-y-6">
                            {locationGranted !== null && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className={`rounded-full px-4 py-2 text-center text-sm font-medium ${locationGranted
                                            ? "bg-green-500/10 text-green-600"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {locationGranted ? "📍 Location access granted" : "Location skipped"}
                                </motion.div>
                            )}

                            <div className="rounded-3xl bg-card border border-border p-8 text-center space-y-5">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <Bell className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Stay in the Loop</h2>
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        Never miss a spark. Get instant notifications for new matches,
                                        messages, and profile interactions.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 bg-muted/60 rounded-2xl p-4 text-left space-y-2">
                                    {[
                                        "New match alerts",
                                        "Incoming messages",
                                        "Profile likes and super-likes",
                                        "Match suggestions curated for you",
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Bell className="w-4 h-4 text-primary flex-shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <motion.button
                                    onClick={() => handleNotifications(true)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl gradient-brand text-primary-foreground font-bold text-base shadow-button hover:opacity-90 transition"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <Bell className="w-5 h-5" />
                                    Enable Notifications
                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                </motion.button>
                                <button
                                    onClick={() => handleNotifications(false)}
                                    className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── Done ─── */}
                    {step === "done" && (
                        <motion.div
                            key="done"
                            {...fadeUp}
                            className="flex flex-col items-center gap-6 py-8 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, transition: { type: "spring", stiffness: 260, damping: 18 } }}
                                className="w-24 h-24 rounded-full gradient-brand flex items-center justify-center shadow-glow"
                            >
                                <Heart className="w-12 h-12 text-primary-foreground" fill="currentColor" />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-black text-foreground">You're all set! 🎉</h2>
                                <p className="mt-2 text-muted-foreground">
                                    Taking you to your matches…
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PermissionsPage;
