import { useState, useEffect } from "react";

// The BeforeInstallPromptEvent interface is not standard in lib.dom.d.ts yet
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallPrompt(null);
      }
    }
  };

  return {
    isInstallable: installPrompt !== null,
    isIOS,
    isStandalone,
    promptInstall,
  };
}
