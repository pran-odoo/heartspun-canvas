import { useEffect } from 'react';

/**
 * Critical Fix for Tab Switching Blur Bug
 * 
 * This component handles the critical issue where switching tabs causes
 * the entire website to become blurred until refresh. It manages:
 * - Proper visibility change detection
 * - Backdrop-filter cleanup on tab switch
 * - Focus/blur state management
 * - CSS filter property reset
 */
export const TabSwitchingFix: React.FC = () => {
  useEffect(() => {
    // Handle tab switching and window focus changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reset any persistent blur effects that may stick
        document.body.style.filter = 'none';
        document.body.style.backdropFilter = 'none';
        
        // Reset any elements that might have stuck backdrop filters
        const elementsWithBackdrop = document.querySelectorAll('[style*="backdrop-filter"]');
        elementsWithBackdrop.forEach((element: any) => {
          // Only reset if it's not intentionally blurred by user interaction
          if (!element.dataset.intentionalBlur) {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.backdropFilter && computedStyle.backdropFilter !== 'none') {
              // Re-trigger any React state that controls the backdrop filter
              element.style.transition = 'backdrop-filter 0.1s ease';
              element.style.backdropFilter = 'none';
              setTimeout(() => {
                element.style.backdropFilter = '';
                element.style.transition = '';
              }, 100);
            }
          }
        });
        
        // Force a repaint to ensure clean state
        document.body.offsetHeight; // Trigger reflow
      }
    };

    // Handle window focus events (for non-tab scenarios)
    const handleWindowFocus = () => {
      // Clear any stuck filters on window focus
      document.body.style.filter = 'none';
      document.body.style.backdropFilter = 'none';
      
      // Reset any global blur effects
      const blurredElements = document.querySelectorAll('[style*="blur"]');
      blurredElements.forEach((element: any) => {
        if (!element.dataset.intentionalBlur) {
          element.style.filter = element.style.filter.replace(/blur\([^)]*\)/g, '');
          element.style.backdropFilter = element.style.backdropFilter.replace(/blur\([^)]*\)/g, '');
        }
      });
    };

    // Handle window blur (when switching away)
    const handleWindowBlur = () => {
      // Mark that we're about to lose focus - this can help prevent stuck states
      document.body.dataset.windowBlurred = 'true';
    };

    const handleWindowFocusEvent = () => {
      // Clean up blur state when returning
      delete document.body.dataset.windowBlurred;
      handleWindowFocus();
    };

    // Additional safety: Handle page show event (back/forward navigation)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from cache, ensure clean state
        handleVisibilityChange();
      }
    };

    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocusEvent);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('pageshow', handlePageShow);

    // Initial cleanup on mount
    handleVisibilityChange();

    return () => {
      // Clean up event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocusEvent);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('pageshow', handlePageShow);
      
      // Final cleanup
      document.body.style.filter = 'none';
      document.body.style.backdropFilter = 'none';
      delete document.body.dataset.windowBlurred;
    };
  }, []);

  // This component doesn't render anything, it just handles the fix
  return null;
};

/**
 * Hook for components that use backdrop-filter to ensure proper cleanup
 */
export const useBackdropFilterCleanup = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Mark elements with intentional backdrop filters to prevent cleanup
        const backdropElements = document.querySelectorAll('[style*="backdrop-filter"]');
        backdropElements.forEach((element: any) => {
          element.dataset.intentionalBlur = 'true';
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};