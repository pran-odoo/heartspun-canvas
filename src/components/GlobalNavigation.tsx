import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Home, ArrowLeft, Menu, X, Compass, History, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/contexts/NavigationContext';

interface SwipeGestureProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  children: React.ReactNode;
}

const SwipeGestureWrapper: React.FC<SwipeGestureProps> = ({ onSwipeRight, onSwipeLeft, children }) => {
  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    const velocityThreshold = 500;
    
    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
      if (info.offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (info.offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
  }, [onSwipeRight, onSwipeLeft]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

const Breadcrumbs: React.FC = () => {
  const { state, navigate, getPageTitle } = useNavigation();
  const pathSegments = state.currentPath.split('/').filter(Boolean);
  
  return (
    <motion.nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <button
        onClick={() => navigate('/')}
        className="hover:text-romantic transition-colors flex items-center"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </button>
      
      {pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        
        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-3 h-3" />
            <button
              onClick={() => !isLast && navigate(path)}
              className={`transition-colors ${
                isLast 
                  ? 'text-romantic font-medium' 
                  : 'hover:text-romantic'
              }`}
              disabled={isLast}
            >
              {getPageTitle(path)}
            </button>
          </React.Fragment>
        );
      })}
    </motion.nav>
  );
};

const NavigationHistory: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { state, navigate } = useNavigation();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass-romantic rounded-2xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-romantic font-semibold text-romantic">Navigation History</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {state.navigationHistory.slice().reverse().map((path, index) => (
                <motion.button
                  key={`${path}-${index}`}
                  onClick={() => {
                    navigate(path);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all hover:bg-romantic/10 ${
                    path === state.currentPath ? 'bg-romantic/20 text-romantic' : 'text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span>{getPageTitle(path)}</span>
                    <span className="text-xs opacity-60">{path}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const GlobalNavigation: React.FC = () => {
  const { state, goBack, goHome, navigate } = useNavigation();
  const [showHistory, setShowHistory] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide navigation on scroll (mobile)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSwipeRight = useCallback(() => {
    if (state.canGoBack) {
      goBack();
    } else {
      goHome();
    }
  }, [state.canGoBack, goBack, goHome]);

  const handleSwipeLeft = useCallback(() => {
    // Could implement forward navigation or menu
    console.log('Swiped left - could open menu');
  }, []);

  const isHomePage = state.currentPath === '/';

  return (
    <>
      {/* Swipe Gesture Wrapper for entire app */}
      <SwipeGestureWrapper onSwipeRight={handleSwipeRight} onSwipeLeft={handleSwipeLeft}>
        <div className="min-h-screen">
          {/* Top Navigation Bar */}
          <motion.header
            className={`fixed top-0 left-0 right-0 z-40 glass-romantic backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${
              isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
              {/* Left side - Back navigation */}
              <div className="flex items-center space-x-3">
                <AnimatePresence mode="wait">
                  {!isHomePage && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goBack}
                        disabled={!state.canGoBack}
                        className="glass hover-lift btn-smooth text-romantic hover:bg-romantic/20"
                        title={`Go back (Alt+←)`}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Breadcrumbs />
              </div>

              {/* Right side - Home and history */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                  className="glass hover-lift btn-smooth text-romantic hover:bg-romantic/20"
                  title="Navigation History"
                >
                  <History className="w-4 h-4" />
                </Button>
                
                {!isHomePage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goHome}
                    className="glass hover-lift btn-smooth text-romantic hover:bg-romantic/20"
                    title="Go Home (Esc)"
                  >
                    <Home className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.header>

          {/* Floating Home Button (Mobile) */}
          <AnimatePresence>
            {!isHomePage && (
              <motion.div
                className="fixed bottom-6 left-6 z-40 md:hidden"
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0.7, 
                  scale: 1, 
                  x: 0,
                  y: isVisible ? 0 : 10
                }}
                exit={{ opacity: 0, scale: 0, x: -20 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <Button
                  onClick={goHome}
                  className="w-14 h-14 glass-romantic rounded-full shadow-lg hover-lift btn-smooth"
                  title="Go Home"
                >
                  <Home className="w-6 h-6 text-romantic" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Back Button (Mobile) */}
          <AnimatePresence>
            {!isHomePage && state.canGoBack && (
              <motion.div
                className="fixed bottom-6 right-6 z-40 md:hidden"
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0.7, 
                  scale: 1, 
                  x: 0,
                  y: isVisible ? 0 : 10
                }}
                exit={{ opacity: 0, scale: 0, x: 20 }}
                transition={{ type: "spring", damping: 20, delay: 0.1 }}
              >
                <Button
                  onClick={goBack}
                  className="w-14 h-14 glass rounded-full shadow-lg hover-lift btn-smooth"
                  title="Go Back"
                >
                  <ArrowLeft className="w-6 h-6 text-muted-foreground" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Transition Indicator */}
          <AnimatePresence>
            {state.isTransitioning && (
              <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-romantic via-gold to-primary z-50"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Keyboard Navigation Hints */}
          <motion.div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <div className="glass rounded-lg px-3 py-1 text-xs text-muted-foreground text-center">
              Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> for Home • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Alt+←</kbd> to go Back
            </div>
          </motion.div>

          {/* Content with proper padding */}
          <main className="pt-20">
            {/* This is where the routed content will appear */}
          </main>
        </div>
      </SwipeGestureWrapper>

      {/* Navigation History Modal */}
      <NavigationHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
};