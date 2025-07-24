import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Galaxy } from 'react-stars-particles';
import { motion } from 'framer-motion';
import { useBackdropFilterCleanup, preserveFilterOnElement } from './TabSwitchingFix';

interface ReactBitsGalaxyProps {
  theme: 'morning' | 'evening' | 'night';
  isDarkMode?: boolean;
  mousePosition: { x: number; y: number };
  isActive?: boolean;
  className?: string;
}

// EXACT configuration matching ReactBits demo with environment variable support
const GALAXY_CONFIG = {
  density: parseFloat(import.meta.env.VITE_GALAXY_DENSITY) || 2.4,
  glowIntensity: parseFloat(import.meta.env.VITE_GALAXY_GLOW_INTENSITY) || 0.8,
  saturation: 0.1,
  hueShift: 180,
  twinkleIntensity: parseFloat(import.meta.env.VITE_GALAXY_TWINKLE_INTENSITY) || 0.8,
  rotationSpeed: 0.2,
  mouseInteraction: true,
  mouseRepulsion: true
};

// Superior color schemes for AKSHITA
const REACTBITS_COLORS = {
  morning: {
    starColor: '#FFE4B5',
    background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 35%, #0f4c75 70%, #1a1a2e 100%)',
    hue: 40,
    saturation: 0.15
  },
  evening: {
    starColor: '#DDA0DD',
    background: 'radial-gradient(ellipse at center, #2c1810 0%, #4a2c17 35%, #6b4423 70%, #2c1810 100%)',
    hue: 300,
    saturation: 0.12
  },
  night: {
    starColor: '#E0E6FF',
    background: 'radial-gradient(ellipse at center, #0f0f23 0%, #1a1a2e 35%, #16213e 70%, #0f0f23 100%)',
    hue: 220,
    saturation: 0.08
  }
};

