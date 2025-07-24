import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'heart' | 'star' | 'spark';
}

interface ParticleSystemProps {
  theme: 'morning' | 'evening' | 'night';
  mousePosition: { x: number; y: number };
  isActive: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  theme, 
  mousePosition, 
  isActive 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const getThemeColors = useCallback(() => {
    switch (theme) {
      case 'morning':
        return {
          primary: '#ff6b9d',
          secondary: '#ffd93d',
          accent: '#ff8a80'
        };
      case 'evening':
        return {
          primary: '#e91e63',
          secondary: '#9c27b0',
          accent: '#ff4081'
        };
      case 'night':
        return {
          primary: '#673ab7',
          secondary: '#3f51b5',
          accent: '#536dfe'
        };
      default:
        return {
          primary: '#ff6b9d',
          secondary: '#ffd93d',
          accent: '#ff8a80'
        };
    }
  }, [theme]);

  const createParticle = useCallback((x: number, y: number, type: Particle['type']) => {
    const colors = getThemeColors();
    const colorArray = [colors.primary, colors.secondary, colors.accent];
    
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 4 + 2,
      color: colorArray[Math.floor(Math.random() * colorArray.length)],
      life: 0,
      maxLife: 60 + Math.random() * 60,
      type
    };
  }, [getThemeColors]);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.life++;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // gravity

      // Draw particle based on type
      const opacity = 1 - (particle.life / particle.maxLife);
      ctx.globalAlpha = opacity;

      if (particle.type === 'heart') {
        ctx.fillStyle = particle.color;
        ctx.font = `${particle.size * 2}px serif`;
        ctx.fillText('♥', particle.x, particle.y);
      } else if (particle.type === 'star') {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add sparkle effect
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x - particle.size * 2, particle.y);
        ctx.lineTo(particle.x + particle.size * 2, particle.y);
        ctx.moveTo(particle.x, particle.y - particle.size * 2);
        ctx.lineTo(particle.x, particle.y + particle.size * 2);
        ctx.stroke();
      } else {
        // Spark
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      return particle.life < particle.maxLife;
    });

    ctx.globalAlpha = 1;
  }, []);

  const handleMouseMove = useCallback(() => {
    if (!isActive) return;

    const { x, y } = mousePosition;
    
    // Create particles based on theme and time
    const now = new Date().getHours();
    let particleType: Particle['type'] = 'spark';
    
    if (theme === 'morning' && now >= 6 && now < 12) {
      particleType = Math.random() > 0.7 ? 'star' : 'spark';
    } else if (theme === 'evening' && now >= 17 && now < 21) {
      particleType = Math.random() > 0.5 ? 'heart' : 'spark';
    } else if (theme === 'night' && (now >= 21 || now < 6)) {
      particleType = Math.random() > 0.6 ? 'star' : 'spark';
    }

    // Add some randomness to prevent too many particles
    if (Math.random() > 0.7) {
      particlesRef.current.push(createParticle(x, y, particleType));
    }
  }, [mousePosition, isActive, theme, createParticle]);

  const animate = useCallback(() => {
    updateParticles();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    handleMouseMove();
  }, [mousePosition, handleMouseMove]);

  // Add ambient particles periodically
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (particlesRef.current.length < 50) { // Limit particle count
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const type = theme === 'morning' ? 'star' : theme === 'evening' ? 'heart' : 'spark';
        particlesRef.current.push(createParticle(x, y, type));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, theme, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};