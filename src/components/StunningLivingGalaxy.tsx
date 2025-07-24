import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBackdropFilterCleanup, preserveFilterOnElement } from './TabSwitchingFix';

interface StunningLivingGalaxyProps {
  theme: 'morning' | 'evening' | 'night';
  isDarkMode?: boolean;
  mousePosition: { x: number; y: number };
  isActive?: boolean;
  className?: string;
}

interface Star {
  id: string;
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
  brightness: number;
  layer: number;
  originalX: number;
  originalY: number;
}

interface Nebula {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  speed: number;
  pulsePhase: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

// SOPHISTICATED COLOR PALETTE FOR PERFECT HARMONY
const COHESIVE_COLOR_SCHEME = {
  morning: {
    background: {
      primary: '#0a0e1a',
      secondary: '#1a1e2e',
      accent: '#2a2e3e'
    },
    stars: {
      primary: '#ffffff',
      secondary: '#e8f4ff',
      accent: '#d6ebff',
      twinkle: '#b3d9ff'
    },
    nebula: {
      primary: 'rgba(173, 216, 255, 0.15)',
      secondary: 'rgba(135, 206, 255, 0.1)',
      accent: 'rgba(100, 149, 237, 0.08)'
    },
    akshita: {
      primary: '#ffffff',
      glow: '#87ceeb',
      shadow: 'rgba(135, 206, 235, 0.3)'
    }
  },
  evening: {
    background: {
      primary: '#0f0a1a',
      secondary: '#1f1a2a',
      accent: '#2f2a3a'
    },
    stars: {
      primary: '#ffffff',
      secondary: '#f0e8ff',
      accent: '#e6d6ff',
      twinkle: '#dbb3ff'
    },
    nebula: {
      primary: 'rgba(221, 160, 221, 0.18)',
      secondary: 'rgba(186, 85, 211, 0.12)',
      accent: 'rgba(147, 112, 219, 0.1)'
    },
    akshita: {
      primary: '#ffffff',
      glow: '#dda0dd',
      shadow: 'rgba(221, 160, 221, 0.3)'
    }
  },
  night: {
    background: {
      primary: '#050a15',
      secondary: '#151a25',
      accent: '#252a35'
    },
    stars: {
      primary: '#ffffff',
      secondary: '#f0f8ff',
      accent: '#e0ecff',
      twinkle: '#c8d4ff'
    },
    nebula: {
      primary: 'rgba(100, 149, 237, 0.12)',
      secondary: 'rgba(70, 130, 180, 0.08)',
      accent: 'rgba(176, 196, 222, 0.06)'
    },
    akshita: {
      primary: '#ffffff',
      glow: '#6495ed',
      shadow: 'rgba(100, 149, 237, 0.3)'
    }
  }
};

export const StunningLivingGalaxy: React.FC<StunningLivingGalaxyProps> = ({
  theme,
  isDarkMode = false,
  mousePosition,
  isActive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const mouseTrailRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);

  // Use the backdrop filter cleanup hook
  useBackdropFilterCleanup();

  // Memoized color scheme
  const colors = useMemo(() => COHESIVE_COLOR_SCHEME[theme], [theme]);

  // Generate stars with proper keys and layered depth
  const stars = useMemo(() => {
    const starCount = Math.min(1200, Math.max(600, Math.floor((dimensions.width * dimensions.height) / 2000)));
    const newStars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const layer = Math.floor(Math.random() * 3); // 3 depth layers
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      
      newStars.push({
        id: `star-${i}-${Date.now()}`, // Unique key
        x,
        y,
        z: 100 + layer * 300, // Depth layers
        size: (Math.random() * 2 + 0.5) * (3 - layer), // Larger stars in front
        speed: (Math.random() * 0.5 + 0.1) * (layer + 1), // Different speeds per layer
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        color: [colors.stars.primary, colors.stars.secondary, colors.stars.accent, colors.stars.twinkle][Math.floor(Math.random() * 4)],
        brightness: Math.random() * 0.8 + 0.2,
        layer,
        originalX: x,
        originalY: y
      });
    }

    return newStars;
  }, [dimensions.width, dimensions.height, colors.stars]);

