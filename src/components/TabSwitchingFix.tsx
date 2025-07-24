import { useEffect, useRef } from 'react';

/**
 * COMPREHENSIVE BLUR ELIMINATION SYSTEM
 * 
 * This component handles ALL blur-related issues:
 * - Tab switching blur: Website blurs when switching tabs and returning
 * - Long page stay blur: Blur accumulation over extended time periods
 * - General focus issues: Various interactions causing persistent blur
 * - Automatic blur detection: Periodic monitoring and cleanup
 * - Performance optimization: Prevents filter accumulation
 */
export const TabSwitchingFix: React.FC = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isBlurPreventionActive = useRef(true);

  useEffect(() => {
    // Comprehensive filter reset function
    const resetAllFilters = () => {
      if (!isBlurPreventionActive.current) return;

      try {
        // Reset document-level filters
        document.body.style.filter = 'none';
        document.body.style.backdropFilter = 'none';
        document.documentElement.style.filter = 'none';
        document.documentElement.style.backdropFilter = 'none';

        // Reset any elements with accumulated backdrop filters
        const elementsWithBackdrop = document.querySelectorAll('[style*="backdrop-filter"], [style*="filter"]');
        elementsWithBackdrop.forEach((element: any) => {
          if (!element.dataset.intentionalBlur && !element.dataset.preserveFilter) {
            // Check if this element has stuck filters
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.backdropFilter && computedStyle.backdropFilter !== 'none') {
              element.style.transition = 'backdrop-filter 0.1s ease';
              element.style.backdropFilter = 'none';
              setTimeout(() => {
                element.style.backdropFilter = '';
                element.style.transition = '';
              }, 100);
            }
            if (computedStyle.filter && computedStyle.filter !== 'none' && !computedStyle.filter.includes('drop-shadow')) {
              element.style.filter = element.style.filter.replace(/blur\([^)]*\)/g, '');
            }
          }
        });

        // Force repaint to ensure clean state
        document.body.offsetHeight; // Trigger reflow
      } catch (error) {
        console.warn('Blur reset encountered an error:', error);
      }
    };

    // Enhanced visibility change handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // More aggressive reset when tab becomes visible
        setTimeout(() => {
          resetAllFilters();
          // Double-check after a short delay
          setTimeout(resetAllFilters, 100);
        }, 50);
      }
    };

    // Window focus event handler
    const handleWindowFocus = () => {
      resetAllFilters();
      // Additional reset after focus to catch any remaining issues
      setTimeout(resetAllFilters, 200);
    };

    // Window blur handler (when losing focus)
    const handleWindowBlur = () => {
      document.body.dataset.windowBlurred = 'true';
    };

    // Page show handler (for back/forward navigation)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page restored from cache - comprehensive reset
        resetAllFilters();
        setTimeout(resetAllFilters, 300);
      }
    };

    // Mouse move handler to detect user activity
    const handleMouseMove = () => {
      if (document.body.dataset.windowBlurred === 'true') {
        delete document.body.dataset.windowBlurred;
        resetAllFilters();
      }
    };

    // PERIODIC BLUR PREVENTION (for long page stays)
    const startPeriodicBlurPrevention = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Check and reset filters every 30 seconds
      intervalRef.current = setInterval(() => {
        if (document.visibilityState === 'visible' && isBlurPreventionActive.current) {
          resetAllFilters();
        }
      }, 30000); // Every 30 seconds
    };

    // Resize handler to reset after layout changes
    const handleResize = () => {
      setTimeout(resetAllFilters, 100);
    };

    // Set up all event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Start periodic monitoring
    startPeriodicBlurPrevention();

    // Initial cleanup on mount
    resetAllFilters();

    // Additional safety: reset after initial render
    setTimeout(resetAllFilters, 1000);

    return () => {
      // Mark blur prevention as inactive
      isBlurPreventionActive.current = false;

      // Clean up event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);

      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Final cleanup
      try {
        document.body.style.filter = 'none';
        document.body.style.backdropFilter = 'none';
        delete document.body.dataset.windowBlurred;
      } catch (error) {
        console.warn('Final blur cleanup error:', error);
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
};

/**
 * Enhanced hook for components that use backdrop-filter to ensure proper cleanup
 */
export const useBackdropFilterCleanup = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Mark elements with intentional backdrop filters to prevent cleanup
        const backdropElements = document.querySelectorAll('[style*="backdrop-filter"]');
        backdropElements.forEach((element: any) => {
          if (element.dataset.preserveFilter !== 'true') {
            element.dataset.intentionalBlur = 'true';
          }
        });
      } else {
        // Clean up markers when page becomes visible
        setTimeout(() => {
          const markedElements = document.querySelectorAll('[data-intentional-blur="true"]');
          markedElements.forEach((element: any) => {
            delete element.dataset.intentionalBlur;
          });
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

/**
 * Utility function to mark elements that should preserve their filters
 */
export const preserveFilterOnElement = (element: HTMLElement) => {
  element.dataset.preserveFilter = 'true';
};

/**
 * Utility function to safely apply backdrop filters without interference
 */
export const applySafeBackdropFilter = (element: HTMLElement, filter: string) => {
  preserveFilterOnElement(element);
  element.style.backdropFilter = filter;
};