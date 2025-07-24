import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ReactBitsLightningProps {
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
  animationProgress: number;
}

interface LightningBranch {
  startIndex: number;
  segments: { x: number; y: number }[];
  thickness: number;
  life: number;
  maxLife: number;
}

interface ElectricParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  opacity: number;
}

// EXACT REACTBITS LIGHTNING COLORS - Enhanced for visibility
const LIGHTNING_COLORS = {
  primary: '#8B5CF6',      // Purple like ReactBits demo
  secondary: '#A855F7',    // Lighter purple
  accent: '#C084FC',       // Even lighter purple
  core: '#FFFFFF',         // White core
  glow: '#9333EA',         // Purple glow
  particle: '#DDD6FE',     // Light purple particles
  background: '#0f0a1a'    // Very dark purple background
};

export const ReactBitsLightning: React.FC<ReactBitsLightningProps> = ({
  className = '',
  intensity = 'medium',
  color = LIGHTNING_COLORS.primary,
  isActive = true,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lightningBolts, setLightningBolts] = useState<LightningBolt[]>([]);
  const [particles, setParticles] = useState<ElectricParticle[]>([]);

  // Lightning generation parameters based on intensity - ENHANCED for visibility
  const getIntensitySettings = () => {
    switch (intensity) {
      case 'low':
        return { 
          boltFrequency: 0.015,   // Much more frequent
          maxBolts: 3, 
          particleCount: 20,
          minThickness: 3,
          maxThickness: 6
        };
      case 'medium':
        return { 
          boltFrequency: 0.025,   // Very frequent
          maxBolts: 5, 
          particleCount: 35,
          minThickness: 4,
          maxThickness: 8
        };
      case 'high':
        return { 
          boltFrequency: 0.035,   // Extremely frequent
          maxBolts: 7, 
          particleCount: 50,
          minThickness: 5,
          maxThickness: 12
        };
      default:
        return { 
          boltFrequency: 0.025, 
          maxBolts: 5, 
          particleCount: 35,
          minThickness: 4,
          maxThickness: 8
        };
    }
  };

  // Generate realistic lightning path with jagged segments
  const generateLightningPath = useCallback((
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number
  ): { x: number; y: number }[] => {
    const segments: { x: number; y: number }[] = [];
    const segmentCount = 12 + Math.floor(Math.random() * 8);
    const roughness = 0.6;
    
    segments.push({ x: startX, y: startY });
    
    for (let i = 1; i < segmentCount; i++) {
      const progress = i / segmentCount;
      
      // Base position along straight line
      let x = startX + (endX - startX) * progress;
      let y = startY + (endY - startY) * progress;
      
      // Add realistic jaggedness
      if (i < segmentCount - 1) {
        const maxOffset = Math.min(80, Math.abs(endX - startX) * roughness);
        x += (Math.random() - 0.5) * maxOffset;
        y += (Math.random() - 0.5) * maxOffset * 0.4;
      }
      
      segments.push({ x, y });
    }
    
    segments.push({ x: endX, y: endY });
    return segments;
  }, []);

  // Generate lightning branches for realism
  const generateBranches = useCallback((
    mainSegments: { x: number; y: number }[], 
    count: number
  ): LightningBranch[] => {
    const branches: LightningBranch[] = [];
    
    for (let i = 0; i < count; i++) {
      const startIndex = Math.floor(Math.random() * (mainSegments.length - 2)) + 1;
      const startPoint = mainSegments[startIndex];
      
      const branchLength = 40 + Math.random() * 80;
      const angle = (Math.random() - 0.5) * Math.PI * 0.8;
      const endX = startPoint.x + Math.cos(angle) * branchLength;
      const endY = startPoint.y + Math.sin(angle) * branchLength;
      
      const branchSegments = generateLightningPath(
        startPoint.x, 
        startPoint.y, 
        endX, 
        endY
      ).slice(1); // Remove duplicate start point
      
      branches.push({
        startIndex,
        segments: branchSegments,
        thickness: 1 + Math.random() * 2,
        life: 20 + Math.random() * 15,
        maxLife: 35
      });
    }
    
    return branches;
  }, [generateLightningPath]);

  // Create new lightning bolt
  const createLightningBolt = useCallback(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return null;

    const settings = getIntensitySettings();
    
    // Random spawn points - from top or sides
    const spawnSide = Math.random();
    let startX, startY, endX, endY;
    
    if (spawnSide < 0.7) {
      // From top
      startX = Math.random() * width;
      startY = -50;
      endX = startX + (Math.random() - 0.5) * width * 0.4;
      endY = height + 50;
    } else {
      // From sides
      startX = Math.random() < 0.5 ? -50 : width + 50;
      startY = Math.random() * height * 0.3;
      endX = width * 0.2 + Math.random() * width * 0.6;
      endY = height * 0.7 + Math.random() * height * 0.3;
    }
    
    const segments = generateLightningPath(startX, startY, endX, endY);
    const branches = generateBranches(segments, 1 + Math.floor(Math.random() * 3));
    
    return {
      id: `lightning-${Date.now()}-${Math.random()}`,
      startX,
      startY,
      endX,
      endY,
      segments,
      branches,
      life: 40 + Math.random() * 20,
      maxLife: 60,
      thickness: settings.minThickness + Math.random() * (settings.maxThickness - settings.minThickness),
      color,
      opacity: 0.8 + Math.random() * 0.2,
      animationProgress: 0
    };
  }, [dimensions, generateLightningPath, generateBranches, color]);

  // Create electrical particles around lightning
  const createElectricalParticles = useCallback((bolt: LightningBolt, count: number): ElectricParticle[] => {
    const particles: ElectricParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      const segmentIndex = Math.floor(Math.random() * bolt.segments.length);
      const segment = bolt.segments[segmentIndex];
      
      particles.push({
        id: `particle-${Date.now()}-${i}`,
        x: segment.x + (Math.random() - 0.5) * 30,
        y: segment.y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        size: 1 + Math.random() * 4,
        life: 40 + Math.random() * 20,
        maxLife: 60,
        color: LIGHTNING_COLORS.particle,
        opacity: 0.8 + Math.random() * 0.2
      });
    }
    
    return particles;
  }, []);

  // Draw lightning bolt with realistic effects
  const drawLightningBolt = useCallback((
    ctx: CanvasRenderingContext2D,
    bolt: LightningBolt
  ) => {
    if (bolt.segments.length < 2) return;

    ctx.save();
    
    const alpha = (bolt.life / bolt.maxLife) * bolt.opacity;
    const progressSegments = Math.floor(bolt.animationProgress * bolt.segments.length);
    
    // Outer glow - ENHANCED for visibility
    ctx.shadowColor = bolt.color;
    ctx.shadowBlur = 40;
    ctx.globalAlpha = alpha * 0.8;
    ctx.strokeStyle = bolt.color;
    ctx.lineWidth = bolt.thickness * 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw main lightning path with animation
    ctx.beginPath();
    ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
    
    for (let i = 1; i < Math.min(progressSegments + 1, bolt.segments.length); i++) {
      ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
    }
    ctx.stroke();
    
    // Inner bright core - ENHANCED
    ctx.shadowBlur = 15;
    ctx.globalAlpha = alpha * 1.0;
    ctx.strokeStyle = LIGHTNING_COLORS.core;
    ctx.lineWidth = bolt.thickness * 2;
    
    ctx.beginPath();
    ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);
    for (let i = 1; i < Math.min(progressSegments + 1, bolt.segments.length); i++) {
      ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
    }
    ctx.stroke();
    
    // Draw branches with animation delay
    const branchProgress = Math.max(0, bolt.animationProgress - 0.3);
    
    bolt.branches.forEach(branch => {
      if (branchProgress <= 0) return;
      
      const branchSegments = Math.floor(branchProgress * branch.segments.length);
      if (branchSegments < 1) return;
      
      const branchAlpha = (branch.life / branch.maxLife) * alpha * 0.8;
      
      // Branch glow
      ctx.globalAlpha = branchAlpha * 0.3;
      ctx.strokeStyle = bolt.color;
      ctx.lineWidth = branch.thickness * 2;
      
      ctx.beginPath();
      ctx.moveTo(bolt.segments[branch.startIndex].x, bolt.segments[branch.startIndex].y);
      for (let i = 0; i < Math.min(branchSegments, branch.segments.length); i++) {
        ctx.lineTo(branch.segments[i].x, branch.segments[i].y);
      }
      ctx.stroke();
      
      // Branch core
      ctx.globalAlpha = branchAlpha * 0.7;
      ctx.strokeStyle = LIGHTNING_COLORS.core;
      ctx.lineWidth = branch.thickness;
      
      ctx.beginPath();
      ctx.moveTo(bolt.segments[branch.startIndex].x, bolt.segments[branch.startIndex].y);
      for (let i = 0; i < Math.min(branchSegments, branch.segments.length); i++) {
        ctx.lineTo(branch.segments[i].x, branch.segments[i].y);
      }
      ctx.stroke();
      
      branch.life--;
    });
    
    ctx.restore();
  }, []);

  // Draw electrical particles
  const drawElectricalParticle = useCallback((
    ctx: CanvasRenderingContext2D,
    particle: ElectricParticle
  ) => {
    const alpha = (particle.life / particle.maxLife) * particle.opacity;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Particle glow
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(0.5, particle.color + '60');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bright core
    ctx.fillStyle = LIGHTNING_COLORS.core;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, []);

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 16;
    const settings = getIntensitySettings();

    // Clear canvas with enhanced dark background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, LIGHTNING_COLORS.background);
    gradient.addColorStop(0.3, '#1a0d2e');
    gradient.addColorStop(0.7, '#2d1b4e');
    gradient.addColorStop(1, LIGHTNING_COLORS.background);
    
    ctx.fillStyle = gradient;
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
      
      // Update bolts
      bolts = bolts.map(bolt => {
        // Animate lightning progress
        bolt.animationProgress = Math.min(1, bolt.animationProgress + 0.05);
        bolt.life = Math.max(0, bolt.life - 1);
        return bolt;
      }).filter(bolt => bolt.life > 0);
      
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
  }, [
    isActive, 
    lightningBolts, 
    particles, 
    createLightningBolt, 
    createElectricalParticles, 
    drawLightningBolt, 
    drawElectricalParticle,
    getIntensitySettings
  ]);

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
      className={`fixed inset-0 z-0 overflow-hidden lightning-section ${className}`}
      data-background="dark"
      style={{ 
        isolation: 'isolate',
        contain: 'layout style paint'
      }}
    >
      {/* Enhanced dark purple gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, #2d1b4e 0%, #0f0a1a 70%),
            linear-gradient(135deg, #1a0d2e 0%, #2d1b4e 50%, #0f0a1a 100%)
          `
        }}
      />

      {/* Lightning canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full lightning-background"
        style={{
          mixBlendMode: 'screen',
          opacity: isActive ? 1 : 0.6,
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* Content overlay */}
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}

      {/* Enhanced atmospheric overlay for depth */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at center, rgba(147, 51, 234, 0.1) 0%, transparent 70%)
          `,
          mixBlendMode: 'soft-light'
        }}
        animate={{
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};