  // Generate nebula clouds
  const nebulas = useMemo(() => {
    const nebulaCount = 8;
    const newNebulas: Nebula[] = [];

    for (let i = 0; i < nebulaCount; i++) {
      newNebulas.push({
        id: `nebula-${i}-${Date.now()}`, // Unique key
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 800 + 400,
        color: [colors.nebula.primary, colors.nebula.secondary, colors.nebula.accent][Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * 360,
        speed: Math.random() * 0.3 + 0.1,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    return newNebulas;
  }, [dimensions.width, dimensions.height, colors.nebula]);

  // Mouse interaction effects
  const handleMouseMovement = useCallback(() => {
    setIsMouseMoving(true);
    const timeout = setTimeout(() => setIsMouseMoving(false), 150);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    handleMouseMovement();
  }, [mousePosition, handleMouseMovement]);

  // Canvas drawing functions
  const drawStar = useCallback((
    ctx: CanvasRenderingContext2D,
    star: Star,
    time: number,
    mouseInfluence: number
  ) => {
    // Calculate twinkling effect
    const twinkle = Math.sin(star.twinklePhase + time * star.twinkleSpeed) * 0.5 + 0.5;
    const brightness = star.brightness * (0.5 + twinkle * 0.5);
    
    // Calculate mouse repulsion effect
    const dx = star.x - mousePosition.x;
    const dy = star.y - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repulsionRadius = 150;
    
    let offsetX = 0;
    let offsetY = 0;
    if (distance < repulsionRadius && mouseInfluence > 0) {
      const force = (repulsionRadius - distance) / repulsionRadius;
      offsetX = (dx / distance) * force * 30 * mouseInfluence;
      offsetY = (dy / distance) * force * 30 * mouseInfluence;
    }

    const finalX = star.x + offsetX;
    const finalY = star.y + offsetY;

    // Draw star with proper glow effect
    ctx.save();
    ctx.globalAlpha = brightness;
    
    // Outer glow
    const gradient = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, star.size * 3);
    gradient.addColorStop(0, star.color);
    gradient.addColorStop(0.3, star.color.replace('rgb', 'rgba').replace(')', ', 0.5)'));
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(finalX, finalY, star.size * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner bright core
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(finalX, finalY, star.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, [mousePosition]);

  const drawNebula = useCallback((
    ctx: CanvasRenderingContext2D,
    nebula: Nebula,
    time: number
  ) => {
    const pulse = Math.sin(nebula.pulsePhase + time * 0.001) * 0.2 + 0.8;
    
    ctx.save();
    ctx.globalAlpha = nebula.opacity * pulse;
    ctx.filter = 'blur(40px)';
    
    const gradient = ctx.createRadialGradient(
      nebula.x, nebula.y, 0,
      nebula.x, nebula.y, nebula.size
    );
    gradient.addColorStop(0, nebula.color);
    gradient.addColorStop(0.5, nebula.color.replace(/[\d.]+\)/, '0.05)'));
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(nebula.x, nebula.y, nebula.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, []);

  const drawMouseTrail = useCallback((
    ctx: CanvasRenderingContext2D,
    particles: Particle[]
  ) => {
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha * 0.6;
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 16; // ~60fps
    const time = timeRef.current;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, colors.background.primary);
    gradient.addColorStop(0.5, colors.background.secondary);
    gradient.addColorStop(1, colors.background.accent);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw nebulas first (background layer)
    nebulas.forEach(nebula => {
      // Slow rotation and drift
      nebula.x += Math.sin(time * 0.0001 + nebula.rotation) * nebula.speed * 0.1;
      nebula.y += Math.cos(time * 0.0001 + nebula.rotation) * nebula.speed * 0.1;
      
      // Wrap around edges
      if (nebula.x < -nebula.size) nebula.x = canvas.width + nebula.size;
      if (nebula.x > canvas.width + nebula.size) nebula.x = -nebula.size;
      if (nebula.y < -nebula.size) nebula.y = canvas.height + nebula.size;
      if (nebula.y > canvas.height + nebula.size) nebula.y = -nebula.size;
      
      drawNebula(ctx, nebula, time);
    });

    // Mouse influence
    const mouseInfluence = isMouseMoving ? 1 : 0;

    // Update and draw stars by layer (back to front)
    for (let layer = 2; layer >= 0; layer--) {
      stars.filter(star => star.layer === layer).forEach(star => {
        // Gentle drift motion
        star.x += Math.sin(time * 0.0001 + star.id.length) * star.speed * 0.2;
        star.y += Math.cos(time * 0.0001 + star.id.length) * star.speed * 0.2;
        
        // Wrap around edges
        if (star.x < -50) star.x = canvas.width + 50;
        if (star.x > canvas.width + 50) star.x = -50;
        if (star.y < -50) star.y = canvas.height + 50;
        if (star.y > canvas.height + 50) star.y = -50;
        
        drawStar(ctx, star, time, mouseInfluence);
      });
    }

    // Add mouse trail particles
    if (isMouseMoving) {
      mouseTrailRef.current.push({
        id: `particle-${Date.now()}-${Math.random()}`,
        x: mousePosition.x + (Math.random() - 0.5) * 20,
        y: mousePosition.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 60,
        maxLife: 60,
        size: Math.random() * 8 + 2,
        color: colors.akshita.glow
      });
    }

    // Update and draw mouse trail
    mouseTrailRef.current = mouseTrailRef.current.filter(particle => {
      particle.life--;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      return particle.life > 0;
    });

    drawMouseTrail(ctx, mouseTrailRef.current);

    animationRef.current = requestAnimationFrame(animate);
  }, [colors, isActive, isMouseMoving, mousePosition, nebulas, stars, drawStar, drawNebula, drawMouseTrail]);

  // Canvas setup and resize handling
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Canvas size and pixel ratio setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Preserve this element from blur cleanup
    preserveFilterOnElement(canvas);
  }, [dimensions]);

  // Start animation
  useEffect(() => {
    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animate]);

  return (
    <div 
      className={`fixed inset-0 z-0 overflow-hidden ${className}`}
      style={{ 
        isolation: 'isolate',
        contain: 'layout style paint'
      }}
    >
      {/* Sophisticated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top, ${colors.background.secondary} 0%, ${colors.background.primary} 50%),
            radial-gradient(ellipse at bottom right, ${colors.background.accent} 0%, transparent 50%),
            linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)
          `
        }}
        animate={{
          background: [
            `radial-gradient(ellipse at top, ${colors.background.secondary} 0%, ${colors.background.primary} 50%)`,
            `radial-gradient(ellipse at top right, ${colors.background.secondary} 0%, ${colors.background.primary} 50%)`,
            `radial-gradient(ellipse at top, ${colors.background.secondary} 0%, ${colors.background.primary} 50%)`
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Living galaxy canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          mixBlendMode: isDarkMode ? 'screen' : 'normal',
          opacity: isActive ? 1 : 0.6,
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* Subtle cosmic overlay for depth */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px,
            ${colors.akshita.shadow} 0%, 
            transparent 40%)`,
          mixBlendMode: 'soft-light'
        }}
        animate={{
          opacity: isMouseMoving ? 0.6 : 0.2,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};