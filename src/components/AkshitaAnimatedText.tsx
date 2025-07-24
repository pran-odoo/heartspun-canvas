import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  variant: 'hero' | 'subtitle' | 'notification' | 'akshita-special';
  className?: string;
  delay?: number;
  isVisible?: boolean;
}

export const AkshitaAnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  variant,
  className = '',
  delay = 0,
  isVisible = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const textRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for AKSHITA's name
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsComplete(true);
        // Hide cursor after completion for cleaner look
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, variant === 'akshita-special' ? 150 : 100);

    return () => clearTimeout(timer);
  }, [currentIndex, text, isVisible, variant]);

  // Create sparkle effects around AKSHITA's name
  useEffect(() => {
    if (!isComplete || variant !== 'akshita-special') return;

    const interval = setInterval(() => {
      const newSparkle = {
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100
      };
      
      setSparkles(prev => [...prev, newSparkle].slice(-8));
      
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 2000);
    }, 500);

    return () => clearInterval(interval);
  }, [isComplete, variant]);

  // Reset animation when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
    setShowCursor(true);
  }, [text]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #2C1810, #4A2C17, #2C1810)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 4px 8px rgba(44, 24, 16, 0.3)',
        };
      case 'subtitle':
        return {
          fontSize: 'clamp(1.2rem, 4vw, 2rem)',
          fontWeight: '500',
          color: '#4A2C17',
          textShadow: '0 2px 4px rgba(255, 229, 241, 0.8)',
        };
      case 'notification':
        return {
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          fontWeight: '400',
          color: '#2F1B69',
          textShadow: '0 2px 4px rgba(248, 240, 255, 0.8)',
        };
      case 'akshita-special':
        return {
          fontSize: 'clamp(3rem, 10vw, 8rem)',
          fontWeight: '800',
          background: 'linear-gradient(45deg, #FF1493, #FF69B4, #FFB6C1, #FF1493, #FF69B4)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 4px 8px rgba(255, 20, 147, 0.4))',
        };
      default:
        return {};
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0, rotate: 0 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      rotate: 360,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  const cursorVariants = {
    blinking: {
      opacity: [1, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      ref={textRef}
      className={`relative inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Main Text with Typewriter Effect */}
      <div 
        className="relative z-10"
        style={getVariantStyles()}
      >
        {variant === 'akshita-special' ? (
          // Special letter-by-letter animation for AKSHITA
          <motion.div className="flex">
            {displayText.split('').map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
                style={{
                  transformOrigin: '50% 100%',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.div>
        ) : (
          // Regular typewriter effect
          <span>{displayText}</span>
        )}
        
        {/* Typewriter Cursor */}
        {showCursor && (
          <motion.span
            variants={cursorVariants}
            animate="blinking"
            className="inline-block ml-1"
            style={{ color: 'inherit' }}
          >
            |
          </motion.span>
        )}
      </div>

      {/* AKSHITA Special Effects */}
      {variant === 'akshita-special' && (
        <>
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0 -z-10 rounded-2xl"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(255, 20, 147, 0.1), rgba(255, 105, 180, 0.1))',
                'linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(255, 182, 193, 0.1))',
                'linear-gradient(225deg, rgba(255, 182, 193, 0.1), rgba(255, 20, 147, 0.1))',
                'linear-gradient(315deg, rgba(255, 20, 147, 0.1), rgba(255, 105, 180, 0.1))',
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Sparkle Effects */}
          <AnimatePresence>
            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                  fontSize: '1rem',
                }}
                variants={sparkleVariants}
                initial="initial"
                animate="animate"
                exit="initial"
              >
                ✨
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Pulsing Glow Effect */}
          <motion.div
            className="absolute inset-0 -z-20 rounded-2xl blur-xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(ellipse, rgba(255, 20, 147, 0.4), transparent 70%)',
            }}
          />
        </>
      )}

      {/* Floating Hearts for AKSHITA */}
      {(text.toUpperCase().includes('AKSHITA') || variant === 'akshita-special') && isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-400"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
                fontSize: '1.5rem',
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0.7, 1, 0.7],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.3,
                ease: "easeInOut"
              }}
            >
              💕
            </motion.div>
          ))}
        </div>
      )}

      {/* Reading Enhancement Background */}
      <div 
        className="absolute inset-0 -z-30 rounded-2xl"
        style={{
          background: variant === 'hero' || variant === 'akshita-special' 
            ? 'linear-gradient(135deg, rgba(255, 229, 241, 0.9), rgba(255, 248, 220, 0.9))'
            : 'linear-gradient(135deg, rgba(255, 229, 241, 0.7), rgba(255, 248, 220, 0.7))',
          backdropFilter: 'blur(8px)',
          padding: '1rem 2rem',
          margin: '-1rem -2rem',
        }}
      />
    </motion.div>
  );
};

// Dynamic Text Rotator for changing messages
interface TextRotatorProps {
  texts: string[];
  interval?: number;
  className?: string;
  variant?: 'hero' | 'subtitle' | 'notification' | 'akshita-special';
}

export const AkshitaTextRotator: React.FC<TextRotatorProps> = ({
  texts,
  interval = 4000,
  className = '',
  variant = 'subtitle'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (texts.length <= 1) return;

    const timer = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <AkshitaAnimatedText
          text={texts[currentIndex]}
          variant={variant}
          className={className}
          isVisible={isVisible}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Highlight Effect for Interactive Text
interface HighlightTextProps {
  text: string;
  highlightWord: string;
  className?: string;
}

export const AkshitaHighlightText: React.FC<HighlightTextProps> = ({
  text,
  highlightWord,
  className = ''
}) => {
  const parts = text.split(new RegExp(`(${highlightWord})`, 'gi'));

  return (
    <span className={className}>
      {parts.map((part, i) => (
        part.toLowerCase() === highlightWord.toLowerCase() ? (
          <motion.span
            key={i}
            className="akshita-highlight inline-block"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'linear-gradient(90deg, #FF1493, #FF69B4, #FFB6C1, #FF1493)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '700',
              textShadow: '0 0 20px rgba(255, 20, 147, 0.5)',
            }}
          >
            {part}
          </motion.span>
        ) : (
          <span key={i}>{part}</span>
        )
      ))}
    </span>
  );
};