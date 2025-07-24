import React, { useEffect, useRef } from 'react';

interface CursorEffectsProps {
  theme: 'morning' | 'evening' | 'night';
  isActive: boolean;
}

export const CursorEffects: React.FC<CursorEffectsProps> = ({ theme, isActive }) => {
  const trailRef = useRef<HTMLDivElement[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const getThemeColors = () => {
    switch (theme) {
      case 'morning':
        return ['#ff6b9d', '#ffd93d', '#ff8a80'];
      case 'evening':
        return ['#e91e63', '#9c27b0', '#ff4081'];
      case 'night':
        return ['#673ab7', '#3f51b5', '#536dfe'];
      default:
        return ['#ff6b9d', '#ffd93d', '#ff8a80'];
    }
  };

  const createTrailElement = (index: number) => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.position = 'fixed';
    trail.style.width = '6px';
    trail.style.height = '6px';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    trail.style.transition = 'all 0.1s ease-out';
    
    const colors = getThemeColors();
    trail.style.background = colors[index % colors.length];
    trail.style.boxShadow = `0 0 10px ${colors[index % colors.length]}`;
    
    document.body.appendChild(trail);
    return trail;
  };

  const updateTrail = () => {
    if (!isActive) return;

    trailRef.current.forEach((trail, index) => {
      if (trail && trail.parentNode) {
        const delay = index * 20;
        const opacity = Math.max(0, 1 - (index * 0.1));
        
        setTimeout(() => {
          if (trail && trail.parentNode) {
            trail.style.left = `${mousePosition.current.x - 3}px`;
            trail.style.top = `${mousePosition.current.y - 3}px`;
            trail.style.opacity = opacity.toString();
            trail.style.transform = `scale(${1 - index * 0.1})`;
          }
        }, delay);
      }
    });

    animationRef.current = requestAnimationFrame(updateTrail);
  };

  const handleMouseMove = (e: MouseEvent) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };
    
    if (isActive && Math.random() > 0.8) {
      createSparkle(e.clientX, e.clientY);
    }
  };

  const createSparkle = (x: number, y: number) => {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9998';
    sparkle.style.fontSize = `${Math.random() * 16 + 8}px`;
    sparkle.style.opacity = '0';
    sparkle.style.animation = 'sparkle 1.5s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 1500);
  };

  const handleClick = (e: MouseEvent) => {
    if (!isActive) return;

    // Create heart explosion on click
    const colors = getThemeColors();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9998';
        heart.style.fontSize = `${Math.random() * 20 + 15}px`;
        heart.style.opacity = '0';
        
        const angle = (i * 60) * (Math.PI / 180);
        const distance = 50 + Math.random() * 30;
        const endX = e.clientX + Math.cos(angle) * distance;
        const endY = e.clientY + Math.sin(angle) * distance;
        
        heart.style.animation = `heartFloat 2s ease-out forwards`;
        heart.style.setProperty('--end-x', `${endX}px`);
        heart.style.setProperty('--end-y', `${endY}px`);
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
          }
        }, 2000);
      }, i * 100);
    }
  };

  useEffect(() => {
    if (!isActive) {
      // Clean up existing trails
      trailRef.current.forEach(trail => {
        if (trail && trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      });
      trailRef.current = [];
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Create trail elements
    trailRef.current = Array.from({ length: 10 }, (_, index) => 
      createTrailElement(index)
    );

    // Start animation
    updateTrail();

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      
      // Clean up trails
      trailRef.current.forEach(trail => {
        if (trail && trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      });
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, theme]);

  // Add custom cursor styles
  useEffect(() => {
    if (isActive) {
      document.body.style.cursor = 'none';
      
      // Create main cursor
      const cursor = document.createElement('div');
      cursor.id = 'custom-cursor';
      cursor.style.position = 'fixed';
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.borderRadius = '50%';
      cursor.style.border = '2px solid';
      cursor.style.borderColor = getThemeColors()[0];
      cursor.style.pointerEvents = 'none';
      cursor.style.zIndex = '10000';
      cursor.style.mixBlendMode = 'difference';
      cursor.style.transition = 'all 0.1s ease-out';
      
      document.body.appendChild(cursor);
      
      const updateCursor = (e: MouseEvent) => {
        cursor.style.left = `${e.clientX - 10}px`;
        cursor.style.top = `${e.clientY - 10}px`;
      };
      
      document.addEventListener('mousemove', updateCursor);
      
      return () => {
        document.body.style.cursor = 'auto';
        document.removeEventListener('mousemove', updateCursor);
        if (cursor.parentNode) {
          cursor.parentNode.removeChild(cursor);
        }
      };
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [isActive, theme]);

  return null;
};