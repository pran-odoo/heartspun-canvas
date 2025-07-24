import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Enhanced3DEffectsProps {
  theme: 'morning' | 'evening' | 'night';
  mousePosition: { x: number; y: number };
  isActive: boolean;
  beatIntensity?: number;
  biometricData?: any;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'heart' | 'star' | 'spark' | 'orb' | 'galaxy';
  rotation: number;
  rotationSpeed: number;
}

export const Enhanced3DEffects: React.FC<Enhanced3DEffectsProps> = ({
  theme,
  mousePosition,
  isActive,
  beatIntensity = 0,
  biometricData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle3D[]>([]);
  const [cameraZ, setCameraZ] = useState(1000);
  
  const mouseX = useSpring(0, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 20 });

  // Update mouse spring values
  useEffect(() => {
    mouseX.set((mousePosition.x / window.innerWidth - 0.5) * 200);
    mouseY.set((mousePosition.y / window.innerHeight - 0.5) * 200);
  }, [mousePosition, mouseX, mouseY]);

  const getThemeColors = useCallback(() => {
    switch (theme) {
      case 'morning':
        return ['#FFE4B5', '#FFB6C1', '#FFF8DC', '#F0E68C', '#FFEFD5'];
      case 'evening':
        return ['#DDA0DD', '#FFB6C1', '#F0E68C', '#FFA07A', '#E6E6FA'];
      case 'night':
        return ['#191970', '#4B0082', '#6A5ACD', '#8A2BE2', '#9932CC'];
      default:
        return ['#FFB6C1', '#DDA0DD', '#F0E68C'];
    }
  }, [theme]);

  const create3DParticle = useCallback((x: number, y: number, type?: Particle3D['type']): Particle3D => {
    const colors = getThemeColors();
    const particleType = type || (['heart', 'star', 'spark', 'orb', 'galaxy'] as const)[Math.floor(Math.random() * 5)];
    
    return {
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      z: Math.random() * 500 - 250,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      vz: (Math.random() - 0.5) * 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 255,
      maxLife: 255,
      type: particleType,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
  }, [getThemeColors]);

  const project3D = useCallback((x: number, y: number, z: number) => {
    const perspective = 800;
    const scale = perspective / (perspective + z);
    return {
      x: x * scale + window.innerWidth / 2,
      y: y * scale + window.innerHeight / 2,
      scale: scale,
    };
  }, []);

  const drawParticle3D = useCallback((ctx: CanvasRenderingContext2D, particle: Particle3D) => {
    const projected = project3D(particle.x, particle.y, particle.z);
    const alpha = (particle.life / particle.maxLife) * projected.scale;
    
    if (alpha <= 0 || projected.scale <= 0) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(projected.x, projected.y);
    ctx.rotate(particle.rotation);
    ctx.scale(projected.scale, projected.scale);

    const size = particle.size * (1 + beatIntensity * 0.02);

    switch (particle.type) {
      case 'heart':
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size * 0.5, -size * 0.2, -size * 0.8, size * 0.1, 0, size * 0.8);
        ctx.bezierCurveTo(size * 0.8, size * 0.1, size * 0.5, -size * 0.2, 0, size * 0.3);
        ctx.fill();
        break;

      case 'star':
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          
          const innerAngle = ((i + 0.5) * Math.PI * 2) / 5;
          const innerX = Math.cos(innerAngle) * size * 0.4;
          const innerY = Math.sin(innerAngle) * size * 0.4;
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'orb':
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.7, particle.color + '80');
        gradient.addColorStop(1, particle.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'galaxy':
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 8;
          const radius = (i / 20) * size * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        break;

      default: // spark
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }, [project3D, beatIntensity]);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with depth fade
    ctx.fillStyle = `rgba(0, 0, 0, ${theme === 'night' ? 0.05 : 0.02})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update camera based on biometrics
    if (biometricData?.heartRate) {
      const heartInfluence = (biometricData.heartRate - 70) / 30; // normalized around resting rate
      setCameraZ(1000 + heartInfluence * 200);
    }

    // Sort particles by z-depth for proper rendering
    particlesRef.current.sort((a, b) => b.z - a.z);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;
      
      // Update rotation
      particle.rotation += particle.rotationSpeed;
      
      // Gravity and forces
      particle.vy += 0.02;
      particle.vx *= 0.999;
      particle.vy *= 0.999;
      particle.vz *= 0.999;

      // Beat influence
      if (beatIntensity > 50) {
        particle.vx += (Math.random() - 0.5) * 0.5;
        particle.vy += (Math.random() - 0.5) * 0.5;
      }

      // Life decay
      particle.life *= 0.995;

      // Draw particle
      drawParticle3D(ctx, particle);

      // Remove dead or out-of-bounds particles
      const projected = project3D(particle.x, particle.y, particle.z);
      return particle.life > 5 && 
             projected.x > -100 && projected.x < canvas.width + 100 &&
             projected.y > -100 && projected.y < canvas.height + 100 &&
             particle.z > -1000 && particle.z < 1000;
    });
  }, [theme, biometricData, beatIntensity, project3D, drawParticle3D]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isActive) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - window.innerWidth / 2;
    const y = e.clientY - rect.top - window.innerHeight / 2;

    // Create particles based on movement and theme
    const particleCount = Math.min(3, Math.ceil(beatIntensity / 20));
    
    for (let i = 0; i < particleCount; i++) {
      let type: Particle3D['type'] = 'heart';
      
      if (theme === 'morning') {
        type = Math.random() < 0.4 ? 'star' : 'spark';
      } else if (theme === 'evening') {
        type = Math.random() < 0.3 ? 'heart' : Math.random() < 0.6 ? 'orb' : 'spark';
      } else {
        type = Math.random() < 0.2 ? 'galaxy' : Math.random() < 0.5 ? 'orb' : 'star';
      }

      particlesRef.current.push(create3DParticle(x, y, type));
    }
  }, [isActive, theme, beatIntensity, create3DParticle]);

  const animate = useCallback(() => {
    updateParticles();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles]);

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, handleMouseMove]);

  // Ambient particle spawning
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (particlesRef.current.length < 50) {
        const x = (Math.random() - 0.5) * window.innerWidth;
        const y = (Math.random() - 0.5) * window.innerHeight;
        
        let type: Particle3D['type'] = 'spark';
        if (theme === 'night') type = 'galaxy';
        else if (theme === 'evening') type = 'orb';
        else if (Math.random() < 0.3) type = 'star';

        particlesRef.current.push(create3DParticle(x, y, type));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, theme, create3DParticle]);

  // Biometric-triggered effects
  useEffect(() => {
    if (!biometricData?.heartRate || !isActive) return;

    if (biometricData.heartRate > 80) {
      // High heart rate - create energy burst
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const x = Math.cos(angle) * 100;
        const y = Math.sin(angle) * 100;
        particlesRef.current.push(create3DParticle(x, y, 'spark'));
      }
    }
  }, [biometricData?.heartRate, isActive, create3DParticle]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        mixBlendMode: theme === 'night' ? 'screen' : 'multiply',
        opacity: isActive ? 0.8 : 0.4,
      }}
      animate={{
        filter: `blur(${beatIntensity > 70 ? 1 : 0}px) hue-rotate(${beatIntensity * 2}deg)`,
      }}
      transition={{ duration: 0.1 }}
    />
  );
};