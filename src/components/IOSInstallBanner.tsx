import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, X, Plus } from "lucide-react";

const DISMISSED_KEY = "bll_ios_banner_dismissed";

/**
 * Detects whether the user is on iOS Safari and the app is NOT running in standalone mode.
 * In that case shows a bottom-sheet "Add to Home Screen" prompt.
 */
const IOSInstallBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
      || window.matchMedia("(display-mode: standalone)").matches;
    const dismissed = localStorage.getItem(DISMISSED_KEY) === "true";

    if (isIOS && !isStandalone && !dismissed) {
      // Delay slightly so it doesn't flash on first paint
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
            onClick={dismiss}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }}
            exit={{ y: "100%", opacity: 0, transition: { duration: 0.2 } }}
            className="fixed bottom-0 left-0 right-0 z-[1000] bg-card border-t border-border rounded-t-3xl p-6 pb-safe"
            style={{ paddingBottom: `max(env(safe-area-inset-bottom), 1.5rem)` }}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-5" />

            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-button flex-shrink-0">
                <span className="text-2xl">❤️</span>
              </div>
              <div>
                <h3 className="font-black text-foreground text-lg leading-tight">Add BlackLoveLink to your Home Screen</h3>
                <p className="text-sm text-muted-foreground mt-1">Install the app for the full experience — faster, full-screen, and always ready.</p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 bg-muted/60 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-black text-primary">1</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Tap the <Share className="w-4 h-4 text-primary inline mx-0.5" /> Share button at the bottom of Safari
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-black text-primary">2</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Scroll down and tap <Plus className="w-4 h-4 text-primary inline mx-0.5" /> <strong className="text-foreground">Add to Home Screen</strong>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-black text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tap <strong className="text-foreground">Add</strong> — that's it!
                </p>
              </div>
            </div>

            <button
              onClick={dismiss}
              className="mt-4 w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default IOSInstallBanner;
