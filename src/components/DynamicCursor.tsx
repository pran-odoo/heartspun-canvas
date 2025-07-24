import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface DynamicCursorProps {
  className?: string;
}

interface CursorState {
  isVisible: boolean;
  backgroundType: 'light' | 'dark' | 'galaxy' | 'lightning';
  brightness: number;
  isOverInteractive: boolean;
  cursorStyle: string;
}

// Calculate brightness from RGB color
const calculateBrightness = (rgbColor: string): number => {
  if (!rgbColor || rgbColor === 'rgba(0, 0, 0, 0)' || rgbColor === 'transparent') {
    return 0; // Default to dark for transparent/unknown
  }

  const rgb = rgbColor.match(/\d+/g);
  if (!rgb || rgb.length < 3) return 0;

  const [r, g, b] = rgb.map(Number);
  // Standard brightness calculation
  return (r * 299 + g * 587 + b * 114) / 1000;
};

// Get background type based on element classes and computed styles
const getBackgroundType = (element: Element): 'light' | 'dark' | 'galaxy' | 'lightning' => {
  // Check for specific background types
  if (element.closest('.galaxy-background') || 
      element.closest('.galaxy-canvas') ||
      element.closest('[data-galaxy]')) {
    return 'galaxy';
  }
  
  if (element.closest('.lightning-background') || 
      element.closest('[data-background="dark"]') ||
      element.closest('.lightning-section')) {
    return 'lightning';
  }
  
  const computedStyle = window.getComputedStyle(element);
  const bgColor = computedStyle.backgroundColor;
  const brightness = calculateBrightness(bgColor);
  
  return brightness < 128 ? 'dark' : 'light';
};

