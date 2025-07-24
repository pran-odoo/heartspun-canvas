import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useBackdropFilterCleanup } from './TabSwitchingFix';

interface GalaxyBackgroundProps {
  theme: 'morning' | 'evening' | 'night';
  isDarkMode?: boolean;
  mousePosition: { x: number; y: number };
  isActive?: boolean;
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
}

interface Nebula {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
}

const SOPHISTICATED_COLORS = {
  morning: {
    stars: ['#FFE4B5', '#F5DEB3', '#DDA0DD', '#E6E6FA'],
    nebula: ['rgba(255, 228, 181, 0.1)', 'rgba(221, 160, 221, 0.08)', 'rgba(230, 230, 250, 0.06)'],
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f4c75 50%, #1a1a2e 75%, #16213e 100%)',
    accent: '#E6E6FA'
  },
  evening: {
    stars: ['#DDA0DD', '#DA70D6', '#BA55D3', '#9370DB'],
    nebula: ['rgba(221, 160, 221, 0.12)', 'rgba(218, 112, 214, 0.1)', 'rgba(186, 85, 211, 0.08)'],
    background: 'linear-gradient(135deg, #2c1810 0%, #4a2c17 25%, #6b4423 50%, #2c1810 75%, #4a2c17 100%)',
    accent: '#DDA0DD'
  },
  night: {
    stars: ['#E0E6FF', '#C8D2FF', '#B0C4DE', '#9BB0D1'],
    nebula: ['rgba(224, 230, 255, 0.08)', 'rgba(200, 210, 255, 0.06)', 'rgba(176, 196, 222, 0.04)'],
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #1a1a2e 100%)',
    accent: '#E0E6FF'
  }
};

export const SophisticatedGalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  theme,
  isDarkMode = false,
  mousePosition,
  isActive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [stars, setStars] = useState<Star[]>([]);
  const [nebulas, setNebulas] = useState<Nebula[]>([]);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  
  // Use the backdrop filter cleanup hook
  useBackdropFilterCleanup();

  // Get current color scheme
  const colors = SOPHISTICATED_COLORS[theme];

  // Initialize stars with sophisticated distribution
  const initializeStars = useCallback((width: number, height: number) => {
    const starCount = 300;
    const newStars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      // Create constellation patterns for some stars
      const isConstellation = Math.random() < 0.15;
      
      newStars.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000,
        size: isConstellation ? Math.random() * 3 + 1 : Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        color: colors.stars[Math.floor(Math.random() * colors.stars.length)],
        twinkle: Math.random() * Math.PI * 2,
        constellation: isConstellation
      });
    }

    return newStars;
  }, [colors.stars]);

  // Initialize nebulas for depth
  const initializeNebulas = useCallback((width: number, height: number) => {
    const nebulaCount = 8;
    const newNebulas: Nebula[] = [];

    for (let i = 0; i < nebulaCount; i++) {
      newNebulas.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 400 + 200,
        color: colors.nebula[Math.floor(Math.random() * colors.nebula.length)],
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * 360
      });
    }

    return newNebulas;
  }, [colors.nebula]);

  // Mouse tracking
  useEffect(() => {
    setIsMouseMoving(true);
    const timeout = setTimeout(() => {
      setIsMouseMoving(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, [mousePosition]);

  // Canvas setup and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      setStars(initializeStars(canvas.width, canvas.height));
      setNebulas(initializeNebulas(canvas.width, canvas.height));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [initializeStars, initializeNebulas]);

  // Animation loop
  useEffect(() => {
    if (!isActive) return;

    const animate = (time: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate mouse influence
      const mouseInfluence = isMouseMoving ? 1.2 : 1;
      const mouseX = mousePosition.x / canvas.width;
      const mouseY = mousePosition.y / canvas.height;

      // Draw nebulas first (background layer)
      nebulas.forEach((nebula, index) => {
        ctx.save();
        
        // Subtle rotation and movement
        const rotation = nebula.rotation + time * 0.0001;
        const offsetX = Math.sin(time * 0.0002 + index) * 20;
        const offsetY = Math.cos(time * 0.0003 + index) * 15;
        
        ctx.translate(nebula.x + offsetX, nebula.y + offsetY);
        ctx.rotate(rotation);
        
        // Create gradient for nebula
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.size);
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(0.3, nebula.color.replace(/[^,]+(?=\))/, '0.02'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-nebula.size/2, -nebula.size/2, nebula.size, nebula.size);
        
        ctx.restore();
      });

      // Draw stars with sophisticated effects
      stars.forEach((star) => {
        // Update star position (subtle parallax)
        const parallaxFactor = star.z / 1000;
        const deltaX = (mouseX - 0.5) * 50 * parallaxFactor * mouseInfluence;
        const deltaY = (mouseY - 0.5) * 50 * parallaxFactor * mouseInfluence;
        
        const x = star.x + deltaX;
        const y = star.y + deltaY;
        
        // Update twinkle
        star.twinkle += star.speed * 0.02;
        
        // Calculate opacity with sophisticated twinkling
        const twinkleIntensity = Math.sin(star.twinkle) * 0.5 + 0.5;
        const baseOpacity = star.constellation ? 0.9 : 0.7;
        const opacity = baseOpacity * twinkleIntensity * (star.z / 1000 + 0.3);
        
        // Draw star with glow effect
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Main star
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect for larger stars
        if (star.size > 1.5) {
          ctx.globalAlpha = opacity * 0.3;
          ctx.beginPath();
          ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Constellation connections
        if (star.constellation && Math.random() < 0.3) {
          const nearbyStars = stars.filter(s => 
            s.constellation && 
            s.id !== star.id && 
            Math.abs(s.x - star.x) < 150 && 
            Math.abs(s.y - star.y) < 150
          );
          
          if (nearbyStars.length > 0) {
            const nearestStar = nearbyStars[0];
            ctx.globalAlpha = opacity * 0.2;
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

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars, nebulas, isActive, mousePosition, isMouseMoving]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Sophisticated gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #000000 100%)'
            : colors.background,
          transition: 'background 1s ease-in-out'
        }}
      />
      
      {/* Galaxy canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          mixBlendMode: isDarkMode ? 'screen' : 'normal',
          opacity: isActive ? 1 : 0.5,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
      
      {/* Sophisticated overlay for text readability */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(255, 255, 255, ${isDarkMode ? '0.03' : '0.08'}) 0%,
            rgba(255, 255, 255, ${isDarkMode ? '0.01' : '0.04'}) 40%,
            transparent 70%)`,
        }}
        animate={{
          opacity: isMouseMoving ? 0.8 : 0.4,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Elegant vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 60%, ${
            isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'
          } 100%)`,
        }}
      />
    </div>
  );
};