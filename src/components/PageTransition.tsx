import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '@/contexts/NavigationContext';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.05,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

const slideVariants = {
  initial: (direction: string) => ({
    x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
    opacity: 0,
  }),
  in: {
    x: 0,
    opacity: 1,
  },
  out: (direction: string) => ({
    x: direction === 'left' ? '100%' : direction === 'right' ? '-100%' : 0,
    opacity: 0,
  }),
};

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = "" 
}) => {
  const { state } = useNavigation();

  // Determine animation direction based on navigation
  const getDirection = () => {
    // Simple heuristic for slide direction
    if (state.previousPath === '/' && state.currentPath !== '/') {
      return 'right'; // Entering from home
    } else if (state.currentPath === '/' && state.previousPath !== '/') {
      return 'left'; // Going back to home
    }
    return 'none'; // Default fade
  };

  const direction = getDirection();
  const useSlide = direction !== 'none';

  // Set page title
  useEffect(() => {
    const pathTitles: Record<string, string> = {
      '/': 'Heartspun Canvas - Home',
      '/memories': 'Photo Gallery - Heartspun Canvas',
      '/music': 'Our Soundtrack - Heartspun Canvas',
      '/timeline': 'Memory Timeline - Heartspun Canvas',
      '/personalization': 'Personalization - Heartspun Canvas',
      '/surprises': 'Surprise Generator - Heartspun Canvas',
      '/gallery': 'Gallery - Heartspun Canvas',
      '/settings': 'Settings - Heartspun Canvas',
    };

    document.title = pathTitles[state.currentPath] || 'Heartspun Canvas';
  }, [state.currentPath]);

  // Add theme class to body
  useEffect(() => {
    document.body.className = `theme-${state.theme}`;
    document.documentElement.classList.remove('morning', 'evening', 'night');
    document.documentElement.classList.add(state.theme);
  }, [state.theme]);

  return (
    <motion.div
      className={`min-h-screen w-full ${className}`}
      initial={useSlide ? slideVariants.initial(direction) : pageVariants.initial}
      animate={useSlide ? slideVariants.in : pageVariants.in}
      exit={useSlide ? slideVariants.out(direction) : pageVariants.out}
      transition={pageTransition}
      custom={direction}
    >
      {children}
    </motion.div>
  );
};