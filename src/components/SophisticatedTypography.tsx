import React from 'react';
import { motion } from 'framer-motion';

interface SophisticatedTextProps {
  children: React.ReactNode;
  variant: 'akshita-elegant' | 'romantic-message' | 'elegant-subtitle' | 'luxury-caption';
  delay?: number;
  className?: string;
  theme?: 'morning' | 'evening' | 'night';
}

interface ElegantTitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
  theme?: 'morning' | 'evening' | 'night';
}

interface LuxuryParagraphProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'morning' | 'evening' | 'night';
}

interface SophisticatedQuoteProps {
  text: string;
  author?: string;
  className?: string;
  theme?: 'morning' | 'evening' | 'night';
}

// COHESIVE COLOR SCHEMES FOR PERFECT HARMONY
const SOPHISTICATED_COLORS = {
  morning: {
    akshita: {
      primary: '#ffffff',
      glow: '#87ceeb',
      shadow: '0 0 30px rgba(135, 206, 235, 0.4), 0 0 60px rgba(135, 206, 235, 0.2)',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #e8f4ff 50%, #d6ebff 100%)'
    },
    text: {
      primary: '#f0f8ff',
      secondary: '#e0ecff',
      accent: '#d6ebff',
      shadow: '0 2px 20px rgba(135, 206, 235, 0.3)'
    }
  },
  evening: {
    akshita: {
      primary: '#ffffff',
      glow: '#dda0dd',
      shadow: '0 0 30px rgba(221, 160, 221, 0.4), 0 0 60px rgba(221, 160, 221, 0.2)',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #f0e8ff 50%, #e6d6ff 100%)'
    },
    text: {
      primary: '#f8f0ff',
      secondary: '#f0e8ff',
      accent: '#e6d6ff',
      shadow: '0 2px 20px rgba(221, 160, 221, 0.3)'
    }
  },
  night: {
    akshita: {
      primary: '#ffffff',
      glow: '#6495ed',
      shadow: '0 0 30px rgba(100, 149, 237, 0.4), 0 0 60px rgba(100, 149, 237, 0.2)',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e0ecff 100%)'
    },
    text: {
      primary: '#f8faff',
      secondary: '#f0f8ff',
      accent: '#e0ecff',
      shadow: '0 2px 20px rgba(100, 149, 237, 0.3)'
    }
  }
};

const textVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      mass: 1
    }
  }
};

const glowVariants = {
  idle: {
    textShadow: (colors: any) => colors.akshita.shadow,
    scale: 1
  },
  hover: {
    textShadow: (colors: any) => `${colors.akshita.shadow}, 0 0 100px ${colors.akshita.glow}`,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const breathingVariants = {
  breathe: {
    scale: [1, 1.02, 1],
    textShadow: [
      (colors: any) => colors.akshita.shadow,
      (colors: any) => `${colors.akshita.shadow}, 0 0 80px ${colors.akshita.glow}`,
      (colors: any) => colors.akshita.shadow
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const SophisticatedText: React.FC<SophisticatedTextProps> = ({
  children,
  variant,
  delay = 0,
  className = '',
  theme = 'night'
}) => {
  const colors = SOPHISTICATED_COLORS[theme];

  const getVariantStyles = () => {
    switch (variant) {
      case 'akshita-elegant':
        return {
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: '300',
          fontFamily: "'Playfair Display', serif",
          letterSpacing: '0.05em',
          background: colors.akshita.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: `drop-shadow(${colors.akshita.shadow})`,
          lineHeight: 1.1
        };
      case 'romantic-message':
        return {
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          fontWeight: '400',
          fontFamily: "'Dancing Script', cursive",
          color: colors.text.primary,
          textShadow: colors.text.shadow,
          lineHeight: 1.6
        };
      case 'elegant-subtitle':
        return {
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: '300',
          fontFamily: "'Playfair Display', serif",
          color: colors.text.secondary,
          textShadow: colors.text.shadow,
          letterSpacing: '0.02em'
        };
      case 'luxury-caption':
        return {
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          fontWeight: '400',
          fontFamily: "'Inter', sans-serif",
          color: colors.text.accent,
          textShadow: colors.text.shadow,
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      variants={textVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {variant === 'akshita-elegant' ? (
        <motion.h1
          style={getVariantStyles()}
          variants={breathingVariants}
          animate="breathe"
          whileHover="hover"
          className="select-none cursor-default"
        >
          {children}
        </motion.h1>
      ) : (
        <motion.div
          style={getVariantStyles()}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export const ElegantTitle: React.FC<ElegantTitleProps> = ({
  children,
  level = 2,
  className = '',
  theme = 'night'
}) => {
  const colors = SOPHISTICATED_COLORS[theme];
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const titleStyles = {
    fontSize: level === 1 ? 'clamp(2.5rem, 6vw, 4rem)' : 
               level === 2 ? 'clamp(2rem, 5vw, 3rem)' : 
               'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: '300',
    fontFamily: "'Playfair Display', serif",
    color: colors.text.primary,
    textShadow: colors.text.shadow,
    letterSpacing: '0.02em',
    lineHeight: 1.2
  };

  return (
    <motion.div
      variants={textVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Tag style={titleStyles}>
        {children}
      </Tag>
    </motion.div>
  );
};

export const LuxuryParagraph: React.FC<LuxuryParagraphProps> = ({
  children,
  size = 'md',
  className = '',
  theme = 'night'
}) => {
  const colors = SOPHISTICATED_COLORS[theme];

  const sizeStyles = {
    sm: { fontSize: 'clamp(0.9rem, 2vw, 1rem)' },
    md: { fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' },
    lg: { fontSize: 'clamp(1.2rem, 3vw, 1.4rem)' },
    xl: { fontSize: 'clamp(1.4rem, 3.5vw, 1.6rem)' }
  };

  const paragraphStyles = {
    ...sizeStyles[size],
    fontWeight: '400',
    fontFamily: "'Inter', sans-serif",
    color: colors.text.primary,
    textShadow: colors.text.shadow,
    lineHeight: 1.7,
    letterSpacing: '0.01em'
  };

  return (
    <motion.p
      variants={textVariants}
      initial="hidden"
      animate="visible"
      style={paragraphStyles}
      className={className}
      whileHover={{ 
        color: colors.text.secondary,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.p>
  );
};

export const SophisticatedQuote: React.FC<SophisticatedQuoteProps> = ({
  text,
  author,
  className = '',
  theme = 'night'
}) => {
  const colors = SOPHISTICATED_COLORS[theme];

  const quoteStyles = {
    fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
    fontWeight: '300',
    fontFamily: "'Playfair Display', serif",
    color: colors.text.primary,
    textShadow: colors.text.shadow,
    fontStyle: 'italic',
    lineHeight: 1.6,
    letterSpacing: '0.01em'
  };

  const authorStyles = {
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    fontWeight: '400',
    fontFamily: "'Inter', sans-serif",
    color: colors.text.accent,
    textShadow: colors.text.shadow,
    letterSpacing: '0.05em',
    marginTop: '1rem'
  };

  return (
    <motion.blockquote
      variants={textVariants}
      initial="hidden"
      animate="visible"
      className={`text-center ${className}`}
    >
      <motion.p
        style={quoteStyles}
        whileHover={{ 
          scale: 1.02,
          color: colors.text.secondary,
          transition: { duration: 0.3 }
        }}
      >
        "{text}"
      </motion.p>
      {author && (
        <motion.cite
          style={authorStyles}
          className="block not-italic"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          — {author}
        </motion.cite>
      )}
    </motion.blockquote>
  );
};