import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ImprovedLightningProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  isActive?: boolean;
  children?: React.ReactNode;
}

interface LightningBolt {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  segments: { x: number; y: number }[];
  branches: LightningBranch[];
  life: number;
  maxLife: number;
  thickness: number;
  color: string;
  opacity: number;
  glowIntensity: number;
}

interface LightningBranch {
  startIndex: number;
  segments: { x: number; y: number }[];
  thickness: number;
  life: number;
  maxLife: number;
  opacity: number;
}

const LIGHTNING_THEMES = {
  romantic: {
    colors: ['#FF69B4', '#FFB6C1', '#DDA0DD', '#DA70D6'],
    glowColor: '#FF69B4',
    intensity: 0.8
  },
  ethereal: {
    colors: ['#87CEEB', '#ADD8E6', '#E0E6FF', '#B0C4DE'],
    glowColor: '#87CEEB',
    intensity: 0.7
  },
  mystical: {
    colors: ['#9370DB', '#8A2BE2', '#BA55D3', '#DDA0DD'],
    glowColor: '#9370DB',
    intensity: 0.9
  }
};

export const ImprovedLightning: React.FC<ImprovedLightningProps> = ({
  className = '',
  intensity = 'medium',
  color = 'romantic',
  isActive = true,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [lightningBolts, setLightningBolts] = useState<LightningBolt[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isFlashing, setIsFlashing] = useState(false);

  const theme = LIGHTNING_THEMES[color as keyof typeof LIGHTNING_THEMES] || LIGHTNING_THEMES.romantic;

  // Generate realistic lightning path
  const generateLightningPath = useCallback((startX: number, startY: number, endX: number, endY: number): { x: number; y: number }[] => {
    const segments: { x: number; y: number }[] = [{ x: startX, y: startY }];
    const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const segmentCount = Math.floor(distance / 20) + 5;
    
    for (let i = 1; i < segmentCount; i++) {
      const progress = i / segmentCount;
      const baseX = startX + (endX - startX) * progress;
      const baseY = startY + (endY - startY) * progress;
      
      // Add randomness for natural lightning look
      const offsetX = (Math.random() - 0.5) * 40 * (1 - Math.abs(progress - 0.5) * 2);
      const offsetY = (Math.random() - 0.5) * 20;
      
      segments.push({
        x: baseX + offsetX,
        y: baseY + offsetY
      });
    }
    
    segments.push({ x: endX, y: endY });
    return segments;
  }, []);

  // Generate lightning branches
  const generateBranches = useCallback((mainPath: { x: number; y: number }[]): LightningBranch[] => {
    const branches: LightningBranch[] = [];
    const branchCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < branchCount; i++) {
      const startIndex = Math.floor(Math.random() * (mainPath.length - 2)) + 1;
      const startPoint = mainPath[startIndex];
      
      // Create branch endpoint
      const angle = (Math.random() - 0.5) * Math.PI * 0.6;
      const length = 50 + Math.random() * 100;
      const endX = startPoint.x + Math.cos(angle) * length;
      const endY = startPoint.y + Math.sin(angle) * length;
      
      const branchPath = generateLightningPath(startPoint.x, startPoint.y, endX, endY);
      
      branches.push({
        startIndex,
        segments: branchPath,
        thickness: 0.5 + Math.random() * 1.5,
        life: 30,
        maxLife: 30,
        opacity: 0.7
      });
    }
    
    return branches;
  }, [generateLightningPath]);

  // Create new lightning bolt
  const createLightningBolt = useCallback(() => {
    if (!dimensions.width || !dimensions.height) return;
    
    const startX = Math.random() * dimensions.width;
    const startY = -50;
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = dimensions.height + 50;
    
    const mainPath = generateLightningPath(startX, startY, endX, endY);
    const branches = generateBranches(mainPath);
    const colorIndex = Math.floor(Math.random() * theme.colors.length);
    
    const newBolt: LightningBolt = {
      id: Date.now().toString() + Math.random(),
      startX,
      startY,
      endX,
      endY,
      segments: mainPath,
      branches,
      life: 60,
      maxLife: 60,
      thickness: 2 + Math.random() * 3,
      color: theme.colors[colorIndex],
      opacity: 1,
      glowIntensity: theme.intensity
    };
    
    setLightningBolts(prev => [...prev, newBolt]);
    
    // Flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 100);
  }, [dimensions, generateLightningPath, generateBranches, theme]);

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

  // Lightning generation timer
  useEffect(() => {
    if (!isActive) return;

    const intensitySettings = {
      low: { interval: 8000, variance: 3000 },
      medium: { interval: 5000, variance: 2000 },
      high: { interval: 3000, variance: 1000 }
    };

    const settings = intensitySettings[intensity];
    
    const createBolt = () => {
      createLightningBolt();
      const nextDelay = settings.interval + (Math.random() - 0.5) * settings.variance;
      setTimeout(createBolt, nextDelay);
    };

    const initialDelay = Math.random() * 5000 + 2000;
    const timeout = setTimeout(createBolt, initialDelay);

    return () => clearTimeout(timeout);
  }, [isActive, intensity, createLightningBolt]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw lightning bolts
      setLightningBolts(prev => {
        return prev.filter(bolt => {
          // Update bolt life
          bolt.life--;
          bolt.opacity = bolt.life / bolt.maxLife;
          
          if (bolt.life <= 0) return false;
          
          // Draw main lightning bolt
          ctx.save();
          
          // Glow effect
          ctx.shadowColor = bolt.color;
          ctx.shadowBlur = 20 * bolt.glowIntensity;
          ctx.lineWidth = bolt.thickness;
          ctx.strokeStyle = `${bolt.color}${Math.floor(bolt.opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.lineCap = 'round';
          
          ctx.beginPath();
          bolt.segments.forEach((segment, index) => {
            if (index === 0) {
              ctx.moveTo(segment.x, segment.y);
            } else {
              ctx.lineTo(segment.x, segment.y);
            }
          });
          ctx.stroke();
          
          // Draw bright core
          ctx.shadowBlur = 10;
          ctx.lineWidth = bolt.thickness * 0.3;
          ctx.strokeStyle = `#FFFFFF${Math.floor(bolt.opacity * 200).toString(16).padStart(2, '0')}`;
          ctx.stroke();
          
          // Draw branches
          bolt.branches.forEach(branch => {
            branch.life--;
            branch.opacity = branch.life / branch.maxLife;
            
            if (branch.life > 0) {
              ctx.lineWidth = branch.thickness;
              ctx.strokeStyle = `${bolt.color}${Math.floor(branch.opacity * 150).toString(16).padStart(2, '0')}`;
              
              ctx.beginPath();
              branch.segments.forEach((segment, index) => {
                if (index === 0) {
                  ctx.moveTo(segment.x, segment.y);
                } else {
                  ctx.lineTo(segment.x, segment.y);
                }
              });
              ctx.stroke();
            }
          });
          
          ctx.restore();
          return true;
        });
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
  }, [isActive]);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 15 }}
    >
      {/* Lightning Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: isActive ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      
      {/* Flash effect */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFlashing ? 0.1 : 0 }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Children content */}
      <div className="relative z-20 pointer-events-auto">
        {children}
      </div>
    </div>
  );
};