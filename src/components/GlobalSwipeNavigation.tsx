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

      // Must be a fast deliberate swipe (under 1 second)
      if (timeDiff > 1000) return;

      const currentIndex = TAB_SEQUENCE.indexOf(location.pathname);
      const goNext = () => {
        if (currentIndex < TAB_SEQUENCE.length - 1) {
          navigate(TAB_SEQUENCE[currentIndex + 1]);
        }
      };
      
      const goPrev = () => {
        if (currentIndex > 0) {
          navigate(TAB_SEQUENCE[currentIndex - 1]);
        }
      };

      // Check horizontal swipe first (more deliberate)
      if (Math.abs(deltaX) > 120 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        // Find if target is part of a horizontal scroll container (like a carousel), ignore if so
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

        if (!isHorizontalScrollContainer) {
            if (deltaX < 0) {
            // Swiped left = go to next
            goNext();
            } else {
            // Swiped right = go to prev
            goPrev();
            }
            return;
        }
      }

      // Vertical scrolling is left to native behavior — no page navigation on vertical swipe.
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
