import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface AdaptiveCursorProps {
  className?: string;
}

interface CursorState {
  isVisible: boolean;
  isDarkBackground: boolean;
  scrollPosition: number;
  isOverInteractive: boolean;
}

export const AdaptiveCursor: React.FC<AdaptiveCursorProps> = ({ className = '' }) => {
  const [cursorState, setCursorState] = useState<CursorState>({
    isVisible: true,
    isDarkBackground: true,
    scrollPosition: 0,
    isOverInteractive: false
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const lastMoveRef = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Detect background darkness by sampling pixels
  const detectBackgroundDarkness = (x: number, y: number): boolean => {
    try {
      // Create a temporary canvas to sample the background
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 1;
      tempCanvas.height = 1;
      const ctx = tempCanvas.getContext('2d');
      
      if (!ctx) return true;

      // Get the element at the cursor position
      const element = document.elementFromPoint(x, y);
      if (!element) return true;

      // Check computed styles
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;
      const backgroundImage = computedStyle.backgroundImage;

      // If it has a dark class or dark background
      if (element.classList.contains('bg-black') || 
          element.classList.contains('dark') ||
          backgroundColor.includes('0, 0, 0') ||
          backgroundColor.includes('rgba(0, 0, 0')) {
        return true;
      }

      // Check for lightning or galaxy backgrounds
      if (element.closest('.lightning-background') || 
          element.closest('.galaxy-background') ||
          element.closest('[data-background="dark"]')) {
        return true;
      }

      return false;
    } catch (error) {
      return true; // Default to dark background
    }
  };

  // Check if cursor is over interactive element
  const checkInteractiveElement = (x: number, y: number): boolean => {
    const element = document.elementFromPoint(x, y);
    if (!element) return false;

    return !!(
      element.closest('button') ||
      element.closest('a') ||
      element.closest('[role="button"]') ||
      element.closest('.cursor-pointer') ||
      element.closest('input') ||
      element.closest('textarea') ||
      element.closest('[data-interactive]') ||
      window.getComputedStyle(element).cursor === 'pointer'
    );
  };

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      lastMoveRef.current = Date.now();
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Update cursor state
      setCursorState(prev => ({
        ...prev,
        isVisible: true,
        isDarkBackground: detectBackgroundDarkness(e.clientX, e.clientY),
        isOverInteractive: checkInteractiveElement(e.clientX, e.clientY)
      }));

      // Hide cursor after inactivity
      timeoutRef.current = setTimeout(() => {
        setCursorState(prev => ({ ...prev, isVisible: false }));
      }, 3000);
    };

    const handleScroll = () => {
      setCursorState(prev => ({
        ...prev,
        scrollPosition: window.scrollY,
        isDarkBackground: detectBackgroundDarkness(mouseX.get(), mouseY.get())
      }));
    };

    const handleMouseLeave = () => {
      setCursorState(prev => ({ ...prev, isVisible: false }));
    };

    const handleMouseEnter = () => {
      setCursorState(prev => ({ ...prev, isVisible: true }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [mouseX, mouseY]);

  // Get adaptive cursor styles
  const getCursorStyles = () => {
    const { isDarkBackground, isOverInteractive } = cursorState;
    
    if (isOverInteractive) {
      return {
        size: 40,
        color: isDarkBackground ? '#ffffff' : '#000000',
        borderColor: isDarkBackground ? '#00d4ff' : '#0066cc',
        backgroundColor: isDarkBackground ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 102, 204, 0.2)',
        borderWidth: 2,
        blur: 0
      };
    }

    return {
      size: 20,
      color: isDarkBackground ? '#ffffff' : '#000000',
      borderColor: isDarkBackground ? '#ffffff' : '#000000',
      backgroundColor: isDarkBackground ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      borderWidth: 1,
      blur: 0
    };
  };

  const styles = getCursorStyles();

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] ${className}`}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          opacity: cursorState.isVisible ? 1 : 0,
          scale: cursorState.isOverInteractive ? 1.5 : 1
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.2 }
        }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: styles.size,
            height: styles.size,
            border: `${styles.borderWidth}px solid ${styles.borderColor}`,
            backgroundColor: 'transparent'
          }}
          animate={{
            rotate: cursorState.isOverInteractive ? 180 : 0
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        {/* Inner dot */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            backgroundColor: styles.color,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: cursorState.isDarkBackground 
              ? '0 0 10px rgba(255, 255, 255, 0.8)'
              : '0 0 10px rgba(0, 0, 0, 0.8)'
          }}
          animate={{
            scale: cursorState.isOverInteractive ? 2 : 1
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Interactive highlight */}
        {cursorState.isOverInteractive && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: styles.size + 10,
              height: styles.size + 10,
              backgroundColor: styles.backgroundColor,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>

      {/* Trail effect for dark backgrounds */}
      {cursorState.isDarkBackground && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%'
          }}
          animate={{
            opacity: cursorState.isVisible ? 0.3 : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="absolute rounded-full blur-sm"
            style={{
              width: 60,
              height: 60,
              background: `radial-gradient(circle, ${styles.borderColor}40 0%, transparent 70%)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </motion.div>
      )}

      {/* CSS to hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        html, body {
          cursor: none !important;
        }
        
        /* Special handling for inputs and text areas */
        input, textarea, [contenteditable] {
          cursor: text !important;
        }
        
        /* Ensure custom cursor is always visible */
        .adaptive-cursor-visible {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};