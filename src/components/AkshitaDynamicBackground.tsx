import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface DynamicBackgroundProps {
  theme: 'morning' | 'evening' | 'night';
  mousePosition: { x: number; y: number };
  isActive?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'heart' | 'star' | 'sparkle' | 'name';
  opacity: number;
}

const getTimeBasedColors = () => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    // Morning - soft pinks and golds with high contrast
    return {
      primary: '#FFE5F1', // Very light pink for text backgrounds
      secondary: '#FFF8DC', // Cream for secondary backgrounds
      accent: '#FF69B4', // Hot pink for accents
      gradient: 'linear-gradient(135deg, #FFE5F1 0%, #FFCCCB 25%, #FFF8DC 50%, #FFE5F1 75%, #FFCCCB 100%)',
      particles: ['#FF1493', '#FFB6C1', '#FF69B4', '#FFC0CB'],
      textContrast: '#2C1810' // Dark brown for maximum readability
    };
  } else if (hour >= 12 && hour < 18) {
    // Afternoon - warm oranges and light pinks
    return {
      primary: '#FFF0E6', // Very light peach
      secondary: '#FFFACD', // Light goldenrod
      accent: '#FF6347', // Tomato for accents
      gradient: 'linear-gradient(135deg, #FFF0E6 0%, #FFEAA7 25%, #FFD3A5 50%, #FFF0E6 75%, #FFEAA7 100%)',
      particles: ['#FF4500', '#FF6347', '#FF7F50', '#FFA07A'],
      textContrast: '#4A2C17'
    };
  } else if (hour >= 18 && hour < 22) {
    // Evening - romantic purples and pinks with light backgrounds
    return {
      primary: '#F8F0FF', // Very light lavender
      secondary: '#FFF0F5', // Lavender blush
      accent: '#9370DB', // Medium slate blue
      gradient: 'linear-gradient(135deg, #F8F0FF 0%, #E6E6FA 25%, #FFF0F5 50%, #F8F0FF 75%, #E6E6FA 100%)',
      particles: ['#9370DB', '#BA55D3', '#DA70D6', '#DDA0DD'],
      textContrast: '#2F1B69'
    };
  } else {
    // Night - deep blues with light overlays for readability
    return {
      primary: '#F0F8FF', // Alice blue - very light
      secondary: '#E6F3FF', // Very light sky blue
      accent: '#4169E1', // Royal blue
      gradient: 'linear-gradient(135deg, #F0F8FF 0%, #E0F6FF 25%, #E6F3FF 50%, #F0F8FF 75%, #E0F6FF 100%)',
      particles: ['#4169E1', '#6495ED', '#87CEEB', '#ADD8E6'],
      textContrast: '#1B2951'
    };
  }
};

