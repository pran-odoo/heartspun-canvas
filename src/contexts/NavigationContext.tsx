import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationState {
  currentPath: string;
  previousPath: string;
  navigationHistory: string[];
  isTransitioning: boolean;
  canGoBack: boolean;
  theme: 'morning' | 'evening' | 'night';
}

interface NavigationContextType {
  state: NavigationState;
  navigate: (path: string, options?: { replace?: boolean; smooth?: boolean }) => void;
  goBack: () => void;
  goHome: () => void;
  setTheme: (theme: 'morning' | 'evening' | 'night') => void;
  addToHistory: (path: string) => void;
  clearHistory: () => void;
  isCurrentPath: (path: string) => boolean;
  getPageTitle: (path: string) => string;
  enableKeyboardNavigation: () => void;
  disableKeyboardNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const pathTitles: Record<string, string> = {
  '/': 'Home',
  '/memories': 'Photo Gallery',
  '/music': 'Our Soundtrack', 
  '/timeline': 'Memory Timeline',
  '/personalization': 'Personalization',
  '/surprises': 'Surprise Generator',
  '/gallery': 'Gallery',
  '/settings': 'Settings',
};

const getTimeBasedTheme = (): 'morning' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return 'morning';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [state, setState] = useState<NavigationState>({
    currentPath: location.pathname,
    previousPath: '/',
    navigationHistory: [location.pathname],
    isTransitioning: false,
    canGoBack: false,
    theme: getTimeBasedTheme(),
  });

  const [keyboardNavEnabled, setKeyboardNavEnabled] = useState(true);

  // Update current path when location changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      previousPath: prev.currentPath,
      currentPath: location.pathname,
      canGoBack: prev.navigationHistory.length > 1,
    }));
  }, [location.pathname]);

  // Auto-update theme based on time
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        theme: getTimeBasedTheme(),
      }));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!keyboardNavEnabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't interfere with form inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          navigateToPath('/');
          break;
        case 'ArrowLeft':
          if (event.altKey) {
            event.preventDefault();
            goBack();
          }
          break;
        case 'ArrowRight':
          if (event.altKey) {
            // Could implement forward navigation
            event.preventDefault();
          }
          break;
        case 'h':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            navigateToPath('/');
          }
          break;
        case '1':
          if (event.altKey) {
            event.preventDefault();
            navigateToPath('/memories');
          }
          break;
        case '2':
          if (event.altKey) {
            event.preventDefault();
            navigateToPath('/music');
          }
          break;
        case '3':
          if (event.altKey) {
            event.preventDefault();
            navigateToPath('/timeline');
          }
          break;
        case '4':
          if (event.altKey) {
            event.preventDefault();
            navigateToPath('/surprises');
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [keyboardNavEnabled]);

  const navigateToPath = useCallback((path: string, options: { replace?: boolean; smooth?: boolean } = {}) => {
    setState(prev => ({
      ...prev,
      isTransitioning: true,
    }));

    // Add smooth transition delay
    if (options.smooth !== false) {
      setTimeout(() => {
        navigate(path, { replace: options.replace });
        setState(prev => ({
          ...prev,
          isTransitioning: false,
        }));
      }, 150);
    } else {
      navigate(path, { replace: options.replace });
      setState(prev => ({
        ...prev,
        isTransitioning: false,
      }));
    }
  }, [navigate]);

  const addToHistory = useCallback((path: string) => {
    setState(prev => ({
      ...prev,
      navigationHistory: [...prev.navigationHistory.filter(p => p !== path), path].slice(-10), // Keep last 10
      canGoBack: true,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      const history = [...prev.navigationHistory];
      history.pop(); // Remove current
      const previousPath = history[history.length - 1] || '/';
      
      return {
        ...prev,
        navigationHistory: history,
        canGoBack: history.length > 1,
      };
    });
    
    const previousPath = state.navigationHistory[state.navigationHistory.length - 2] || '/';
    navigateToPath(previousPath);
  }, [state.navigationHistory, navigateToPath]);

  const goHome = useCallback(() => {
    navigateToPath('/');
  }, [navigateToPath]);

  const setTheme = useCallback((theme: 'morning' | 'evening' | 'night') => {
    setState(prev => ({
      ...prev,
      theme,
    }));

    // Apply theme to document
    document.documentElement.classList.remove('morning', 'evening', 'night');
    document.documentElement.classList.add(theme);
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      navigationHistory: [prev.currentPath],
      canGoBack: false,
    }));
  }, []);

  const isCurrentPath = useCallback((path: string) => {
    return state.currentPath === path;
  }, [state.currentPath]);

  const getPageTitle = useCallback((path: string) => {
    return pathTitles[path] || 'Unknown Page';
  }, []);

  const enableKeyboardNavigation = useCallback(() => {
    setKeyboardNavEnabled(true);
  }, []);

  const disableKeyboardNavigation = useCallback(() => {
    setKeyboardNavEnabled(false);
  }, []);

  // Track navigation changes for history
  useEffect(() => {
    addToHistory(location.pathname);
  }, [location.pathname, addToHistory]);

  const contextValue: NavigationContextType = {
    state,
    navigate: navigateToPath,
    goBack,
    goHome,
    setTheme,
    addToHistory,
    clearHistory,
    isCurrentPath,
    getPageTitle,
    enableKeyboardNavigation,
    disableKeyboardNavigation,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};