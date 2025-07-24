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
  speedX: number;
  speedY: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
  brightness: number;
  layer: number;
  baseOpacity: number;
  currentOpacity: number;
  rotationSpeed: number;
  distanceFromMouse: number;
  originalSpeed: number;
}

interface Nebula {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  speedX: number;
  speedY: number;
  pulsePhase: number;
  pulseSpeed: number;
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
  opacity: number;
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

// Star layer configuration for different movement speeds
const STAR_LAYERS = [
  { speed: 0.08, size: 'small', opacity: 0.4, count: 0.4 },     // Background stars (slowest)
  { speed: 0.15, size: 'medium', opacity: 0.7, count: 0.4 },    // Mid-layer stars
  { speed: 0.25, size: 'large', opacity: 1.0, count: 0.2 }      // Foreground stars (fastest)
];

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
  const galaxyRotationRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [nebulas, setNebulas] = useState<Nebula[]>([]);

  // Use the backdrop filter cleanup hook
  useBackdropFilterCleanup();

  // Memoized color scheme
  const colors = useMemo(() => COHESIVE_COLOR_SCHEME[theme], [theme]);

  // Generate living stars with movement vectors
  const generateStars = useCallback((width: number, height: number) => {
    const starCount = Math.min(1500, Math.max(800, Math.floor((width * height) / 1800)));
    const newStars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const layerIndex = Math.random() < 0.4 ? 0 : Math.random() < 0.7 ? 1 : 2;
      const layer = STAR_LAYERS[layerIndex];
      const x = Math.random() * (width + 200) - 100; // Extended bounds for smooth wrapping
      const y = Math.random() * (height + 200) - 100;
      
      // Generate natural movement speeds
      const baseSpeed = layer.speed;
      const speedVariation = baseSpeed * 0.5;
      const speedX = (Math.random() - 0.5) * baseSpeed + (Math.random() - 0.5) * speedVariation;
      const speedY = (Math.random() - 0.5) * baseSpeed * 0.3 + (Math.random() - 0.5) * speedVariation * 0.3;
      
      newStars.push({
        id: `star-${i}-${Date.now()}`,
        x,
        y,
        z: 100 + layerIndex * 300,
        size: (Math.random() * 1.5 + 0.5) * (layerIndex === 0 ? 0.8 : layerIndex === 1 ? 1.2 : 1.8),
        speedX,
        speedY,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: [colors.stars.primary, colors.stars.secondary, colors.stars.accent, colors.stars.twinkle][Math.floor(Math.random() * 4)],
        brightness: Math.random() * 0.6 + 0.4,
        layer: layerIndex,
        baseOpacity: layer.opacity * (Math.random() * 0.4 + 0.6),
        currentOpacity: layer.opacity * (Math.random() * 0.4 + 0.6),
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        distanceFromMouse: 0,
        originalSpeed: baseSpeed
      });
    }

    return newStars;
  }, [colors.stars]);

  // Generate living nebula clouds
  const generateNebulas = useCallback((width: number, height: number) => {
    const nebulaCount = 12;
    const newNebulas: Nebula[] = [];

    for (let i = 0; i < nebulaCount; i++) {
      newNebulas.push({
        id: `nebula-${i}-${Date.now()}`,
        x: Math.random() * (width + 400) - 200,
        y: Math.random() * (height + 400) - 200,
        size: Math.random() * 600 + 300,
        color: [colors.nebula.primary, colors.nebula.secondary, colors.nebula.accent][Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.25 + 0.05,
        rotation: Math.random() * 360,
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005
      });
    }

    return newNebulas;
  }, [colors.nebula]);

  // Initialize stars and nebulas when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setStars(generateStars(dimensions.width, dimensions.height));
      setNebulas(generateNebulas(dimensions.width, dimensions.height));
    }
  }, [dimensions, generateStars, generateNebulas]);

  // Mouse movement detection
  useEffect(() => {
    setIsMouseMoving(true);
    const timeout = setTimeout(() => setIsMouseMoving(false), 150);
    return () => clearTimeout(timeout);
  }, [mousePosition]);

  // Enhanced star drawing with twinkling and glow
  const drawStar = useCallback((
    ctx: CanvasRenderingContext2D,
    star: Star,
    time: number,
    mouseInfluence: number
  ) => {
    const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
    const finalOpacity = star.currentOpacity * twinkle * star.brightness;
    
    if (finalOpacity < 0.05) return;

    ctx.save();
    
    // Glow effect for larger stars
    if (star.size > 1.2) {
      const glowRadius = star.size * 4 * (1 + mouseInfluence * 0.3);
      const glowGradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, glowRadius
      );
      glowGradient.addColorStop(0, star.color + Math.floor(finalOpacity * 100).toString(16).padStart(2, '0'));
      glowGradient.addColorStop(0.3, star.color + Math.floor(finalOpacity * 40).toString(16).padStart(2, '0'));
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Main star body
    ctx.globalAlpha = finalOpacity;
    ctx.fillStyle = star.color;
    
    // Add subtle rotation for visual interest
    if (star.size > 1) {
      ctx.translate(star.x, star.y);
      ctx.rotate(time * star.rotationSpeed);
      ctx.translate(-star.x, -star.y);
    }
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Bright core for larger stars
    if (star.size > 1.5) {
      ctx.globalAlpha = finalOpacity * 1.2;
      ctx.fillStyle = colors.stars.primary;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }, [colors.stars.primary]);

  // Enhanced nebula drawing with movement
  const drawNebula = useCallback((
    ctx: CanvasRenderingContext2D,
    nebula: Nebula,
    time: number
  ) => {
    const pulse = Math.sin(time * nebula.pulseSpeed + nebula.pulsePhase) * 0.3 + 0.7;
    const finalOpacity = nebula.opacity * pulse;
    
    ctx.save();
    ctx.globalAlpha = finalOpacity;
    
    // Create nebula gradient
    const gradient = ctx.createRadialGradient(
      nebula.x, nebula.y, 0,
      nebula.x, nebula.y, nebula.size
    );
    gradient.addColorStop(0, nebula.color);
    gradient.addColorStop(0.4, nebula.color.replace(/[\d\.]+\)$/, '0.05)'));
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.translate(nebula.x, nebula.y);
    ctx.rotate((nebula.rotation + time * 0.001) * Math.PI / 180);
    ctx.scale(1 + Math.sin(time * 0.0008) * 0.1, 1 + Math.cos(time * 0.0006) * 0.1);
    
    ctx.beginPath();
    ctx.arc(0, 0, nebula.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, []);

  // Mouse trail particle drawing
  const drawMouseTrail = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(particle => {
      const alpha = (particle.life / particle.maxLife) * particle.opacity;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      
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

  // MAIN ANIMATION LOOP WITH LIVING STAR MOVEMENT
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 16; // ~60fps
    const time = timeRef.current;
    
    // Update galaxy rotation
    galaxyRotationRef.current += 0.0002; // Very slow rotation

    // Clear canvas with animated gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    const rotationOffset = Math.sin(time * 0.0001) * 0.1;
    gradient.addColorStop(0, colors.background.primary);
    gradient.addColorStop(0.5 + rotationOffset, colors.background.secondary);
    gradient.addColorStop(1, colors.background.accent);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply slow galaxy rotation
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(galaxyRotationRef.current);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Update and draw nebulas with movement
    nebulas.forEach(nebula => {
      // Continuous drift movement
      nebula.x += nebula.speedX;
      nebula.y += nebula.speedY;
      
      // Add subtle orbital motion
      nebula.x += Math.sin(time * 0.0001 + nebula.pulsePhase) * 0.02;
      nebula.y += Math.cos(time * 0.0001 + nebula.pulsePhase) * 0.02;
      
      // Wrap around edges with buffer
      if (nebula.x < -nebula.size - 200) nebula.x = canvas.width + nebula.size + 200;
      if (nebula.x > canvas.width + nebula.size + 200) nebula.x = -nebula.size - 200;
      if (nebula.y < -nebula.size - 200) nebula.y = canvas.height + nebula.size + 200;
      if (nebula.y > canvas.height + nebula.size + 200) nebula.y = -nebula.size - 200;
      
      drawNebula(ctx, nebula, time);
    });

    // Update stars with LIVING MOVEMENT
    stars.forEach(star => {
      // Calculate distance from mouse for interaction
      const dx = star.x - mousePosition.x;
      const dy = star.y - mousePosition.y;
      star.distanceFromMouse = Math.sqrt(dx * dx + dy * dy);
      
      // Mouse repulsion effect
      const mouseInfluenceRadius = 150;
      let mouseForceX = 0;
      let mouseForceY = 0;
      
      if (star.distanceFromMouse < mouseInfluenceRadius && isMouseMoving) {
        const force = (mouseInfluenceRadius - star.distanceFromMouse) / mouseInfluenceRadius;
        const angle = Math.atan2(dy, dx);
        mouseForceX = Math.cos(angle) * force * 0.5;
        mouseForceY = Math.sin(angle) * force * 0.5;
      }
      
      // CONTINUOUS AMBIENT DRIFT - This is what makes stars ALIVE
      star.x += star.speedX + mouseForceX;
      star.y += star.speedY + mouseForceY;
      
      // Add subtle orbital motion for organic feel
      star.x += Math.sin(time * 0.0001 + star.twinklePhase) * star.originalSpeed * 0.3;
      star.y += Math.cos(time * 0.0001 + star.twinklePhase) * star.originalSpeed * 0.2;
      
      // Smooth wrapping at screen edges
      const wrapBuffer = 100;
      if (star.x < -wrapBuffer) star.x = canvas.width + wrapBuffer;
      if (star.x > canvas.width + wrapBuffer) star.x = -wrapBuffer;
      if (star.y < -wrapBuffer) star.y = canvas.height + wrapBuffer;
      if (star.y > canvas.height + wrapBuffer) star.y = -wrapBuffer;
      
      // Dynamic opacity based on mouse interaction
      const targetOpacity = star.distanceFromMouse < mouseInfluenceRadius && isMouseMoving
        ? star.baseOpacity * 1.3
        : star.baseOpacity;
      
      star.currentOpacity += (targetOpacity - star.currentOpacity) * 0.05;
    });

    // Draw stars by layer (back to front) for proper depth
    for (let layer = 2; layer >= 0; layer--) {
      stars.filter(star => star.layer === layer).forEach(star => {
        drawStar(ctx, star, time, isMouseMoving ? 1 : 0);
      });
    }

    ctx.restore(); // Restore from galaxy rotation

    // Add mouse trail particles for interactivity
    if (isMouseMoving) {
      for (let i = 0; i < 3; i++) {
        mouseTrailRef.current.push({
          id: `particle-${Date.now()}-${Math.random()}`,
          x: mousePosition.x + (Math.random() - 0.5) * 30,
          y: mousePosition.y + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          life: 80,
          maxLife: 80,
          size: Math.random() * 6 + 2,
          color: colors.akshita.glow,
          opacity: 0.8
        });
      }
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
      // Enable smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    // Preserve this element from blur cleanup
    preserveFilterOnElement(canvas);
  }, [dimensions]);

  // Start animation
  useEffect(() => {
    if (isActive && stars.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animate, stars.length]);

  return (
    <div 
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
      style={{ 
        isolation: 'isolate',
        contain: 'layout style paint',
        transform: 'translateZ(0)' // Hardware acceleration
      }}
    >
      {/* Canvas for living galaxy */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full galaxy-canvas"
        style={{
          willChange: 'contents',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Optional: Add subtle CSS rotation for extra motion */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, ${colors.background.primary}10 100%)`,
          mixBlendMode: 'overlay'
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 600, // 10 minutes for full rotation
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};