import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBackdropFilterCleanup, preserveFilterOnElement } from './TabSwitchingFix';

interface EnhancedGalaxyBackgroundProps {
  theme: 'morning' | 'evening' | 'night';
  isDarkMode?: boolean;
  mousePosition: { x: number; y: number };
  isActive?: boolean;
  className?: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  color: string;
  twinkle: number;
  constellation?: boolean;
  brightness: number;
  life: number;
}

interface Nebula {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  speed: number;
  depth: number;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
  life: number;
}

const ENHANCED_GALAXY_COLORS = {
  morning: {
    stars: ['#FFE4B5', '#F5DEB3', '#DDA0DD', '#E6E6FA', '#FFFACD', '#F0E68C'],
    nebula: [
      'rgba(255, 228, 181, 0.12)', 
      'rgba(221, 160, 221, 0.1)', 
      'rgba(230, 230, 250, 0.08)',
      'rgba(240, 230, 140, 0.06)'
    ],
    background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 35%, #0f4c75 70%, #1a1a2e 100%)',
    accent: '#E6E6FA',
    shootingStars: '#FFE4B5'
  },
  evening: {
    stars: ['#DDA0DD', '#DA70D6', '#BA55D3', '#9370DB', '#8B4513', '#CD853F'],
    nebula: [
      'rgba(221, 160, 221, 0.15)', 
      'rgba(218, 112, 214, 0.12)', 
      'rgba(186, 85, 211, 0.1)',
      'rgba(139, 69, 19, 0.08)'
    ],
    background: 'radial-gradient(ellipse at center, #2c1810 0%, #4a2c17 35%, #6b4423 70%, #2c1810 100%)',
    accent: '#DDA0DD',
    shootingStars: '#DA70D6'
  },
  night: {
    stars: ['#E0E6FF', '#C8D2FF', '#B0C4DE', '#9BB0D1', '#6495ED', '#4682B4'],
    nebula: [
      'rgba(224, 230, 255, 0.1)', 
      'rgba(200, 210, 255, 0.08)', 
      'rgba(176, 196, 222, 0.06)',
      'rgba(100, 149, 237, 0.04)'
    ],
    background: 'radial-gradient(ellipse at center, #0f0f23 0%, #1a1a2e 35%, #16213e 70%, #0f0f23 100%)',
    accent: '#E0E6FF',
    shootingStars: '#C8D2FF'
  }
};