export const AkshitaDynamicBackground: React.FC<DynamicBackgroundProps> = ({
  theme,
  mousePosition,
  isActive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [currentColors, setCurrentColors] = useState(getTimeBasedColors());
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [lastMouseTime, setLastMouseTime] = useState(Date.now());
  
  // Smooth mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  // Update colors based on time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColors(getTimeBasedColors());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Track mouse movement for interactive particles
  useEffect(() => {
    mouseX.set(mousePosition.x);
    mouseY.set(mousePosition.y);
    setIsMouseMoving(true);
    setLastMouseTime(Date.now());

    const timeout = setTimeout(() => {
      setIsMouseMoving(false);
    }, 150);

    return () => clearTimeout(timeout);
  }, [mousePosition, mouseX, mouseY]);

  // Create AKSHITA-themed particles
  const createParticle = useCallback((x: number, y: number, type: Particle['type'] = 'sparkle'): Particle => {
    const colors = currentColors.particles;
    
    return {
      id: Math.random(),
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1,
      maxLife: Math.random() * 3 + 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      type,
      opacity: Math.random() * 0.8 + 0.2
    };
  }, [currentColors]);

  // Create heart particles when mouse moves
  useEffect(() => {
    if (isMouseMoving && isActive) {
      const newParticles: Particle[] = [];
      
      // Create heart particles following mouse
      for (let i = 0; i < 3; i++) {
        newParticles.push(createParticle(mousePosition.x, mousePosition.y, 'heart'));
      }
      
      // Occasionally create AKSHITA name particles
      if (Math.random() < 0.1) {
        newParticles.push(createParticle(mousePosition.x, mousePosition.y, 'name'));
      }

      setParticles(prev => [...prev, ...newParticles].slice(-50)); // Keep only 50 particles
    }
  }, [isMouseMoving, mousePosition, createParticle, isActive]);

  // Ambient particle generation
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const newParticles: Particle[] = [];
      
      // Create ambient sparkle particles
      for (let i = 0; i < 2; i++) {
        newParticles.push(createParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() < 0.3 ? 'star' : 'sparkle'
        ));
      }

      setParticles(prev => [...prev, ...newParticles].slice(-50));
    }, 1000);

    return () => clearInterval(interval);
  }, [createParticle, isActive]);

  // Animation loop
  useEffect(() => {
    if (!isActive) return;

    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx) return;

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, currentColors.primary);
      gradient.addColorStop(0.5, currentColors.secondary);
      gradient.addColorStop(1, currentColors.primary);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      setParticles(prev => {
        const updatedParticles = prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.02,
            opacity: (particle.life / particle.maxLife) * 0.8
          }))
          .filter(particle => particle.life > 0);

        // Draw particles
        updatedParticles.forEach(particle => {
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          
          switch (particle.type) {
            case 'heart':
              drawHeart(ctx, particle.x, particle.y, particle.size);
              break;
            case 'star':
              drawStar(ctx, particle.x, particle.y, particle.size);
              break;
            case 'name':
              drawAkshitaSymbol(ctx, particle.x, particle.y, particle.size);
              break;
            default:
              drawSparkle(ctx, particle.x, particle.y, particle.size);
          }
          
          ctx.restore();
        });

        return updatedParticles;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, currentColors]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drawing functions for different particle types
  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 10, size / 10);
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-5, -2, -15, 1, 0, 15);
    ctx.bezierCurveTo(15, 1, 5, -2, 0, 3);
    ctx.fill();
    ctx.restore();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((i * 144 - 90) * Math.PI / 180) * size, 
                 Math.sin((i * 144 - 90) * Math.PI / 180) * size);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillRect(-size/2, -size/2, size, size);
    ctx.fillRect(-size/4, -size, size/2, size*2);
    ctx.fillRect(-size, -size/4, size*2, size/2);
    ctx.restore();
  };

  const drawAkshitaSymbol = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', 0, 0);
    ctx.restore();
  };

  return (
    <>
      {/* Dynamic Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          background: currentColors.gradient,
        }}
      />
      
      {/* Automatic Text Contrast Overlay System */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(800px circle at ${smoothMouseX.get()}px ${smoothMouseY.get()}px, 
            ${currentColors.primary}ee 0%, 
            ${currentColors.primary}cc 20%, 
            ${currentColors.primary}88 40%, 
            transparent 70%)`,
        }}
        animate={{
          opacity: isMouseMoving ? 0.9 : 0.6,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Reading Enhancement Zones */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Hero Text Area Enhancement */}
        <div 
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-32 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${currentColors.primary}f0, ${currentColors.secondary}f0)`,
            backdropFilter: 'blur(10px)',
          }}
        />
        
        {/* Button Area Enhancement */}
        <div 
          className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-3/4 h-40 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${currentColors.primary}e0, ${currentColors.secondary}e0)`,
            backdropFilter: 'blur(8px)',
          }}
        />
      </div>

      {/* Dynamic Ambient Light Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-5"
        animate={{
          background: [
            `radial-gradient(ellipse at top, ${currentColors.accent}10, transparent 50%)`,
            `radial-gradient(ellipse at bottom right, ${currentColors.accent}15, transparent 50%)`,
            `radial-gradient(ellipse at top left, ${currentColors.accent}10, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Text Contrast CSS Variables */}
      <style jsx>{`
        :global(.akshita-text) {
          color: ${currentColors.textContrast} !important;
          text-shadow: 0 2px 4px ${currentColors.primary}80 !important;
        }
        
        :global(.akshita-title) {
          color: ${currentColors.textContrast} !important;
          text-shadow: 0 3px 6px ${currentColors.primary}90 !important;
          background: linear-gradient(135deg, ${currentColors.primary}20, ${currentColors.secondary}20);
          backdrop-filter: blur(8px);
          border-radius: 1rem;
          padding: 1rem 2rem;
        }
        
        :global(.akshita-subtitle) {
          color: ${currentColors.textContrast} !important;
          text-shadow: 0 2px 4px ${currentColors.primary}70 !important;
          background: linear-gradient(135deg, ${currentColors.primary}15, ${currentColors.secondary}15);
          backdrop-filter: blur(6px);
          border-radius: 0.75rem;
          padding: 0.75rem 1.5rem;
        }
      `}</style>
    </>
  );
};