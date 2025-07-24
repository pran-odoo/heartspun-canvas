import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface SophisticatedTextProps {
  children: React.ReactNode;
  variant: 'hero' | 'akshita-elegant' | 'sophisticated-subtitle' | 'romantic-script' | 'luxury-body';
  className?: string;
  delay?: number;
  isVisible?: boolean;
  animate?: boolean;
}

interface ElegantTitleProps {
  text: string;
  className?: string;
  glowEffect?: boolean;
  letterSpacing?: 'tight' | 'normal' | 'wide' | 'wider';
}

const SOPHISTICATED_FONTS = {
  hero: 'font-family: "Playfair Display", serif',
  akshitaElegant: 'font-family: "Playfair Display", serif',
  subtitle: 'font-family: "Inter", sans-serif',
  script: 'font-family: "Dancing Script", cursive',
  luxury: 'font-family: "Inter", sans-serif',
};

const SOPHISTICATED_COLORS = {
  light: {
    primary: '#2C1810',
    secondary: '#4A2C17', 
    accent: '#8B4513',
    gold: '#B8860B',
    platinum: '#E5E4E2',
    rose: '#C08497'
  },
  dark: {
    primary: '#F5F5DC',
    secondary: '#E6E6FA',
    accent: '#DDA0DD',
    gold: '#FFD700',
    platinum: '#F0F0F0',
    rose: '#F0C0C0'
  }
};

export const SophisticatedText: React.FC<SophisticatedTextProps> = ({
  children,
  variant,
  className = '',
  delay = 0,
  isVisible = true,
  animate = true
}) => {
  const [isRevealed, setIsRevealed] = useState(!animate);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animate && isVisible) {
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [animate, isVisible, delay]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          ...SOPHISTICATED_FONTS.hero,
          background: 'linear-gradient(135deg, #2C1810 0%, #8B4513 50%, #2C1810 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 4px 12px rgba(44, 24, 16, 0.3)',
        };
      case 'akshita-elegant':
        return {
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          fontWeight: '700',
          lineHeight: '0.9',
          letterSpacing: '0.05em',
          ...SOPHISTICATED_FONTS.akshitaElegant,
          background: 'linear-gradient(45deg, #B8860B 0%, #FFD700 25%, #F0E68C 50%, #FFD700 75%, #B8860B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundSize: '300% 300%',
          filter: 'drop-shadow(0 6px 12px rgba(184, 134, 11, 0.4))',
        };
      case 'sophisticated-subtitle':
        return {
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '300',
          lineHeight: '1.4',
          letterSpacing: '0.02em',
          ...SOPHISTICATED_FONTS.subtitle,
          color: '#4A2C17',
          textShadow: '0 2px 6px rgba(74, 44, 23, 0.2)',
        };
      case 'romantic-script':
        return {
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          fontWeight: '400',
          lineHeight: '1.3',
          letterSpacing: '0.01em',
          ...SOPHISTICATED_FONTS.script,
          background: 'linear-gradient(135deg, #C08497 0%, #D2B48C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 3px 6px rgba(192, 132, 151, 0.3))',
        };
      case 'luxury-body':
        return {
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          fontWeight: '400',
          lineHeight: '1.6',
          letterSpacing: '0.01em',
          ...SOPHISTICATED_FONTS.luxury,
          color: '#2C1810',
          opacity: 0.9,
        };
      default:
        return {};
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: variant === 'akshita-elegant' ? 100 : 50,
      scale: variant === 'akshita-elegant' ? 0.8 : 0.95,
      rotateX: variant === 'hero' ? -15 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: variant === 'akshita-elegant' ? 1.2 : 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay
      }
    }
  };

  return (
    <motion.div
      ref={textRef}
      className={`sophisticated-text ${className}`}
      style={getVariantStyles()}
      variants={animate ? containerVariants : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate && isRevealed ? "visible" : undefined}
    >
      {/* Elegant background glow for AKSHITA */}
      {variant === 'akshita-elegant' && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-2xl"
          style={{
            background: 'radial-gradient(ellipse, rgba(184, 134, 11, 0.15), transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {children}
    </motion.div>
  );
};

export const ElegantTitle: React.FC<ElegantTitleProps> = ({
  text,
  className = '',
  glowEffect = false,
  letterSpacing = 'normal'
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Sophisticated typewriter effect
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 120);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text]);

  const getLetterSpacing = () => {
    switch (letterSpacing) {
      case 'tight': return '-0.05em';
      case 'normal': return '0';
      case 'wide': return '0.05em';
      case 'wider': return '0.1em';
      default: return '0';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.h1
        className="elegant-title"
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          fontWeight: '300',
          lineHeight: '1.1',
          letterSpacing: getLetterSpacing(),
          fontFamily: '"Playfair Display", serif',
          background: 'linear-gradient(135deg, #2C1810 0%, #8B4513 50%, #B8860B 75%, #2C1810 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: glowEffect ? '0 0 30px rgba(139, 69, 19, 0.5)' : 'none',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {displayText.split('').map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
              scale: 1.1,
              color: '#B8860B',
              textShadow: '0 0 20px rgba(184, 134, 11, 0.8)',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.h1>
      
      {/* Elegant underline effect */}
      {isComplete && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #B8860B, transparent)',
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
        />
      )}
    </div>
  );
};

