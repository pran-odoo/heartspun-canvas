import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useBackdropFilterCleanup, preserveFilterOnElement } from './TabSwitchingFix';

interface StunningLightningBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  isActive?: boolean;
}

interface LightningBolt {
  id: string;
  path: string;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  thickness: number;
  branches: LightningBranch[];
}

interface LightningBranch {
  id: string;
  path: string;
  opacity: number;
  thickness: number;
}

interface ElectricalParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

// EXACT LIGHTNING COLORS (ReactBits Style)
const LIGHTNING_COLORS = {
  primary: '#00d4ff',
  secondary: '#0099cc',
  accent: '#66e5ff',
  glow: '#00aadd',
  core: '#ffffff',
  particle: '#4dd0e7'
};

export const StunningLightningBackground: React.FC<StunningLightningBackgroundProps> = ({
  className = '',
  intensity = 'medium',
  color = LIGHTNING_COLORS.primary,
  isActive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lightningBolts, setLightningBolts] = useState<LightningBolt[]>([]);
  const [particles, setParticles] = useState<ElectricalParticle[]>([]);

  // Use the backdrop filter cleanup hook
  useBackdropFilterCleanup();

  // Lightning generation parameters based on intensity
  const getIntensitySettings = () => {
    switch (intensity) {
      case 'low':
        return { boltFrequency: 0.003, maxBolts: 2, particleCount: 15 };
      case 'medium':
        return { boltFrequency: 0.005, maxBolts: 3, particleCount: 25 };
      case 'high':
        return { boltFrequency: 0.008, maxBolts: 5, particleCount: 40 };
      default:
        return { boltFrequency: 0.005, maxBolts: 3, particleCount: 25 };
    }
  };

  // Generate lightning bolt path with realistic jagged pattern
  const generateLightningPath = useCallback((startX: number, startY: number, endX: number, endY: number): string => {
    const segments = 15;
    const roughness = 0.4;
    let path = `M ${startX} ${startY}`;
    
    for (let i = 1; i <= segments; i++) {
      const progress = i / segments;
      
      // Base position along straight line
      let x = startX + (endX - startX) * progress;
      let y = startY + (endY - startY) * progress;
      
      // Add jagged variation
      if (i < segments) {
        const maxOffset = Math.min(50, Math.abs(endX - startX) * roughness);
        x += (Math.random() - 0.5) * maxOffset;
        y += (Math.random() - 0.5) * maxOffset * 0.3;
      }
      
      path += ` L ${x} ${y}`;
    }
    
    return path;
  }, []);

  // Generate lightning branches
  const generateBranches = useCallback((mainPath: string, count: number): LightningBranch[] => {
    const branches: LightningBranch[] = [];
    const pathPoints = mainPath.split('L').slice(1);
    
    for (let i = 0; i < count && i < pathPoints.length; i++) {
      const pointIndex = Math.floor(Math.random() * pathPoints.length);
      const point = pathPoints[pointIndex].trim().split(' ');
      const startX = parseFloat(point[0]);
      const startY = parseFloat(point[1]);
      
      const branchLength = 50 + Math.random() * 100;
      const angle = (Math.random() - 0.5) * Math.PI;
      const endX = startX + Math.cos(angle) * branchLength;
      const endY = startY + Math.sin(angle) * branchLength;
      
      branches.push({
        id: `branch-${Date.now()}-${i}`,
        path: generateLightningPath(startX, startY, endX, endY),
        opacity: 0.6 + Math.random() * 0.4,
        thickness: 1 + Math.random() * 2
      });
    }
    
    return branches;
  }, [generateLightningPath]);

  // Create new lightning bolt
  const createLightningBolt = useCallback(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return null;

    // Random start and end points
    const startX = Math.random() * width;
    const startY = -20;
    const endX = startX + (Math.random() - 0.5) * width * 0.3;
    const endY = height + 20;
    
    const mainPath = generateLightningPath(startX, startY, endX, endY);
    const branches = generateBranches(mainPath, 2 + Math.floor(Math.random() * 3));
    
    return {
      id: `lightning-${Date.now()}-${Math.random()}`,
      path: mainPath,
      opacity: 0.8 + Math.random() * 0.2,
      life: 30 + Math.random() * 20, // frames
      maxLife: 50,
      color: color,
      thickness: 2 + Math.random() * 3,
      branches
    };
  }, [dimensions, generateLightningPath, generateBranches, color]);

  // Create electrical particles
  const createElectricalParticles = useCallback((bolt: LightningBolt, count: number): ElectricalParticle[] => {
    const particles: ElectricalParticle[] = [];
    const pathPoints = bolt.path.split('L').slice(1);
    
    for (let i = 0; i < count; i++) {
      if (pathPoints.length === 0) break;
      
      const point = pathPoints[Math.floor(Math.random() * pathPoints.length)].trim().split(' ');
      const x = parseFloat(point[0]) + (Math.random() - 0.5) * 20;
      const y = parseFloat(point[1]) + (Math.random() - 0.5) * 20;
      
      particles.push({
        id: `particle-${Date.now()}-${i}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: 1 + Math.random() * 3,
        life: 60 + Math.random() * 30,
        maxLife: 90,
        color: LIGHTNING_COLORS.particle
      });
    }
    
    return particles;
  }, []);

  // Canvas drawing functions
  const drawLightningBolt = useCallback((
    ctx: CanvasRenderingContext2D,
    bolt: LightningBolt
  ) => {
    ctx.save();
    
    // Outer glow
    ctx.shadowColor = bolt.color;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = bolt.opacity * 0.3;
    ctx.strokeStyle = bolt.color;
    ctx.lineWidth = bolt.thickness * 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const path = new Path2D(bolt.path);
    ctx.stroke(path);
    
    // Inner bright core
    ctx.shadowBlur = 5;
    ctx.globalAlpha = bolt.opacity;
    ctx.strokeStyle = LIGHTNING_COLORS.core;
    ctx.lineWidth = bolt.thickness;
    ctx.stroke(path);
    
    // Draw branches
    bolt.branches.forEach(branch => {
      ctx.globalAlpha = branch.opacity * bolt.opacity * 0.7;
      ctx.strokeStyle = bolt.color;
      ctx.lineWidth = branch.thickness;
      
      const branchPath = new Path2D(branch.path);
      ctx.stroke(branchPath);
    });
    
    ctx.restore();
  }, []);

  const drawElectricalParticle = useCallback((
    ctx: CanvasRenderingContext2D,
    particle: ElectricalParticle
  ) => {
    const alpha = particle.life / particle.maxLife;
    
    ctx.save();
    ctx.globalAlpha = alpha * 0.8;
    
    // Particle glow
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(0.5, particle.color + '80');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bright core
    ctx.fillStyle = LIGHTNING_COLORS.core;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 1;
    const settings = getIntensitySettings();

    // Clear canvas with dark background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate new lightning bolts
    setLightningBolts(prevBolts => {
      let bolts = [...prevBolts];
      
      // Add new bolt occasionally
      if (Math.random() < settings.boltFrequency && bolts.length < settings.maxBolts) {
        const newBolt = createLightningBolt();
        if (newBolt) {
          bolts.push(newBolt);
          
          // Create particles for this bolt
          setParticles(prevParticles => [
            ...prevParticles,
            ...createElectricalParticles(newBolt, settings.particleCount)
          ]);
        }
      }
      
      // Update and filter bolts
      bolts = bolts.map(bolt => ({ ...bolt, life: bolt.life - 1 }))
                   .filter(bolt => bolt.life > 0);
      
      return bolts;
    });

    // Update particles
    setParticles(prevParticles => {
      return prevParticles.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.vx * 0.98,
        vy: particle.vy * 0.98,
        life: particle.life - 1
      })).filter(particle => particle.life > 0);
    });

    // Draw lightning bolts
    lightningBolts.forEach(bolt => drawLightningBolt(ctx, bolt));
    
    // Draw particles
    particles.forEach(particle => drawElectricalParticle(ctx, particle));

    animationRef.current = requestAnimationFrame(animate);
  }, [isActive, lightningBolts, particles, createLightningBolt, createElectricalParticles, drawLightningBolt, drawElectricalParticle, getIntensitySettings]);

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
      {/* Dark gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, #0a0a0a 0%, #000000 50%),
            linear-gradient(180deg, #001122 0%, #000000 100%)
          `
        }}
      />

      {/* Lightning canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          mixBlendMode: 'screen',
          opacity: isActive ? 1 : 0.6,
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* Atmospheric overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(0, 170, 221, 0.05) 0%, transparent 50%)
          `,
          mixBlendMode: 'soft-light'
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};