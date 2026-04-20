import React, { useState, useEffect } from "react";
import { Share, PlusSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface InstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-card border border-border/50 shadow-2xl rounded-[2rem] p-6 sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg mb-6">
              <span className="text-white font-black text-2xl tracking-tight">BLL</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Install BlackLoveLink</h3>
            <p className="text-muted-foreground mb-8">
              Install our app on your iPhone for the best, fastest, and most immersive experience.
            </p>

            <div className="w-full space-y-4 bg-muted/30 p-5 rounded-2xl border border-border/40">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-black/50 flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                  <span className="font-bold text-foreground">1</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Tap the Share icon at the bottom of Safari</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-blue-500">
                  <Share className="w-6 h-6" />
                </div>
              </div>

              <div className="w-px h-6 bg-border mx-auto ml-5" />

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-black/50 flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                  <span className="font-bold text-foreground">2</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">Scroll down and tap "Add to Home Screen"</p>
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-foreground">
                  <PlusSquare className="w-6 h-6" />
                </div>
              </div>
            </div>

            <Button onClick={onClose} className="w-full mt-8 rounded-xl h-12 text-base font-bold">
              Got it!
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InstallPrompt;
