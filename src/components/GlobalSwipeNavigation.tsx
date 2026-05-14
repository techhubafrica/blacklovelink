import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// The sequence of the main discovery ring. It avoids /messages purposefully.
const TAB_SEQUENCE = ['/profile', '/swipe', '/likes', '/community'];

export const GlobalSwipeNavigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const touchStartRef = useRef<{ x: number, y: number, time: number } | null>(null);

  useEffect(() => {
    // Only apply logic if we are inside the ring sequence
    if (!TAB_SEQUENCE.includes(location.pathname)) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const timeDiff = Date.now() - touchStartRef.current.time;
      
      const deltaX = touchEndX - touchStartRef.current.x;
      const deltaY = touchEndY - touchStartRef.current.y;
      
      // Reset ref
      touchStartRef.current = null;

      // Must be a fast deliberate swipe (under 600ms for a real tab-switch gesture)
      if (timeDiff > 600) return;

      // ── VERTICAL BAIL-OUT ──────────────────────────────────────────────────
      // If the finger moved more than 60px vertically in either direction it's a
      // scroll gesture. Bail immediately so scrolling never triggers navigation.
      if (Math.abs(deltaY) > 60) return;

      // ── HORIZONTAL SWIPE GATE ──────────────────────────────────────────────
      // Require:
      //   • at least 80 px horizontal travel
      //   • horizontal movement must be at least 2.5× the vertical drift
      //     (much stricter than before — eliminates diagonal-scroll false fires)
      if (Math.abs(deltaX) < 80) return;
      if (Math.abs(deltaX) < Math.abs(deltaY) * 2.5) return;

      const currentIndex = TAB_SEQUENCE.indexOf(location.pathname);

      // Check if inside a horizontal scroll container (e.g. image carousels)
      let isHorizontalScrollContainer = false;
      let current = e.target as HTMLElement | null;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
          isHorizontalScrollContainer = true;
          break;
        }
        current = current.parentElement;
      }
      if (isHorizontalScrollContainer) return;

      if (deltaX < 0 && currentIndex < TAB_SEQUENCE.length - 1) {
        // Swiped left → next tab
        navigate(TAB_SEQUENCE[currentIndex + 1]);
      } else if (deltaX > 0 && currentIndex > 0) {
        // Swiped right → previous tab
        navigate(TAB_SEQUENCE[currentIndex - 1]);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [location.pathname, navigate]);

  return <>{children}</>;
};
