'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface TargetCursorProps {
  children: React.ReactNode;
  className?: string;
  cursorText?: string;
  variant?: 'default' | 'magnetic' | 'akshita-special' | 'voice-command' | 'romantic';
  disabled?: boolean;
}

interface CursorState {
  x: number;
  y: number;
  isVisible: boolean;
  isHovering: boolean;
  text: string;
  variant: string;
}

const CURSOR_VARIANTS = {
  default: {
    size: 40,
    color: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    textColor: '#ffffff',
  },
  magnetic: {
    size: 50,
    color: 'rgba(184, 134, 11, 0.15)',
    borderColor: 'rgba(184, 134, 11, 0.4)',
    textColor: '#B8860B',
  },
  'akshita-special': {
    size: 60,
    color: 'rgba(221, 160, 221, 0.2)',
    borderColor: 'rgba(221, 160, 221, 0.5)',
    textColor: '#DDA0DD',
  },
  'voice-command': {
    size: 45,
    color: 'rgba(46, 185, 223, 0.15)',
    borderColor: 'rgba(46, 185, 223, 0.4)',
    textColor: '#2EB9DF',
  },
  romantic: {
    size: 55,
    color: 'rgba(192, 132, 151, 0.18)',
    borderColor: 'rgba(192, 132, 151, 0.45)',
    textColor: '#C08497',
  },
};

export const TargetCursor: React.FC<TargetCursorProps> = ({
  children,
  className = '',
  cursorText = '',
  variant = 'default',
  disabled = false
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    isVisible: false,
    isHovering: false,
    text: cursorText,
    variant: variant,
  });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animations for cursor position
  const springX = useSpring(mouseX, { stiffness: 400, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 40 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseX.set(x);
      mouseY.set(y);
      
      setCursorState(prev => ({
        ...prev,
        x,
        y,
        isVisible: true,
      }));
    }
  }, [disabled, mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    
    setCursorState(prev => ({
      ...prev,
      isHovering: true,
      text: cursorText,
      variant: variant,
    }));
  }, [disabled, cursorText, variant]);

  const handleMouseLeave = useCallback(() => {
    setCursorState(prev => ({
      ...prev,
      isVisible: false,
      isHovering: false,
    }));
  }, []);

  const cursorConfig = CURSOR_VARIANTS[variant as keyof typeof CURSOR_VARIANTS];

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ cursor: disabled ? 'default' : 'none' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {cursorState.isVisible && !disabled && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-50"
            style={{
              x: springX,
              y: springY,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: cursorState.isHovering ? 1 : 0.8, 
              opacity: cursorState.isHovering ? 1 : 0.7 
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
          >
            {/* Main cursor circle */}
            <motion.div
              className="absolute rounded-full border-2 flex items-center justify-center"
              style={{
                width: cursorConfig.size,
                height: cursorConfig.size,
                backgroundColor: cursorConfig.color,
                borderColor: cursorConfig.borderColor,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: cursorState.isHovering ? [1, 1.2, 1] : 1,
                rotate: cursorState.isHovering ? 360 : 0,
              }}
              transition={{ 
                scale: { duration: 0.3, ease: "easeInOut" },
                rotate: { duration: 2, ease: "linear", repeat: Infinity },
              }}
            >
              {/* Inner dot */}
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cursorConfig.textColor }}
                animate={{
                  scale: cursorState.isHovering ? [1, 0.5, 1] : 1,
                }}
                transition={{ 
                  duration: 1, 
                  ease: "easeInOut", 
                  repeat: Infinity 
                }}
              />
            </motion.div>

            {/* Cursor text */}
            {cursorState.text && cursorState.isHovering && (
              <motion.div
                className="absolute whitespace-nowrap px-2 py-1 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: cursorConfig.borderColor,
                  color: cursorConfig.textColor,
                  transform: 'translate(-50%, -150%)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${cursorConfig.borderColor}`,
                }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {cursorState.text}
              </motion.div>
            )}

            {/* Special effects for AKSHITA variant */}
            {variant === 'akshita-special' && cursorState.isHovering && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: cursorConfig.textColor,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      x: Math.cos(i * 45 * Math.PI / 180) * 30,
                      y: Math.sin(i * 45 * Math.PI / 180) * 30,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </>
            )}

            {/* Magnetic effect for magnetic variant */}
            {variant === 'magnetic' && (
              <motion.div
                className="absolute rounded-full border"
                style={{
                  width: cursorConfig.size * 1.5,
                  height: cursorConfig.size * 1.5,
                  borderColor: cursorConfig.borderColor,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: cursorState.isHovering ? [1, 1.3, 1] : 0,
                  opacity: cursorState.isHovering ? [0.3, 0.7, 0.3] : 0,
                }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeInOut", 
                  repeat: Infinity 
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Global cursor provider for website-wide cursor effects
export const GlobalTargetCursor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalCursor, setGlobalCursor] = useState({
    x: 0,
    y: 0,
    isVisible: false,
    variant: 'default' as keyof typeof CURSOR_VARIANTS,
    text: '',
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setGlobalCursor(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        isVisible: true,
      }));
    };

    const handleMouseLeave = () => {
      setGlobalCursor(prev => ({ ...prev, isVisible: false }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative">
      {children}
      
      {/* Global cursor overlay */}
      <AnimatePresence>
        {globalCursor.isVisible && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
            style={{
              x: globalCursor.x - 4,
              y: globalCursor.y - 4,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};