// Sophisticated paragraph component
interface LuxuryParagraphProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'light' | 'normal' | 'medium';
  className?: string;
}

export const LuxuryParagraph: React.FC<LuxuryParagraphProps> = ({
  children,
  size = 'md',
  weight = 'normal',
  className = ''
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' };
      case 'md': return { fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' };
      case 'lg': return { fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' };
      default: return {};
    }
  };

  const getWeightStyles = () => {
    switch (weight) {
      case 'light': return { fontWeight: '300' };
      case 'normal': return { fontWeight: '400' };
      case 'medium': return { fontWeight: '500' };
      default: return {};
    }
  };

  return (
    <motion.p
      className={`luxury-paragraph ${className}`}
      style={{
        ...getSizeStyles(),
        ...getWeightStyles(),
        lineHeight: '1.7',
        letterSpacing: '0.01em',
        fontFamily: '"Inter", sans-serif',
        color: '#4A2C17',
        opacity: 0.9,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.9, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.p>
  );
};

// Elegant quote component
interface SophisticatedQuoteProps {
  text: string;
  author?: string;
  className?: string;
}

export const SophisticatedQuote: React.FC<SophisticatedQuoteProps> = ({
  text,
  author,
  className = ''
}) => {
  return (
    <motion.blockquote
      className={`sophisticated-quote ${className}`}
      style={{
        fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
        fontWeight: '300',
        lineHeight: '1.4',
        fontStyle: 'italic',
        fontFamily: '"Playfair Display", serif',
        color: '#8B4513',
        textAlign: 'center',
        position: 'relative',
        padding: '2rem',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Elegant quotation marks */}
      <span 
        style={{
          fontSize: '4rem',
          color: '#B8860B',
          position: 'absolute',
          top: '0',
          left: '0',
          lineHeight: '1',
          opacity: 0.3,
        }}
      >
        "
      </span>
      
      {text}
      
      <span 
        style={{
          fontSize: '4rem',
          color: '#B8860B',
          position: 'absolute',
          bottom: '0',
          right: '0',
          lineHeight: '1',
          opacity: 0.3,
        }}
      >
        "
      </span>
      
      {author && (
        <motion.cite
          style={{
            display: 'block',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: '400',
            fontStyle: 'normal',
            marginTop: '1rem',
            color: '#4A2C17',
            opacity: 0.8,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          — {author}
        </motion.cite>
      )}
    </motion.blockquote>
  );
};