export const EnhancedGalaxyBackground: React.FC<EnhancedGalaxyBackgroundProps> = ({
  theme,
  isDarkMode = false,
  mousePosition,
  isActive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [stars, setStars] = useState<Star[]>([]);
  const [nebulas, setNebulas] = useState<Nebula[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const timeRef = useRef(0);
  
  // Use the backdrop filter cleanup hook
  useBackdropFilterCleanup();

  // Memoize color scheme to prevent unnecessary recalculations
  const colors = useMemo(() => ENHANCED_GALAXY_COLORS[theme], [theme]);

  // Enhanced star initialization with better distribution
  const initializeStars = useCallback((width: number, height: number) => {
    const starCount = Math.min(800, Math.max(300, Math.floor((width * height) / 3000)));
    const newStars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const isConstellation = Math.random() < 0.12;
      const isSpecial = Math.random() < 0.05;
      
      newStars.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000 + 100,
        size: isSpecial ? Math.random() * 4 + 2 : (isConstellation ? Math.random() * 3 + 1 : Math.random() * 2 + 0.5),
        speed: Math.random() * 0.8 + 0.2,
        color: colors.stars[Math.floor(Math.random() * colors.stars.length)],
        twinkle: Math.random() * Math.PI * 2,
        constellation: isConstellation,
        brightness: Math.random() * 0.8 + 0.2,
        life: Math.random() * 1000 + 500
      });
    }

    return newStars;
  }, [colors.stars]);

  // Enhanced nebula initialization
  const initializeNebulas = useCallback((width: number, height: number) => {
    const nebulaCount = 12;
    const newNebulas: Nebula[] = [];

    for (let i = 0; i < nebulaCount; i++) {
      newNebulas.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 600 + 300,
        color: colors.nebula[Math.floor(Math.random() * colors.nebula.length)],
        opacity: Math.random() * 0.4 + 0.2,
        rotation: Math.random() * 360,
        speed: Math.random() * 0.5 + 0.1,
        depth: Math.random() * 0.8 + 0.2
      });
    }

    return newNebulas;
  }, [colors.nebula]);

  // Initialize shooting stars
  const createShootingStar = useCallback((width: number, height: number) => {
    const edge = Math.floor(Math.random() * 4);
    let x, y, angle;
    
    switch (edge) {
      case 0: // Top
        x = Math.random() * width;
        y = -50;
        angle = Math.random() * 60 + 60; // 60-120 degrees
        break;
      case 1: // Right
        x = width + 50;
        y = Math.random() * height;
        angle = Math.random() * 60 + 150; // 150-210 degrees
        break;
      case 2: // Bottom
        x = Math.random() * width;
        y = height + 50;
        angle = Math.random() * 60 + 240; // 240-300 degrees
        break;
      default: // Left
        x = -50;
        y = Math.random() * height;
        angle = Math.random() * 60 + 330; // 330-390 degrees
        break;
    }

    return {
      x,
      y,
      angle: angle * Math.PI / 180,
      speed: Math.random() * 8 + 4,
      length: Math.random() * 100 + 50,
      opacity: Math.random() * 0.8 + 0.2,
      life: Math.random() * 300 + 100
    };
  }, []);

  // Mouse tracking with debouncing
  useEffect(() => {
    setIsMouseMoving(true);
    const timeout = setTimeout(() => setIsMouseMoving(false), 150);
    return () => clearTimeout(timeout);
  }, [mousePosition]);

  // Canvas setup and resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const { width, height } = rect;
      
      // Use device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      setDimensions({ width, height });
      setStars(initializeStars(width, height));
      setNebulas(initializeNebulas(width, height));
    };

    handleResize();
    
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    return () => resizeObserver.disconnect();
  }, [initializeStars, initializeNebulas]);

  // Shooting star management
  useEffect(() => {
    if (!isActive || dimensions.width === 0) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        setShootingStars(prev => [
          ...prev.filter(star => star.life > 0),
          createShootingStar(dimensions.width, dimensions.height)
        ]);
      }
    }, 2000 + Math.random() * 3000); // 2-5 second intervals

    return () => clearInterval(interval);
  }, [isActive, dimensions, createShootingStar]);

  // Main animation loop
  useEffect(() => {
    if (!isActive || dimensions.width === 0) return;

    const animate = (currentTime: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx) return;

      const deltaTime = currentTime - timeRef.current;
      timeRef.current = currentTime;

      // Clear canvas with performance optimization
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Calculate mouse influence
      const mouseInfluence = isMouseMoving ? 1.3 : 1;
      const mouseX = mousePosition.x / dimensions.width;
      const mouseY = mousePosition.y / dimensions.height;

      // Draw nebulas with enhanced effects
      nebulas.forEach((nebula, index) => {
        ctx.save();
        
        const time = currentTime * 0.0001;
        const rotation = nebula.rotation + time * nebula.speed * 10;
        const offsetX = Math.sin(time * 0.5 + index) * 30 * nebula.depth;
        const offsetY = Math.cos(time * 0.3 + index) * 20 * nebula.depth;
        const parallaxX = (mouseX - 0.5) * 40 * nebula.depth;
        const parallaxY = (mouseY - 0.5) * 40 * nebula.depth;
        
        ctx.translate(
          nebula.x + offsetX + parallaxX, 
          nebula.y + offsetY + parallaxY
        );
        ctx.rotate(rotation);
        
        // Create complex gradient for more realistic nebula
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.size);
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(0.4, nebula.color.replace(/[^,]+(?=\))/, (nebula.opacity * 0.3).toString()));
        gradient.addColorStop(0.7, nebula.color.replace(/[^,]+(?=\))/, (nebula.opacity * 0.1).toString()));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-nebula.size/2, -nebula.size/2, nebula.size, nebula.size);
        
        ctx.restore();
      });

      // Draw stars with enhanced effects
      stars.forEach((star) => {
        const parallaxFactor = (1000 - star.z) / 1000;
        const deltaX = (mouseX - 0.5) * 60 * parallaxFactor * mouseInfluence;
        const deltaY = (mouseY - 0.5) * 60 * parallaxFactor * mouseInfluence;
        
        const x = star.x + deltaX;
        const y = star.y + deltaY;
        
        // Update twinkle with time-based animation
        star.twinkle += star.speed * 0.03;
        star.life -= deltaTime * 0.001;
        
        if (star.life <= 0) {
          star.life = Math.random() * 1000 + 500;
          star.twinkle = Math.random() * Math.PI * 2;
        }

        // Skip stars outside viewport
        if (x < -50 || x >= dimensions.width + 50 || y < -50 || y >= dimensions.height + 50) {
          return;
        }

        // Calculate enhanced twinkling
        const twinkleIntensity = Math.sin(star.twinkle) * 0.5 + 0.5;
        const depthOpacity = parallaxFactor * 0.7 + 0.3;
        const lifeOpacity = Math.min(star.life / 100, 1);
        const opacity = star.brightness * twinkleIntensity * depthOpacity * lifeOpacity;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Main star
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(x, y, star.size * parallaxFactor, 0, Math.PI * 2);
        ctx.fill();
        
        // Enhanced glow for larger stars
        if (star.size > 1.8) {
          ctx.globalAlpha = opacity * 0.4;
          ctx.beginPath();
          ctx.arc(x, y, star.size * 4 * parallaxFactor, 0, Math.PI * 2);
          ctx.fill();
          
          // Extra bright core
          ctx.globalAlpha = opacity * 0.8;
          ctx.beginPath();
          ctx.arc(x, y, star.size * 0.5 * parallaxFactor, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Constellation connections
        if (star.constellation && Math.random() < 0.02) {
          const nearbyStars = stars.filter(s => 
            s.constellation && 
            s.id !== star.id && 
            Math.abs(s.x - star.x) < 120 && 
            Math.abs(s.y - star.y) < 120
          );
          
          if (nearbyStars.length > 0) {
            const nearestStar = nearbyStars[0];
            ctx.globalAlpha = opacity * 0.3;
            ctx.strokeStyle = star.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nearestStar.x + deltaX, nearestStar.y + deltaY);
            ctx.stroke();
          }
        }
        
        ctx.restore();
      });

      // Draw shooting stars
      setShootingStars(prev => prev.map(shootingStar => {
        if (shootingStar.life <= 0) return null;
        
        ctx.save();
        
        const gradient = ctx.createLinearGradient(
          shootingStar.x, 
          shootingStar.y,
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        gradient.addColorStop(0, colors.shootingStars);
        gradient.addColorStop(0.5, colors.shootingStars + '80');
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = shootingStar.opacity;
        
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        ctx.stroke();
        
        ctx.restore();
        
        // Update position
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.life -= deltaTime * 0.01;
        
        return shootingStar;
      }).filter(Boolean) as ShootingStar[]);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars, nebulas, isActive, mousePosition, isMouseMoving, dimensions, colors, shootingStars]);

  // Preserve the canvas element from blur cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      preserveFilterOnElement(canvas);
    }
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-0 overflow-hidden ${className}`}
      style={{ isolation: 'isolate' }} // Prevent filter inheritance
    >
      {/* Enhanced gradient background */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: isDarkMode 
            ? 'radial-gradient(ellipse at center, #000000 0%, #0f0f23 50%, #000000 100%)'
            : colors.background,
        }}
        animate={{
          background: isDarkMode 
            ? 'radial-gradient(ellipse at center, #000000 0%, #0f0f23 50%, #000000 100%)'
            : colors.background,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Galaxy canvas with enhanced performance */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          mixBlendMode: isDarkMode ? 'screen' : 'normal',
          opacity: isActive ? 1 : 0.6,
          willChange: 'auto', // Let browser optimize
        }}
      />
      
      {/* Enhanced overlay for text readability - NO BACKDROP FILTER */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px,
            transparent 0%, 
            rgba(0, 0, 0, 0.1) 50%, 
            rgba(0, 0, 0, 0.2) 100%)`,
          opacity: isMouseMoving ? 0.7 : 0.3,
        }}
        animate={{
          opacity: isMouseMoving ? 0.7 : 0.3,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};