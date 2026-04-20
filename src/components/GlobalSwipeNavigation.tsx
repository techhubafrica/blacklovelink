import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// The sequence of the main discovery ring. It avoids /messages purposefully.
const TAB_SEQUENCE = ['/profile', '/swipe', '/likes', '/community'];

// Helper to find if the element is at the very bottom of its scrollable parent
const isAtBottom = (el: HTMLElement | null): boolean => {
  let current: HTMLElement | null = el;
  while (current && current !== document.body && current !== document.documentElement) {
    // If it has overflow-y auto/scroll, check its boundaries
    const style = window.getComputedStyle(current);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflowY === 'overlay') {
      return current.scrollTop + current.clientHeight >= current.scrollHeight - 30;
    }
    current = current.parentElement;
  }
  // Fallback to window scroll check
  return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 30;
};

// Helper for top
const isAtTop = (el: HTMLElement | null): boolean => {
  let current: HTMLElement | null = el;
  while (current && current !== document.body && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflowY === 'overlay') {
      return current.scrollTop <= 30;
    }
    current = current.parentElement;
  }
  return window.scrollY <= 30;
};

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

      // Check vertical pull up/down at boundaries
      if (Math.abs(deltaY) > 80 && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < 0) {
          // Swiped UP (pulled bottom to see more) = go next
          if (isAtBottom(e.target as HTMLElement)) {
            goNext();
          }
        } else {
          // Swiped DOWN (pulled top to go back) = go prev
          if (isAtTop(e.target as HTMLElement)) {
             goPrev();
          }
        }
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
