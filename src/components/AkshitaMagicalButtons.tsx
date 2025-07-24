import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface MagicalButtonProps {
  children: React.ReactNode;
  variant: 'memories' | 'songs' | 'surprises' | 'akshita-special';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

export const AkshitaMagicalButton: React.FC<MagicalButtonProps> = ({
  children,
  variant,
  onClick,
  className = '',
  disabled = false,
  size = 'md'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mouse tracking for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 400 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Handle mouse movement for magnetic effect
  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 100; // Maximum distance for magnetic effect
    
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      mouseX.set(deltaX * strength * 0.3);
      mouseY.set(deltaY * strength * 0.3);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    setParticles([]);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    
    // Create hover particles for AKSHITA-themed buttons
    if (variant === 'akshita-special') {
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Create ripple effect
    const rect = buttonRef.current!.getBoundingClientRect();
    const ripple: RippleEffect = {
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    setRipples(prev => [...prev, ripple]);
    setIsPressed(true);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
      setIsPressed(false);
    }, 600);

    onClick?.();
  };

  const getVariantStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
      overflow: 'hidden' as const,
      borderRadius: '1rem',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
    };

    const sizeStyles = {
      sm: { padding: '0.75rem 1.5rem', fontSize: '0.875rem' },
      md: { padding: '1rem 2rem', fontSize: '1rem' },
      lg: { padding: '1.25rem 2.5rem', fontSize: '1.125rem' },
      xl: { padding: '1.5rem 3rem', fontSize: '1.25rem' }
    };

    const variantStyles = {
      memories: {
        background: 'linear-gradient(135deg, #FFE5F1, #FFCCCB, #FFF8DC)',
        color: '#2C1810',
        boxShadow: '0 8px 32px rgba(255, 182, 193, 0.3)',
      },
      songs: {
        background: 'linear-gradient(135deg, #FFF0E6, #FFEAA7, #FFD3A5)',
        color: '#4A2C17',
        boxShadow: '0 8px 32px rgba(255, 100, 71, 0.3)',
      },
      surprises: {
        background: 'linear-gradient(135deg, #F8F0FF, #E6E6FA, #FFF0F5)',
        color: '#2F1B69',
        boxShadow: '0 8px 32px rgba(147, 112, 219, 0.3)',
      },
      'akshita-special': {
        background: 'linear-gradient(135deg, #FF1493, #FF69B4, #FFB6C1, #FF1493)',
        backgroundSize: '300% 300%',
        color: 'white',
        boxShadow: '0 12px 40px rgba(255, 20, 147, 0.4)',
        fontWeight: '700',
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    };
  };

  const getHoverStyles = () => {
    const hoverVariants = {
      memories: {
        background: 'linear-gradient(135deg, #FFCCCB, #FFB6C1, #FFCCCB)',
        transform: 'translateY(-4px) scale(1.02)',
        boxShadow: '0 12px 48px rgba(255, 182, 193, 0.5)',
      },
      songs: {
        background: 'linear-gradient(135deg, #FFEAA7, #FFD3A5, #FFEAA7)',
        transform: 'translateY(-4px) scale(1.02)',
        boxShadow: '0 12px 48px rgba(255, 100, 71, 0.5)',
      },
      surprises: {
        background: 'linear-gradient(135deg, #E6E6FA, #DDA0DD, #E6E6FA)',
        transform: 'translateY(-4px) scale(1.02)',
        boxShadow: '0 12px 48px rgba(147, 112, 219, 0.5)',
      },
      'akshita-special': {
        backgroundPosition: '100% 0%',
        transform: 'translateY(-6px) scale(1.05)',
        boxShadow: '0 16px 64px rgba(255, 20, 147, 0.6)',
        filter: 'brightness(1.1)',
      }
    };

    return hoverVariants[variant];
  };

  const buttonVariants = {
    idle: getVariantStyles(),
    hover: {
      ...getVariantStyles(),
      ...getHoverStyles(),
    },
    pressed: {
      ...getVariantStyles(),
      transform: 'translateY(2px) scale(0.98)',
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`magical-button ${className}`}
      style={buttonVariants.idle}
      variants={buttonVariants}
      initial="idle"
      animate={isPressed ? "pressed" : isHovered ? "hover" : "idle"}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
    >
      {/* Magnetic effect container */}
      <motion.div
        style={{ x, y }}
        className="relative z-10 flex items-center justify-center gap-3"
      >
        {children}
      </motion.div>

      {/* Shine effect */}
      <div className="absolute inset-0 overflow-hidden rounded-inherit">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          style={{
            transform: 'translateX(-100%) skewX(-15deg)',
            width: '100%',
            height: '100%',
          }}
          animate={isHovered ? {
            transform: 'translateX(300%) skewX(-15deg)',
            opacity: [0, 0.3, 0]
          } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white"
            style={{
              left: ripple.x - 25,
              top: ripple.y - 25,
              width: 50,
              height: 50,
            }}
            initial={{ opacity: 0.6, scale: 0 }}
            animate={{ opacity: 0, scale: 4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* AKSHITA special particles */}
      {variant === 'akshita-special' && (
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute pointer-events-none text-white"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                fontSize: '0.75rem',
              }}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
                rotate: 360,
                y: [-20, 20, -20],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Animated gradient background for AKSHITA special */}
      {variant === 'akshita-special' && (
        <motion.div
          className="absolute inset-0 rounded-inherit"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(270deg, rgba(255, 255, 255, 0.1), transparent, rgba(255, 255, 255, 0.1))',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* Icon-specific animations */}
      {variant === 'memories' && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-400"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30}%`,
                fontSize: '1rem',
              }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            >
              📸
            </motion.div>
          ))}
        </div>
      )}

      {variant === 'songs' && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-orange-400"
              style={{
                left: `${15 + i * 25}%`,
                top: `${25 + (i % 2) * 50}%`,
                fontSize: '0.875rem',
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            >
              🎵
            </motion.div>
          ))}
        </div>
      )}

      {variant === 'surprises' && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 text-purple-400 text-4xl flex items-center justify-center"
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🎁
          </motion.div>
        </div>
      )}

      {/* Gradient border animation */}
      <motion.div
        className="absolute inset-0 rounded-inherit"
        style={{
          background: `linear-gradient(135deg, 
            ${variant === 'memories' ? 'rgba(255, 182, 193, 0.5)' :
              variant === 'songs' ? 'rgba(255, 100, 71, 0.5)' :
              variant === 'surprises' ? 'rgba(147, 112, 219, 0.5)' :
              'rgba(255, 20, 147, 0.5)'}, 
            transparent, 
            ${variant === 'memories' ? 'rgba(255, 182, 193, 0.5)' :
              variant === 'songs' ? 'rgba(255, 100, 71, 0.5)' :
              variant === 'surprises' ? 'rgba(147, 112, 219, 0.5)' :
              'rgba(255, 20, 147, 0.5)'})`,
          padding: '2px',
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="w-full h-full rounded-inherit bg-current"
          style={{ background: 'inherit' }}
        />
      </motion.div>
    </motion.button>
  );
};

// Floating Action Button variant
interface FloatingButtonProps {
  icon: string;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export const AkshitaFloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  onClick,
  position = 'bottom-right',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const positionStyles = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <motion.button
      className={`${positionStyles[position]} z-50 w-16 h-16 rounded-full shadow-lg ${className}`}
      style={{
        background: 'linear-gradient(135deg, #FF1493, #FF69B4)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
      }}
      whileHover={{ 
        scale: 1.1, 
        boxShadow: '0 12px 40px rgba(255, 20, 147, 0.4)' 
      }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      animate={{
        boxShadow: [
          '0 8px 32px rgba(255, 20, 147, 0.3)',
          '0 12px 40px rgba(255, 20, 147, 0.5)',
          '0 8px 32px rgba(255, 20, 147, 0.3)',
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.span
        animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.span>

      {/* Ripple effect background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};