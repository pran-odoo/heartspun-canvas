import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinklePhase: number;
  brightness: number;
  color: string;
  zIndex: number;
}

interface ImprovedGalaxyProps {
  theme: 'morning' | 'evening' | 'night';
  mousePosition: { x: number; y: number };
  isActive?: boolean;
  className?: string;
}

const GALAXY_THEMES = {
  morning: {
    starColors: ['#FFE4B5', '#F0E68C', '#DDD6C1', '#E6D2AA', '#F5DEB3'],
    background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 35%, #0f4c75 70%, #1a1a2e 100%)',
    starCount: 300,
    coreIntensity: 0.8
  },
  evening: {
    starColors: ['#DDA0DD', '#DA70D6', '#FF69B4', '#FFB6C1', '#F0E6FF'],
    background: 'radial-gradient(ellipse at center, #2c1810 0%, #4a2c17 35%, #6b4423 70%, #2c1810 100%)',
    starCount: 400,
    coreIntensity: 0.9
  },
  night: {
    starColors: ['#E0E6FF', '#B0C4DE', '#87CEEB', '#ADD8E6', '#F0F8FF'],
    background: 'radial-gradient(ellipse at center, #0f0f23 0%, #1a1a2e 35%, #16213e 70%, #0f0f23 100%)',
    starCount: 500,
    coreIntensity: 1.0
  }
};

export const ImprovedGalaxy: React.FC<ImprovedGalaxyProps> = ({
  theme,
  mousePosition,
  isActive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [stars, setStars] = useState<Star[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Generate realistic galaxy star distribution
  const generateGalaxyStars = useCallback((width: number, height: number, theme: keyof typeof GALAXY_THEMES) => {
    const themeConfig = GALAXY_THEMES[theme];
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.6;
    const newStars: Star[] = [];

    // Generate stars with spiral galaxy distribution
    for (let i = 0; i < themeConfig.starCount; i++) {
      // Create spiral arms
      const armIndex = Math.floor(Math.random() * 3); // 3 spiral arms
      const armAngle = (armIndex * 120 + Math.random() * 60) * (Math.PI / 180);
      
      // Distance from center with concentration towards core
      const r = Math.random();
      const distance = (r * r * r) * maxRadius; // Cubic distribution for galaxy core concentration
      
      // Add spiral shape
      const spiralFactor = distance / maxRadius * 2 * Math.PI;
      const angle = armAngle + spiralFactor + (Math.random() - 0.5) * 0.5;
      
      // Position with some random scatter
      const scatter = (Math.random() - 0.5) * distance * 0.3;
      const x = centerX + Math.cos(angle) * distance + scatter;
      const y = centerY + Math.sin(angle) * distance + scatter * 0.5;
      
      // Skip if outside canvas
      if (x < 0 || x > width || y < 0 || y > height) continue;
      
      // Size based on distance from center (core stars are brighter)
      const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const coreInfluence = Math.max(0, 1 - distanceFromCenter / maxRadius);
      const baseSize = 0.5 + Math.random() * 2;
      const size = baseSize + coreInfluence * 2;
      
      // Brightness and opacity
      const brightness = 0.3 + Math.random() * 0.7 + coreInfluence * 0.5;
      const opacity = Math.min(1, 0.4 + brightness * 0.6);
      
      // Color selection
      const colorIndex = Math.floor(Math.random() * themeConfig.starColors.length);
      const color = themeConfig.starColors[colorIndex];
      
      newStars.push({
        id: i,
        x,
        y,
        size,
        opacity,
        speed: 0.5 + Math.random() * 1.5,
        twinklePhase: Math.random() * Math.PI * 2,
        brightness,
        color,
        zIndex: Math.floor(brightness * 10)
      });
    }

    // Sort by zIndex to render background stars first
    return newStars.sort((a, b) => a.zIndex - b.zIndex);
  }, []);

  // Initialize stars when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const newStars = generateGalaxyStars(dimensions.width, dimensions.height, theme);
      setStars(newStars);
    }
  }, [dimensions, theme, generateGalaxyStars]);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stars.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars with twinkling effect
      stars.forEach((star, index) => {
        // Twinkling animation
        const twinkle = Math.sin(time * star.speed + star.twinklePhase) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;
        const currentSize = star.size * (0.8 + twinkle * 0.4);
        
        // Mouse interaction - subtle repulsion
        const mouseDistance = Math.sqrt(
          (mousePosition.x - star.x) ** 2 + (mousePosition.y - star.y) ** 2
        );
        
        let offsetX = 0;
        let offsetY = 0;
        if (mouseDistance < 100) {
          const force = (100 - mouseDistance) / 100 * 10;
          const angle = Math.atan2(star.y - mousePosition.y, star.x - mousePosition.x);
          offsetX = Math.cos(angle) * force;
          offsetY = Math.sin(angle) * force;
        }
        
        // Draw star with glow effect
        ctx.save();
        
        // Glow effect for brighter stars
        if (star.brightness > 0.7) {
          const gradient = ctx.createRadialGradient(
            star.x + offsetX, star.y + offsetY, 0,
            star.x + offsetX, star.y + offsetY, currentSize * 3
          );
          gradient.addColorStop(0, `${star.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, `${star.color}00`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x + offsetX, star.y + offsetY, currentSize * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Main star
        ctx.fillStyle = `${star.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright core for larger stars
        if (currentSize > 2) {
          ctx.fillStyle = `#FFFFFF${Math.floor(currentOpacity * 128).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.arc(star.x + offsetX, star.y + offsetY, currentSize * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });
      
      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars, mousePosition, isActive]);

  const themeConfig = GALAXY_THEMES[theme];

  return (
    <div 
      className={`fixed inset-0 z-0 overflow-hidden ${className}`}
      style={{ 
        isolation: 'isolate',
        contain: 'layout style paint',
        pointerEvents: 'none'
      }}
    >
      {/* Enhanced gradient background */}
      <motion.div 
        className="absolute inset-0"
        style={{ background: themeConfig.background }}
        animate={{ background: themeConfig.background }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Galaxy Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: isActive ? 1 : 0.6,
          transition: 'opacity 0.5s ease-in-out',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Subtle nebula overlay for depth */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse 800px 400px at 30% 20%, ${themeConfig.starColors[0]}20, transparent),
                       radial-gradient(ellipse 600px 300px at 70% 80%, ${themeConfig.starColors[1]}15, transparent)`
        }}
      />
    </div>
  );
};