export const ReactBitsGalaxy: React.FC<ReactBitsGalaxyProps> = ({
  theme,
  isDarkMode = false,
  mousePosition,
  isActive = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [galaxyConfig, setGalaxyConfig] = useState({
    quantity: Math.floor(GALAXY_CONFIG.density * 800), // Higher star density
    attract: GALAXY_CONFIG.mouseInteraction ? 0.5 : 0,
    repulse: GALAXY_CONFIG.mouseRepulsion ? 0.2 : 0,
    color: REACTBITS_COLORS[theme].starColor
  });

  // Use the backdrop filter cleanup hook
  useBackdropFilterCleanup();

  // Mouse tracking with enhanced interaction
  useEffect(() => {
    setIsMouseMoving(true);
    const timeout = setTimeout(() => setIsMouseMoving(false), 150);
    return () => clearTimeout(timeout);
  }, [mousePosition]);

  // Update galaxy configuration based on theme and interaction
  useEffect(() => {
    const colors = REACTBITS_COLORS[theme];
    
    setGalaxyConfig(prev => ({
      ...prev,
      color: colors.starColor,
      attract: GALAXY_CONFIG.mouseInteraction ? (isMouseMoving ? 0.8 : 0.5) : 0,
      repulse: GALAXY_CONFIG.mouseRepulsion ? (isMouseMoving ? 0.3 : 0.2) : 0,
      quantity: Math.floor(GALAXY_CONFIG.density * (isMouseMoving ? 1000 : 800))
    }));
  }, [theme, isMouseMoving]);

  // Real-time galaxy adjustment functions (for future controls)
  const updateDensity = useCallback((density: number) => {
    setGalaxyConfig(prev => ({
      ...prev,
      quantity: Math.floor(density * 800)
    }));
  }, []);

  const updateMouseInteraction = useCallback((enabled: boolean) => {
    setGalaxyConfig(prev => ({
      ...prev,
      attract: enabled ? 0.5 : 0
    }));
  }, []);

  const updateMouseRepulsion = useCallback((enabled: boolean) => {
    setGalaxyConfig(prev => ({
      ...prev,
      repulse: enabled ? 0.2 : 0
    }));
  }, []);

  // Preserve the container element from blur cleanup
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      preserveFilterOnElement(container);
    }
  }, []);

  // Theme-based background calculation
  const currentColors = REACTBITS_COLORS[theme];
  const backgroundStyle = isDarkMode 
    ? 'radial-gradient(ellipse at center, #000000 0%, #0f0f23 50%, #000000 100%)'
    : currentColors.background;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-0 overflow-hidden ${className}`}
      style={{ 
        isolation: 'isolate',
        contain: 'layout style paint'
      }}
    >
      {/* Enhanced gradient background with theme colors */}
      <motion.div 
        className="absolute inset-0"
        style={{ background: backgroundStyle }}
        animate={{ background: backgroundStyle }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* EXACT ReactBits Galaxy Implementation */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: isActive ? 1 : 0.6,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <Galaxy
          quantity={galaxyConfig.quantity}
          attract={galaxyConfig.attract}
          repulse={galaxyConfig.repulse}
          color={galaxyConfig.color}
        />
      </div>

      {/* Interactive glow enhancement overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(${currentColors.hue === 40 ? '255, 228, 181' : 
                  currentColors.hue === 300 ? '221, 160, 221' : 
                  '224, 230, 255'}, ${isMouseMoving ? 0.15 : 0.08}) 0%, 
            transparent 50%)`,
          mixBlendMode: 'soft-light'
        }}
        animate={{
          opacity: isMouseMoving ? 1 : 0.5,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Twinkling enhancement overlay for higher glow intensity */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(${currentColors.hue === 40 ? '255, 228, 181' : 
                  currentColors.hue === 300 ? '221, 160, 221' : 
                  '224, 230, 255'}, 0.05) 0%, 
            transparent 70%)`,
          opacity: GALAXY_CONFIG.glowIntensity
        }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [GALAXY_CONFIG.glowIntensity * 0.5, GALAXY_CONFIG.glowIntensity, GALAXY_CONFIG.glowIntensity * 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle rotation effect matching demo */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, 
            transparent 0deg, 
            rgba(${currentColors.hue === 40 ? '255, 228, 181' : 
                  currentColors.hue === 300 ? '221, 160, 221' : 
                  '224, 230, 255'}, 0.03) 90deg, 
            transparent 180deg, 
            rgba(${currentColors.hue === 40 ? '255, 228, 181' : 
                  currentColors.hue === 300 ? '221, 160, 221' : 
                  '224, 230, 255'}, 0.03) 270deg, 
            transparent 360deg)`,
          filter: `hue-rotate(${GALAXY_CONFIG.hueShift}deg) saturate(${currentColors.saturation + GALAXY_CONFIG.saturation})`
        }}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1 / GALAXY_CONFIG.rotationSpeed * 100,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Text readability enhancement - NO BACKDROP FILTER */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px,
            transparent 0%, 
            rgba(0, 0, 0, 0.1) 60%, 
            rgba(0, 0, 0, 0.15) 100%)`,
        }}
        animate={{
          opacity: isMouseMoving ? 0.8 : 0.4,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

// Galaxy Controls Component (for future customization UI)
interface GalaxyControlsProps {
  config: typeof GALAXY_CONFIG;
  onConfigChange: (newConfig: Partial<typeof GALAXY_CONFIG>) => void;
  className?: string;
}

export const GalaxyControls: React.FC<GalaxyControlsProps> = ({
  config,
  onConfigChange,
  className = ''
}) => {
  return (
    <motion.div
      className={`fixed top-4 right-4 bg-black/20 backdrop-blur-md rounded-2xl p-4 space-y-3 z-50 ${className}`}
      style={{ minWidth: '200px' }}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-white font-semibold text-sm mb-3">Galaxy Controls</h3>
      
      {/* Density Control */}
      <div className="space-y-1">
        <label className="text-white text-xs opacity-80">Density: {config.density}</label>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={config.density}
          onChange={(e) => onConfigChange({ density: parseFloat(e.target.value) })}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Glow Intensity Control */}
      <div className="space-y-1">
        <label className="text-white text-xs opacity-80">Glow: {config.glowIntensity}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.glowIntensity}
          onChange={(e) => onConfigChange({ glowIntensity: parseFloat(e.target.value) })}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Twinkle Intensity Control */}
      <div className="space-y-1">
        <label className="text-white text-xs opacity-80">Twinkle: {config.twinkleIntensity}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.twinkleIntensity}
          onChange={(e) => onConfigChange({ twinkleIntensity: parseFloat(e.target.value) })}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Rotation Speed Control */}
      <div className="space-y-1">
        <label className="text-white text-xs opacity-80">Rotation: {config.rotationSpeed}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.rotationSpeed}
          onChange={(e) => onConfigChange({ rotationSpeed: parseFloat(e.target.value) })}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Hue Shift Control */}
      <div className="space-y-1">
        <label className="text-white text-xs opacity-80">Hue: {config.hueShift}°</label>
        <input
          type="range"
          min="0"
          max="360"
          step="10"
          value={config.hueShift}
          onChange={(e) => onConfigChange({ hueShift: parseInt(e.target.value) })}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Toggle Controls */}
      <div className="space-y-2 pt-2 border-t border-white/20">
        <label className="flex items-center text-white text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={config.mouseInteraction}
            onChange={(e) => onConfigChange({ mouseInteraction: e.target.checked })}
            className="mr-2"
          />
          Mouse Interaction
        </label>
        
        <label className="flex items-center text-white text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={config.mouseRepulsion}
            onChange={(e) => onConfigChange({ mouseRepulsion: e.target.checked })}
            className="mr-2"
          />
          Mouse Repulsion
        </label>
      </div>
    </motion.div>
  );
};