export const DynamicCursor: React.FC<DynamicCursorProps> = ({ className = '' }) => {
  const [cursorState, setCursorState] = useState<CursorState>({
    isVisible: true,
    backgroundType: 'dark',
    brightness: 0,
    isOverInteractive: false,
    cursorStyle: 'default'
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef(0);

  // Generate SVG cursor based on background type
  const generateCursorSVG = useCallback((type: 'light' | 'dark' | 'galaxy' | 'lightning', isInteractive: boolean = false) => {
    const size = isInteractive ? 32 : 24;
    const center = size / 2;
    
    let cursor = '';
    
    switch (type) {
      case 'galaxy':
        cursor = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle cx="${center}" cy="${center}" r="${center - 4}" fill="none" stroke="white" stroke-width="2" filter="url(#glow)" opacity="0.9"/>
          <circle cx="${center}" cy="${center}" r="3" fill="cyan" filter="url(#glow)"/>
          <circle cx="${center}" cy="${center}" r="1" fill="white"/>
        </svg>`;
        break;
        
      case 'lightning':
        cursor = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <defs>
            <filter id="electric">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle cx="${center}" cy="${center}" r="${center - 3}" fill="none" stroke="#00d4ff" stroke-width="2" filter="url(#electric)" opacity="0.8"/>
          <circle cx="${center}" cy="${center}" r="4" fill="#66e5ff" opacity="0.6"/>
          <circle cx="${center}" cy="${center}" r="2" fill="white"/>
        </svg>`;
        break;
        
      case 'dark':
        cursor = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${center}" cy="${center}" r="${center - 3}" fill="none" stroke="white" stroke-width="2" opacity="0.9"/>
          <circle cx="${center}" cy="${center}" r="2" fill="white"/>
        </svg>`;
        break;
        
      case 'light':
      default:
        cursor = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${center}" cy="${center}" r="${center - 3}" fill="none" stroke="black" stroke-width="2" opacity="0.8"/>
          <circle cx="${center}" cy="${center}" r="2" fill="black"/>
        </svg>`;
        break;
    }
    
    const encoded = encodeURIComponent(cursor);
    return `url('data:image/svg+xml;charset=utf-8,${encoded}'), auto`;
  }, []);

  // Check if cursor is over interactive element
  const checkInteractiveElement = useCallback((x: number, y: number): boolean => {
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
      element.closest('.memory-card') ||
      window.getComputedStyle(element).cursor === 'pointer'
    );
  }, []);

  // Real-time cursor adaptation
  const updateCursor = useCallback((e: MouseEvent) => {
    const now = Date.now();
    
    // Throttle updates for performance
    if (now - lastUpdateRef.current < 16) return; // ~60fps
    lastUpdateRef.current = now;

    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;

    const backgroundType = getBackgroundType(element);
    const computedStyle = window.getComputedStyle(element);
    const brightness = calculateBrightness(computedStyle.backgroundColor);
    const isInteractive = checkInteractiveElement(e.clientX, e.clientY);
    
    setCursorState(prev => ({
      ...prev,
      isVisible: true,
      backgroundType,
      brightness,
      isOverInteractive: isInteractive,
      cursorStyle: generateCursorSVG(backgroundType, isInteractive)
    }));

    // Apply cursor style immediately to document
    document.body.style.cursor = generateCursorSVG(backgroundType, isInteractive);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Hide cursor after inactivity
    timeoutRef.current = setTimeout(() => {
      setCursorState(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  }, [mouseX, mouseY, generateCursorSVG, checkInteractiveElement]);

  // Handle mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => updateCursor(e);
    const handleMouseLeave = () => setCursorState(prev => ({ ...prev, isVisible: false }));
    const handleMouseEnter = () => setCursorState(prev => ({ ...prev, isVisible: true }));

    // Set initial cursor state
    document.body.style.cursor = generateCursorSVG('dark');
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateCursor, generateCursorSVG]);

  // Scroll detection for background changes
  useEffect(() => {
    const handleScroll = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const element = document.elementFromPoint(centerX, centerY);
      
      if (element) {
        const backgroundType = getBackgroundType(element);
        document.body.style.cursor = generateCursorSVG(backgroundType, cursorState.isOverInteractive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [cursorState.isOverInteractive, generateCursorSVG]);

  // Get cursor visual properties based on background type
  const getCursorProps = () => {
    const { backgroundType, isOverInteractive } = cursorState;
    
    const baseProps = {
      size: isOverInteractive ? 40 : 28,
      opacity: cursorState.isVisible ? 1 : 0
    };

    switch (backgroundType) {
      case 'galaxy':
        return {
          ...baseProps,
          borderColor: '#ffffff',
          glowColor: '#87ceeb',
          fillColor: 'rgba(135, 206, 235, 0.3)',
          shadowColor: 'rgba(255, 255, 255, 0.6)'
        };
      case 'lightning':
        return {
          ...baseProps,
          borderColor: '#00d4ff',
          glowColor: '#66e5ff',
          fillColor: 'rgba(0, 212, 255, 0.3)',
          shadowColor: 'rgba(0, 212, 255, 0.8)'
        };
      case 'dark':
        return {
          ...baseProps,
          borderColor: '#ffffff',
          glowColor: '#ffffff',
          fillColor: 'rgba(255, 255, 255, 0.2)',
          shadowColor: 'rgba(255, 255, 255, 0.4)'
        };
      case 'light':
      default:
        return {
          ...baseProps,
          borderColor: '#000000',
          glowColor: '#333333',
          fillColor: 'rgba(0, 0, 0, 0.1)',
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        };
    }
  };

  const cursorProps = getCursorProps();

  return (
    <>
      {/* Enhanced visual cursor for special backgrounds */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[10000] ${className}`}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          opacity: cursorProps.opacity,
          scale: cursorState.isOverInteractive ? 1.2 : 1
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 0.15 }
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: cursorProps.size + 8,
            height: cursorProps.size + 8,
            border: `1px solid ${cursorProps.borderColor}`,
            backgroundColor: 'transparent',
            boxShadow: `0 0 20px ${cursorProps.glowColor}`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            rotate: cursorState.isOverInteractive ? 180 : 0,
            scale: cursorState.backgroundType === 'lightning' ? [1, 1.1, 1] : 1
          }}
          transition={{
            rotate: { duration: 0.6, ease: "easeInOut" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Inner circle */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: cursorProps.size,
            height: cursorProps.size,
            backgroundColor: cursorProps.fillColor,
            border: `2px solid ${cursorProps.borderColor}`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: cursorState.isOverInteractive ? 1.1 : 1
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Center dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: 4,
            height: 4,
            backgroundColor: cursorProps.borderColor,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 8px ${cursorProps.shadowColor}`
          }}
        />

        {/* Interactive state indicator */}
        {cursorState.isOverInteractive && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: cursorProps.size + 16,
              height: cursorProps.size + 16,
              border: `1px solid ${cursorProps.glowColor}`,
              backgroundColor: 'transparent',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>

      {/* Global cursor hide styles */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        html, body {
          cursor: none !important;
        }
        
        /* Special handling for inputs */
        input:focus, textarea:focus, [contenteditable]:focus {
          cursor: text !important;
        }
        
        /* Force cursor visibility on dark backgrounds */
        .galaxy-background *, 
        .lightning-background *, 
        [data-background="dark"] * {
          cursor: none !important;
        }
        
        /* Performance optimization */
        .dynamic-cursor-optimized {
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
      `}</style>
    </>
  );
};